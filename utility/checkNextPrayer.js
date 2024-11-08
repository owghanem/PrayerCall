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
        if (prayerTime >= currentTime) {
            nextPrayer = new NextPrayer(prayerName, prayerTime)
            break
        }
    }

    if (!nextPrayer && currentTime > todaysPrayerTimes["isha"]) {
        const nextDayPrayers = new PrayersOfTheDay(prayerTimesFile, currentTime.getDate() + 1)
        nextPrayer = new NextPrayer("fajr", nextDayPrayers["fajr"])
    }

    return nextPrayer
}


// checkNextPrayer(date, './data/NovemberPrayerTimes.json')

module.exports = checkNextPrayer