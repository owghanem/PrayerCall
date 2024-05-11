const player = require('play-sound')()

function playPrayerCall(athanPath) {
    player.play(athanPath, err => {
        if (err) {
            console.log(err);
        }
        console.log('athan is playing');
    })
}

module.exports = playPrayerCall