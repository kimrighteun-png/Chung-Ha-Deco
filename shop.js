function pullGacha() {
    const cost = 20;
    const hCountElem = document.getElementById('h-count');
    let currentHearts = parseInt(hCountElem.innerText);

    // 1. Проверка денег
  if (currentHearts < cost) {
        alert("Не хватает сердечек! ♡");
        return;
    }

    // 2. Списание
    currentHearts -= cost;
    hCountElem.innerText = currentHearts;

    // 3. Рандом из категории album
    const albumPool = allCards.filter(card => card.category === 'album');

    if (albumPool.length === 0) {
        console.error("Ошибка: В категории 'album' нет карт!");
        return;
    }

    const wonCard = albumPool[Math.floor(Math.random() * albumPool.length)];

    // 4. Показ результата
    displayWin(wonCard);
}

function displayWin(card) {
    const resOverlay = document.getElementById('gacha-result');
    const resImg = document.getElementById('result-card-img');
    const resName = document.getElementById('result-card-name');

    // Устанавливаем данные
    resImg.style.backgroundImage = `url'(${card.img}')`;
    resName.innerText = card.name;

    // Показываем оверлей
    resOverlay.style.display = 'flex';

    // 5. Сохранение и закрытие
    setTimeout(() => {
        resOverlay.style.display = 'none';

        // 1. Добавляем карту в массив
        myCards.push(card);

        // 2. Сохраняем обновленный массив в память браузера
        localStorage.setItem('myInventory', JSON.stringify(myCards));

        // 3. Если есть функция отрисовки биндера — запускаем её
        if (typeof renderStorage === 'function') {
            renderStorage();
        }
    }, 3000);
}
