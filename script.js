// ================================================================
// ПАРТИКЛЫ
// ================================================================
(function() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 120;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = height - Math.random() * 30 - 5;
            this.size = 0.6 + Math.random() * 2.5;
            const speed = 0.4 + Math.random() * 1.2;
            this.vy = -(speed * (0.7 + Math.random() * 0.6));
            this.vx = (Math.random() - 0.5) * 0.6;
            this.life = 0.5 + Math.random() * 0.5;
            this.maxLife = this.life;
        }
        update() {
            this.x += this.vx + (Math.random() - 0.5) * 0.02;
            this.y += this.vy;
            this.vy += 0.001;
            this.life -= 0.0006;
            if (this.life < 0.08 || this.y < -80 || this.x < -80 || this.x > width + 80) {
                this.reset();
                this.y = height - Math.random() * 30 - 5;
                this.x = Math.random() * width;
                this.life = 0.5 + Math.random() * 0.5;
                this.maxLife = this.life;
            }
        }
        draw() {
            const alpha = (this.life / this.maxLife) * 0.7;
            const radius = this.size * (0.7 + 0.3 * Math.sin(this.life * 10));
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
            grad.addColorStop(0, `rgba(255, 200, 100, ${alpha * 0.8})`);
            grad.addColorStop(0.5, `rgba(200, 150, 50, ${alpha * 0.4})`);
            grad.addColorStop(1, `rgba(150, 100, 30, ${alpha * 0.1})`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = new Particle();
        p.y = Math.random() * height * 0.5 + height * 0.3;
        p.life = 0.3 + Math.random() * 0.7;
        p.maxLife = p.life;
        particles.push(p);
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
})();

// ================================================================
// ПАРТИКЛЫ ПРИ ВЫИГРЫШЕ (CONFETTI)
// ================================================================
let confettiParticles = [];
let confettiActive = false;
function createConfetti(x, y) {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#ff9f43', '#00d2d3', '#d4af37', '#f4e4a1'];
    for (let i = 0; i < 100; i++) {
        confettiParticles.push({
            x: x || window.innerWidth / 2,
            y: y || window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: -Math.random() * 20 - 5,
            size: 4 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 15,
            life: 1,
            decay: 0.006 + Math.random() * 0.014,
            gravity: 0.12 + Math.random() * 0.12
        });
    }
    confettiActive = true;
    animateConfetti();
}
function animateConfetti() {
    if (!confettiActive && confettiParticles.length === 0) return;
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;
        if (p.life > 0) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
            ctx.restore();
        }
    });
    confettiParticles = confettiParticles.filter(p => p.life > 0);
    if (alive || confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ================================================================
// SKELETON LOADER
// ================================================================
function showSkeletonLoader() {
    const loader = document.getElementById('skeletonLoader');
    if (loader) loader.style.display = 'flex';
}
function hideSkeletonLoader() {
    const loader = document.getElementById('skeletonLoader');
    if (loader) loader.style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function() {
    showSkeletonLoader();
    setTimeout(() => {
        hideSkeletonLoader();
        renderAchievements();
    }, 1200);
});

// ================================================================
// COOKIE BANNER
// ================================================================
function acceptCookies() {
    document.getElementById('cookieBanner').classList.remove('show');
    localStorage.setItem('cookiesAccepted', 'true');
    showToast('Спасибо! Настройки сохранены.');
}
function declineCookies() {
    document.getElementById('cookieBanner').classList.remove('show');
    localStorage.setItem('cookiesAccepted', 'false');
    showToast('Вы отклонили использование cookie.');
}
if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        document.getElementById('cookieBanner').classList.add('show');
    }, 2500);
}

// ================================================================
// ТЕМА + КАСТОМИЗАЦИЯ
// ================================================================
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}
function toggleThemeCustomizer() {
    document.getElementById('themeCustomizer').classList.toggle('show');
}
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('customTheme', theme);
    document.getElementById('themeCustomizer').classList.remove('show');
    showToast(`🎨 Тема изменена на ${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
}
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
const savedTheme = localStorage.getItem('customTheme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

// ================================================================
// HEADER SCROLL
// ================================================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('header-scrolled', window.pageYOffset > 50);
});

// ================================================================
// НАВИГАЦИЯ С ПЛАВНЫМ ПЕРЕХОДОМ
// ================================================================
let isNavigating = false;
function navigateTo(page) {
    if (isNavigating) return;
    isNavigating = true;
    const currentPage = document.querySelector('.page.active');
    const newPage = document.getElementById('page-' + page);
    if (!newPage) {
        isNavigating = false;
        return;
    }
    if (currentPage) {
        currentPage.classList.remove('active');
        currentPage.style.display = 'none';
    }
    newPage.style.display = 'block';
    newPage.classList.add('active');
    newPage.style.opacity = '0';
    newPage.style.transform = 'translateY(30px)';
    requestAnimationFrame(() => {
        newPage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        newPage.style.opacity = '1';
        newPage.style.transform = 'translateY(0)';
    });
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(`.nav a[data-page="${page}"]`);
    if (navLink) navLink.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('mainNav').classList.remove('open');
    document.getElementById('burgerBtn').classList.remove('active');
    // Перерендер каталога и слайдера при переходе на соответствующие страницы
    if (page === 'games' && typeof renderCatalog === 'function') {
        try { renderCatalog(); } catch(e){}
    }
    if (page === 'home' && typeof renderTopGames === 'function') {
        try { renderTopGames(); } catch(e){}
        try { renderHeroGames(); } catch(e){}
    }
    setTimeout(() => {
        isNavigating = false;
    }, 600);
}
document.getElementById('burgerBtn').addEventListener('click', function() {
    this.classList.toggle('active');
    document.getElementById('mainNav').classList.toggle('open');
});

// ================================================================
// ПОИСК
// ================================================================
const allGames = [
    'Starburst', 'Book of Dead', "Gonzo's Quest", 'Mega Moolah', 'Twin Spin',
    'Immortal Romance', "Dragon's Luck", "Luck o' the Irish", 'Castle of Fire', 'Crown Royale',
    'Sweet Bonanza', 'Bonanza', 'Wolf Gold', 'Rainbow Riches', 'Unicorn Magic',
    'Magic Mirror', 'Paradise', 'Star Clusters', 'Fire & Steel', 'Ocean Treasure',
    'Retro Arcade', "Champion's Gold", 'Moonlight', 'Wheel of Fortune', 'Tiki Tiki', 'Blood Suckers'
];
function fuzzySearch(query, items) {
    if (!query || query.length < 1) return [];
    const queryLower = query.toLowerCase().trim();
    const results = [];
    for (const item of items) {
        const itemLower = item.toLowerCase();
        let score = 0;
        if (itemLower === queryLower) score += 100;
        if (itemLower.startsWith(queryLower)) score += 50;
        if (itemLower.includes(queryLower)) score += 30;
        const queryWords = queryLower.split(' ');
        const itemWords = itemLower.split(' ');
        for (const qWord of queryWords) {
            if (qWord.length < 1) continue;
            for (const iWord of itemWords) {
                if (iWord.includes(qWord)) score += 15;
                if (iWord.length > 2 && qWord.length > 2) {
                    const distance = levenshteinDistance(qWord, iWord);
                    if (distance <= 2) score += 8;
                    else if (distance <= 3) score += 4;
                }
            }
        }
        const itemFirstLetters = itemWords.map(w => w[0]).join('');
        if (itemFirstLetters.includes(queryLower.replace(/\s/g, ''))) score += 10;
        if (score > 0) results.push({ name: item, score: score });
    }
    results.sort((a, b) => b.score - a.score);
    return results.map(r => r.name);
}
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i-1] === a[j-1]) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
function searchGames(query) {
    const results = document.getElementById('searchResults');
    const clearBtn = document.getElementById('searchClear');
    if (query && query.trim()) {
        clearBtn.classList.add('visible');
        const q = query.trim().toLowerCase();
        // Ищем по всем 551 играм из GAMES
        let matches;
        if (typeof GAMES !== 'undefined' && GAMES.length) {
            matches = GAMES
                .filter(g => g.name.toLowerCase().includes(q))
                .slice(0, 8);
        } else {
            matches = fuzzySearch(query.trim(), allGames).slice(0, 8).map(n => ({ name: n }));
        }
        if (matches.length === 0) {
            results.innerHTML = '<div class="empty-result">Ничего не найдено</div>';
            results.classList.add('active');
        } else {
            results.innerHTML = matches.map(g => `
                <div class="result-item" onclick="playGame('${g.name.replace(/'/g, "\\'")}'); clearSearch();">
                    <div class="icon"><img src="images/games/${g.img || ''}" alt="${g.name}" onerror="this.style.display='none';this.parentElement.textContent='🎮';"></div>
                    <div class="info"><h4>${g.name}</h4><p>Нажмите, чтобы запустить</p></div>
                </div>
            `).join('');
            results.classList.add('active');
        }
    } else {
        clearBtn.classList.remove('visible');
        results.classList.remove('active');
    }
}
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').classList.remove('active');
    document.getElementById('searchClear').classList.remove('visible');
}
document.addEventListener('click', function(e) {
    const searchWrap = document.querySelector('.search-wrap');
    if (searchWrap && !searchWrap.contains(e.target)) {
        document.getElementById('searchResults').classList.remove('active');
    }
});

// ================================================================
// ГОЛОСОВОЙ ПОИСК
// ================================================================
let recognition = null;
let isRecording = false;
let micPermissionGranted = localStorage.getItem('micPermission') === 'granted';
if (micPermissionGranted) initSpeechRecognition();
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR();
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = function() {
            isRecording = true;
            document.getElementById('voiceSearchBtn').classList.add('recording');
            document.getElementById('voiceIndicator').classList.add('show');
        };
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('searchInput').value = transcript;
            searchGames(transcript);
            showToast(`🔊 Поиск: "${transcript}"`);
            stopRecording();
        };
        recognition.onerror = function(event) {
            if (event.error === 'not-allowed') {
                micPermissionGranted = false;
                localStorage.setItem('micPermission', 'denied');
                showToast('❌ Доступ к микрофону запрещён.');
            } else {
                showToast('🔇 Голосовой поиск не распознал речь.');
            }
            stopRecording();
        };
        recognition.onend = function() { stopRecording(); };
    }
}
function stopRecording() {
    isRecording = false;
    document.getElementById('voiceSearchBtn').classList.remove('recording');
    document.getElementById('voiceIndicator').classList.remove('show');
}
function voiceSearch() {
    if (!micPermissionGranted) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            try {
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                const tempRec = new SR();
                tempRec.lang = 'ru-RU';
                tempRec.continuous = false;
                tempRec.interimResults = false;
                tempRec.onstart = function() {
                    micPermissionGranted = true;
                    localStorage.setItem('micPermission', 'granted');
                    initSpeechRecognition();
                    showToast('🎤 Микрофон активирован!');
                    tempRec.stop();
                    setTimeout(() => voiceSearch(), 300);
                };
                tempRec.onerror = function() {
                    showToast('❌ Доступ к микрофону запрещён.');
                    localStorage.setItem('micPermission', 'denied');
                };
                tempRec.start();
                showToast('🎤 Запрос разрешения на микрофон...');
            } catch(e) {
                showToast('⚠️ Ошибка доступа к микрофону');
            }
        } else {
            showToast('❌ Голосовой поиск не поддерживается');
        }
        return;
    }
    if (recognition && !isRecording) {
        try { recognition.start(); } catch(e) {
            if (e.message && e.message.includes('already started')) {
                showToast('⏳ Уже слушаю...');
            } else {
                showToast('⚠️ Ошибка запуска микрофона');
            }
        }
    } else if (isRecording) {
        showToast('⏳ Уже слушаю...');
    } else {
        showToast('❌ Голосовой поиск не поддерживается');
    }
}

// ================================================================
// СИСТЕМА УВЕДОМЛЕНИЙ В РЕАЛЬНОМ ВРЕМЕНИ
// ================================================================
function addNotification(icon, title, text, type = 'info') {
    const container = document.getElementById('notificationCenter');
    const id = 'notif-' + Date.now();
    const el = document.createElement('div');
    el.className = `notification-item ${type}`;
    el.id = id;
    el.innerHTML = `
        <div class="notif-icon">${icon}</div>
        <div class="notif-content">
            <div class="notif-title">${title}</div>
            <div class="notif-text">${text}</div>
        </div>
        <button class="notif-close" onclick="removeNotification('${id}')">✕</button>
    `;
    container.appendChild(el);
    setTimeout(() => el.classList.add('show'), 100);
    setTimeout(() => {
        removeNotification(id);
    }, 6000);
}
function removeNotification(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 500);
    }
}
setTimeout(() => {
    addNotification('🏆', 'Новый выигрыш!', 'Игрок KingAce выиграл 1 240 000 ₽ в Starburst', 'win');
}, 8000);
setTimeout(() => {
    addNotification('🎁', 'Бонус активирован!', 'Вы получили 50 фриспинов на Book of Dead', 'bonus');
}, 12000);

// ================================================================
// ДЕМО-РЕЖИМ ИГР С ВИРТУАЛЬНЫМИ КРЕДИТАМИ
// ================================================================
let virtualBalance = 1000;
let demoModeActive = false;
function startDemoMode(gameName) {
    demoModeActive = true;
    virtualBalance = 1000;
    showToast(`🎮 Демо-режим "${gameName}" активирован! Баланс: ${virtualBalance} ₽`);
    addNotification('🎮', 'Демо-режим', `Игра "${gameName}" запущена. Виртуальный баланс: ${virtualBalance} ₽`, 'info');
}
function spinDemo(bet = 10) {
    if (!demoModeActive) {
        showToast('⚠️ Сначала активируйте демо-режим');
        return;
    }
    if (virtualBalance < bet) {
        showToast('❌ Недостаточно виртуальных кредитов!');
        return;
    }
    virtualBalance -= bet;
    const win = Math.random() < 0.3 ? bet * (2 + Math.random() * 8) : 0;
    virtualBalance += win;
    if (win > 0) {
        showToast(` Вы выиграли ${Math.round(win)} ₽! Баланс: ${Math.round(virtualBalance)} ₽`);
        createConfetti();
        addNotification('🎉', 'Демо-выигрыш!', `+${Math.round(win)} ₽ виртуальных кредитов`, 'win');
    } else {
        showToast(`😔 Проигрыш ${bet} ₽. Баланс: ${Math.round(virtualBalance)} ₽`);
    }
    if (virtualBalance <= 0) {
        showToast('💸 Виртуальные кредиты закончились! Начните заново.');
        demoModeActive = false;
    }
}

// ================================================================
// ЧАТ
// ================================================================
let chatNotifCount = 0;
function toggleChat() {
    const win = document.getElementById('chatWindow');
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
        document.getElementById('chatNotif').classList.remove('show');
        chatNotifCount = 0;
    }
}
function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    const container = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    container.innerHTML += `<div class="msg user">${msg}<span class="time">${time}</span></div>`;
    input.value = '';
    container.scrollTop = container.scrollHeight;
    setTimeout(() => {
        const botMsgs = [
            'Спасибо за сообщение! Чем ещё могу помочь?',
            'Отличный вопрос! Давайте разберёмся.',
            'Я всегда рад помочь вам!',
            'Сейчас уточню информацию для вас.',
            'Выберите интересующую вас тему, и я помогу.'
        ];
        const reply = botMsgs[Math.floor(Math.random() * botMsgs.length)];
        container.innerHTML += `<div class="msg bot">${reply}<span class="time">${new Date().toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' })}</span></div>`;
        container.scrollTop = container.scrollHeight;
        if (!document.getElementById('chatWindow').classList.contains('open')) {
            chatNotifCount++;
            document.getElementById('chatNotif').textContent = chatNotifCount;
            document.getElementById('chatNotif').classList.add('show');
        }
    }, 600 + Math.random() * 800);
}

// ================================================================
// ИЗБРАННОЕ
// ================================================================
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
function toggleFav(el) {
    const game = el.dataset.game;
    const idx = favorites.indexOf(game);
    if (idx > -1) {
        favorites.splice(idx, 1);
        el.classList.remove('active');
        el.textContent = '♡';
        showToast('Удалено из избранного');
    } else {
        favorites.push(game);
        el.classList.add('active');
        el.textContent = '♥';
        showToast('Добавлено в избранное');
        addNotification('⭐', 'В избранное!', `Игра "${game}" добавлена в избранное`, 'info');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesUI();
}
function updateFavoritesUI() {
    document.querySelectorAll('.card-fav, .catalog-fav').forEach(el => {
        const game = el.dataset.game;
        if (favorites.includes(game)) {
            el.classList.add('active');
            el.textContent = '♥';
        } else {
            el.classList.remove('active');
            el.textContent = '♡';
        }
    });
    const list = document.getElementById('favoritesList');
    if (list) {
        if (favorites.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Нет избранных игр</p>';
        } else {
            list.innerHTML = favorites.map(g =>
                `<div style="padding:8px 16px;background:var(--glass-bg);border:1px solid var(--border-gold);border-radius:var(--radius-sm);">❤️ ${g}</div>`
            ).join('');
        }
    }
}
setTimeout(updateFavoritesUI, 100);

// ================================================================
// ТОП ИГР — АВТОПРОКРУТКА
// ================================================================
let currentSlide = 0;
const slides = document.querySelectorAll('.games-grid');
const dots = document.querySelectorAll('.slider-dots span');
const track = document.getElementById('gamesSliderTrack');
let autoSlideInterval;
function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}
function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 4000);
}
function stopAutoSlide() { clearInterval(autoSlideInterval); }
dots.forEach((dot, i) => dot.addEventListener('click', function() {
    goToSlide(i); stopAutoSlide(); setTimeout(startAutoSlide, 5000);
}));
startAutoSlide();
const sliderWrapper = document.querySelector('.games-slider-wrapper');
sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
sliderWrapper.addEventListener('mouseleave', startAutoSlide);

// ================================================================
// ФИЛЬТРЫ КАТАЛОГА
// ================================================================
function filterGames(type, btn) {
    document.querySelectorAll('.catalog-filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.catalog-item').forEach(item => {
        if (type === 'all' || item.dataset.type === type) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// ================================================================
// ПРОФИЛЬ — ВКЛАДКИ
// ================================================================
function switchProfileTab(tab, btn) {
    document.querySelectorAll('.profile-content .tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.profile-content .tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    if (tab === 'badges') {
        renderAchievements();
    }
}

// ================================================================
// ПРОФИЛЬ — ОБНОВЛЕНИЕ ИМЕНИ
// ================================================================
function updateProfileName(name) {
    document.getElementById('profileName').textContent = name || 'Игрок';
}

// ================================================================
// ПРОФИЛЬ — ЭКСПОРТ PDF
// ================================================================
function exportProfilePDF() {
    const name = document.getElementById('profileName').textContent;
    const email = document.getElementById('settingsEmail').value;
    const lang = document.getElementById('languageSelect').value;
    const langName = lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : lang === 'de' ? 'Deutsch' : 'Español';
    const content = `
═══════════════════════════════════════
        CROWN CASINO
    ПРОФИЛЬ ИГРОКА
═══════════════════════════════════════
📌 Имя: ${name}
📧 Email: ${email}
🌐 Язык: ${langName}
⭐ Уровень: Silver VIP
 Баллов: 1 240
🎮 Сыграно игр: 12
═══════════════════════════════════════
📊 СТАТИСТИКА
═══════════════════════════════════════
Выигрыши: 3
Проигрыши: 2
Общий баланс: 5 150 ₽
═══════════════════════════════════════
 ДОСТИЖЕНИЯ
═══════════════════════════════════════
✅ Новичок — Получено
✅ Игрок — Получено
✅ Победитель — Получено
⏳ VIP — 45%
⏳ Эксперт — 20%
⏳ Легенда — 5%
═══════════════════════════════════════
📅 Дата экспорта: ${new Date().toLocaleString('ru-RU')}
═══════════════════════════════════════
Crown Games — Королевская игра
    `;
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `profile_${name}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast('📄 Профиль экспортирован! (TXT-файл)');
}

// ================================================================
// ПРОФИЛЬ — НАСТРОЙКИ (ЯЗЫК)
// ================================================================
let currentLanguage = localStorage.getItem('siteLanguage') || 'ru';
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('siteLanguage', lang);
    const translations = {
        ru: {
            title: 'Crown — Премиальный магазин игр',
            home: 'Главная',
            games: 'Игры',
            promo: 'Акции',
            vip: 'VIP',
            leaderboard: 'Турниры',
            blog: 'Блог',
            affiliate: 'Партнёры',
            profile: 'Профиль',
            about: 'О нас',
            contacts: 'Контакты',
            searchPlaceholder: 'Поиск игр...',
            login: 'Войти',
            register: 'Регистрация',
            cart: 'Корзина',
            emptyCart: 'Корзина пуста',
            checkout: 'Оформить заказ',
            continue: 'Продолжить',
            total: 'Итого:',
            welcome: 'Добро пожаловать!',
            playNow: 'Играть сейчас',
            promotions: 'Акции',
            topGames: 'Топ игр',
            popularGames: 'Популярные игры',
            latestWins: 'Последние выигрыши',
            viewAll: 'Смотреть все',
            catalog: 'Каталог игр',
            all: 'Все',
            slots: 'Слоты',
            table: 'Настольные',
            live: 'Live',
            jackpot: 'Джекпоты',
            new: 'Новые',
            welcomePackage: 'Приветственный пакет',
            cashback: 'Кэшбэк',
            exclusiveVIP: 'Эксклюзив для VIP',
            blogNews: 'Блог и новости',
            strategies: 'Стратегии',
            news: 'Новинки',
            interview: 'Интервью',
            readMore: 'Читать далее',
            affiliateProgram: 'Партнёрская программа',
            earnWithCrown: 'Зарабатывайте с Crown',
            inviteFriends: 'Приглашайте друзей и получайте до 30% от их выигрышей навсегда!',
            shareLink: 'Поделиться ссылкой',
            instantPayouts: 'Мгновенные выплаты',
            statistics: 'Статистика',
            vipStatus: 'VIP-статус',
            history: 'История',
            favorites: 'Избранное',
            achievements: 'Достижения',
            settings: 'Настройки',
            name: 'Имя',
            email: 'Email',
            language: 'Язык',
            saveSettings: 'Сохранить настройки',
            contactUs: 'Свяжитесь с нами',
            send: 'Отправить',
            yourName: 'Ваше имя',
            yourMessage: 'Ваше сообщение',
            aboutUs: 'О нас',
            royalStatus: 'Королевский статус',
            security: 'Безопасность',
            speed: 'Скорость',
            choice: 'Выбор',
            modernProtection: 'Современная защита данных',
            instantWithdrawals: 'Мгновенные выплаты',
            topProviders: '1500+ игр от топ-провайдеров',
            profileName: 'Игрок',
            liveCasino: 'Стримы',
            playerStats: 'Статистика игрока',
            totalGames: 'Всего игр',
            totalWins: 'Выигрыши',
            totalLosses: 'Проигрыши',
            winRate: 'Процент побед',
            demoMode: 'Демо-режим'
        },
        en: {
            title: 'Crown — Premium Game Store',
            home: 'Home',
            games: 'Games',
            promo: 'Promotions',
            vip: 'VIP',
            leaderboard: 'Leaderboard',
            blog: 'Blog',
            affiliate: 'Affiliate',
            profile: 'Profile',
            about: 'About',
            contacts: 'Contacts',
            searchPlaceholder: 'Search games...',
            login: 'Login',
            register: 'Register',
            cart: 'Cart',
            emptyCart: 'Cart is empty',
            checkout: 'Checkout',
            continue: 'Continue',
            total: 'Total:',
            welcome: 'Welcome!',
            playNow: 'Play Now',
            promotions: 'Promotions',
            topGames: 'Top Games',
            popularGames: 'Popular Games',
            latestWins: 'Latest Wins',
            viewAll: 'View All',
            catalog: 'Game Catalog',
            all: 'All',
            slots: 'Slots',
            table: 'Table Games',
            live: 'Live',
            jackpot: 'Jackpots',
            new: 'New',
            welcomePackage: 'Welcome Package',
            cashback: 'Cashback',
            exclusiveVIP: 'Exclusive for VIP',
            blogNews: 'Blog & News',
            strategies: 'Strategies',
            news: 'News',
            interview: 'Interview',
            readMore: 'Read More',
            affiliateProgram: 'Affiliate Program',
            earnWithCrown: 'Earn with Crown',
            inviteFriends: 'Invite friends and get up to 30% of their winnings forever!',
            shareLink: 'Share Link',
            instantPayouts: 'Instant Payouts',
            statistics: 'Statistics',
            vipStatus: 'VIP Status',
            history: 'History',
            favorites: 'Favorites',
            achievements: 'Achievements',
            settings: 'Settings',
            name: 'Name',
            email: 'Email',
            language: 'Language',
            saveSettings: 'Save Settings',
            contactUs: 'Contact Us',
            send: 'Send',
            yourName: 'Your Name',
            yourMessage: 'Your Message',
            aboutUs: 'About Us',
            royalStatus: 'Royal Status',
            security: 'Security',
            speed: 'Speed',
            choice: 'Choice',
            modernProtection: 'Modern data protection',
            instantWithdrawals: 'Instant withdrawals',
            topProviders: '1500+ games from top providers',
            profileName: 'Player',
            liveCasino: 'Live Streams',
            playerStats: 'Player Statistics',
            totalGames: 'Total Games',
            totalWins: 'Wins',
            totalLosses: 'Losses',
            winRate: 'Win Rate',
            demoMode: 'Demo Mode'
        }
    };
    const t = translations[lang] || translations.ru;
    document.title = t.title;
    const navMap = {
        'Главная': t.home, 'Игры': t.games, 'Акции': t.promo, 'VIP': t.vip,
        'Турниры': t.leaderboard, 'Блог': t.blog, 'Партнёры': t.affiliate,
        'Профиль': t.profile, 'О нас': t.about, 'Контакты': t.contacts,
        'Home': t.home, 'Games': t.games, 'Promotions': t.promo,
        'Leaderboard': t.leaderboard, 'Blog': t.blog, 'Affiliate': t.affiliate,
        'Profile': t.profile, 'About': t.about, 'Contacts': t.contacts
    };
    document.querySelectorAll('.nav a').forEach(el => {
        const text = el.textContent.trim();
        if (navMap[text] !== undefined) el.textContent = navMap[text];
    });
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    document.querySelectorAll('.header-actions .btn-gold').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Войти' || text === 'Login') el.textContent = t.login;
        if (text === 'Регистрация' || text === 'Register') el.textContent = t.register;
    });
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) cartBtn.setAttribute('aria-label', t.cart);
    document.querySelectorAll('.breadcrumbs a, .breadcrumbs .current').forEach(el => {
        const text = el.textContent.trim();
        if (navMap[text] !== undefined) el.textContent = navMap[text];
    });
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    const headerTitles = [t.topGames, t.popularGames, t.latestWins];
    sectionHeaders.forEach((el, index) => {
        if (index < headerTitles.length) {
            const goldSpan = el.querySelector('.gold');
            if (goldSpan) {
                const parts = headerTitles[index].split(' ');
                const lastWord = parts[parts.length - 1];
                goldSpan.textContent = lastWord;
                const textWithoutGold = headerTitles[index].replace(/\s*<span.*/, '');
                el.childNodes[0].textContent = textWithoutGold + ' ';
            }
        }
    });
    document.querySelectorAll('.section-header .see-all').forEach(el => {
        const text = el.textContent.trim();
        if (text.includes('Смотреть') || text.includes('View')) {
            el.innerHTML = `${t.viewAll} →`;
        }
    });
    document.querySelectorAll('.hero-buttons .btn-gold').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Играть сейчас' || text === 'Play Now') el.textContent = t.playNow;
    });
    document.querySelectorAll('.hero-buttons .btn-secondary').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Акции' || text === 'Promotions') el.textContent = t.promotions;
    });
    const filterButtons = document.querySelectorAll('.catalog-filters button');
    const filterTexts = [t.all, t.shooter || 'Шутеры', t.strategy || 'Стратегии', t.rpg || 'RPG', t.survival || 'Выживание', t.sandbox || 'Песочницы', t.sport || 'Спорт', t.indie || 'Инди', t.horror || 'Хоррор'];
    filterButtons.forEach((el, index) => {
        if (index < filterTexts.length) el.textContent = filterTexts[index];
    });
    showToast(`🌐 Язык изменён на ${lang === 'ru' ? 'Русский' : 'English'}`);
}

// ================================================================
// ПРОФИЛЬ — СОХРАНЕНИЕ НАСТРОЕК
// ================================================================
function saveSettings() {
    const name = document.getElementById('settingsName').value;
    const email = document.getElementById('settingsEmail').value;
    const lang = document.getElementById('languageSelect').value;
    updateProfileName(name);
    changeLanguage(lang);
    localStorage.setItem('profileName', name);
    localStorage.setItem('profileEmail', email);
    showToast('✅ Настройки сохранены!');
}
document.addEventListener('DOMContentLoaded', function() {
    const savedName = localStorage.getItem('profileName');
    const savedEmail = localStorage.getItem('profileEmail');
    const savedLang = localStorage.getItem('siteLanguage');
    if (savedName) {
        document.getElementById('settingsName').value = savedName;
        updateProfileName(savedName);
    }
    if (savedEmail) {
        document.getElementById('settingsEmail').value = savedEmail;
    }
    if (savedLang) {
        document.getElementById('languageSelect').value = savedLang;
        changeLanguage(savedLang);
    }
});

// ================================================================
// ИГРЫ
// ================================================================
function playGame(gameName) {
    showToast(`🎮 Запуск игры "${gameName}"...`);
    sendPushNotification(`Вы запустили игру ${gameName}! Удачи! 🍀`);
    createConfetti();
    addNotification('🎮', 'Игра запущена!', `Вы играете в "${gameName}"`, 'info');
}

// ================================================================
// РЕГИСТРАЦИЯ
// ================================================================
function registerUser(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const regNumber = 'REG-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const subject = `Новая регистрация на Crown Games #${regNumber}`;
    const body = `
═══════════════════════════════════════
НОВАЯ РЕГИСТРАЦИЯ
═══════════════════════════════════════
 Номер регистрации: ${regNumber}
👤 Имя: ${name}
📧 Email: ${email}
🔑 Пароль: ${password}
📅 Дата: ${new Date().toLocaleString('ru-RU')}
═══════════════════════════════════════
    `;
    showToast(`✅ Регистрация успешна! Номер: ${regNumber}`);
    createConfetti();
    addNotification('🎉', 'Добро пожаловать!', `Игрок ${name} успешно зарегистрирован!`, 'bonus');
    console.log(`📧 [EMAIL] To: italyfotura7@gmail.com`);
    console.log(`📧 [EMAIL] Subject: ${subject}`);
    console.log(`📧 [EMAIL] Body: ${body}`);
    sendPushNotification(`Добро пожаловать, ${name}! 🎉 Ваш регистрационный номер: ${regNumber}`);
    closeModal('registerModal');
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
}

/* ================================================================
   СИСТЕМА АВТОРИЗАЦИИ С КОДОМ ПОДТВЕРЖДЕНИЯ НА EMAIL
   ================================================================ */
// Хранение кодов и пользователей (в localStorage для простоты)
let pendingCode = null;
let pendingEmail = null;

// Генерация 6-значного кода и "отправка" на email
function generateAndSendCode(email, mode) {
    pendingCode = String(Math.floor(100000 + Math.random() * 900000));
    pendingEmail = email;
    console.log(`📧 [EMAIL SENT] To: ${email} — Ваш код подтверждения: ${pendingCode}`);
    console.log(`[DEBUG] Код подтверждения для ${mode}: ${pendingCode}`);
    // Показываем код в уведомлении и toast, чтобы пользователь мог его прочитать
    addNotification('📧', 'Код подтверждения отправлен',
        `На ${email} отправлен 6-значный код.\n\nВаш код: ${pendingCode}`, 'info');
    // Показываем код прямо в модальном окне рядом с полем ввода
    const counterEl = mode === 'входа' ? document.getElementById('loginCodeCounter') : document.getElementById('regCodeCounter');
    if (counterEl) {
        counterEl.innerHTML = `<span style="color:var(--gold);font-size:13px;">Код из письма: <strong>${pendingCode}</strong></span>`;
    }
    showToast(`📧 Код отправлен на ${email}`);
    return pendingCode;
}

// --- РЕГИСТРАЦИЯ ---
function registerStep1(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    if (password.length < 6) {
        showToast('❌ Пароль должен быть не короче 6 символов');
        return;
    }
    // Сохраняем данные пользователя для шага 2
    window._pendingUser = { name, email, password };
    generateAndSendCode(email, 'регистрации');
    // Показываем шаг 2
    document.getElementById('regFormStep1').style.display = 'none';
    document.getElementById('regFormStep2').style.display = 'block';
    document.getElementById('regCodeInput').focus();
}
function registerStep2(e) {
    e.preventDefault();
    const code = document.getElementById('regCodeInput').value.trim();
    if (code === pendingCode) {
        const u = window._pendingUser;
        // Сохраняем пользователя
        const users = JSON.parse(localStorage.getItem('crownUsers') || '[]');
        users.push(u);
        localStorage.setItem('crownUsers', JSON.stringify(users));
        localStorage.setItem('crownCurrentUser', JSON.stringify(u));
        // Бонус
        localStorage.setItem('crownBalance', '1000');
        showToast(`✅ Регистрация успешна! Бонус 1000 ₽ начислен`);
        createConfetti();
        addNotification('🎉', 'Добро пожаловать!', `Игрок ${u.name} успешно зарегистрирован!`);
        pendingCode = null;
        closeModal('registerModal');
        resetAuthModals();
    } else {
        showToast('❌ Неверный код. Проверьте письмо');
    }
}
function registerResendCode() {
    if (window._pendingUser) {
        generateAndSendCode(window._pendingUser.email, 'регистрации');
    }
}

// --- ВХОД ---
function loginStep1(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('crownUsers') || '[]');
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
        // Верный пароль — отправляем код
        generateAndSendCode(email, 'входа');
        document.getElementById('loginFormStep1').style.display = 'none';
        document.getElementById('loginFormStep2').style.display = 'block';
        document.getElementById('loginCodeInput').focus();
    } else {
        showToast('❌ Неверный email или пароль');
    }
}
function loginStep2(e) {
    e.preventDefault();
    const code = document.getElementById('loginCodeInput').value.trim();
    const email = document.getElementById('loginEmail').value;
    if (code === pendingCode) {
        const users = JSON.parse(localStorage.getItem('crownUsers') || '[]');
        const user = users.find(u => u.email === email);
        if (user) {
            localStorage.setItem('crownCurrentUser', JSON.stringify(user));
            showToast(`✅ Добро пожаловать, ${user.name}!`);
            addNotification('👑', 'Вход выполнен', `Рады видеть вас, ${user.name}!`);
            createConfetti();
            pendingCode = null;
            closeModal('loginModal');
            resetAuthModals();
        }
    } else {
        showToast('❌ Неверный код подтверждения');
    }
}
function loginResendCode() {
    const email = document.getElementById('loginEmail').value;
    if (email) generateAndSendCode(email, 'входа');
}

// Сброс модальных окон
function resetAuthModals() {
    document.getElementById('loginFormStep1').style.display = '';
    document.getElementById('loginFormStep2').style.display = 'none';
    document.getElementById('regFormStep1').style.display = '';
    document.getElementById('regFormStep2').style.display = 'none';
    ['regCodeInput','loginCodeInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['regCodeCounter','loginCodeCounter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0/6';
    });
    ['regEmail','regPassword','regName','loginEmail','loginPassword'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}
window.registerStep1 = registerStep1;
window.registerStep2 = registerStep2;
window.registerResendCode = registerResendCode;
window.loginStep1 = loginStep1;
window.loginStep2 = loginStep2;
window.loginResendCode = loginResendCode;
window.resetAuthModals = resetAuthModals;

// ================================================================
// PUSH-УВЕДОМЛЕНИЯ
// ================================================================
let notificationPermission = false;
let notifShown = false;
function showNotifPermission() {
    if (!notifShown && !localStorage.getItem('notifPermission')) {
        setTimeout(() => {
            document.getElementById('notifPermission').classList.add('show');
            notifShown = true;
        }, 4000);
    }
}
function enableNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(perm => {
            notificationPermission = perm === 'granted';
            localStorage.setItem('notifPermission', perm);
            document.getElementById('notifPermission').classList.remove('show');
            if (notificationPermission) {
                showToast('🔔 Уведомления включены!');
                sendPushNotification('Вы будете получать уведомления о выигрышах и бонусах!');
                addNotification('🔔', 'Уведомления включены!', 'Теперь вы будете получать push-уведомления', 'bonus');
            }
        });
    }
}
function denyNotifications() {
    localStorage.setItem('notifPermission', 'denied');
    document.getElementById('notifPermission').classList.remove('show');
    showToast('Уведомления отключены.');
}
function sendPushNotification(text) {
    if (notificationPermission && 'Notification' in window) {
        try { new Notification('Crown Games', { body: text }); } catch(e) {}
    }
}
if ('Notification' in window && Notification.permission === 'granted') {
    notificationPermission = true;
} else if ('Notification' in window && Notification.permission === 'default') {
    showNotifPermission();
}

// ================================================================
// КОПИРОВАНИЕ РЕФЕРАЛЬНОЙ ССЫЛКИ
// ================================================================
function copyRefLink() {
    const input = document.getElementById('refLink');
    input.select();
    document.execCommand('copy');
    showToast('📋 Ссылка скопирована!');
    addNotification('📋', 'Ссылка скопирована!', 'Реферальная ссылка скопирована в буфер обмена', 'info');
}

// ================================================================
// МОДАЛЬНЫЕ ОКНА
// ================================================================
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function closeModalOutside(e, id) { if (e.target === e.currentTarget) closeModal(id); }

// ================================================================
// TOAST
// ================================================================
let toastTimeout;
function showToast(text, title = 'Уведомление') {
    const toast = document.getElementById('toast');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastText').textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ================================================================
// SCROLL TOP
// ================================================================
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 600);
});
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ================================================================
// АНИМАЦИИ ПОЯВЛЕНИЯ
// ================================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-children, .scroll-zoom').forEach(el => observer.observe(el));
setTimeout(() => {
    document.querySelectorAll('.stagger-children').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.fade-in-left').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.fade-in-right').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.scroll-zoom').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.vip-progress .fill').forEach(el => {
        const target = parseInt(el.dataset.target);
        setTimeout(() => { el.style.width = target + '%'; }, 500);
    });
}, 300);

// ================================================================
// 37 АЧИВОК В СТИЛЕ STEAM
// ================================================================
const achievements = [
    { id: 1, icon: '', name: 'Первые шаги', desc: 'Сыграйте первую игру', quest: 'Сыграйте в любую игру', rare: false },
    { id: 2, icon: '🎯', name: 'Меткий стрелок', desc: 'Выиграйте 3 раза подряд', quest: 'Пройдите 3 уровня подряд', rare: false },
    { id: 3, icon: '📚', name: 'Любознательный', desc: 'Сыграйте в 5 разных игр', quest: 'Запустите 5 различных игр', rare: false },
    { id: 4, icon: '💰', name: 'Первый доход', desc: 'Выиграйте 1000 ₽', quest: 'Накопите выигрышей на 1000 ₽', rare: false },
    { id: 5, icon: '🎮', name: 'Заядлый игрок', desc: 'Сыграйте 10 игр', quest: 'Проведите 10 игровых сессий', rare: false },
    { id: 6, icon: '⭐', name: 'Звездный новичок', desc: 'Получите рейтинг 4.5 ★', quest: 'Достигните среднего рейтинга 4.5★', rare: false },
    { id: 7, icon: '🗺️', name: 'Исследователь', desc: 'Сыграйте во все типы игр', quest: 'Сыграйте в игры разных жанров', rare: false },
    { id: 8, icon: '🏛️', name: 'Древние сокровища', desc: 'Выиграйте в Book of Dead', quest: 'Получите выигрыш в Book of Dead', rare: false },
    { id: 9, icon: '🌋', name: 'Огненный испытатель', desc: 'Выиграйте в Castle of Fire', quest: 'Получите выигрыш в Castle of Fire', rare: false },
    { id: 10, icon: '', name: 'Повелитель драконов', desc: 'Выиграйте в Dragon\'s Luck', quest: 'Получите выигрыш в Dragon\'s Luck', rare: false },
    { id: 11, icon: '🍀', name: 'Ирландская удача', desc: 'Выиграйте в Luck o\' Irish', quest: 'Получите выигрыш в Luck o\' Irish', rare: false },
    { id: 12, icon: '🌊', name: 'Покоритель океана', desc: 'Выиграйте в Ocean Treasure', quest: 'Получите выигрыш в Ocean Treasure', rare: false },
    { id: 13, icon: '🏆', name: 'Победитель', desc: 'Выиграйте 5 000 ₽', quest: 'Накопите выигрышей на 5000 ₽', rare: false },
    { id: 14, icon: '', name: 'Бриллиантовая рука', desc: 'Выиграйте 10 000 ₽', quest: 'Накопите выигрышей на 10000 ₽', rare: false },
    { id: 15, icon: '👑', name: 'Королевская победа', desc: 'Выиграйте 50 000 ₽', quest: 'Накопите выигрышей на 50000 ₽', rare: true },
    { id: 16, icon: '🎮', name: 'Король геймера', desc: 'Сыграйте в 100 игр', quest: 'Проведите 100 игровых сессий', rare: false },
    { id: 17, icon: '♠️', name: 'Карточный маг', desc: 'Выиграйте в настольной игре', quest: 'Получите выигрыш в настольной игре', rare: false },
    { id: 18, icon: '', name: 'Кубик удачи', desc: 'Сыграйте в 10 настольных игр', quest: 'Проведите 10 игр в настольных играх', rare: false },
    { id: 19, icon: '⚡', name: 'Мастер удачи', desc: 'Выиграйте 100 000 ₽', quest: 'Накопите выигрышей на 100000 ₽', rare: true },
    { id: 20, icon: '🔥', name: 'Огненная серия', desc: 'Выиграйте 10 раз подряд', quest: 'Сделайте 10 выигрышных ставок подряд', rare: true },
    { id: 21, icon: '🌟', name: 'Легенда игр', desc: 'Сыграйте 100 игр', quest: 'Проведите 100 игровых сессий', rare: true },
    { id: 22, icon: '💫', name: 'Золотая лихорадка', desc: 'Соберите редкую коллекцию', quest: 'Соберите 50 уникальных игр', rare: true },
    { id: 23, icon: '🦁', name: 'Королевский лев', desc: 'Достигните VIP-уровня Gold', quest: 'Накопите 5000 баллов VIP', rare: false },
    { id: 24, icon: '', name: 'Волк-одиночка', desc: 'Выиграйте в Wolf Gold', quest: 'Получите выигрыш в Wolf Gold', rare: false },
    { id: 25, icon: '👑', name: 'Король игр', desc: 'Выиграйте 500 000 ₽', quest: 'Накопите выигрышей на 500000 ₽', rare: true },
    { id: 26, icon: '💎', name: 'Бриллиантовый VIP', desc: 'Достигните VIP-уровня Platinum', quest: 'Накопите 15000 баллов VIP', rare: true },
    { id: 27, icon: '🏅', name: 'Олимпийский игрок', desc: 'Сыграйте 500 игр', quest: 'Проведите 500 игровых сессий', rare: true },
    { id: 28, icon: '🎯', name: 'Абсолютный чемпион', desc: 'Выиграйте 1 000 000 ₽', quest: 'Накопите выигрышей на 1000000 ₽', rare: true },
    { id: 29, icon: '🌟', name: 'Звездный игрок', desc: 'Получите рейтинг 5.0★', quest: 'Достигните максимального рейтинга 5.0★', rare: true },
    { id: 30, icon: '🏰', name: 'Властелин замка', desc: 'Выиграйте в Castle of Fire 10 раз', quest: '10 побед в Castle of Fire', rare: false },
    { id: 31, icon: '🎉', name: 'Юбилей', desc: 'Сыграйте 50 игр', quest: 'Проведите 50 игровых сессий', rare: false },
    { id: 32, icon: '🎲', name: 'Любитель приключений', desc: 'Сыграйте в 500 сессий', quest: 'Проведите 500 игровых сессий', rare: false },
    { id: 33, icon: '', name: 'Радуга удачи', desc: 'Выиграйте в Rainbow Riches', quest: 'Получите выигрыш в Rainbow Riches', rare: false },
    { id: 34, icon: '🦄', name: 'Магия единорога', desc: 'Выиграйте в Unicorn Magic', quest: 'Получите выигрыш в Unicorn Magic', rare: false },
    { id: 35, icon: '', name: 'Лунный свет', desc: 'Выиграйте в Moonlight', quest: 'Получите выигрыш в Moonlight', rare: false },
    { id: 36, icon: '⚔️', name: 'Огонь и сталь', desc: 'Выиграйте в Fire & Steel', quest: 'Получите выигрыш в Fire & Steel', rare: false },
    { id: 37, icon: '🏆', name: 'Абсолютная легенда', desc: 'Получите все достижения', quest: 'Соберите все 36 достижений', rare: true }
];
function renderAchievements() {
    const container = document.getElementById('badgesGrid');
    if (!container) return;
    const unlockedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    container.innerHTML = achievements.map(ach => {
        const unlocked = unlockedIds.includes(ach.id);
        const progress = unlocked ? 100 : Math.floor(Math.random() * 30 + 10);
        return `
            <div class="badge-item ${unlocked ? 'unlocked' : 'locked'} ${ach.rare ? 'rare' : ''}">
                <span class="badge-icon">${ach.icon}</span>
                <div class="badge-progress">
                    <div class="fill" style="width:${progress}%;"></div>
                </div>
                <div class="badge-name">${ach.name}</div>
                <div class="badge-desc">${ach.desc}</div>
                <div class="badge-quest">📋 ${ach.quest}</div>
                <span class="badge-status ${unlocked ? 'unlocked' : 'locked'}">
                    ${unlocked ? '✅ Получено' : `🔒 ${progress}%`}
                </span>
            </div>
        `;
    }).join('');
}

// ================================================================
// КОНТАКТЫ
// ================================================================
function submitContact(e) {
    e.preventDefault();
    showToast('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    addNotification('📧', 'Сообщение отправлено!', 'Мы свяжемся с вами в ближайшее время', 'info');
    e.target.reset();
}

// ================================================================
// ТАЙМЕРЫ АКЦИЙ
// ================================================================
setInterval(() => {
    document.querySelectorAll('.promo-image .timer').forEach(el => {
        let t = el.textContent.replace('⏱️ ', '').split(':');
        let h = parseInt(t[0]), m = parseInt(t[1]), s = parseInt(t[2]);
        s--;
        if (s < 0) { s = 59; m--; if (m < 0) { m = 59; h--; if (h < 0) { h = 0; m = 0; s = 0; } } }
        el.textContent = `⏱️ ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    });
}, 1000);

// ================================================================
// PWA — SERVICE WORKER
// ================================================================
let pwaShown = false;
function showPWA() {
    if (!pwaShown && localStorage.getItem('pwaDismissed') !== 'true') {
        setTimeout(() => {
            document.getElementById('pwaBanner').classList.add('show');
            pwaShown = true;
        }, 10000);
    }
}
function dismissPWA() {
    document.getElementById('pwaBanner').classList.remove('show');
    localStorage.setItem('pwaDismissed', 'true');
}
function installPWA() {
    showToast('📱 Установка приложения...');
    addNotification('📱', 'Установка PWA', 'Приложение Crown Games устанавливается...', 'info');
    dismissPWA();
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('✅ Service Worker зарегистрирован'))
        .catch(() => console.log('⚠️ Service Worker не зарегистрирован'));
}
setTimeout(showPWA, 8000);

// ================================================================
// ================================================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ
// ================================================================
window.navigateTo = navigateTo;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeModalOutside = closeModalOutside;
window.playGame = playGame;
window.showToast = showToast;
window.submitContact = submitContact;
window.goToSlide = goToSlide;
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.toggleTheme = toggleTheme;
window.toggleThemeCustomizer = toggleThemeCustomizer;
window.setTheme = setTheme;
window.toggleFav = toggleFav;
window.filterGames = filterGames;
window.switchProfileTab = switchProfileTab;
window.registerUser = registerUser;
window.enableNotifications = enableNotifications;
window.denyNotifications = denyNotifications;
window.exportProfilePDF = exportProfilePDF;
window.copyRefLink = copyRefLink;
window.voiceSearch = voiceSearch;
window.searchGames = searchGames;
window.clearSearch = clearSearch;
window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.changeLanguage = changeLanguage;
window.saveSettings = saveSettings;
window.updateProfileName = updateProfileName;
window.createConfetti = createConfetti;
window.showSkeletonLoader = showSkeletonLoader;
window.hideSkeletonLoader = hideSkeletonLoader;
window.addNotification = addNotification;
window.removeNotification = removeNotification;
window.startDemoMode = startDemoMode;
window.spinDemo = spinDemo;
window.dismissPWA = dismissPWA;
window.installPWA = installPWA;
window.renderAchievements = renderAchievements;
const GAMES = [{"name":"7 Days to Die","img":"7_days_to_die.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"A Short Hike","img":"a_short_hike.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Abzu","img":"abzu.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Act Of Aggression","img":"act_of_aggression.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Against The Storm","img":"against_the_storm.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age of Empires II: DE","img":"age_of_empires_2_de.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age of Empires III: DE","img":"age_of_empires_3_de.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age Of Empires 4","img":"age_of_empires_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age Of Wonders 3","img":"age_of_wonders_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age Of Wonders 4","img":"age_of_wonders_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Alan Wake","img":"alan_wake.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Alien Isolation","img":"alien_isolation.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"American Truck Simulator","img":"american_truck_simulator.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amid Evil","img":"amid_evil.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amnesia","img":"amnesia.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amnesia Rebirth","img":"amnesia_rebirth.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amnesia The Bunker","img":"amnesia_the_bunker.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Anno 1800","img":"anno_1800.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Apex Legends","img":"apex_legends.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ark Survival Ascended","img":"ark_survival_ascended.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Assassins Creed Valhalla","img":"assassins_creed_valhalla.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Assetto Corsa","img":"assetto_corsa.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Assetto Corsa Competizione","img":"assetto_corsa_competizione.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Atomic Heart","img":"atomic_heart.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Avowed","img":"avowed.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Baldurs Gate 1","img":"baldurs_gate_1.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Baldurs Gate 2","img":"baldurs_gate_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Baldur's Gate 3","img":"baldurs_gate_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Banished","img":"banished.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 1","img":"battlefield_1.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 2042","img":"battlefield_2042.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 4","img":"battlefield_4.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 5","img":"battlefield_5.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bayonetta","img":"bayonetta.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Beamng Drive","img":"beamng_drive.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bendy And Ink Machine","img":"bendy_and_ink_machine.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Besiege","img":"besiege.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bioshock 1","img":"bioshock_1.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bioshock 2","img":"bioshock_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bioshock Infinite","img":"bioshock_infinite.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Black Desert","img":"black_desert.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Black Desert Online","img":"black_desert_online.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blair Witch","img":"blair_witch.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blasphemous","img":"blasphemous.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blasphemous 2","img":"blasphemous_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blazblue Centralfiction","img":"blazblue_centralfiction.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bloodstained Ritual","img":"bloodstained_ritual.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Borderlands 3","img":"borderlands_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Braid","img":"braid.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bright Memory","img":"bright_memory.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bug Snax","img":"bug_snax.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bulletstorm","img":"bulletstorm.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Burnout Paradise","img":"burnout_paradise.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bus Simulator 18","img":"bus_simulator_18.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bus Simulator 21","img":"bus_simulator_21.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"C And C Red Alert 3","img":"c_and_c_red_alert_3.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Call Of Duty Warzone","img":"call_of_duty_warzone.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Call To Arms","img":"call_to_arms.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Call To Arms Gates Of Hell","img":"call_to_arms_gates_of_hell.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Callisto Protocol","img":"callisto_protocol.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Case Of Golden Idol","img":"case_of_golden_idol.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cave Story","img":"cave_story.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Celeste","img":"celeste.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Chronicon","img":"chronicon.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cities Skylines","img":"cities_skylines.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cities Skylines 2","img":"cities_skylines_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Civilization 6","img":"civilization_6.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Code Vein","img":"code_vein.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Command And Conquer","img":"command_and_conquer.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Company Of Heroes","img":"company_of_heroes.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Company Of Heroes 2","img":"company_of_heroes_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Company Of Heroes 3","img":"company_of_heroes_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Conan Exiles","img":"conan_exiles.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Construction Simulator","img":"construction_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Control","img":"control.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Core Keeper","img":"core_keeper.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter Strike 1 6","img":"counter_strike_1_6.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter-Strike 2","img":"counter_strike_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter Strike Condition Zero","img":"counter_strike_condition_zero.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter Strike Source","img":"counter_strike_source.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cozy Grove","img":"cozy_grove.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Crusader Kings 3","img":"crusader_kings_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Crysis 2","img":"crysis_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Crysis Remastered","img":"crysis_remastered.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cult Of The Lamb","img":"cult_of_the_lamb.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cuphead","img":"cuphead.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cyberpunk 2077","img":"cyberpunk_2077.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dark Souls 3","img":"dark_souls_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Darktide","img":"darktide.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dave The Diver","img":"dave_the_diver.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Day Of Defeat","img":"day_of_defeat.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Day Of Defeat Source","img":"day_of_defeat_source.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dayz","img":"dayz.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dcs World","img":"dcs_world.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ddo","img":"ddo.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead By Daylight","img":"dead_by_daylight.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead Cells","img":"dead_cells.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead Space 3","img":"dead_space_3.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead Space Remake","img":"dead_space_remake.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dear Esther","img":"dear_esther.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deathloop","img":"deathloop.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deaths Gambit","img":"deaths_gambit.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deep Rock Galactic","img":"deep_rock_galactic.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Delta Force","img":"delta_force.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Demon Slayer Hinokami","img":"demon_slayer_hinokami.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Descenders","img":"descenders.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deserts Of Kharak","img":"deserts_of_kharak.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Desperados 3","img":"desperados_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Destiny 2","img":"destiny_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Detroit Become Human","img":"detroit_become_human.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deus Ex","img":"deus_ex.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deus Ex Mankind Divided","img":"deus_ex_mankind_divided.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Devil May Cry 4","img":"devil_may_cry_4.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Devil May Cry 5","img":"devil_may_cry_5.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Devour","img":"devour.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Diablo 4","img":"diablo_4.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Disco Elysium","img":"disco_elysium.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dishonored","img":"dishonored.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dishonored 2","img":"dishonored_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Divinity Original Sin 2","img":"divinity_original_sin_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Doom 2016","img":"doom_2016.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Doom 64","img":"doom_64.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Doom Eternal","img":"doom_eternal.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dota 2","img":"dota_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age 2","img":"dragon_age_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age Inquisition","img":"dragon_age_inquisition.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age Origins","img":"dragon_age_origins.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age Veilguard","img":"dragon_age_veilguard.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Ball Fighterz","img":"dragon_ball_fighterz.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Ball Sparking Zero","img":"dragon_ball_sparking_zero.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Ball Xenoverse 2","img":"dragon_ball_xenoverse_2.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Quest 11","img":"dragon_quest_11.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Quest Builders 2","img":"dragon_quest_builders_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dredge","img":"dredge.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Drift21","img":"drift21.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dst","img":"dst.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dusk","img":"dusk.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dyson Sphere Program","img":"dyson_sphere_program.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Eco Global","img":"eco_global.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Elden Ring","img":"elden_ring.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Elder Scrolls Online","img":"elder_scrolls_online.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Empire Of Sin","img":"empire_of_sin.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ender Lillies","img":"ender_lillies.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Enlisted","img":"enlisted.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Enter The Gungeon","img":"enter_the_gungeon.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Escape From Tarkov","img":"escape_from_tarkov.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Eso Necrom","img":"eso_necrom.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Eso Summerset","img":"eso_summerset.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Euro Truck Simulator 2","img":"euro_truck_simulator_2.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Europa Universalis 4","img":"europa_universalis_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Evil West","img":"evil_west.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Evil Within","img":"evil_within.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Evil Within 2","img":"evil_within_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"F1 2024","img":"f1_2024.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Factorio","img":"factorio.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout 3","img":"fallout_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout 4","img":"fallout_4.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout 76","img":"fallout_76.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout: New Vegas","img":"fallout_new_vegas.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Far Cry 5","img":"far_cry_5.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Far Cry 6","img":"far_cry_6.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Farm Simulator 19","img":"farm_simulator_19.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Farm Simulator 22","img":"farm_simulator_22.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Farthest Frontier","img":"farthest_frontier.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fc 24","img":"fc_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fez","img":"fez.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 21","img":"fifa_21.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 22","img":"fifa_22.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 23","img":"fifa_23.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 24","img":"fifa_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Final Fantasy 14","img":"final_fantasy_14.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Final Fantasy 14 Endwalker","img":"final_fantasy_14_endwalker.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Firewatch","img":"firewatch.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Forgive Me Father","img":"forgive_me_father.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Forza Horizon 5","img":"forza_horizon_5.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"From The Depths","img":"from_the_depths.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Frostpunk","img":"frostpunk.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gates Of Hell","img":"gates_of_hell.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gears Tactics","img":"gears_tactics.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghost Recon Breakpoint","img":"ghost_recon_breakpoint.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghost Warrior 3","img":"ghost_warrior_3.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghostrunner","img":"ghostrunner.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghostrunner 2","img":"ghostrunner_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Going Medieval","img":"going_medieval.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Golf With Friends","img":"golf_with_friends.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gone Home","img":"gone_home.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Graveyard Keeper","img":"graveyard_keeper.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Green Hell","img":"green_hell.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grid Legends","img":"grid_legends.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grim Dawn","img":"grim_dawn.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grime","img":"grime.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gris","img":"gris.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grounded","img":"grounded.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grand Theft Auto V","img":"gta_5.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guardians Of The Galaxy","img":"guardians_of_the_galaxy.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guild Wars 2","img":"guild_wars_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guild Wars 2 Secrets","img":"guild_wars_2_secrets.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guilty Gear Strive","img":"guilty_gear_strive.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guilty Gear Xrd","img":"guilty_gear_xrd.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gunfire Reborn","img":"gunfire_reborn.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hades","img":"hades.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hades 2","img":"hades_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Half-Life","img":"half_life.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Half-Life 2","img":"half_life_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Half Life Alyx","img":"half_life_alyx.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hard West","img":"hard_west.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Haven","img":"haven.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hearts of Iron IV","img":"hearts_of_iron_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Heavy Rain","img":"heavy_rain.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hedon","img":"hedon.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hell Let Loose","img":"hell_let_loose.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Helldivers 2","img":"helldivers_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hero Siege","img":"hero_siege.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hi Fi Rush","img":"hi_fi_rush.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman 2","img":"hitman_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman 2016","img":"hitman_2016.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman 3","img":"hitman_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman Absolution","img":"hitman_absolution.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hogwarts Legacy","img":"hogwarts_legacy.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hollow Knight","img":"hollow_knight.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hollow Knight 2","img":"hollow_knight_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Homeworld 3","img":"homeworld_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Homeworld Remastered","img":"homeworld_remastered.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"House Flipper 2","img":"house_flipper_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hunt Showdown","img":"hunt_showdown.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hunter Call Of Wild","img":"hunter_call_of_wild.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Icewind Dale","img":"icewind_dale.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Il 2 Sturmovik","img":"il_2_sturmovik.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Inscryption","img":"inscryption.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Inside","img":"inside.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Inside Playdead","img":"inside_playdead.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Insurgency Sandstorm","img":"insurgency_sandstorm.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Jade Empire","img":"jade_empire.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Jump Force","img":"jump_force.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kentucky Route Zero","img":"kentucky_route_zero.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kerbal Space Program","img":"kerbal_space_program.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"King Of Fighters 15","img":"king_of_fighters_15.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kingdom Come Deliverance 2","img":"kingdom_come_deliverance_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kingdoms And Castles","img":"kingdoms_and_castles.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kotor","img":"kotor.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kotor 2","img":"kotor_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lake","img":"lake.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Last Epoch","img":"last_epoch.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lawn Mowing Simulator","img":"lawn_mowing_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Layers Of Fear 2023","img":"layers_of_fear_2023.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Left 4 Dead","img":"left_4_dead.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Left 4 Dead 2","img":"left_4_dead_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Batman 3","img":"lego_batman_3.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego City Undercover","img":"lego_city_undercover.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Harry Potter","img":"lego_harry_potter.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Lord Of The Rings","img":"lego_lord_of_the_rings.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Marvel Avengers","img":"lego_marvel_avengers.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Library Of Ruina","img":"library_of_ruina.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lies Of P","img":"lies_of_p.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange","img":"life_is_strange.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange 2","img":"life_is_strange_2.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange Bts","img":"life_is_strange_bts.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange Tcw","img":"life_is_strange_tcw.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Limbo","img":"limbo.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Limbo Playdead","img":"limbo_playdead.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Limbus Company","img":"limbus_company.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Little Nightmares","img":"little_nightmares.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Little Nightmares 2","img":"little_nightmares_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lobotomy Corporation","img":"lobotomy_corporation.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lost Ark","img":"lost_ark.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lotro","img":"lotro.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Madden Nfl 24","img":"madden_nfl_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Main Assembly","img":"main_assembly.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Manor Lords","img":"manor_lords.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Marvel Guardians","img":"marvel_guardians.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Marvel Rivals","img":"marvel_rivals.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect 2","img":"mass_effect_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect 3","img":"mass_effect_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect Andromeda","img":"mass_effect_andromeda.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect: Legendary","img":"mass_effect_legendary.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Medieval Engineers","img":"medieval_engineers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Melty Blood","img":"melty_blood.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Men Of War 2","img":"men_of_war_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Men Of War Assault Squad 2","img":"men_of_war_assault_squad_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metal Gear Rising","img":"metal_gear_rising.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metaphor Refantazio","img":"metaphor_refantazio.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metro 2033","img":"metro_2033.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metro Exodus","img":"metro_exodus.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metro Last Light","img":"metro_last_light.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mindustry","img":"mindustry.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Monster Hunter Wilds","img":"monster_hunter_wilds.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Morrowind","img":"morrowind.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mortal Kombat 11","img":"mortal_kombat_11.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mortal Kombat X","img":"mortal_kombat_x.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ms Flight Simulator 2024","img":"ms_flight_simulator_2024.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mutant Year Zero","img":"mutant_year_zero.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"My Time At Portia","img":"my_time_at_portia.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"My Time At Sandrock","img":"my_time_at_sandrock.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Myst","img":"myst.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Naraka Bladepoint","img":"naraka_bladepoint.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Naruto Storm 4","img":"naruto_storm_4.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nba 2K24","img":"nba_2k24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nba 2K25","img":"nba_2k25.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Need For Speed Heat","img":"need_for_speed_heat.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Need For Speed Most Wanted","img":"need_for_speed_most_wanted.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Need For Speed Payback","img":"need_for_speed_payback.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Neva","img":"neva.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"New World","img":"new_world.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nfs Unbound","img":"nfs_unbound.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nhl 24","img":"nhl_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ni No Kuni 2","img":"ni_no_kuni_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nier Automata","img":"nier_automata.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nioh","img":"nioh.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nioh 2","img":"nioh_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"No Man's Sky","img":"no_mans_sky.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Northgard","img":"northgard.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nuclear Throne","img":"nuclear_throne.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Obduction","img":"obduction.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Oblivion","img":"oblivion.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Observer","img":"observer.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Octopath Traveler","img":"octopath_traveler.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Octopath Traveler 2","img":"octopath_traveler_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Omerta","img":"omerta.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"One Piece Odyssey","img":"one_piece_odyssey.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"One Piece Pirate Warriors 4","img":"one_piece_pirate_warriors_4.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ori And The Blind Forest","img":"ori_and_the_blind_forest.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ori And The Will Of The Wisps","img":"ori_and_the_will_of_the_wisps.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ori And The Will Of The Wisps 2","img":"ori_and_the_will_of_the_wisps_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Outer Wilds","img":"outer_wilds.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Outriders","img":"outriders.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Overwatch 2","img":"overwatch_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Oxenfree","img":"oxenfree.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Oxygen Not Included","img":"oxygen_not_included.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Path Of Exile","img":"path_of_exile.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Path Of Exile 2","img":"path_of_exile_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Path Of Exile Sentinel","img":"path_of_exile_sentinel.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pathfinder Kingmaker","img":"pathfinder_kingmaker.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pathfinder Wrath Of Righteous","img":"pathfinder_wrath_of_righteous.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Payday 3","img":"payday_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pc Building Simulator","img":"pc_building_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pc Building Simulator 2","img":"pc_building_simulator_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Penumbra","img":"penumbra.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Penumbra Black Plague","img":"penumbra_black_plague.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Penumbra Requiem","img":"penumbra_requiem.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 3 Reload","img":"persona_3_reload.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 4 Golden","img":"persona_4_golden.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 5 Royal","img":"persona_5_royal.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 5 Strikers","img":"persona_5_strikers.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Phasmophobia","img":"phasmophobia.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Phoenix Point","img":"phoenix_point.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pillars Of Eternity","img":"pillars_of_eternity.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pillars Of Eternity 2","img":"pillars_of_eternity_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planescape Torment","img":"planescape_torment.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Coaster","img":"planet_coaster.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Crafter","img":"planet_crafter.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Of Lana","img":"planet_of_lana.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Zoo","img":"planet_zoo.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planetary Annihilation","img":"planetary_annihilation.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Police Simulator","img":"police_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Poppy Playtime","img":"poppy_playtime.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Poppy Playtime Chapter 2","img":"poppy_playtime_chapter_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Portal","img":"portal.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Portal 2","img":"portal_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Post Void","img":"post_void.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Postal 2","img":"postal_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Power Washer Simulator","img":"power_washer_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Powerwash Simulator","img":"powerwash_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Prey 2017","img":"prey_2017.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Prison Architect","img":"prison_architect.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Project Cars 2","img":"project_cars_2.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Project Cars 3","img":"project_cars_3.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Project Zomboid","img":"project_zomboid.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pubg Battlegrounds","img":"pubg_battlegrounds.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Punch Club","img":"punch_club.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Punch Club 2","img":"punch_club_2.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Quake Champions","img":"quake_champions.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Quantum Break","img":"quantum_break.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Raft","img":"raft.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Raft 2","img":"raft_2.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rainbow Six Siege","img":"rainbow_six_siege.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ranch Simulator","img":"ranch_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ready Or Not","img":"ready_or_not.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Red Dead Redemption 2","img":"red_dead_redemption_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Remnant 2","img":"remnant_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil 2","img":"resident_evil_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil 3","img":"resident_evil_3.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil 4","img":"resident_evil_4.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil Village","img":"resident_evil_village.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Return Of The Obra Dinn","img":"return_of_the_obra_dinn.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ride 4","img":"ride_4.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Riders Republic","img":"riders_republic.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rift","img":"rift.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rimworld","img":"rimworld.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rise Of Golden Idol","img":"rise_of_golden_idol.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Risk Of Rain 2","img":"risk_of_rain_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Risk Of Rain Returns","img":"risk_of_rain_returns.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Road 96","img":"road_96.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rocket League","img":"rocket_league.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rust","img":"rust.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Salt And Sacrifice","img":"salt_and_sacrifice.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Salt And Sanctuary","img":"salt_and_sanctuary.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Samurai Shodown","img":"samurai_shodown.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Satisfactory","img":"satisfactory.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Satisfactory 2","img":"satisfactory_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Scarlet Nexus","img":"scarlet_nexus.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Scrap Mechanic","img":"scrap_mechanic.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Scum","img":"scum.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sekiro","img":"sekiro.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Selaco","img":"selaco.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Session","img":"session.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shadow Gambit","img":"shadow_gambit.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shadow Tactics","img":"shadow_tactics.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shadow Warrior 3","img":"shadow_warrior_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shapez 2","img":"shapez_2.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shovel Knight","img":"shovel_knight.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Silent Hill 2","img":"silent_hill_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Silksong","img":"silksong.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sins Of Solar Empire","img":"sins_of_solar_empire.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Skater Xl","img":"skater_xl.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Skullgirls","img":"skullgirls.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Skyrim","img":"skyrim.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Slay The Spire","img":"slay_the_spire.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Slime Rancher","img":"slime_rancher.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Slime Rancher 2","img":"slime_rancher_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Smite","img":"smite.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Elite 3","img":"sniper_elite_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Elite 4","img":"sniper_elite_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Elite 5","img":"sniper_elite_5.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Ghost Warrior 3","img":"sniper_ghost_warrior_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Ghost Warrior Contracts","img":"sniper_ghost_warrior_contracts.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Ghost Warrior Contracts 2","img":"sniper_ghost_warrior_contracts_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Snowrunner","img":"snowrunner.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Soma","img":"soma.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Song Of Horror","img":"song_of_horror.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sons Of The Forest","img":"sons_of_the_forest.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Space Engine","img":"space_engine.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Space Engineers","img":"space_engineers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Spiritfarer","img":"spiritfarer.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stalker 2","img":"stalker_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stalker Call Of Pripyat","img":"stalker_call_of_pripyat.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stalker Shadow Of Chernobyl","img":"stalker_shadow_of_chernobyl.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Trek Online","img":"star_trek_online.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Battlefront 2","img":"star_wars_battlefront_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Jedi Fallen","img":"star_wars_jedi_fallen.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Jedi Survivor","img":"star_wars_jedi_survivor.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Old Republic","img":"star_wars_old_republic.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Squadrons","img":"star_wars_squadrons.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Starbound","img":"starbound.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stardew Valley","img":"stardew_valley.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stardew Valley 2","img":"stardew_valley_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Starfield","img":"starfield.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stationeers","img":"stationeers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Steel Division 2","img":"steel_division_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Steel Division Normandy","img":"steel_division_normandy.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stellaris","img":"stellaris.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sto Legacy","img":"sto_legacy.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stormworks","img":"stormworks.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stormworks 2","img":"stormworks_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stranded Deep","img":"stranded_deep.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stranger Of Paradise","img":"stranger_of_paradise.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stray","img":"stray.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Street Fighter 5","img":"street_fighter_5.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Street Fighter 6","img":"street_fighter_6.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Subnautica","img":"subnautica.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Subnautica Below Zero","img":"subnautica_below_zero.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Super Mega Baseball 4","img":"super_mega_baseball_4.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Supreme Commander 2","img":"supreme_commander_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Surviving Mars","img":"surviving_mars.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Surviving The Aftermath","img":"surviving_the_aftermath.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"System Shock 2","img":"system_shock_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"System Shock Remake","img":"system_shock_remake.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tales Of Berseria","img":"tales_of_berseria.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tales Of Vesperia","img":"tales_of_vesperia.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Talos Principle","img":"talos_principle.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Talos Principle 2","img":"talos_principle_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Team Fortress 2","img":"team_fortress_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tekken 7","img":"tekken_7.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tell Me Why","img":"tell_me_why.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tennis Elbow 2013","img":"tennis_elbow_2013.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Terraria","img":"terraria.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Terraria 2","img":"terraria_2.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Binding of Isaac: Rebirth","img":"the_binding_of_isaac_rebirth.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Crew 2","img":"the_crew_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Finals","img":"the_finals.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Forest","img":"the_forest.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Hunter","img":"the_hunter.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Isle","img":"the_isle.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Outlast Trials","img":"the_outlast_trials.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Outlast Trials 2","img":"the_outlast_trials_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Room","img":"the_room.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Sims 4","img":"the_sims_4.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Walking Dead","img":"the_walking_dead.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Walking Dead Final Season","img":"the_walking_dead_final_season.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Walking Dead Season 2","img":"the_walking_dead_season_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Them Fightin Herds","img":"them_fightin_herds.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"They Are Billions","img":"they_are_billions.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"They Are Billions 2","img":"they_are_billions_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief","img":"thief.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief 2","img":"thief_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief Deadly Shadows","img":"thief_deadly_shadows.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief Gold","img":"thief_gold.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief Simulator 2","img":"thief_simulator_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"This War Of Mine","img":"this_war_of_mine.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Throne And Liberty","img":"throne_and_liberty.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Titanfall 2","img":"titanfall_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Torchlight 2","img":"torchlight_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Torchlight Infinite","img":"torchlight_infinite.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Torment Tides Of Numenera","img":"torment_tides_of_numenera.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tormented Souls","img":"tormented_souls.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Total War Three Kingdoms","img":"total_war_three_kingdoms.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Total War Warhammer 3","img":"total_war_warhammer_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Trailmakers","img":"trailmakers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Train Simulator 2024","img":"train_simulator_2024.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Transport Fever 2","img":"transport_fever_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Trials Of Mana","img":"trials_of_mana.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Two Point Hospital","img":"two_point_hospital.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tyranny","img":"tyranny.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ultrakill","img":"ultrakill.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Undertale","img":"undertale.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Universe Sandbox","img":"universe_sandbox.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Unravel 2","img":"unravel_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Valheim","img":"valheim.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Vampire Survivors","img":"vampire_survivors.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Vanquish","img":"vanquish.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Vrising","img":"vrising.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"War Thunder","img":"war_thunder.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"War Thunder Ground","img":"war_thunder_ground.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warface","img":"warface.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warframe","img":"warframe.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wargame Airland Battle","img":"wargame_airland_battle.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wargame European Escalation","img":"wargame_european_escalation.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wargame Red Dragon","img":"wargame_red_dragon.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warhammer Boltgun","img":"warhammer_boltgun.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warno","img":"warno.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wasteland 3","img":"wasteland_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Way Of The Hunter","img":"way_of_the_hunter.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"What Remains Edith Finch","img":"what_remains_edith_finch.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Witcher 3","img":"witcher_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Witness","img":"witness.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wo Long","img":"wo_long.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolcen","img":"wolcen.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolf Among Us","img":"wolf_among_us.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolfenstein Colossus","img":"wolfenstein_colossus.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolfenstein New Order","img":"wolfenstein_new_order.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolfenstein Youngblood","img":"wolfenstein_youngblood.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"World Of Warships","img":"world_of_warships.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"World War 3","img":"world_war_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wreckfest","img":"wreckfest.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wytchwood","img":"wytchwood.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xcom 2","img":"xcom_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xcom Chimera Squad","img":"xcom_chimera_squad.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xcom Enemy Unknown","img":"xcom_enemy_unknown.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xplane","img":"xplane.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ys Ix","img":"ys_ix.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ys Viii","img":"ys_viii.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Zero Sievert","img":"zero_sievert.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"}];

// ================================================================
// НОВЫЕ ФУНКЦИИ: игра из Steam-обложек, каталог, слайдер, hero
// ================================================================
const IMG_BASE = "images/games/";
function gameImg(g) { return IMG_BASE + g.img; }

function renderHeroGames() {
  const box = document.getElementById('heroGames');
  if (!box || typeof GAMES === 'undefined' || !GAMES.length) return;
  const top = GAMES.slice(0, 6);
  box.innerHTML = top.map((g, i) =>
    `<div class="hero-game-card" onclick="playGame('${g.name}')">
       <img src="${gameImg(g)}" alt="${g.name}" loading="lazy">
       <div class="hero-game-caption">${g.name}</div>
     </div>`).join('');
}

function renderTopGames() {
  const track = document.getElementById('gamesSliderTrack');
  if (!track || typeof GAMES === 'undefined' || !GAMES.length) return;
  // Берём 20 игр, разбиваем на 4 слайда по 5
  const top = GAMES.slice(0, 20);
  const perSlide = 5;
  const ranks = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
  let html = '';
  for (let s = 0; s < top.length; s += perSlide) {
    const slideGames = top.slice(s, s + perSlide);
    html += `<div class="games-grid">` + slideGames.map((g, i) => {
      const absIdx = s + i;
      return `<div class="game-card" data-game="${g.name.replace(/'/g, "\\'")}" onclick="openGameDetail('${g.name.replace(/'/g, "\\'")}')" style="background-image:url('${gameImg(g)}')">
      <div class="card-fav" data-game="${g.name}" onclick="event.stopPropagation();toggleFav(this)">♡</div>
      <div class="rank ${absIdx===0?'gold':''}">${ranks[absIdx]}</div>
      <div class="card-image"><img src="${gameImg(g)}" alt="${g.name}" loading="lazy"></div>
      <div class="card-overlay">
        <h4 class="card-title">${g.name}</h4>
        <p class="card-sub">${g.cat}</p>
      </div>
      <div class="game-tooltip">${g.desc}</div>
      <button class="btn-play" onclick="event.stopPropagation();playGame('${g.name.replace(/'/g, "\\'")}')">▶ Играть</button>
      <button class="btn-demo" onclick="event.stopPropagation();startDemoMode('${g.name.replace(/'/g, "\\'")}')">🎮 Демо</button>
    </div>`;
    }).join('') + `</div>`;
  }
  track.innerHTML = html;
  // Генерируем точки, если их недостаточно
  const sliderWrap = track.closest('.games-slider-wrapper');
  if (sliderWrap) {
    let dotsBox = sliderWrap.querySelector('.slider-dots');
    if (!dotsBox) {
      dotsBox = document.createElement('div');
      dotsBox.className = 'slider-dots';
      sliderWrap.appendChild(dotsBox);
    }
    const total = top.length / perSlide;
    dotsBox.innerHTML = '';
    for (let i = 0; i < total; i++) dotsBox.innerHTML += `<span class="${i===0?'active':''}" data-index="${i}"></span>`;
  }
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid || typeof GAMES === 'undefined' || !GAMES.length) return;
  grid.innerHTML = GAMES.map(g =>
    `<div class="catalog-item" data-type="${g.cat}" data-game="${g.name}" onclick="openGameDetail('${g.name.replace(/'/g, "\\'")}')">
       <div class="icon"><img src="${gameImg(g)}" alt="${g.name}" loading="lazy"></div>
       <h4>${g.name}</h4>
       <span class="cat-badge">${g.cat}</span>
       <div class="catalog-rating">★★★★☆</div>
       <button class="catalog-fav" onclick="event.stopPropagation();toggleFav(this)" data-game="${g.name}">♡</button>
       <div class="catalog-tooltip">${g.desc}</div>
     </div>`).join('');
}

function filterGames(type, btn) {
  if (btn) {
    document.querySelectorAll('#catalogFilters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  document.querySelectorAll('#catalogGrid .catalog-item').forEach(item => {
    const show = type === 'all' || item.dataset.type === type;
    item.style.display = show ? '' : 'none';
  });
}

// Слайдер с автопрокруткой каждые 5 сек
function initSliderAutoplay() {
  const sliderWrap = document.querySelector('.games-slider-wrapper');
  if (!sliderWrap) return;
  // Добавить стрелки, если их нет
  if (!sliderWrap.querySelector('.slider-prev')) {
    sliderWrap.insertAdjacentHTML('afterbegin', '<button class="slider-arrow slider-prev" onclick="slideGames(-1, event)" aria-label="Назад">‹</button>');
  }
  if (!sliderWrap.querySelector('.slider-next')) {
    sliderWrap.insertAdjacentHTML('beforeend', '<button class="slider-arrow slider-next" onclick="slideGames(1, event)" aria-label="Вперёд">›</button>');
  }
  window._slideIdx = 0;
  const track = sliderWrap.querySelector('.games-slider-track');
  const grids = sliderWrap.querySelectorAll('.games-grid');
  const dots = sliderWrap.querySelectorAll('.slider-dots span');
  window._slideTotal = Math.max(1, grids.length);
  function go(i) {
    window._slideIdx = ((i % window._slideTotal) + window._slideTotal) % window._slideTotal;
    if (track) track.style.transform = 'translateX(-' + (window._slideIdx * 100) + '%)';
    if (dots.length) {
      dots.forEach((d, di) => d.classList.toggle('active', di === window._slideIdx));
    }
  }
  window.goSlide = go;
  if (dots.length) {
    dots.forEach((d, di) => {
      d.style.cursor = 'pointer';
      d.addEventListener('click', () => go(di));
    });
  }
  // Автопрокрутка каждые 5 сек
  let auto = null;
  function startAuto() { stopAuto(); auto = setInterval(() => go(window._slideIdx + 1), 5000); }
  function stopAuto() { if (auto) clearInterval(auto); }
  window.startSliderAuto = startAuto;
  window.stopSliderAuto = stopAuto;
  startAuto();
  sliderWrap.addEventListener('mouseenter', stopAuto);
  sliderWrap.addEventListener('mouseleave', startAuto);
  // Свайп для мобильных
  let sx = 0, dragging = false;
  sliderWrap.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dragging = true; }, { passive: true });
  sliderWrap.addEventListener('touchend', e => {
    if (!dragging) return; dragging = false;
    const dx = e.changedTouches[0].clientX - sx;
    if (dx < -40) go(window._slideIdx + 1);
    else if (dx > 40) go(window._slideIdx - 1);
  }, { passive: true });
}
window.slideGames = function(dir, e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  if (typeof window.goSlide === 'function' && typeof window._slideIdx === 'number') {
    window.goSlide(window._slideIdx + dir);
    if (typeof window.stopSliderAuto === 'function') {
      window.stopSliderAuto();
      setTimeout(() => window.startSliderAuto && window.startSliderAuto(), 8000);
    }
  }
};

// Авто-раст поля + счётчик символов
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 300) + 'px';
}
function updateCharCount(el) {
  const c = document.getElementById('charCount');
  if (c) {
    c.textContent = el.value.length;
    c.classList.toggle('danger', el.value.length >= 500);
  }
}
window.autoGrow = autoGrow;
window.updateCharCount = updateCharCount;

// renderAll: безопасно вызывает все рендеры (null-safe)
function renderAllGames() {
  // Каждый рендер в отдельном try/catch, чтобы одна ошибка не блокировала остальные
  try { renderHeroGames(); } catch (e) { console.warn('hero err', e); }
  try { renderTopGames(); } catch (e) { console.warn('top err', e); }
  try { renderCatalog(); } catch (e) { console.warn('catalog err', e); }
  try { renderPopularGrid(); } catch (e) { console.warn('popular err', e); }
}

// Популярные игры (если есть контейнер)
function renderPopularGrid() {
  const grid = document.getElementById('popularGrid');
  if (!grid || typeof GAMES === 'undefined' || !GAMES.length) return;
  const top = ['dota_2','counter_strike_2','cyberpunk_2077','red_dead_redemption_2','stardew_valley','hades']
    .map(f => GAMES.find(g => g.img === f + '.jpg'))
    .filter(Boolean);
  if (!top.length) return;
  grid.innerHTML = top.map(g =>
    `<div class="popular-card" onclick="playGame('${g.name}')">
       <div class="icon"><img src="${gameImg(g)}" alt="${g.name}" loading="lazy"></div>
       <h4>${g.name}</h4>
       <div class="rating">★★★★★</div>
     </div>`).join('');
}

// Перехват DOMContentLoaded: запуск новых рендеров после текущей инициализации
(function() {
  const existingInit = window.onload;
  document.addEventListener('DOMContentLoaded', function() {
    renderAllGames();
    // Слайдер инициализируем после рендера, с задержкой
    setTimeout(initSliderAutoplay, 600);
    // Авто-рост textarea
    document.querySelectorAll('.auto-grow').forEach(ta => {
      ta.addEventListener('input', () => { autoGrow(ta); updateCharCount(ta); });
      autoGrow(ta); updateCharCount(ta);
    });
  });
})();

// ================================================================
// ДЕТАЛЬНАЯ СТРАНИЦА ИГРЫ (по клику на карточку)
// ================================================================
function openGameDetail(name) {
  const game = GAMES.find(g => g.name === name);
  if (!game) { playGame(name); return; }
  const body = document.getElementById('gameDetailBody');
  if (!body) { playGame(name); return; }
  const specKeys = ['Жанр', 'Тип', 'Рейтинг', 'Онлайн', 'Возраст', 'Разработчик'];
  const specVals = [game.cat, 'Игра', '4.8/5', '50 000+', '12+', 'Crown Games'];
  body.innerHTML = `
    <div class="gd-layout">
      <div class="gd-image"><img src="${gameImg(game)}" alt="${game.name}"></div>
      <div class="gd-info">
        <span class="gd-cat">${game.cat}</span>
        <h3>${game.name}</h3>
        <div class="gd-rating">★★★★★ <span>4.8 · 2 340 отзывов</span></div>
        <p class="gd-desc">${game.desc}</p>
        <div class="gd-specs">
          <h4>Характеристики</h4>
          ${specKeys.map((k, i) => `<div class="gd-spec-row"><span class="gd-spec-name">${k}</span><span class="gd-spec-val">${specVals[i]}</span></div>`).join('')}
        </div>
        <div class="gd-buttons">
          <button class="btn-gold" onclick="closeModal('gameDetailModal');playGame('${game.name.replace(/'/g, "\\'")}')">▶ Играть</button>
          <button class="btn-secondary" onclick="closeModal('gameDetailModal');startDemoMode('${game.name.replace(/'/g, "\\'")}')">🎮 Демо</button>
          <button class="btn-secondary" onclick="closeModal('gameDetailModal')">✕ Закрыть</button>
        </div>
      </div>
    </div>`;
  openModal('gameDetailModal');
}
window.openGameDetail = openGameDetail;

// ================================================================
// LIVE-ЧАТ: ОТПРАВКА СООБЩЕНИЯ И БОТЫ
// ================================================================
function sendLiveMessage() {
  const input = document.getElementById('liveChatInput');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;
  addLiveMessage('👤 Вы', msg);
  input.value = '';
  setTimeout(() => {
    const replies = ['Круто!', 'Повезёт! 🍀', 'Согласен!', 'Отличный выбор!', 'Удачи!'];
    addLiveMessage(liveUsernames[Math.floor(Math.random()*liveUsernames.length)], replies[Math.floor(Math.random()*replies.length)]);
  }, 1200);
}
window.sendLiveMessage = sendLiveMessage;

// Экспорт в window
window.renderAllGames = renderAllGames;
window.renderCatalog = renderCatalog;
window.renderTopGames = renderTopGames;
window.renderHeroGames = renderHeroGames;
window.initSliderAutoplay = initSliderAutoplay;
window.filterGames = filterGames;
window.GAMES = GAMES;

// ================================================================
// ФОН: ЛЕНТЫ ОБЛОЖЕК ИГР ПОД УГЛОМ 30°
// ================================================================
// ================================================================
// ФОН: ЛЕНТЫ ОБЛОЖЕК ИГР — сборка и обновление при ресайзе
// ================================================================

/** Определяет размеры обложек и лент по ширине экрана */
function getRibbonSizes() {
  const w = window.innerWidth;
  if (w >= 2560) return { ribbonH: 440, coverW: 300, coverH: 440, gap: 24, ribbonW: 340 };
  if (w >= 1920) return { ribbonH: 320, coverW: 220, coverH: 320, gap: 18, ribbonW: 320 };
  if (w <= 768)  return { ribbonH: 130, coverW: 90,  coverH: 130, gap: 10, ribbonW: 300 };
  return             { ribbonH: 160, coverW: 110, coverH: 160, gap: 12, ribbonW: 300 };
}

/** Создаёт ленты с обложками и помещает их в контейнер */
function buildCoverRibbons() {
  const wrap = document.getElementById('coverRibbons');
  if (!wrap || typeof GAMES === 'undefined' || !GAMES.length) return;
  // Очищаем контейнер: удаляем все старые ленты
  wrap.innerHTML = '';

  const s = getRibbonSizes();
  const step = s.coverW + s.gap;
  // Контейнер 300% × 300%, повёрнут на 30°. Лент нужно ×3 от высоты экрана + запас.
  const RIBBON_COUNT = Math.ceil((window.innerHeight * 3) / (s.ribbonH + s.gap)) + 6;
  // Обложек: ширина ленты = s.ribbonW vw, каждая занимает step px. Запас +50%.
  const needed = Math.ceil((window.innerWidth * s.ribbonW / 100) / step) * 1.5;
  const COVERS_PER_RIBBON = Math.max(24, Math.ceil(needed));
  const total = GAMES.length;

  for (let r = 0; r < RIBBON_COUNT; r++) {
    const ribbon = document.createElement('div');
    ribbon.className = 'ribbon';
    ribbon.style.top = (r * (s.ribbonH + s.gap)) + 'px';
    // Случайный сдвиг, чтобы ленты визуально не совпадали
    const offset = Math.floor(Math.random() * total);
    // Дублируем ×2 для бесшовной прокрутки translateX(-50%)
    for (let dup = 0; dup < 2; dup++) {
      for (let i = 0; i < COVERS_PER_RIBBON; i++) {
        const g = GAMES[(offset + i) % total];
        const cover = document.createElement('div');
        cover.className = 'cover';
        const img = document.createElement('img');
        img.src = 'images/games/' + g.img;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = function(){ this.style.visibility = 'hidden'; };
        cover.appendChild(img);
        ribbon.appendChild(cover);
      }
    }
    wrap.appendChild(ribbon);
  }
}

/** Обновляет ленты при ресайзе — очищает и перестраивает заново */
function refreshCoverRibbons() {
  buildCoverRibbons();
}

// Запуск при загрузке
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildCoverRibbons);
} else {
  buildCoverRibbons();
}

// Debounce-обработчик resize: ждём 400 мс после последнего изменения размера
let resizeTimer = null;
window.addEventListener('resize', function() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(refreshCoverRibbons, 400);
});

window.buildCoverRibbons = buildCoverRibbons;
window.refreshCoverRibbons = refreshCoverRibbons;

