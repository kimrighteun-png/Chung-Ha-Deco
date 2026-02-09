const library = {
    "HandsOnMe": {
        title: "Hands On Me",
        folder: "Music/HandsOnMe/",
        tracks: [
            "1HandsOnMe.ogg",
            "2WhyDontYouKnow.ogg",
            "3MakeAWish.ogg",
            "4CosmicDust.ogg",
            "5Week.ogg"
        ]
    },
    "algorithm": {
        title: "Algorithm",
        folder: "Music/Algorithm/",
        tracks: [
            "algorithm.ogg"
        ]
    },
    "gottago": {
        title: "Gotta Go",
        folder: "Music/GottaGo/",
        tracks: [
            "gottago.ogg"
        ]
      },
      "Offset": {
          title: "Offset",
          folder: "Music/Offset/",
          tracks: [
              "1offset.ogg",
              "2rollercoaster.ogg",
              "3doit.ogg",
              "4badboy.ogg",
              "5remindofyou.ogg"
          ]
        },
          "BloomingBlue": {
              title: "Blooming Blue",
              folder: "Music/BloomingBlue/",
              tracks: [
                  "1bb.ogg",
                  "2loveu.ogg",
                  "3cherrykisses.ogg",
                  "4drive.ogg",
                  "5fromnowon.ogg"
                ]
              },
            "Flourishing": {
                  title: "Flourishing",
                  folder: "Music/Flourishing/",
                  tracks: [
                      "1chica.ogg",
                      "2younginlove.ogg",
                      "3callitlove.ogg",
                      "4flourishing.ogg",
                      "5snapping.ogg"
                    ]
                  },
              "Querencia": {
                    title: "Querencia",
                    folder: "Music/Querencia/",
                    tracks: [
                      "1sidea.ogg",
                      "2bicycle.ogg",
                      "3masquarade.ogg",
                      "4flyingonfaith.ogg",
                      "5lucesicutstellae.ogg",
                      "6sideb.ogg",
                      "7staytonight.ogg",
                      "8dreamofyou.ogg",
                      "9botherme.ogg",
                      "10chill.ogg",
                      "11sidec.ogg",
                      "12play.ogg",
                      "13demente.ogg",
                      "14lemon.ogg",
                      "15byulhatang.pgg",
                      "16sided.ogg",
                      "17x.ogg",
                      "18allnightlong.ogg",
                      "19everybodyhas.ogg",
                      "20comengoes.ogg",
                      "21querencia.ogg"
                    ]
                    },
                "Alivio": {
                  title: "Alivio",
                  folder: "Music/Alivio/",
                  tracks: [
                    "1creepin.ogg",
                    "2salty.ogg",
                    "3loyal.ogg",
                    "4stress.ogg",
                    "5beatofmyheart.ogg",
                    "6evensteven.ogg",
                    "7thanksforthememories.ogg",
                    "8stillarose.ogg"
                  ]
                  },
                "Barerare": {
                  title: "Barerare",
                  folder: "Music/Barerare/",
                  tracks: [
                    "1xxxx.ogg",
                    "2sparkling.ogg",
                    "3louder.ogg",
                    "4crazylikeyou.ogg",
                    "5californiadream.ogg",
                    "6goodnightmuprincess.ogg",
                    "7lovemeoutloud.ogg",
                    "8nuhuh.ogg"
                  ]
                  },
                  "ChristmasPromise": {
                   title: "ChristmasPromise",
                   folder: "Music/ChristmasPromise/",
                   tracks: [
                     "1sleigh.ogg",
                     "2theregoessantaclaus.ogg"
                   ]
                   },
                   "ChristmasPromiseAgain": {
                    title: "ChristmasPromiseAgain",
                    folder: "Music/ChristmasPromiseAgain/",
                    tracks: [
                      "1christmasagain.ogg",
                      "2itsthattimeofyear.ogg",
                      "3sleigh.ogg",
                      "4theregoessantaclaus.ogg"
                    ]
                    },
                    "eeniemeenie": {
                     title: "eeniemeenie",
                     folder: "Music/eeniemeenie/",
                     tracks: [
                       "1eeniemeenie.ogg",
                       "2imready.ogg"
                     ]
                   },
                   "KillingMe": {
                    title: "KillingMe",
                    folder: "Music/KillingMe/",
                    tracks: [
                      "killingme.ogg"
                    ]
                  },
                  "SaveMe": {
                   title: "SaveMe",
                   folder: "Music/SaveMe/",
                   tracks: [
                     "saveme.ogg"
                   ]
                   }
                }

let currentAlbumKey = null;
let currentTrackIndex = 0;
let isInstrumental = false;
let isPlaying = false;

// ИНИЦИАЛИЗАЦИЯ ПЛЕЕРА
const audioPlayer = new Audio();
audioPlayer.volume = 0.5;
audioPlayer.preload = 'none';

// АВТОМАТИКА: Когда песня заканчивается, сама вызывается следующая
audioPlayer.onended = () => {
    nextTrack();
};

// ОСНОВНАЯ ЛОГИКА
// ОСНОВНАЯ ЛОГИКА - ОБНОВЛЕННАЯ
function updateTrack(keepTime = false) {
    if (!currentAlbumKey) return;

    const album = library[currentAlbumKey];
    const subFolder = isInstrumental ? "Instrumental/" : "Original/";
    const trackName = album.tracks[currentTrackIndex];
    const savedTime = keepTime ? audioPlayer.currentTime : 0;
    const fullPath = album.folder + subFolder + trackName;

    // 1. Снимаем все старые обработчики, чтобы они не копились
    audioPlayer.oncanplay = null;

    // 2. Устанавливаем путь.
    // На GitHub лучше НЕ использовать load(), если сразу идет play()
    audioPlayer.src = fullPath;

    if (isPlaying) {
        // 3. Используем упрощенный запуск.
        // Браузер сам поймет, что нужно качать файл, как только увидит play()
        audioPlayer.play().then(() => {
            audioPlayer.currentTime = savedTime;

            const visualDisk = document.getElementById('player-disk-visual');
            if (visualDisk) visualDisk.classList.add('spinning');
        }).catch(e => {
            console.log("Ожидание буферизации...");

            // Если сеть медленная, запускаем как только появится первый кусочек данных
            audioPlayer.oncanplay = () => {
                if (isPlaying) {
                    audioPlayer.play();
                    audioPlayer.currentTime = savedTime;
                    const visualDisk = document.getElementById('player-disk-visual');
                    if (visualDisk) visualDisk.classList.add('spinning');
                }
            };
        });
    }
}





function insertDisk(albumKey) {
    if (library[albumKey]) {
        currentAlbumKey = albumKey;
        currentTrackIndex = 0;
        isPlaying = true;

        // --- ДОБАВЛЯЕМ ЭТО ---
        const visualDisk = document.getElementById('player-disk-visual');
        if (visualDisk) {
            // Убедись, что путь "visual/CDs/" совпадает с твоей папкой
            let fileName = albumKey.toLowerCase();
            visualDisk.src = `CDs/${fileName}.webp`;
            visualDisk.classList.remove('hidden');
        }
        // ---------------------

        updateTrack(false);
        console.log(`Диск ${library[albumKey].title} вставлен!`);

        // Закрываем оверлей (у тебя в HTML он cd-binder-overlay)
        document.getElementById('cd-binder-overlay').classList.add('hidden');
    }
}

function togglePlay() {
    if (!currentAlbumKey) return;

    const visualDisk = document.getElementById('player-disk-visual');

    if (audioPlayer.paused) {
        audioPlayer.play();
        isPlaying = true;
        if (visualDisk) visualDisk.classList.add('spinning'); // Запуск вращения
    } else {
        audioPlayer.pause();
        isPlaying = false;
        if (visualDisk) visualDisk.classList.remove('spinning'); // Стоп вращение
    }
}

function nextTrack() {
    if (!currentAlbumKey) return;
    const album = library[currentAlbumKey];

    if (currentTrackIndex < album.tracks.length - 1) {
        currentTrackIndex++;
        updateTrack(false);
    } else {
        // Конец альбома
        audioPlayer.pause();
        isPlaying = false;
        audioPlayer.currentTime = 0;
    }
}

function prevTrack() {
    if (!currentAlbumKey || currentTrackIndex === 0) return;
    currentTrackIndex--;
    updateTrack(false);
}

function toggleMode() {
    if (!currentAlbumKey) return;
    isInstrumental = !isInstrumental;
    updateTrack(true);
}

function stopAudio() {
    audioPlayer.pause();
    audioPlayer.src = "";
    audioPlayer.load();
    currentAlbumKey = null;
    currentTrackIndex = 0;
    isInstrumental = false;
    isPlaying = false;
    audioPlayer.currentTime = 0;
}

// Изменение громкости (delta: 0.1 или -0.1)
function changeVolume(delta) {
    let newVolume = audioPlayer.volume + delta;

    // Ограничиваем, чтобы громкость не выходила за пределы 0 и 1
    if (newVolume >= 0 && newVolume <= 1) {
        audioPlayer.volume = newVolume;
        console.log('Громкость: ${Math.round(newVolume * 100)}%');
    }
}
