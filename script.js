let cookies = 0;

const cookie = document.getElementById('cookie');
const cookiesCount = document.getElementById('cookiesCount');
const buyAutoClickButton = document.getElementById('buyAutoClick');
let autoClicks = 0;
let autoClickPrice = 100;

function updateButtons() {
    if (cookies >= autoClickPrice) {
        buyAutoClickButton.removeAttribute('disabled');
    } else {
        buyAutoClickButton.setAttribute('disabled', 'disabled');
    }
}

function autoClick() {
    cookies += autoClicks;
    updateCookiesCount();
}

buyAutoClickButton.addEventListener('click', () => {
    if (cookies >= autoClickPrice) {
        cookies -= autoClickPrice;
        autoClicks += 10;
        autoClickPrice += 100;
        buyAutoClickButton.textContent = `Comprar Auto Click (${autoClickPrice} cookies)`;
        updateButtons();
    }
});

function updateCookiesCount() {
    cookiesCount.textContent = cookies;
}

setInterval(autoClick, 1000); // Chama a função autoClick a cada 1 segundo
updateButtons();

// Adicionando a função de clique no cookie
cookie.addEventListener('click', () => {
    cookies++;
    updateCookiesCount();
    updateButtons();
});
