const fetchPrayerTimes = require('./utility/fetchPrayerTimes.js')
const checkNextPrayer = require('./utility/checkNextPrayer.js')
const playPrayerCall = require('./utility/playPrayerCall.js')
const getAudioPath = require('./utility/getAudioPath.js')
const getAudioDuration = require('./utility/getAudioDuration.js')

async function checkTimeAndExecute(date) {
    // Current time data
    let currentTime = new Date()
    if (date) {currentTime = new Date(date)}
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    const currentDay = currentTime.getDate()

    // Prayer data
    const prayerTimesPath = await fetchPrayerTimes()
    const nextPrayer = await checkNextPrayer(currentHour, currentMinute, currentDay, prayerTimesPath)
    const prayerTimeHH = parseInt(nextPrayer['time'].slice(0, nextPrayer['time'].indexOf(':')))
    const prayerTimeMM = parseInt(nextPrayer['time'].slice(nextPrayer['time'].indexOf(':') + 1))
    
    // audio (Athan) data
    const audioPath = getAudioPath(nextPrayer['name'])
    const audioDuration = await getAudioDuration(audioPath)

    if (currentHour === prayerTimeHH && currentMinute === prayerTimeMM) {
        console.log('Athan time Time!!!!!');
        playPrayerCall(audioPath)
        setTimeout(() => { checkTimeAndExecute() }, audioDuration)
        console.log(`Waiting for Athan to end after ${(audioDuration/1000)/60} minutes`);
    } else {
        let millisecondsUntilTarget = ((prayerTimeHH - currentHour) * 60 * 60 + (prayerTimeMM - currentMinute) * 60) * 1000

        if (nextPrayer.firstPrayerOfTheDay) {
            millisecondsUntilTarget = ((23 - currentHour + prayerTimeHH) * 60 * 60 + (60 - currentMinute + prayerTimeMM) * 60) * 1000
        }

        setTimeout(() => {
            checkTimeAndExecute();
        }, millisecondsUntilTarget);
        console.log(`Waiting ${(millisecondsUntilTarget/1000)/60} minutes for ${nextPrayer['name']} at ${nextPrayer['time']}`);
    }
}

const time = new Date('2024-05-11T17:36')
checkTimeAndExecute()