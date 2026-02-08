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
                  }
}

let currentAlbumKey = null;
let currentTrackIndex = 0;
let isInstrumental = false;
let isPlaying = false;

// ИНИЦИАЛИЗАЦИЯ ПЛЕЕРА
const audioPlayer = new Audio();
audioPlayer.volume = 0.5;
audioPlayer.preload = 'metadata';

// АВТОМАТИКА: Когда песня заканчивается, сама вызывается следующая
audioPlayer.onended = () => {
    nextTrack();
};

// ОСНОВНАЯ ЛОГИКА
function updateTrack(keepTime = false) {
    if (!currentAlbumKey) return;

    const album = library[currentAlbumKey];
    const subFolder = isInstrumental ? "Instrumental/" : "Original/";
    const trackName = album.tracks[currentTrackIndex];
    const savedTime = keepTime ? audioPlayer.currentTime : 0;

    // Улучшаем загрузку: 'auto' вместо 'none'
    audioPlayer.preload = 'auto';
    audioPlayer.src = album.folder + subFolder + trackName;

    // Сбрасываем и загружаем заново
    audioPlayer.load();

    audioPlayer.oncanplay = () => { // Используем oncanplay, оно быстрее
        audioPlayer.currentTime = savedTime;

        const visualDisk = document.getElementById('player-disk-visual');

        if (isPlaying) {
            // Принудительный старт
            audioPlayer.play().catch(e => console.log("Ошибка авто-старта:", e));
            if (visualDisk) visualDisk.classList.add('spinning');
        } else {
            if (visualDisk) visualDisk.classList.remove('spinning');
        }
    };
}function updateTrack(keepTime = false) {
    if (!currentAlbumKey) return;

    const album = library[currentAlbumKey];
    const subFolder = isInstrumental ? "Instrumental/" : "Original/";
    const trackName = album.tracks[currentTrackIndex];
    const savedTime = keepTime ? audioPlayer.currentTime : 0;

    // СТРОИМ ПУТЬ (проверь, чтобы тут не было лишних/недостающих слешей)
    const fullPath = album.folder + subFolder + trackName;
    console.log("Загружаю трек:", fullPath); // ОТЛАДКА: посмотри в консоль, правильный ли путь

    audioPlayer.src = fullPath;
    audioPlayer.load();

    // Запускаем сразу, не дожидаясь события загрузки (браузер сам подтянет данные)
    if (isPlaying) {
        audioPlayer.play().then(() => {
            audioPlayer.currentTime = savedTime;
            const visualDisk = document.getElementById('player-disk-visual');
            if (visualDisk) visualDisk.classList.add('spinning');
        }).catch(e => {
            console.log("Автостарт заблокирован браузером. Нужно нажать Play руками.", e);
            isPlaying = false;
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
