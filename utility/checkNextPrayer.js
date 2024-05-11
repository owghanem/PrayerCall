class prayersOfTheDay {
    constructor(prayerTimesFile, currDay) {
        this.fajr = prayerTimesFile.data[currDay - 1].timings.Fajr.substring(0, 5)
        this.duhr = prayerTimesFile.data[currDay - 1].timings.Dhuhr.substring(0, 5)
        this.asr = prayerTimesFile.data[currDay - 1].timings.Asr.substring(0, 5)
        this.maghrib = prayerTimesFile.data[currDay - 1].timings.Maghrib.substring(0, 5)
        this.isha = prayerTimesFile.data[currDay - 1].timings.Isha.substring(0, 5)
    }
}

class nextPrayer {
    constructor(name, time, firstPrayerOfTheDay) {
        this.name = name
        this.time = time
        this.firstPrayerOfTheDay = firstPrayerOfTheDay
    }
}

async function checkNextPrayer(currentHour, currentMinute, currentDay, filePath) {
    // Object -> Number
    // Checks the time of the Next Prayer
    // !!Write Tests

    const prayerTimesFile = require('.' + filePath)
    const todaysPrayerTimes = new prayersOfTheDay(prayerTimesFile, currentDay)

    for (const prayerName in todaysPrayerTimes) {
        const prayerTime = todaysPrayerTimes[prayerName]
        const prayerTimeHH = parseInt(prayerTime.substring(0, 2))
        const prayerTimeMM = parseInt(prayerTime.substring(3, 5))

        if ((currentHour < prayerTimeHH || currentHour === prayerTimeHH && currentMinute <= prayerTimeMM)) {
            return new nextPrayer(prayerName, prayerTime, false)
        }

        else if (currentHour === parseInt(todaysPrayerTimes['isha'].substring(0, 2)) && currentMinute > parseInt(todaysPrayerTimes['isha'].substring(3, 5))) {
            const tomorrowsPrayerTimes = new prayersOfTheDay(prayerTimesFile, currentDay + 1)
            const firstPrayerName = Object.keys(tomorrowsPrayerTimes)[0]
            const firstPrayerTime = tomorrowsPrayerTimes[firstPrayerName]

            return new nextPrayer(firstPrayerName, firstPrayerTime, true)
        }
    }
}

module.exports = checkNextPrayer