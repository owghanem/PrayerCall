const fetchPrayerTimes = require('./utility/fetchPrayerTimes.js')
const checkNextPrayer = require('./utility/checkNextPrayer.js')
const playPrayerCall = require('./utility/playPrayerCall.js')
const getAudioPath = require('./utility/getAudioPath.js')
const getAudioDuration = require('./utility/getAudioDuration.js')

async function checkTimeAndExecute(date) {
    // Current time data
    let currentTime = new Date()
    if (date) { currentTime = new Date(date) }

    // Prayer data
    const prayerTimesPath = await fetchPrayerTimes()
    const nextPrayer = await checkNextPrayer(currentTime, prayerTimesPath)
    const prayerTime = nextPrayer['time']

    // audio (Athan) data
    const audioPath = getAudioPath(nextPrayer['name'])
    const audioDuration = await getAudioDuration(audioPath)

    if (currentTime === prayerTime) {
        console.log('Athan time Time!!!!!')
        playPrayerCall(audioPath)
        setTimeout(() => { checkTimeAndExecute() }, audioDuration)
        console.log(`Waiting for Athan to end after ${(audioDuration / 1000) / 60} minutes`);
    }

    const millisecondsUntilTarget = prayerTime - currentTime
    if (millisecondsUntilTarget) {
        setTimeout(() => { checkTimeAndExecute() }, millisecondsUntilTarget)
        console.log(`Waiting ${Math.floor(millisecondsUntilTarget / (1000 * 60))} mins for ${nextPrayer['name']} at ${nextPrayer['time'].toLocaleTimeString()}`)
    } else throw new Error("something went wrong")
}

const time = new Date('2024-05-11T17:36')
checkTimeAndExecute()