const fs = require('fs')
const player = require('play-sound')()
const prayerTimesFile = require('./data.json')

// Make a fetch request

async function getPrayerTimes() {
    try {
        const response = await fetch('https://api.aladhan.com/v1/calendarByAddress/2024/5?address=Dortmund,%20Germany&method=3')

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response as JSON
        const data = await response.json()


        // Write the JSON data to a file
        fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
            if (err) {
                throw err
            } else {
                console.log('Data saved to data.json');
            }
        });

    } catch (err) {
        console.error('Fetch error:', err);
    }
}


// Function to check if it's a specific time of day
function checkTimeAndExecute(targetHour, targetMinute, callback) {
    const currentTime = new Date();
    // const currentHour = 13
    // const currentMinute = 27
    // const currentHour = currentTime.getHours();
    // const currentMinute = currentTime.getMinutes();


    if (currentHour === targetHour && currentMinute === targetMinute) {
        // Execute the callback function if the current time matches the target time
        callback();
    } else {
        // Calculate the milliseconds until the target time
        const millisecondsUntilTarget = ((targetHour - currentHour) * 60 * 60 + (targetMinute - currentMinute) * 60) * 1000;

        // Set a timeout to check again at the target time
        setTimeout(() => {
            checkTimeAndExecute(targetHour, targetMinute, callback);
        }, millisecondsUntilTarget);
        console.log("waiting for next Prayer");
    }
}

class NewPrayerTimes {
    constructor(currDay) {
        this.fajr = prayerTimesFile.data[currDay - 1].timings.Fajr.substring(0, 5)
        this.duhr = prayerTimesFile.data[currDay - 1].timings.Dhuhr.substring(0, 5)
        this.asr = prayerTimesFile.data[currDay - 1].timings.Asr.substring(0, 5)
        this.maghrib = prayerTimesFile.data[currDay - 1].timings.Maghrib.substring(0, 5)
        this.isha = prayerTimesFile.data[currDay - 1].timings.Isha.substring(0, 5)
    }
}


const currentHour = 13
const currentMinute = 26

function checkNextPrayer() {
    const currentTime = new Date();
    const currentDay = currentTime.getDate()
    // const currentHour = currentTime.getHours();
    // const currentMinute = currentTime.getMinutes();
    const prayerTimes = new NewPrayerTimes(currentDay)
    const prayerTimesArr = Object.values(prayerTimes)

    for (let i = 0; i < prayerTimesArr.length; i++) {
        const prayerTimeHH = parseInt(prayerTimesArr[i].substring(0, 2))
        const prayerTimeMM = parseInt(prayerTimesArr[i].substring(3, 5))

        if ((currentHour < prayerTimeHH || currentHour === prayerTimeHH && currentMinute <= prayerTimeMM)) { 
            console.log(`The next Prayer is at ${prayerTimesArr[i]}`);

            const hh = parseInt(prayerTimesArr[i].slice(0, prayerTimesArr[i].indexOf(':')))
            const mm = parseInt(prayerTimesArr[i].slice(prayerTimesArr[i].indexOf(':') + 1))

            checkTimeAndExecute(hh, mm, () => {
                console.log('Athan time Time!!!!!');
                playPrayerCall() 
                setTimeout(() => {checkNextPrayer()}, 120000)
            });

            break
        }
    }
}

function playPrayerCall() {
    const athan = './athan.mp3'

    player.play(athan, err => {
        if (err) {
            console.log(err);
        }
        console.log('athan is playing');
    })

}

checkNextPrayer()