console.log('=== shop.js загружен ===');

function initShopShelves() {
    const shelves = [
        document.getElementById('shelf-1'),
        document.getElementById('shelf-2'),
        document.getElementById('shelf-3')
    ];

    const cards = window.allCards || [];
    const inventory = window.playerInventory || [];

    // ДОБАВЛЯЕМ ЭТО: загружаем данные биндера, чтобы проверить карты там
    const binderData = JSON.parse(localStorage.getItem('chungha_binder_data')) || {};
    const cardsInBinder = Object.values(binderData).map(id => String(id)); // Массив ID из биндера

    const perShelf = Math.ceil(cards.length / shelves.length);

    shelves.forEach((shelf, index) => {
        if (!shelf) return;

        const start = index * perShelf;
        const end = start + perShelf;
        const shelfCards = cards.slice(start, end);

        shelfCards.forEach(card => {
            const sId = String(card.id);

            // ИЗМЕНЕННАЯ ПРОВЕРКА: есть в инвентаре ИЛИ в биндере
            const isOwned = inventory.map(String).includes(sId) || cardsInBinder.includes(sId);

            const cardEl = document.createElement('div');
            cardEl.className = 'shop-card';
            cardEl.innerHTML =`
                <img src="${card.image}" alt="">
                <div class="card-price">${card.price} ❤️</div>
                <button class="buy-btn" data-id="${card.id}">
                    ${isOwned ? 'OWNED' : 'BUY'}
                </button>
            `;

            shelf.appendChild(cardEl);

            const btn = cardEl.querySelector('.buy-btn');
            btn.addEventListener('click', () => buyCard(card.id, btn));
            if (isOwned) btn.disabled = true;
        });
    });
}

function buyCard(cardId, buttonEl) {
    const inventory = window.playerInventory || [];
    if (inventory.includes(cardId)) return;

    // Добавляем карту в массив
    inventory.push(cardId);
    window.playerInventory = inventory;
    localStorage.setItem('chungha_inventory', JSON.stringify(inventory));

    // Добавляем карту в инвентарь на экране биндера
    if (typeof window.addCardToInventory === 'function') {
        window.addCardToInventory(cardId);
    }

    // Обновляем кнопку
    buttonEl.textContent = 'OWNED';
    buttonEl.disabled = true;

    console.log('Куплена карта:', cardId);
}

// Инициализация магазина
document.addEventListener('DOMContentLoaded', () => {
    window.playerInventory = JSON.parse(localStorage.getItem('chungha_inventory')) || [];
    initShopShelves();
});
