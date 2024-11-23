const fetchPrayerTimes = require('./utility/fetchPrayerTimes.js')
const checkNextPrayer = require('./utility/checkNextPrayer.js')
const playPrayerCall = require('./utility/playPrayerCall.js')
const getAudioPath = require('./utility/getAudioPath.js')
const getAudioDuration = require('./utility/getAudioDuration.js')

// I had to do this because I was trying to use jasmine to manipulate time to be able to test easily.
// When using setTimeout directly jasmine doesn't wait until the function is done because
// setTimeout is not async/doesn't return a promise.
async function timeout(time, action) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            action()
            resolve()
        }, time);
    })
}

async function checkTimeAndExecute(date) {
    try {
        // Current time data
        const currentTime = date ? date : new Date()
        console.log(currentTime)

        // Prayer data
        const prayerTimesPath = await fetchPrayerTimes(currentTime)
        const nextPrayer = await checkNextPrayer(currentTime, prayerTimesPath)
        const prayerTime = nextPrayer['time']

        // audio (Athan) data
        const audioPath = getAudioPath(nextPrayer['name'])
        const audioDuration = await getAudioDuration(audioPath)

        const millisecondsUntilTarget = prayerTime - currentTime
        console.log(millisecondsUntilTarget);

        if (millisecondsUntilTarget > 0) {
            console.log(`Waiting ${Math.floor(millisecondsUntilTarget / (1000 * 60))} mins for ${nextPrayer['name']} at ${nextPrayer['time'].toLocaleTimeString()}`)
            await timeout(millisecondsUntilTarget, checkTimeAndExecute)
        } else if (new Date(currentTime.setSeconds(0, 0)).getTime() <= prayerTime.getTime()) {
            console.log('Athan time Time!!!!!')
            // playPrayerCall(audioPath)
            console.log(`Waiting for Athan to end after ${audioDuration / 60000} minutes`);
            await timeout(audioDuration, checkTimeAndExecute)
        } else throw new Error("something went wrong")

    } catch (error) {
        console.error(error)
    }
}

/* This is only for testing */

const time = new Date('2024-12-25T06:51:45')
checkTimeAndExecute(time)

module.exports = { checkTimeAndExecute }