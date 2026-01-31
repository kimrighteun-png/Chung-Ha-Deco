// Пытаемся достать данные из памяти, если их нет — создаем пустой массив или стартовый набор
let myCards = JSON.parse(localStorage.getItem('myInventory')) || [
  { id: 'alivioa1', img: 'POCAs/album/alivioa1.webp', category: 'album'},
  { id: 'alivioa2', img: 'POCAs/album/alivioa2.webp', category: 'album' },
  { id: 'alivioa3', img: 'POCAs/album/alivioa3.webp', category: 'album' },
  { id: 'alivioa4', img: 'POCAs/album/alivioa4.webp', category: 'album' }
];

const allCards = [
  { id: 'alivioa1', img: 'POCAs/album/alivioa1.webp', category: 'album'},
  { id: 'alivioa2', img: 'POCAs/album/alivioa2.webp', category: 'album' },
  { id: 'alivioa3', img: 'POCAs/album/alivioa3.webp', category: 'album' },
  { id: 'alivioa4', img: 'POCAs/album/alivioa4.webp', category: 'album' },
  { id: 'handsonmea1', img: 'POCAs/album/handsonmea1.webp', category: 'album' },
  { id: 'handsonmea2', img: 'POCAs/album/handsonmea2.webp', category: 'album' },
  { id: 'handsonmea3', img: 'POCAs/album/handsonmea3.webp', category: 'album' }
]
