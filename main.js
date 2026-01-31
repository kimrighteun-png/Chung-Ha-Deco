function startGame() {
const loader = document.getElementById('loading-screen');

// 1. Показываем загрузку
loader.classList.remove('hidden');

// 2. Через 3 секунды переключаем экран
setTimeout(() => {
    // Прячем загрузку
    loader.classList.add('hidden');

    // Показываем счетчик и переходим в игру
    document.getElementById('heart-display').style.opacity = '1';
    showScreen('work-zone');
}, 1500);
}

function showScreen(screenId) {
document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
const target = document.getElementById(screenId);
if(target) target.classList.add('active');
}

function openBinder() {
    alert("Ты нажала на биндер! Здесь будет вид сверху.");
    // Когда создашь экран вида сверху, заменим alert на переключение экрана
}

function openBinder() {
    document.getElementById('binder-view').classList.remove('hidden');
    console.log("Биндер открыт");
}

function closeBinder() {
    document.getElementById('binder-view').classList.add('hidden');
    console.log("Биндер закрыт");
}
