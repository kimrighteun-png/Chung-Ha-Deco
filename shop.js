console.log('=== shop.js загружен ===');

function initShopShelves() {
    const shelves = [
        document.getElementById('shelf-1'),
        document.getElementById('shelf-2'),
        document.getElementById('shelf-3')
    ];

    const cards = window.allCards || [];
    const inventory = window.playerInventory || [];

    // Разбиваем карты на 3 полки
    const perShelf = Math.ceil(cards.length / shelves.length);

    shelves.forEach((shelf, index) => {
        if (!shelf) return; // Проверка, что полка существует в HTML

        const start = index * perShelf;
        const end = start + perShelf;
        const shelfCards = cards.slice(start, end);

        shelfCards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'shop-card';
            cardEl.innerHTML = `
                <img src="${card.image}" alt="">
                <div class="card-price">${card.price} ❤️</div>
                <button class="buy-btn" data-id="${card.id}">
                    ${inventory.includes(card.id) ? 'OWNED' : 'BUY'}
                </button>
            `;

            // Добавляем карточку в текущую полку
            shelf.appendChild(cardEl);

            // обработчик кнопки покупки
            const btn = cardEl.querySelector('.buy-btn');
            btn.addEventListener('click', () => buyCard(card.id, btn));
            if (inventory.includes(card.id)) btn.disabled = true;
        }); // Конец shelfCards.forEach
    }); // Конец shelves.forEach
} // Конец initShopShelves

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
