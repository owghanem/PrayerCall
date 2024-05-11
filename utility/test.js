const fs = require('fs').promises;
const fetch = require('node-fetch');

/**
 * Fetches prayer times from an API and saves them to a file.
 * @returns {Promise<string>} A Promise that resolves with the file path where the prayer times are saved.
 * @throws {Error} If there is an error while fetching or saving the prayer times.
 */
async function fetchPrayerTimes() {
    try {
        const currentDateTime = new Date();
        const currentYear = currentDateTime.getFullYear();
        const currentMonth = currentDateTime.getMonth();
        const currentMonthName = currentDateTime.toLocaleString('default', { month: 'long' });
        const filePath = `./data/${currentMonthName}PrayerTimes.json`;

        // Check if the file already exists
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        // If the file doesn't exist, fetch the prayer times from the API
        if (!fileExists) {
            // Delete existing files
            const files = await fs.readdir('./data');
            await Promise.all(files.map(file => fs.unlink(`./data/${file}`)));

            const response = await fetch(`https://api.aladhan.com/v1/calendarByAddress/${currentYear}/${currentMonth + 1}?address=Dortmund,%20Germany&method=3&methodSettings=null,null,15`);

            if (!response.ok) {
                throw new Error(`Failed to fetch prayer times. HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Save the fetched data to the file
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));

            return filePath;
        } else {
            // If the file already exists, return its path
            return filePath;
        }
    } catch (error) {
        console.error('Error fetching or saving prayer times:', error);
        throw error;
    }
}

// Example usage:
async function exampleUsage() {
    try {
        const filePath = await fetchPrayerTimes();
        console.log('Prayer times fetched and saved at:', filePath);
    } catch (error) {
        console.error('Error:', error);
    }
}

exampleUsage();
