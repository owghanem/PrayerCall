const fs = require('fs');
require('dotenv').config()

async function fetchPrayerTimes(date) {
    // Link -> filePath
    // Fetches Prayer times from an API, saves it and returns where was it saved
    // !!Write tests
    const city = process.env.CITY
    const country = process.env.COUNTRY
    const currentTime = date
    const currentYear = currentTime.getFullYear()
    const currentMonth = currentTime.getMonth()

    const currentMonthName = currentTime.toLocaleString('default', { month: 'long' })
    const filePath = `./data/${currentMonthName}PrayerTimes.json`
    try {
        const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false)

        if (!fileExists) {
            await fs.promises.mkdir('./data', { recursive: true }, err => { if (err) console.error(err) });
            const files = await fs.promises.readdir('./data', err => { if (err) console.error(err) });
            await Promise.all(files.map(file => fs.unlink(`./data/${file}`, err => { if (err) console.error(err) })));

            const response = await fetch(`https://api.aladhan.com/v1/calendarByAddress/${currentYear}/${currentMonth + 1}?address=${city}, ${country}&iso8601=true&method=99&methodSettings=15,5 min,90 min`)

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

            const data = await response.json()

            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2))

            return filePath

        } else {
            return filePath
        }

    } catch (err) {
        console.error('Fetch error:', err)
    }

}

module.exports = fetchPrayerTimes