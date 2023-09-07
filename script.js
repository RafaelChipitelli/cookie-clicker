// Variáveis globais para rastrear o estado do jogo
let cookies = 0; // Quantidade de cookies
let clickMultiplier = 1; // Multiplicador de cliques
let clickCount = 0; // Contagem de cliques
let bonusActive = false; // Rastreia se o bônus está ativo
let bonusTimeout; // Limite de tempo do bônus
let clickGoal = 10; // Meta para acionar o bônus duplo
const timeForBonusOff = 1000; // Tempo para desligar o bônus em milissegundos
const clickThreshold = 100; // Número de cliques necessário para o bônus triplo
let clickTimestamp = 0; // Timestamp do último clique

// Variáveis relacionadas ao multiplicador
let multiplierActive = false; // Verifica se o multiplicador está ativo
let multiplierTimeout; // Limite de tempo do multiplicador
const multiplierDuration = 10000; // Duração do multiplicador em milissegundos
const multiplierValue = 5; // Valor do multiplicador

// Elementos da interface do usuário
const cookie = document.getElementById('cookie'); // Elemento do cookie
const cookiesCount = document.getElementById('cookiesCount'); // Exibição da quantidade de cookies
const buyAutoClickButton = document.getElementById('buyAutoClick'); // Botão para comprar autoclique
const buyMultiplierButton = document.getElementById('buyMultiplier5-10s'); // Botão para comprar multiplicador
let bonusMultiplicador = false; // Rastreia se o bônus do multiplicador está ativo
const bonusMessage = document.getElementById('bonusMessage'); // Parágrafo para exibir mensagens de bônus
let autoClicks = 0; // Número de autocliques por segundo
let autoClickPrice = 100; // Preço dos autocliques

function updateButtons() {
    if (cookies >= autoClickPrice) {
        buyAutoClickButton.removeAttribute('disabled');
    } else {
        buyAutoClickButton.setAttribute('disabled', 'disabled');
    }

    // Atualize o botão do multiplicador com base no estado do multiplicador
    if (!multiplierActive && cookies >= 1000 ) {
        buyMultiplierButton.removeAttribute('disabled');
    } else {
        buyMultiplierButton.setAttribute('disabled', 'disabled');
    }
}

function autoClick() {
    cookies += (autoClicks * clickMultiplier); // Aplica o bônus aos cookies ganhos com autoclicks
    updateCookiesCount();

    // Verifique se o multiplicador está ativo e aplique-o aos cookies ganhos com o autoclique
    if (multiplierActive) {
        cookies += (autoClicks * clickMultiplier * multiplierValue);
    }
}

buyAutoClickButton.addEventListener('click', () => {
    if (cookies >= autoClickPrice) {
        cookies -= autoClickPrice;
        autoClicks += 10;
        autoClickPrice += 100;
        buyAutoClickButton.textContent = `Comprar Auto Click: ${autoClickPrice} Cookies`;
        updateButtons();
    }
});

function applyClickMultiplier() {
    clickMultiplier = 2;
    bonusMessage.textContent = 'Bônus Ativo: Cookies em Dobro!';
    bonusMessage.style.display = 'block'; // Exibe a mensagem de bônus

    // Define o temporizador do bônus para desativar o bônus após 1 segundo
    bonusTimeout = setTimeout(() => {
        clickMultiplier = 1;
        bonusMessage.style.display = 'none'; // Oculta a mensagem de bônus
        clickCount = 0; // Reinicia a contagem após 1 segundo
        bonusActive = false; // Bônus desativado
    }, timeForBonusOff); // segundos em milissegundos
}

function updateCookiesCount() {
    const previousCookies = parseInt(cookiesCount.textContent) || 0;
    cookiesCount.textContent = cookies;

    if (cookies > previousCookies) {
        cookiesCount.classList.remove('cookie-change');
        cookie.classList.add('cookie-change');
        setTimeout(() => {
            cookie.classList.remove('cookie-change');
        }, 100);
    }

    updateButtons();
}

setInterval(autoClick, 1000);
updateButtons();

cookie.addEventListener('click', () => {
    const currentTimestamp = Date.now();

    // Verifique se o tempo entre cliques é inferior a 1 segundo
    if (currentTimestamp - clickTimestamp < timeForBonusOff) {
        clickCount++;
    } else {
        clickCount = 1;
    }

    clickTimestamp = currentTimestamp;

    // Aplica o bônus aos cliques no cookie
    if (bonusMultiplicador) {
        const clickBonus = bonusActive ? clickMultiplier * multiplierValue : clickMultiplier;
        cookies += clickBonus;
    } else {
        const clickBonus = bonusActive ? clickMultiplier : clickMultiplier;
        cookies += clickBonus;
    }
    
    
    updateCookiesCount();
    updateButtons();

    // Verifica se o número de cliques atingiu o limite para o bônus triplo
    if (clickCount >= clickThreshold) {
        applyTripleClickBonus();
    } else if (clickCount >= clickGoal && !bonusActive) {
        applyClickMultiplier();
        bonusActive = true; // Bônus ativado
    }

    // Cancela e redefine o temporizador do bônus em cada clique
    clearTimeout(bonusTimeout);

    // Adicione um if aqui para desativar o bônus somente se o tempo for maior que 1 segundo
    if (clickCount >= clickGoal && bonusActive) {
        bonusTimeout = setTimeout(() => {
            clickCount = 0;
            clickMultiplier = 1;
            bonusMessage.style.display = 'none'; // Oculta a mensagem de bônus
            bonusActive = false; // Bônus desativado
        }, timeForBonusOff); // segundos em milissegundos
    }
});

function applyTripleClickBonus() {
    clickMultiplier = 3;
    bonusMessage.textContent = 'Bônus Ativo: Cookies em Triplo!';
    bonusMessage.style.display = 'block'; // Exibe a mensagem de bônus
    clickCount = 0; // Reinicia a contagem após ativar o bônus
    bonusActive = true; // Bônus ativado

    // Adicione um if aqui para desativar o bônus somente se o tempo for maior que 1 segundo
    if (clickCount >= clickGoal && bonusActive) {
        bonusTimeout = setTimeout(() => {
            clickCount = 0;
            clickMultiplier = 1;
            bonusMessage.style.display = 'none'; // Oculta a mensagem de bônus
            bonusActive = false; // Bônus desativado
        }, timeForBonusOff); // segundos em milissegundos
    }
}

function activateMultiplier(multiplierValue, duration) {
    // Ative o multiplicador com o valor especificado
    clickMultiplier *= multiplierValue;

    // Exiba a mensagem de bônus do multiplicador
    bonusMessagex.textContent = `Bônus Ativo: Cookies em ${multiplierValue}x!`;

    // Exiba a mensagem de bônus
    bonusMessagex.style.display = 'block';

    // Defina um temporizador para desativar o multiplicador após a duração especificada
    multiplierTimeout = setTimeout(() => {
        // Redefina o multiplicador para 1 (desativado)
        clickMultiplier = 1;

        // Oculte a mensagem de bônus
        bonusMessagex.style.display = 'none';

        // Bônus do multiplicador desativado
        multiplierActive = false;
        bonusMultiplicador = false
    }, duration);
}


// Event listener para o botão de multiplicador 5x por 10 segundos
buyMultiplierButton.addEventListener('click', () => {
    // Verifique se o multiplicador já está ativo
    if (!multiplierActive) {
        // Defina o preço do multiplicador
        const multiplierPrice = 1000;

        // Verifique se o jogador tem cookies suficientes para comprar o multiplicador
        if (cookies >= multiplierPrice) {
            // Desconte o preço do multiplicador dos cookies do jogador
            cookies -= multiplierPrice;

            // Atualize a exibição de cookies
            updateCookiesCount();

            // Chame a função para ativar o multiplicador 5x por 10 segundos
            activateMultiplier(5, 10000); // Ativa o multiplicador por 10 segundos (10000 milissegundos)

            // Desabilite o botão após a compra
            buyMultiplierButton.setAttribute('disabled', 'disabled');

            bonusMultiplicador = true
        }
    }
});
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
