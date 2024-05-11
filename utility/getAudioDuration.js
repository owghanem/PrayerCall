const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static')


async function getAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
        ffprobe(audioPath, { path: ffprobeStatic.path }, (err, info) => {
            if (err) {
                console.error('Error while probing audio:', err);
                reject(new Error('Error while probing audio'));
                return;
            }
            try {
                const durationMS = parseFloat(info.streams[0].duration) * 1000
                if (!isNaN(durationMS)) {
                    resolve(durationMS);
                } else {
                    throw new Error('Invalid duration value');
                }
            } catch (error) {
                console.error('Error parsing audio duration:', error);
                reject(new Error('Invalid audio duration'));
            }
        });
    });
}

getAudioDuration('./media/fajrAthan.mp3')

// async function getAudioDuration(audioPath) {
//     await ffprobe(audioPath, { path: ffprobeStatic.path }, (err, info) => {
//         if (err) {
//             console.error('Error while probing Audio:', err)
//             return
//         }
//         if (info.streams[0].duration) {
//             const duration = parseInt(info.streams[0].duration.replace('.', ''))
//             return duration
//         } else {
//             console.error('Could not get duration of the audio file.')
//         }
//     })
// }

module.exports = getAudioDuration