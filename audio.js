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
        title: "Hands On Me",
        folder: "Music/Algorithm/",
        tracks: [
            "algorithm.ogg"
        ]
    },
    "gottago": {
        title: "Hands On Me",
        folder: "Music/GottaGo/",
        tracks: [
            "gottago.ogg"
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

    audioPlayer.src = album.folder + subFolder + trackName;

    audioPlayer.onloadedmetadata = () => {
    audioPlayer.currentTime = savedTime;

    const visualDisk = document.getElementById('player-disk-visual'); // Находим диск

    if (isPlaying) {
        audioPlayer.play().catch(e => console.log("Ошибка старта"));

        // --- ДОБАВЛЯЕМ ЭТО ---
        if (visualDisk) visualDisk.classList.add('spinning');
    } else {
        // --- И ЭТО (на случай паузы) ---
        if (visualDisk) visualDisk.classList.remove('spinning');
    }
};
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
