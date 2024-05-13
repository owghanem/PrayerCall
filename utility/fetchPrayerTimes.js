const fs = require('fs');

async function fetchPrayerTimes() {
    // Link -> filePath
    // Fetches Prayer times from an API, saves it and returns where was it saved
    // !!Write tests

    const city = 'Dortmund'
    const country = 'Germany'
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear()
    const currentMonth = currentTime.getMonth()

    const currentMonthName = currentTime.toLocaleString('default', { month: 'long' })
    const filePath = `./data/${currentMonthName}PrayerTimes.json`
    try {
        const fileExists = await fs.promises.access(filePath, err => { if (err) console.error(err) }).then(() => true).catch(() => false)

        if (!fileExists) {
            const files = await fs.promises.readdir('./data', err => { if (err) console.error(err) });
            await Promise.all(files.map(file => fs.unlink(`./data/${file}`, err => { if (err) console.error(err) })));

            const response = await fetch(`https://api.aladhan.com/v1/calendarByAddress/${currentYear}/${currentMonth + 1}?address=${city}, ${country}&method=99&methodSettings=15,5 min,90 min`)

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

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