// cards-data.js
console.log('=== CARDS-DATA.JS ЗАГРУЖЕН ===');

const allCards = [
    {
        id: 'alivioa1',
        name: 'alivioa1',
        image: 'POCAs/album/alivioa1.webp',
        price: 0
    },
    {
        id: 'alivioa2',
        name: 'alivioa2',
        image: 'POCAs/album/alivioa2.webp',
        price: 0
    },
    {
        id: 'alivioa3',
        name: 'alivioa3',
        image: 'POCAs/album/alivioa3.webp',
        price: 0
    },
    {
        id: 'alivioa4',
        name: 'alivioa4',
        image: 'POCAs/album/alivioa4.webp',
        price: 0
    },
    {
        id: 'handsonmea1',
        name: 'handsonmea1',
        image: 'POCAs/album/handsonmea1.webp',
        price: 30
    },
    {
        id: 'handsonmea2',
        name: 'handsonmea2',
        image: 'POCAs/album/handsonmea2.webp',
        price: 30
    },
    {
        id: 'handsonmea3',
        name: 'handsonmea3',
        image: 'POCAs/album/handsonmea3.webp',
        price: 30
    },
    {
        id: 'offseta1',
        name: 'offseta1',
        image: 'POCAs/album/offseta1.webp',
        price: 30
    },
    {
        id: 'offseta2',
        name: 'offseta2',
        image: 'POCAs/album/offseta2.webp',
        price: 30
    },
    {
        id: 'offseta3',
        name: 'offseta3',
        image: 'POCAs/album/offseta3.webp',
        price: 30
    },
    {
        id: 'offseta4',
        name: 'offseta4',
        image: 'POCAs/album/offseta4.webp',
        price: 30
    },
    {
        id: 'offseta5',
        name: 'offseta5',
        image: 'POCAs/album/offseta5.webp',
        price: 30
    },
    {
        id: 'offseta6',
        name: 'offseta6',
        image: 'POCAs/album/offseta6.webp',
        price: 30
    },
    {
        id: 'bloomingbluea1',
        name: 'bloomingbluea1',
        image: 'POCAs/album/bloomingbluea1.webp',
        price: 30
    }
    // Добавьте остальные 64 карты
];

// Делаем глобально доступным
if (typeof window !== 'undefined') {
    window.allCards = allCards;
    console.log('✅ allCards установлен в window. Карт:', allCards.length);
    console.log('Первая карта:', allCards[0]);
}

// Экспорт для модулей (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { allCards };
}
