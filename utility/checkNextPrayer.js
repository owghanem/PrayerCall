const fetchPrayerTimes = require("./fetchPrayerTimes")

class PrayersOfTheDay {
    constructor(prayerTimesFile, currDay) {
        this.fajr = new Date(prayerTimesFile.data[currDay - 1].timings.Fajr)
        this.duhr = new Date(prayerTimesFile.data[currDay - 1].timings.Dhuhr)
        this.asr = new Date(prayerTimesFile.data[currDay - 1].timings.Asr)
        this.maghrib = new Date(prayerTimesFile.data[currDay - 1].timings.Maghrib)
        this.isha = new Date(prayerTimesFile.data[currDay - 1].timings.Isha)
    }
}

class NextPrayer {
    constructor(name, time) {
        this.name = name
        this.time = time
    }
}

async function checkNextPrayer(currentTime, filePath) {
    // Object -> Number
    // Checks the time of the Next Prayer
    // !!Write Tests
    const prayerTimesFile = require('.' + filePath)
    const todaysPrayerTimes = new PrayersOfTheDay(prayerTimesFile, currentTime.getDate())

    let nextPrayer

    for (const prayerName in todaysPrayerTimes) {
        const prayerTime = todaysPrayerTimes[prayerName]
        
        // Think about the condition, do you want it to ring exactly on minute start or within the minute
        if (prayerTime - currentTime >= -60000) {
            nextPrayer = new NextPrayer(prayerName, prayerTime)
            break
        }
    }

    if (!nextPrayer && currentTime > todaysPrayerTimes["isha"]) {
        const YYYY = currentTime.getFullYear()
        const MM = currentTime.getMonth()
        const DD = currentTime.getDate()

        const newDate = new Date(YYYY, MM, DD + 1)
        const newPath = await fetchPrayerTimes(newDate)
        const prayerTimesFile = require('.' + newPath)
        const nextDayPrayers = new PrayersOfTheDay(prayerTimesFile, newDate.getDate())
        nextPrayer = new NextPrayer("fajr", nextDayPrayers["fajr"])
    }

    return nextPrayer
}

module.exports = checkNextPrayer