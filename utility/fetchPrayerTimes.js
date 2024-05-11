const fs = require('fs');

async function fetchPrayerTimes() {
    // Link -> filePath
    // Fetches Prayer times from an API, saves it and returns where was it saved
    // !!Write tests

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

            const response = await fetch(`https://api.aladhan.com/v1/calendarByAddress/${currentYear}/${currentMonth + 1}?address=Dortmund,%20Germany&method=3&methodSettings=null,null,15`)

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
// async function fetchPrayerTimes() {
//     try {
//         const currentDateTime = new Date();
//         const currentYear = currentDateTime.getFullYear();
//         const currentMonth = currentDateTime.getMonth();
//         const currentMonthName = currentDateTime.toLocaleString('default', { month: 'long' });
//         const filePath = `./data/${currentMonthName}PrayerTimes.json`;

//         // Check if the file already exists
//         const fileExists = await checkFileExists(filePath)

//         // If the file doesn't exist, fetch the prayer times from the API
//         if (!fileExists) {
//             // Delete existing files
//             const files = await fs.promises.readdir('./data', err => { if (err) console.error(err) });
//             await Promise.all(files.map(file => fs.unlink(`./data/${file}`, err => { if (err) console.error(err) })));

//             const response = await fetch(`https://api.aladhan.com/v1/calendarByAddress/${currentYear}/${currentMonth + 1}?address=Dortmund,%20Germany&method=3&methodSettings=null,null,15`);

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch prayer times. HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();

//             // Save the fetched data to the file
//             await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));

//             return filePath;
//         } else {
//             // If the file already exists, return its path
//             return filePath;
//         }
//     } catch (error) {
//         console.error('Error fetching or saving prayer times:', error);
//         throw error;
//     }
// }

module.exports = fetchPrayerTimes