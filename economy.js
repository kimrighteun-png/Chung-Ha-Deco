

// Глобальная функция для добавления сердечек
window.addHearts = function(amount) {
    // Загружаем текущий баланс
    let currentHearts = parseInt(localStorage.getItem('dog_hearts')) || 0;

    // Добавляем
    currentHearts += amount;

    // Сохраняем
    localStorage.setItem('dog_hearts', currentHearts.toString());

    // Обновляем отображение
    const display = document.getElementById('h-count');
    if (display) {
        display.textContent = currentHearts;
    }

  
    return currentHearts;
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Показываем текущий баланс
    const hearts = parseInt(localStorage.getItem('dog_hearts')) || 0;
    const display = document.getElementById('h-count');
    if (display) {
        display.textContent = hearts;
    }
});
