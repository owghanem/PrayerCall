function getAudioPath(prayerName) {
    if (prayerName === 'fajr') {
        return './media/fajrAthan.mp3'
    } else {
        return './media/athan.mp3'
    }
}

module.exports = getAudioPath