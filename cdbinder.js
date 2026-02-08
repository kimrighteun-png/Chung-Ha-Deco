const binderAlbums = [
    "HandsOnMe", // Страница 1
    "Offset",
    "BloomingBlue",
    "gottago",  // Страница 3
    "Flourishing",
    "Querencia",
    "KillingMe",
    "Barerare",
    "eeniemeenie",
    "algorithm",
    "ChristmasPromise",
    "Alivio",
    "ChristmasPromiseAgain"
    // ... и так далее до 13
];

const totalPages = binderAlbums.length; // Автоматически станет 13, когда дополнишь массив

//let currentPage = 0;
//const totalPages = 1;

function openCdBinder() {
    document.getElementById('binder-overlay').classList.remove('hidden');
    currentPage = 0;
    updateBinderView();
}

function closeCdBinder() {
    document.getElementById('binder-overlay').classList.add('hidden');
}

function changePage(direction) {
    currentPage += direction;
    if (currentPage < 0) currentPage = 0;
    if (currentPage > totalPages) currentPage = totalPages;
    updateBinderView();
}

function updateBinderView() {
    const book = document.getElementById('binder-book');
    const content = document.getElementById('binder-content');
    if (!book || !content) return;

    if (currentPage === 0) {
        // Обложка
        book.style.backgroundImage = "url('visual/cdbinder/cdbindercover.webp')";
        content.innerHTML = '';
    } else {
        // Любая страница с диском
        book.style.backgroundImage = "url('visual/cdbinder/cdbinderpl1.webp')";
        renderDisks();
    }
}

function renderDisks() {
    const content = document.getElementById('binder-content');
    const albumKey = binderAlbums[currentPage - 1];

    // Ищем данные, игнорируя регистр ключа
    const albumData = library[albumKey] || library[albumKey.toLowerCase()] || library[albumKey.charAt(0).toUpperCase() + albumKey.slice(1)];

    if (!albumData) {
        console.error("Альбом не найден в базе:", albumKey);
        return;
    }

    content.innerHTML = `
    <div class="page-spread">
        <img src="visual/cdbinder/cdbinderpl1.webp" class="layer-bottom">
        <div class="disk-slot">
            <img src="CDs/${albumKey.toLowerCase()}.webp" class="cd-disk" draggable="false">
        </div>
        <img src="visual/cdbinder/cdbinderpl2.webp" class="layer-top">
    </div>
    <button id="use-disk-btn" class="use-btn fixed-button">Использовать диск</button>
`;

    document.getElementById('use-disk-btn').onclick = () => {
        insertDisk(albumKey);
        closeCdBinder();
    };
}

// Закрытие по клику на фон
function checkClose(event) {
    if (event.target.id === 'binder-overlay') {
        closeCdBinder();
    }
}
