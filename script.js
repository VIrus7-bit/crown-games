// ================================================================
// ПАРТИКЛЫ
// ================================================================
(function() {
    // На мобильных отключаем частицы для производительности
    if (window.innerWidth <= 768) return;
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
    if (loader) {
        loader.classList.remove('hiding');
        loader.style.display = 'flex';
    }
}
function hideSkeletonLoader() {
    const loader = document.getElementById('skeletonLoader');
    if (!loader) return;
    // Плавное исчезновение: добавляем класс hiding (opacity + visibility),
    // после перехода скрываем элемент полностью
    loader.classList.add('hiding');
    setTimeout(() => {
        loader.style.display = 'none';
        loader.classList.remove('hiding');
    }, 800); // длительность transition в CSS (0.8s)
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
    const navEl = document.getElementById('mainNav');
    if (navEl) navEl.classList.remove('open');
    const burgerEl = document.getElementById('burgerBtn');
    if (burgerEl) burgerEl.classList.remove('active');
    // Перерендер каталога и слайдера при переходе на соответствующие страницы
    if (page === 'games' && typeof renderCatalog === 'function') {
        try { renderCatalog(); } catch(e){}
    }
    if (page === 'home' && typeof renderTopGames === 'function') {
        try { renderTopGames(); } catch(e){}
        try { renderHeroGames(); } catch(e){}
    }
    if (page === 'profile' && typeof renderProfileLibrary === 'function') {
        try { renderProfileLibrary(); } catch(e){}
    }
    if (page === 'library' && typeof renderLibrary === 'function') {
        try { renderLibrary(); } catch(e){}
    }
    setTimeout(() => {
        isNavigating = false;
    }, 600);
}

/** Переход к блоку «Блог и новости» на главной странице */
function goToNews() {
    // Если главная страница не активна — переходим на неё
    const homePage = document.getElementById('page-home');
    const isHomeActive = homePage && homePage.classList.contains('active');
    if (!isHomeActive) {
        navigateTo('home');
    }
    // Прокручиваем к блоку новостей после отображения главной
    setTimeout(() => {
        const newsSection = document.getElementById('newsSection');
        if (newsSection) {
            newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, isHomeActive ? 0 : 600);
}
window.goToNews = goToNews;

/** Переключение выпадающего списка языков */
function toggleLangDropdown(e) {
  if (e) e.stopPropagation();
  document.getElementById('langDropdown').classList.toggle('open');
}
/** Установить язык и применить переводы */
function setLanguage(lang, e) {
  if (e) e.stopPropagation();
  document.getElementById('langDropdown').classList.remove('open');
  currentLanguage = lang;
  localStorage.setItem('siteLanguage', lang);
  document.documentElement.lang = lang;
  document.getElementById('langLabel').textContent = lang.toUpperCase();
  applyTranslations(lang);
  showToast(`🌐 ${lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : '中文'}`);
}
window.setLanguage = setLanguage;

function loadLanguage() {
  const saved = localStorage.getItem('siteLanguage');
  if (saved && translations[saved]) {
    currentLanguage = saved;
    document.documentElement.lang = saved;
    document.getElementById('langLabel').textContent = saved.toUpperCase();
    applyTranslations(saved);
  }
}
window.loadLanguage = loadLanguage;

// Закрытие дропдауна языка при клике вне
document.addEventListener('click', function(e) {
  if (!e.target.closest('.header-lang')) {
    const dd = document.getElementById('langDropdown');
    if (dd) dd.classList.remove('open');
  }
});
const burgerBtn = document.getElementById('burgerBtn');
if (burgerBtn) {
  burgerBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    document.getElementById('mainNav').classList.toggle('open');
  });
}

// ================================================================
// ГОЛОСОВОЙ ПОИСК НА СТРАНИЦЕ «ИГРЫ»
// ================================================================
/** Голосовой поиск на странице «Игры» — заполняет поиск каталога */
function gamesVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('❌ Голосовой поиск не поддерживается');
        return;
    }
    try {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SR();
        rec.lang = 'ru-RU';
        rec.continuous = false;
        rec.interimResults = false;
        rec.onstart = function() {
            showToast('🎤 Слушаю...');
        };
        rec.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('gamesSearchInput');
            if (input) {
                input.value = transcript;
                filterGamesSearch(transcript);
            }
            showToast(`🔊 Поиск: "${transcript}"`);
        };
        rec.onerror = function() {
            showToast('❌ Не удалось распознать речь');
        };
        rec.onend = function() {
            // ничего не делаем при завершении
        };
        rec.start();
    } catch(e) {
        showToast('⚠️ Ошибка доступа к микрофону');
    }
}
window.gamesVoiceSearch = gamesVoiceSearch;

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
// Фейковые уведомления удалены — уведомления появляются только по действиям пользователя.

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
    document.querySelectorAll('.card-fav, .catalog-fav, .sl-fav, .row-fav').forEach(el => {
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
// ФИЛЬТРЫ КАТАЛОГА
// ================================================================
/** Поиск по каталогу игр (страница «Игры») */
function filterGamesSearch(query) {
    const items = document.querySelectorAll('#catalogGrid .catalog-item');
    const q = query.trim().toLowerCase();
    items.forEach(item => {
        const name = (item.getAttribute('data-game') || item.querySelector('h4').textContent).toLowerCase();
        const show = !q || name.includes(q);
        item.style.display = show ? '' : 'none';
    });
}
/** Очистка поиска в каталоге игр */
function clearGamesSearch() {
    document.getElementById('gamesSearchInput').value = '';
    document.querySelectorAll('#catalogGrid .catalog-item').forEach(item => item.style.display = '');
}
window.filterGamesSearch = filterGamesSearch;
window.clearGamesSearch = clearGamesSearch;

// ================================================================
// ПРОФИЛЬ — ВКЛАДКИ
// ================================================================
function switchProfileTab(tab, btn) {
    // Поддержка старого и нового (Steam) стиля вкладок
    const tabsContainer = btn.closest('.profile-tabs') || btn.closest('.tabs');
    const contentContainer = btn.closest('.profile-right') || btn.closest('.profile-content');
    if (tabsContainer) {
        tabsContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    if (contentContainer) {
        contentContainer.querySelectorAll('.profile-tab-content, .tab-content').forEach(t => t.classList.remove('active'));
        const target = document.getElementById('tab-' + tab);
        if (target) target.classList.add('active');
    }
    if (tab === 'badges') {
        renderAchievements();
    }
    if (tab === 'library') {
        renderProfileLibrary();
    }
}

// ================================================================
// ПРОФИЛЬ — ОБНОВЛЕНИЕ ИМЕНИ
// ================================================================
function updateProfileName(name) {
    document.getElementById('profileName').textContent = name || 'Игрок';
}

// ================================================================
// ПРОФИЛЬ — ЭКСПОРТ TXT
// ================================================================
function exportProfileTXT() {
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

const translations = {
    ru: {
        // Навигация
        'nav_home': 'Главная', 'nav_games': 'Игры', 'nav_library': 'Библиотека', 'nav_vip': 'VIP', 'nav_blog': 'Блог',
        'nav_affiliate': 'Партнёры', 'nav_profile': 'Профиль', 'nav_about': 'О нас', 'nav_contacts': 'Контакты',
        'auth_login': 'Войти', 'auth_register': 'Регистрация',

        // Хлебные крошки
        'bread_home': 'Главная', 'bread_games': 'Игры', 'bread_promo': 'Акции', 'bread_vip': 'VIP',
        'bread_affiliate': 'Партнёры', 'bread_about': 'О нас', 'bread_blog': 'Блог', 'bread_profile': 'Профиль',

        // Баннеры
        'pwa_install': '— установите приложение', 'pwa_desc': 'Быстрый доступ, push-уведомления и офлайн-режим',
        'pwa_btn': 'Установить',
        'cookie_text': '🍪 Мы используем файлы cookie для улучшения вашего опыта. Продолжая использовать сайт, вы соглашаетесь с нашей политикой конфиденциальности.',
        'cookie_decline': 'Отклонить', 'cookie_accept': 'Принять',
        'notif_text': '🔔 Включите уведомления, чтобы не пропускать выигрыши и новые бонусы!',
        'notif_allow': 'Разрешить', 'notif_deny': 'Не сейчас',
        'voice_listening': '🎤 Слушаю...',
        'theme_customizer': 'Настройка темы',
        'theme_gold': 'Золото', 'theme_platinum': 'Платина', 'theme_ruby': 'Рубин', 'theme_sapphire': 'Сапфир',
        'loader_sub': 'Загружаем игровую вселенную...',
        'toast_title': 'Уведомление', 'toast_text': 'Текст уведомления',

        // Hero
        'hero_badge': '✦ Премиум-портал игр',
        'hero_title1': 'Королевская игра',
        'hero_title2': 'начинается здесь',
        'hero_desc': 'Погрузитесь в мир роскоши и азарта. Только лучшие игры, эксклюзивные бонусы и атмосфера высшего статуса.',
        'hero_play': 'Играть сейчас', 'hero_promo': 'Акции',

        // Пополнение Steam
        'topup_title': 'Пополни баланс Steam',
        'topup_subtitle': 'Моментальное пополнение кошелька Стим',
        'topup_refills': 'пополнений',
        'region_ru': 'Россия', 'region_kz': 'Казахстан', 'region_sbp': 'СПБ',
        'discount_current': 'Текущая скидка: <b>-2%</b>',
        'topup_login_label': 'Логин аккаунта', 'topup_login_hint': 'Как узнать логин?',
        'topup_login_ph': 'Введите ваш логин',
        'topup_amount_label': 'Сумма пополнения', 'topup_amount_prefix': 'Получите',
        'fee_progress_text': 'Ещё 1000 ₽ чтобы уменьшить комиссию', 'fee_commission': 'Включая комиссию ~7.4%',
        'quick_sum_label': 'Быстрый выбор суммы',

        // Оплата
        'pay_header': 'Способ <span class="gold">оплаты</span>', 'pay_subtitle': 'Выберите удобный метод',
        'pay_card': 'Картой', 'pay_sbp': 'СБП',
        'pay_sum_amount': 'Сумма пополнения', 'pay_sum_fee': 'Комиссия сервиса', 'pay_sum_total': 'Итого к оплате',
        'pay_promo_label': 'Промокод', 'pay_promo_ph': 'Введите промокод (если есть)',
        'pay_warning': '⚠️ Для успешной оплаты рекомендуем отключить VPN и перезагрузить страницу',
        'pay_submit': 'Оплатить',
        'pay_agree_text': 'Нажимая кнопку «Оплатить», вы соглашаетесь с офертой об оказании услуг',
        'pay_legal_rules': 'Я ознакомлен(а) с правилами оплаты, условиями возврата и обработки персональных данных',

        // Топ игр и новости
        'top_title': 'Топ <span class="gold">игр</span>', 'top_viewall': 'Смотреть все →',
        'news_title': 'Блог и <span class="gold">новости</span>', 'news_tag_new': 'Новинки',
        'readmore': 'Читать далее →',
        'news1_title': 'Cyberpunk 2077: масштабное обновление графики',
        'news1_text': 'Трассировка лучей и новые настройки производительности сделали Найт-Сити ещё красивее. Разработчики выпустили крупный патч, который добавляет поддержку DLSS 4, улучшенные отражения и оптимизацию для видеокарт нового поколения.',
        'news2_tag': 'Киберспорт',
        'news2_title': 'Elden Ring: секреты и гайд по сложным боссам',
        'news2_text': 'Как победить самых сложных боссов Междуземья — проверенные билды и стратегии. В этом гайде мы собрали лучшие советы от профессиональных игроков: какие оружия и заклинания использовать против каждого босса.',
        'news3_tag': 'Стратегии',
        'news3_title': 'Dota 2: мета 2025 и лучшие герои',
        'news3_text': 'Разбор актуальной меты, сильнейшие герои патча и советы по подъёму рейтинга. Мы проанализировали статистику матчей высокого ранга и подготовили список самых эффективных героев для каждой позиции.',
        'news4_tag': 'Гайд',
        'news4_title': 'Stardew Valley: лучшие фермерские стратегии',
        'news4_text': 'Как быстро разбогатеть, какие культуры выгоднее и секреты общения с жителями. В этом подробном руководстве мы расскажем о самых прибыльных культурах для каждого сезона.',
        'news5_tag': 'Обзор',
        'news5_title': 'Red Dead Redemption 2: почему это шедевр',
        'news5_text': 'Разбор открытого мира, истории и геймплея самой атмосферной игры последних лет. Red Dead Redemption 2 продолжает удерживать планку лучшей игры в жанре вестерн.',
        'news6_tag': 'Советы',
        'news6_title': "Baldur's Gate 3: гайд по созданию персонажа",
        'news6_text': 'Лучшие классы, расы и билды для новичков и опытных игроков. Создание персонажа в Baldur\'s Gate 3 — один из самых важных этапов игры.',
        'guide_badge': '✦ Гид недели',
        'guide_title': 'Как собрать идеальный <span class="gold">игровой компьютер</span> в 2025 году',
        'guide_text': 'Процессор, видеокарта, память и охлаждение — подробный разбор каждого компонента для сборки ПК под любой бюджет.',
        'guide_l1': 'Видеокарта — ядро производительности', 'guide_l2': 'Процессор для онлайн-игр и стримов',
        'guide_l3': '32 ГБ ОЗУ — новый стандарт', 'guide_l4': 'Быстрый NVMe-накопитель для мгновенной загрузки',
        'guide_btn': 'Читать полный гид',

        // Каталог игр
        'games_breadcrumb': 'Игры',
        'catalog_title': 'Каталог <span style="color:var(--gold);">игр</span>',
        'search_ph': 'Поиск игр...',
        'filter_all': 'Все', 'filter_shooter': 'Шутеры', 'filter_strategy': 'Стратегии', 'filter_rpg': 'RPG',
        'filter_survival': 'Выживание', 'filter_sandbox': 'Песочницы', 'filter_sport': 'Спорт',
        'filter_indie': 'Инди', 'filter_horror': 'Хоррор',
        'cat_shooter': 'Шутер', 'cat_strategy': 'Стратегия', 'cat_rpg': 'RPG', 'cat_survival': 'Выживание',
        'cat_sandbox': 'Песочница', 'cat_sport': 'Спорт', 'cat_indie': 'Инди', 'cat_horror': 'Хоррор',
        'desc_shooter': 'Динамичный шутер с захватывающими перестрелками, соревновательным мультиплеером и отличной отдачей от оружия.',
        'desc_strategy': 'Глубокая стратегия, требующая продуманного планирования, управления ресурсами и тактического мышления.',
        'desc_rpg': 'Масштабная RPG с проработанным миром, системой прокачки и множеством сюжетных развилок.',
        'desc_survival': 'Напряжённый survival-хоррор с исследованием опасного мира, крафтом и борьбой за выживание.',
        'desc_sandbox': 'Открытая песочница с безграничными возможностями для творчества и экспериментов.',
        'desc_sport': 'Реалистичный спортивный симулятор с точной физикой и захватывающим соревновательным режимом.',
        'desc_indie': 'Оригинальная инди-игра с уникальной художественной стилистикой и необычными механиками.',
        'desc_horror': 'Атмосферный хоррор с напряжённым геймплеем, скримерами и глубоким погружением в ужас.',
        'desc_default': 'Увлекательная игра с уникальным геймплеем и глубокой проработкой мира.',
        'gd_specs': 'Характеристики', 'gd_features': 'Особенности', 'gd_languages': 'Языки',
        'gd_sysreq': 'Системные требования', 'gd_minreq': 'Минимальные:', 'gd_recreq': 'Рекомендуемые:',
        'gd_genre': 'Жанр', 'gd_dev': 'Разработчик', 'gd_pub': 'Издатель', 'gd_release': 'Дата выхода', 'gd_age': 'Возраст', 'gd_online': 'Онлайн',
        'gd_reviews': 'отзывов', 'gd_buy': 'Купить', 'gd_close': '✕ Закрыть',
        'gd_online_multi': '50 000+ игроков', 'gd_online_single': 'Синглплеер',
        'gd_lang_list': 'Русский, English, Deutsch, Français, Español, 中文, 日本語, Português',
        'gd_minreq_text': 'ОС: Windows 10 64-bit · Процессор: Intel Core i3-8100 / AMD Ryzen 3 1200 · ОЗУ: 8 ГБ · Видеокарта: NVIDIA GTX 960 / AMD R9 380 · DirectX 11 · 30 ГБ на диске',
        'gd_recreq_text': 'ОС: Windows 11 64-bit · Процессор: Intel Core i7-9700K / AMD Ryzen 5 3600 · ОЗУ: 16 ГБ · Видеокарта: NVIDIA RTX 2060 / AMD RX 5700 · DirectX 12 · 30 ГБ SSD',

        // Акции
        'promo_breadcrumb': 'Акции',
        'promo_title': 'Акции и <span style="color:var(--gold);">скидки</span>',
        'promo1_tag': 'Новое', 'promo1_title': 'Скидка 20% на первую покупку', 'promo1_desc': 'Скидка 20% на первую игру для новых покупателей',
        'promo2_tag': 'Бонус', 'promo2_title': 'Бонусные баллы до 25%', 'promo2_desc': 'Возвращайте до 25% баллов с каждой покупки',
        'promo3_tag': 'VIP', 'promo3_title': 'Эксклюзивные скидки для VIP', 'promo3_desc': 'Персональные предложения и повышенные бонусы',

        // VIP
        'vip_breadcrumb': 'VIP',
        'vip_title': 'VIP <span style="color:var(--gold);">подписки</span>',
        'vip_subtitle': 'Выберите уровень подписки и получите эксклюзивные привилегии в нашем магазине игр. Чем выше уровень — тем больше бонусов и скидок.',
        'vip_silver_1': 'Скидка 5% на все игры', 'vip_silver_2': 'Ранний доступ к новинкам',
        'vip_silver_3': 'Бонусные баллы ×1.5', 'vip_silver_4': 'Поддержка в приоритетном порядке',
        'vip_subscribe': 'Подключить Silver',
        'vip_gold_1': 'Скидка 12% на все игры', 'vip_gold_2': 'Бесплатные DLC каждый месяц',
        'vip_gold_3': 'Бонусные баллы ×3', 'vip_gold_4': 'Персональный менеджер',
        'vip_gold_5': 'Эксклюзивные турниры', 'vip_gold_6': 'Доступ к бете игр',
        'vip_subscribe_gold': 'Подключить Gold',
        'vip_platinum_1': 'Скидка 20% на все игры', 'vip_platinum_2': 'Бесплатные игры каждый месяц',
        'vip_platinum_3': 'Бонусные баллы ×5', 'vip_platinum_4': 'Индивидуальные бонусы',
        'vip_platinum_5': 'Приглашения на мероприятия', 'vip_platinum_6': 'Персональный консьерж 24/7',
        'vip_platinum_7': 'Ранний доступ ко всем релизам',
        'vip_subscribe_platinum': 'Подключить Platinum',

        // Партнёры
        'affiliate_breadcrumb': 'Партнёры',
        'affiliate_title': 'Зарабатывайте с <span class="gold">Crown</span>',
        'affiliate_subtitle': 'Приглашайте друзей и получайте до 30% от их выигрышей навсегда!',
        'affiliate_invited': 'Приглашено', 'affiliate_active': 'Активных', 'affiliate_earned': 'Заработано',
        'affiliate_feature1': 'Мгновенные выплаты', 'affiliate_feature1_desc': 'Деньги начисляются сразу',
        'affiliate_feature2': 'Статистика', 'affiliate_feature2_desc': 'Отслеживайте прогресс',
        'affiliate_feature3': 'VIP-статус', 'affiliate_feature3_desc': 'Эксклюзивные бонусы',
        'affiliate_share': 'Поделиться ссылкой',

        // Профиль
        'profile_breadcrumb': 'Профиль', 'profile_name': 'Игрок', 'profile_level': 'Уровень 12',
        'profile_online': 'В сети', 'profile_online_dot': 'В сети',
        'profile_overview': 'Обзор', 'profile_country': 'Страна', 'profile_country_val': '🇷🇺 Россия',
        'profile_reg': 'Регистрация', 'profile_reg_val': '15 марта 2024',
        'profile_steam_level': 'Уровень Steam', 'profile_time': 'Время в играх', 'profile_hours': '342 ч',
        'profile_library': 'Библиотека', 'profile_games': 'игр', 'profile_ach_count': 'достижений', 'profile_done': 'пройдено',
        'profile_friends': 'Друзья', 'profile_badges': 'Достижения', 'profile_ach_65': '65% из 108 достижений',
        'tab_activity': 'Активность', 'tab_library': 'Библиотека', 'tab_badges': 'Достижения', 'tab_settings': 'Настройки',
        'act1': 'Играл в <strong>Counter-Strike 2</strong>', 'act1_time': 'сегодня, 14:32',
        'act2': 'Получено достижение в <strong>Dota 2</strong>', 'act2_time': 'сегодня, 12:15',
        'act3': 'Куплена игра <strong>Elden Ring</strong>', 'act3_time': 'вчера, 21:40',
        'stats_title': '📊 Статистика игрока', 'stat_total': 'Всего игр', 'stat_done': 'Пройдено',
        'stat_ach': 'Достижения', 'stat_hours': 'В играх',
        'label_name': 'Имя', 'label_email': 'Email', 'label_lang': 'Язык',
        'save_settings': 'Сохранить настройки',

        // О нас
        'about_breadcrumb': 'О нас',
        'about_title': 'Королевский <span style="color:var(--gold);">статус</span>',
        'about_p1': '<strong>Crown Games</strong> — это премиальный интернет-магазин игр, созданный для тех, кто ценит качество, азарт и безупречный сервис. Мы объединили более 550 топовых игр со всего мира в одном месте.',
        'about_p2': 'Наша миссия — подарить вам незабываемые эмоции и атмосферу высшего статуса. Мы заботимся о каждом игроке и гарантируем честность, безопасность и мгновенные выплаты.',
        'about_p3': '<strong>Присоединяйтесь к королевской игре!</strong>',
        'about_img_sub': 'Crown Games — символ статуса',
        'about_hist_title': 'Наша <span style="color:var(--gold);">история</span>',
        'about_h1': '<strong>2020</strong> — Crown Games начал путь как небольшая команда энтузиастов с идеей создать идеальную игровую платформу.',
        'about_h2': '<strong>2022</strong> — мы достигли отметки в 100 000 игроков и расширили каталог до 300 игр от ведущих студий.',
        'about_h3': '<strong>2024</strong> — обновлённая платформа с мгновенными выплатами, VIP-программой и поддержкой 24/7.',
        'about_h4': '<strong>2025</strong> — более 550 игр, миллионы сыгранных раундов и тысячи довольных игроков по всему миру.',
        'about_today': 'Сегодня Crown Games — это не просто магазин игр, а целая экосистема для любителей азартных игр. Мы продолжаем развиваться, добавляем новые игры и улучшаем сервис каждый день.',
        'about_values_label': '<strong>Наши ценности:</strong>',
        'about_v1': 'Честность и прозрачность', 'about_v2': 'Безопасность на каждом уровне',
        'about_v3': 'Индивидуальный подход к каждому игроку', 'about_v4': 'Постоянное развитие и инновации',
        'about_values_title': 'Наши <span style="color:var(--gold);">ценности</span>',
        'value_security': 'Безопасность', 'value_security_desc': 'Современная защита данных',
        'value_speed': 'Скорость', 'value_speed_desc': 'Мгновенные выплаты',
        'value_choice': 'Выбор', 'value_choice_desc': '550+ игр от топ-провайдеров',
        'contact_title': 'Свяжитесь <span class="gold">с нами</span>',
        'contact_email': 'Email', 'contact_phone': 'Телефон', 'contact_chat': 'Live-чат', 'contact_chat_val': 'Онлайн 24/7',
        'contact_form_title': 'Написать нам', 'contact_name': 'Ваше имя', 'contact_msg': 'Сообщение',
        'contact_msg_hint': '(макс. 500 символов)', 'contact_msg_ph': 'Ваше сообщение...', 'contact_send': 'Отправить',

        // Футер
        'footer_desc': 'Премиальный интернет-магазин игр для настоящих геймеров. Играйте с королевским стилем.',
        'footer_menu': 'Меню', 'footer_info': 'Информация', 'footer_social': 'Соцсети',
        'footer_policy': 'Политика', 'footer_terms': 'Условия',
        'footer_copyright': '© 2025 Crown Games. Все права защищены.',
        'footer_contacts': 'Контакты',

        // Модальные окна
        'auth_login_tab': 'Войти', 'auth_register_tab': 'Зарегистрироваться',
        'login_title': 'Вход', 'login_sub': 'Войдите в свой аккаунт, чтобы продолжить',
        'label_password': 'Пароль', 'btn_continue': 'Продолжить →',
        'code_label': 'Код из письма', 'code_ph': '6-значный код',
        'resend_code': 'Отправить код повторно', 'btn_login': 'Войти',
        'register_title': 'Регистрация', 'register_sub': 'Создайте аккаунт и получите бонус 100% на первый депозит',
        'label_name_input': 'Имя', 'btn_register': 'Зарегистрироваться',
        'steam_help_title': 'Как узнать логин <span class="gold">Steam?</span>',
        'steam_help_text': 'Следуйте простой инструкции, чтобы найти свой логин Steam:',
        'steam_help_1': 'Откройте приложение Steam или сайт <strong>store.steampowered.com</strong>.',
        'steam_help_2': 'Войдите в свой аккаунт.', 'steam_help_3': 'Нажмите на свой логин в правом верхнем углу.',
        'steam_help_4': 'В выпадающем меню выберите «О моём аккаунте».',
        'steam_help_5': 'Ваш логин отображается в верхней части страницы.',
        'steam_help_6': 'Скопируйте логин и вставьте в поле ввода.',
        'steam_help_example': '🖼️ Пример: ваш логин указан в шапке профиля Steam',
        'steam_help_gotit': 'Понятно',
        'buy_added': 'Товар добавлен в корзину', 'buy_cart': 'Перейти в корзину', 'buy_continue': 'Продолжить покупки',
        'card_title': 'Оплата <span class="gold">картой</span>',
        'card_secure': 'Защищённое соединение (SSL) • 3-D Secure',
        'card_number': 'Номер карты', 'card_number_ph': '0000 0000 0000 0000',
        'card_expiry': 'Срок действия', 'card_expiry_ph': 'ММ/ГГ', 'card_cvv': 'CVV/CVC', 'card_cvv_ph': '•••',
        'card_holder': 'Держатель карты', 'card_holder_ph': 'IVAN IVANOV',
        'card_save': 'Сохранить карту для следующих платежей',
        'card_secure_notice': '🔒 Ваши данные защищены. Платежи проходят через PCI DSS сертифицированный шлюз.',
        'card_sum': 'Сумма к оплате:', 'card_pay': 'Оплатить',
        'card_agree': 'Нажимая «Оплатить», вы соглашаетесь с условиями оплаты',
        'qr_title': 'Оплата через <span class="gold">СБП</span>',
        'qr_scan': 'Отсканируйте QR-код в приложении банка',
        'qr_expires': 'Срок действия кода:', 'qr_paid': 'Я оплатил', 'qr_cancel': 'Отмена',
        'chat_title': '💬 Поддержка', 'chat_greeting': '👋 Здравствуйте! Чем я могу вам помочь?',

        // Календарь
        'cal_badge': 'НОВИНКА',
        'cal_title': 'Ваш личный календарь',
        'cal_subtitle': 'Персонализированный список новых и готовящихся к выходу игр',
        'cal_explore': 'Explore more',

        // Профиль (Steam-стиль)
        'sp_level': 'Уровень',
        'sp_badge_title': 'Выслуга лет',
        'sp_badge_xp': '400 ед. опыта',
        'sp_edit': 'Редактировать профиль',
        'sp_showcase': 'Витрина достижений',
        'sp_ach': 'Достижения',
        'sp_perfect_games': 'Идеальных игр',
        'sp_avg_ach': 'Ср. процент достижений за игру',
        'sp_started': 'Запущенные игры',
        'sp_sessions': 'Сессии',
        'sp_new_games': 'Новые игры',
        'sp_fav_game': 'Любимая игра',
        'sp_hours_played': 'Часов сыграно',
        'sp_ach_count': 'Достижений',
        'sp_ach_progress': 'Достижения 57 из 57',
        'sp_review': '👍 Обзор 1',
        'sp_recent_activity': 'Недавняя активность',
        'sp_recent_hours': '31,3 ч. за последние 2 недели',
        'sp_total_hours': '623 ч. всего',
        'sp_last_launch': 'последний запуск {DATE}',
        'sp_ach_recent': 'Достижения 13 из 64',
        'sp_recent_links': 'Все недавно запущенные | Список желаемого | Обзоры',
        'sp_comments': 'Комментарии',
        'sp_subscribe': 'Подписаться ({N})',
        'sp_online': 'В сети',
        'sp_badges': 'Значки 13',
        'sp_games': 'Игры',
        'sp_inventory': 'Инвентарь',
        'sp_screenshots': 'Скриншоты',
        'sp_video': 'Видео',
        'sp_workshop': 'Работы в мастерской',
        'sp_reviews': 'Обзоры',
        'sp_guides': 'Руководства',
        'sp_artwork': 'Иллюстрации',
        'sp_friends': 'Друзья 18',
        'sp_online_now': 'В сети',
        'sp_online_days': 'В сети: {N} дн. назад',

        // Библиотека
        'lib_select': 'Игры и Программы',
        'lib_search_ph': 'Поиск по библиотеке...',
        'lib_whats_new': 'Что нового',
        'lib_recent': 'Недавние игры',
        'lib_suggest': 'Во что поиграть?',
        'lib_suggest_sub': 'В эти игры вы ещё не играли, но они нравятся похожим на вас игрокам',
        'lib_all_games': 'Все игры ',
        'lib_sort': 'СОРТИРОВКА',
        'lib_asc': 'По алфавиту',
        'lib_desc': 'Обратный',

        // Кнопка темы
        'theme_toggle_title': 'Тёмная/светлая тема', 'theme_customize_title': 'Сменить тему',
    },
    en: {
        // Navigation
        'nav_home': 'Home', 'nav_games': 'Games', 'nav_library': 'Library', 'nav_vip': 'VIP', 'nav_blog': 'Blog',
        'nav_affiliate': 'Affiliate', 'nav_profile': 'Profile', 'nav_about': 'About', 'nav_contacts': 'Contacts',
        'auth_login': 'Login', 'auth_register': 'Register',

        // Breadcrumbs
        'bread_home': 'Home', 'bread_games': 'Games', 'bread_promo': 'Promotions', 'bread_vip': 'VIP',
        'bread_affiliate': 'Affiliate', 'bread_about': 'About', 'bread_blog': 'Blog', 'bread_profile': 'Profile',

        // Banners
        'pwa_install': '— install the app', 'pwa_desc': 'Quick access, push notifications and offline mode',
        'pwa_btn': 'Install',
        'cookie_text': '🍪 We use cookies to improve your experience. By continuing to use the site, you agree to our privacy policy.',
        'cookie_decline': 'Decline', 'cookie_accept': 'Accept',
        'notif_text': '🔔 Enable notifications so you don\'t miss winnings and new bonuses!',
        'notif_allow': 'Allow', 'notif_deny': 'Not now',
        'voice_listening': '🎤 Listening...',
        'theme_customizer': 'Theme settings',
        'theme_gold': 'Gold', 'theme_platinum': 'Platinum', 'theme_ruby': 'Ruby', 'theme_sapphire': 'Sapphire',
        'loader_sub': 'Loading the gaming universe...',
        'toast_title': 'Notification', 'toast_text': 'Notification text',

        // Hero
        'hero_badge': '✦ Premium Game Portal',
        'hero_title1': 'The royal game',
        'hero_title2': 'begins here',
        'hero_desc': 'Immerse yourself in a world of luxury and excitement. Only the best games, exclusive bonuses and an atmosphere of the highest status.',
        'hero_play': 'Play Now', 'hero_promo': 'Promotions',

        // Steam top-up
        'topup_title': 'Top up Steam balance',
        'topup_subtitle': 'Instant Steam wallet top-up',
        'topup_refills': 'refills',
        'region_ru': 'Russia', 'region_kz': 'Kazakhstan', 'region_sbp': 'SBP',
        'discount_current': 'Current discount: <b>-2%</b>',
        'topup_login_label': 'Account login', 'topup_login_hint': 'How to find login?',
        'topup_login_ph': 'Enter your login',
        'topup_amount_label': 'Top-up amount', 'topup_amount_prefix': 'You get',
        'fee_progress_text': 'Another 1000 ₽ to reduce commission', 'fee_commission': 'Including commission ~7.4%',
        'quick_sum_label': 'Quick amount selection',

        // Payment
        'pay_header': 'Payment <span class="gold">method</span>', 'pay_subtitle': 'Choose a convenient method',
        'pay_card': 'Card', 'pay_sbp': 'SBP',
        'pay_sum_amount': 'Top-up amount', 'pay_sum_fee': 'Service commission', 'pay_sum_total': 'Total to pay',
        'pay_promo_label': 'Promo code', 'pay_promo_ph': 'Enter promo code (if any)',
        'pay_warning': '⚠️ For successful payment, we recommend disabling VPN and refreshing the page',
        'pay_submit': 'Pay',
        'pay_agree_text': 'By clicking «Pay», you agree to the service agreement',
        'pay_legal_rules': 'I have read the payment rules, refund terms and personal data processing',

        // Top games and news
        'top_title': 'Top <span class="gold">games</span>', 'top_viewall': 'View all →',
        'news_title': 'Blog & <span class="gold">news</span>', 'news_tag_new': 'New',
        'readmore': 'Read more →',
        'news1_title': 'Cyberpunk 2077: major graphics update',
        'news1_text': 'Ray tracing and new performance settings made Night City even more beautiful. The developers released a major patch that adds DLSS 4 support, improved reflections and optimization for new-generation graphics cards.',
        'news2_tag': 'Esports',
        'news2_title': 'Elden Ring: secrets and guide to hard bosses',
        'news2_text': 'How to beat the toughest bosses of the Lands Between — proven builds and strategies. In this guide we collected the best tips from professional players: which weapons and spells to use against each boss.',
        'news3_tag': 'Strategies',
        'news3_title': 'Dota 2: 2025 meta and best heroes',
        'news3_text': 'Analysis of the current meta, the strongest heroes of the patch and tips for climbing rank. We analyzed high-rank match statistics and prepared a list of the most effective heroes for each position.',
        'news4_tag': 'Guide',
        'news4_title': 'Stardew Valley: best farming strategies',
        'news4_text': 'How to get rich fast, which crops are more profitable and secrets of communicating with villagers. In this detailed guide we will tell you about the most profitable crops for each season.',
        'news5_tag': 'Review',
        'news5_title': 'Red Dead Redemption 2: why it\'s a masterpiece',
        'news5_text': 'Analysis of the open world, story and gameplay of the most atmospheric game of recent years. Red Dead Redemption 2 continues to hold the bar as the best game in the western genre.',
        'news6_tag': 'Tips',
        'news6_title': "Baldur's Gate 3: character creation guide",
        'news6_text': 'The best classes, races and builds for beginners and experienced players. Character creation in Baldur\'s Gate 3 is one of the most important stages of the game.',
        'guide_badge': '✦ Guide of the week',
        'guide_title': 'How to build the perfect <span class="gold">gaming PC</span> in 2025',
        'guide_text': 'Processor, graphics card, memory and cooling — a detailed breakdown of every component for building a PC for any budget.',
        'guide_l1': 'Graphics card — the core of performance', 'guide_l2': 'Processor for online games and streaming',
        'guide_l3': '32 GB RAM — the new standard', 'guide_l4': 'Fast NVMe drive for instant loading',
        'guide_btn': 'Read full guide',

        // Game catalog
        'games_breadcrumb': 'Games',
        'catalog_title': 'Game <span style="color:var(--gold);">catalog</span>',
        'search_ph': 'Search games...',
        'filter_all': 'All', 'filter_shooter': 'Shooters', 'filter_strategy': 'Strategies', 'filter_rpg': 'RPG',
        'filter_survival': 'Survival', 'filter_sandbox': 'Sandbox', 'filter_sport': 'Sports',
        'filter_indie': 'Indie', 'filter_horror': 'Horror',
        'cat_shooter': 'Shooter', 'cat_strategy': 'Strategy', 'cat_rpg': 'RPG', 'cat_survival': 'Survival',
        'cat_sandbox': 'Sandbox', 'cat_sport': 'Sports', 'cat_indie': 'Indie', 'cat_horror': 'Horror',
        'desc_shooter': 'A dynamic shooter with exciting gunfights, competitive multiplayer and great weapon feedback.',
        'desc_strategy': 'A deep strategy game requiring careful planning, resource management and tactical thinking.',
        'desc_rpg': 'A large-scale RPG with a detailed world, leveling system and many story branches.',
        'desc_survival': 'An intense survival horror with exploration of a dangerous world, crafting and the fight to survive.',
        'desc_sandbox': 'An open sandbox with endless possibilities for creativity and experimentation.',
        'desc_sport': 'A realistic sports simulator with accurate physics and an exciting competitive mode.',
        'desc_indie': 'An original indie game with a unique artistic style and unusual mechanics.',
        'desc_horror': 'An atmospheric horror with intense gameplay, jump scares and deep immersion in terror.',
        'desc_default': 'An engaging game with unique gameplay and deep world-building.',
        'gd_specs': 'Specifications', 'gd_features': 'Features', 'gd_languages': 'Languages',
        'gd_sysreq': 'System Requirements', 'gd_minreq': 'Minimum:', 'gd_recreq': 'Recommended:',
        'gd_genre': 'Genre', 'gd_dev': 'Developer', 'gd_pub': 'Publisher', 'gd_release': 'Release date', 'gd_age': 'Age', 'gd_online': 'Online',
        'gd_reviews': 'reviews', 'gd_buy': 'Buy', 'gd_close': '✕ Close',
        'gd_online_multi': '50,000+ players', 'gd_online_single': 'Singleplayer',
        'gd_lang_list': 'Russian, English, Deutsch, Français, Español, 中文, 日本語, Português',
        'gd_minreq_text': 'OS: Windows 10 64-bit · CPU: Intel Core i3-8100 / AMD Ryzen 3 1200 · RAM: 8 GB · GPU: NVIDIA GTX 960 / AMD R9 380 · DirectX 11 · 30 GB storage',
        'gd_recreq_text': 'OS: Windows 11 64-bit · CPU: Intel Core i7-9700K / AMD Ryzen 5 3600 · RAM: 16 GB · GPU: NVIDIA RTX 2060 / AMD RX 5700 · DirectX 12 · 30 GB SSD',

        // Promotions
        'promo_breadcrumb': 'Promotions',
        'promo_title': 'Promotions & <span style="color:var(--gold);">discounts</span>',
        'promo1_tag': 'New', 'promo1_title': '20% off your first purchase', 'promo1_desc': '20% off your first game for new customers',
        'promo2_tag': 'Bonus', 'promo2_title': 'Bonus points up to 25%', 'promo2_desc': 'Get up to 25% cashback points with every purchase',
        'promo3_tag': 'VIP', 'promo3_title': 'Exclusive discounts for VIP', 'promo3_desc': 'Personal offers and increased bonuses',

        // VIP
        'vip_breadcrumb': 'VIP',
        'vip_title': 'VIP <span style="color:var(--gold);">subscriptions</span>',
        'vip_subtitle': 'Choose a subscription level and get exclusive privileges in our game store. The higher the level — the more bonuses and discounts.',
        'vip_silver_1': '5% off all games', 'vip_silver_2': 'Early access to new releases',
        'vip_silver_3': 'Bonus points ×1.5', 'vip_silver_4': 'Priority support',
        'vip_subscribe': 'Subscribe Silver',
        'vip_gold_1': '12% off all games', 'vip_gold_2': 'Free DLC every month',
        'vip_gold_3': 'Bonus points ×3', 'vip_gold_4': 'Personal manager',
        'vip_gold_5': 'Exclusive tournaments', 'vip_gold_6': 'Beta access',
        'vip_subscribe_gold': 'Subscribe Gold',
        'vip_platinum_1': '20% off all games', 'vip_platinum_2': 'Free games every month',
        'vip_platinum_3': 'Bonus points ×5', 'vip_platinum_4': 'Individual bonuses',
        'vip_platinum_5': 'Event invitations', 'vip_platinum_6': 'Personal concierge 24/7',
        'vip_platinum_7': 'Early access to all releases',
        'vip_subscribe_platinum': 'Subscribe Platinum',

        // Affiliate
        'affiliate_breadcrumb': 'Affiliate',
        'affiliate_title': 'Earn with <span class="gold">Crown</span>',
        'affiliate_subtitle': 'Invite friends and get up to 30% of their winnings forever!',
        'affiliate_invited': 'Invited', 'affiliate_active': 'Active', 'affiliate_earned': 'Earned',
        'affiliate_feature1': 'Instant payouts', 'affiliate_feature1_desc': 'Money is credited immediately',
        'affiliate_feature2': 'Statistics', 'affiliate_feature2_desc': 'Track your progress',
        'affiliate_feature3': 'VIP status', 'affiliate_feature3_desc': 'Exclusive bonuses',
        'affiliate_share': 'Share link',

        // Profile
        'profile_breadcrumb': 'Profile', 'profile_name': 'Player', 'profile_level': 'Level 12',
        'profile_online': 'Online', 'profile_online_dot': 'Online',
        'profile_overview': 'Overview', 'profile_country': 'Country', 'profile_country_val': '🇷🇺 Russia',
        'profile_reg': 'Registered', 'profile_reg_val': 'March 15, 2024',
        'profile_steam_level': 'Steam Level', 'profile_time': 'Time in games', 'profile_hours': '342 h',
        'profile_library': 'Library', 'profile_games': 'games', 'profile_ach_count': 'achievements', 'profile_done': 'completed',
        'profile_friends': 'Friends', 'profile_badges': 'Achievements', 'profile_ach_65': '65% of 108 achievements',
        'tab_activity': 'Activity', 'tab_library': 'Library', 'tab_badges': 'Achievements', 'tab_settings': 'Settings',
        'act1': 'Played <strong>Counter-Strike 2</strong>', 'act1_time': 'today, 14:32',
        'act2': 'Earned achievement in <strong>Dota 2</strong>', 'act2_time': 'today, 12:15',
        'act3': 'Bought game <strong>Elden Ring</strong>', 'act3_time': 'yesterday, 21:40',
        'stats_title': '📊 Player statistics', 'stat_total': 'Total games', 'stat_done': 'Completed',
        'stat_ach': 'Achievements', 'stat_hours': 'In games',
        'label_name': 'Name', 'label_email': 'Email', 'label_lang': 'Language',
        'save_settings': 'Save settings',

        // About
        'about_breadcrumb': 'About',
        'about_title': 'Royal <span style="color:var(--gold);">status</span>',
        'about_p1': '<strong>Crown Games</strong> is a premium online game store created for those who value quality, excitement and impeccable service. We brought together more than 550 top games from around the world in one place.',
        'about_p2': 'Our mission is to give you unforgettable emotions and an atmosphere of the highest status. We take care of every player and guarantee honesty, security and instant payouts.',
        'about_p3': '<strong>Join the royal game!</strong>',
        'about_img_sub': 'Crown Games — a symbol of status',
        'about_hist_title': 'Our <span style="color:var(--gold);">history</span>',
        'about_h1': '<strong>2020</strong> — Crown Games started as a small team of enthusiasts with the idea of creating the perfect gaming platform.',
        'about_h2': '<strong>2022</strong> — we reached 100,000 players and expanded the catalog to 300 games from leading studios.',
        'about_h3': '<strong>2024</strong> — an updated platform with instant payouts, a VIP program and 24/7 support.',
        'about_h4': '<strong>2025</strong> — more than 550 games, millions of rounds played and thousands of satisfied players around the world.',
        'about_today': 'Today Crown Games is not just a game store, but a whole ecosystem for gambling lovers. We continue to grow, add new games and improve the service every day.',
        'about_values_label': '<strong>Our values:</strong>',
        'about_v1': 'Honesty and transparency', 'about_v2': 'Security at every level',
        'about_v3': 'Individual approach to every player', 'about_v4': 'Constant development and innovation',
        'about_values_title': 'Our <span style="color:var(--gold);">values</span>',
        'value_security': 'Security', 'value_security_desc': 'Modern data protection',
        'value_speed': 'Speed', 'value_speed_desc': 'Instant payouts',
        'value_choice': 'Choice', 'value_choice_desc': '550+ games from top providers',
        'contact_title': 'Contact <span class="gold">us</span>',
        'contact_email': 'Email', 'contact_phone': 'Phone', 'contact_chat': 'Live chat', 'contact_chat_val': 'Online 24/7',
        'contact_form_title': 'Write to us', 'contact_name': 'Your name', 'contact_msg': 'Message',
        'contact_msg_hint': '(max. 500 characters)', 'contact_msg_ph': 'Your message...', 'contact_send': 'Send',

        // Footer
        'footer_desc': 'Premium online game store for true gamers. Play with royal style.',
        'footer_menu': 'Menu', 'footer_info': 'Information', 'footer_social': 'Social',
        'footer_policy': 'Privacy Policy', 'footer_terms': 'Terms',
        'footer_copyright': '© 2025 Crown Games. All rights reserved.',
        'footer_contacts': 'Contacts',

        // Modals
        'auth_login_tab': 'Login', 'auth_register_tab': 'Register',
        'login_title': 'Login', 'login_sub': 'Log in to your account to continue',
        'label_password': 'Password', 'btn_continue': 'Continue →',
        'code_label': 'Code from email', 'code_ph': '6-digit code',
        'resend_code': 'Resend code', 'btn_login': 'Login',
        'register_title': 'Registration', 'register_sub': 'Create an account and get a 100% bonus on your first deposit',
        'label_name_input': 'Name', 'btn_register': 'Register',
        'steam_help_title': 'How to find your <span class="gold">Steam</span> login?',
        'steam_help_text': 'Follow the simple instructions to find your Steam login:',
        'steam_help_1': 'Open the Steam app or website <strong>store.steampowered.com</strong>.',
        'steam_help_2': 'Log in to your account.', 'steam_help_3': 'Click on your login in the top right corner.',
        'steam_help_4': 'In the dropdown menu, select «About my account».',
        'steam_help_5': 'Your login is displayed at the top of the page.',
        'steam_help_6': 'Copy the login and paste it into the input field.',
        'steam_help_example': '🖼️ Example: your login is listed in the Steam profile header',
        'steam_help_gotit': 'Got it',
        'buy_added': 'Item added to cart', 'buy_cart': 'Go to cart', 'buy_continue': 'Continue shopping',
        'card_title': 'Card <span class="gold">payment</span>',
        'card_secure': 'Secure connection (SSL) • 3-D Secure',
        'card_number': 'Card number', 'card_number_ph': '0000 0000 0000 0000',
        'card_expiry': 'Expiry date', 'card_expiry_ph': 'MM/YY', 'card_cvv': 'CVV/CVC', 'card_cvv_ph': '•••',
        'card_holder': 'Card holder', 'card_holder_ph': 'IVAN IVANOV',
        'card_save': 'Save card for future payments',
        'card_secure_notice': '🔒 Your data is protected. Payments go through a PCI DSS certified gateway.',
        'card_sum': 'Amount to pay:', 'card_pay': 'Pay',
        'card_agree': 'By clicking «Pay», you agree to the payment terms',
        'qr_title': 'SBP <span class="gold">payment</span>',
        'qr_scan': 'Scan the QR code in your bank app',
        'qr_expires': 'Code expires in:', 'qr_paid': 'I paid', 'qr_cancel': 'Cancel',
        'chat_title': '💬 Support', 'chat_greeting': '👋 Hello! How can I help you?',

        // Calendar
        'cal_badge': 'NEW',
        'cal_title': 'Your personal calendar',
        'cal_subtitle': 'Personalized list of new and upcoming games',
        'cal_explore': 'Explore more',

        // Profile (Steam-style)
        'sp_level': 'Level',
        'sp_badge_title': 'Years of service',
        'sp_badge_xp': '400 XP',
        'sp_edit': 'Edit profile',
        'sp_showcase': 'Achievement showcase',
        'sp_ach': 'Achievements',
        'sp_perfect_games': 'Perfect games',
        'sp_avg_ach': 'Average achievement completion',
        'sp_started': 'Games launched',
        'sp_sessions': 'Sessions',
        'sp_new_games': 'New games',
        'sp_fav_game': 'Favorite game',
        'sp_hours_played': 'Hours played',
        'sp_ach_count': 'Achievements',
        'sp_ach_progress': '57 of 57 achievements',
        'sp_review': '👍 1 review',
        'sp_recent_activity': 'Recent activity',
        'sp_recent_hours': '31.3 h in the last 2 weeks',
        'sp_total_hours': '623 h total',
        'sp_last_launch': 'last launch {DATE}',
        'sp_ach_recent': '13 of 64 achievements',
        'sp_recent_links': 'All recently launched | Wishlist | Reviews',
        'sp_comments': 'Comments',
        'sp_subscribe': 'Subscribe ({N})',
        'sp_online': 'Online',
        'sp_badges': '13 badges',
        'sp_games': 'Games',
        'sp_inventory': 'Inventory',
        'sp_screenshots': 'Screenshots',
        'sp_video': 'Video',
        'sp_workshop': 'Workshop items',
        'sp_reviews': 'Reviews',
        'sp_guides': 'Guides',
        'sp_artwork': 'Artwork',
        'sp_friends': '18 friends',
        'sp_online_now': 'Online',
        'sp_online_days': 'Online: {N} days ago',

        // Library
        'lib_select': 'Games and Software',
        'lib_search_ph': 'Search the library...',
        'lib_whats_new': 'What\'s new',
        'lib_recent': 'Recent games',
        'lib_suggest': 'What to play?',
        'lib_suggest_sub': 'You haven\'t played these games yet, but players like you enjoy them',
        'lib_all_games': 'All games ',
        'lib_sort': 'SORT BY',
        'lib_asc': 'Alphabetical',
        'lib_desc': 'Reverse',

        // Theme button
        'theme_toggle_title': 'Dark/light theme', 'theme_customize_title': 'Change theme',
    },
    zh: {
        // 导航
        'nav_home': '首页', 'nav_games': '游戏', 'nav_library': '游戏库', 'nav_vip': 'VIP', 'nav_blog': '博客',
        'nav_affiliate': '合作伙伴', 'nav_profile': '个人资料', 'nav_about': '关于我们', 'nav_contacts': '联系方式',
        'auth_login': '登录', 'auth_register': '注册',

        // 面包屑
        'bread_home': '首页', 'bread_games': '游戏', 'bread_promo': '促销', 'bread_vip': 'VIP',
        'bread_affiliate': '合作伙伴', 'bread_about': '关于我们', 'bread_blog': '博客', 'bread_profile': '个人资料',

        // 横幅
        'pwa_install': '— 安装应用', 'pwa_desc': '快速访问、推送通知和离线模式',
        'pwa_btn': '安装',
        'cookie_text': '🍪 我们使用 Cookie 来改善您的体验。继续使用本网站即表示您同意我们的隐私政策。',
        'cookie_decline': '拒绝', 'cookie_accept': '接受',
        'notif_text': '🔔 开启通知，不错过奖金和新优惠！',
        'notif_allow': '允许', 'notif_deny': '稍后',
        'voice_listening': '🎤 正在聆听...',
        'theme_customizer': '主题设置',
        'theme_gold': '金色', 'theme_platinum': '铂金', 'theme_ruby': '红宝石', 'theme_sapphire': '蓝宝石',
        'loader_sub': '正在加载游戏世界...',
        'toast_title': '通知', 'toast_text': '通知内容',

        // 主视觉
        'hero_badge': '✦ 高级游戏门户',
        'hero_title1': '王者游戏',
        'hero_title2': '从这里开始',
        'hero_desc': '沉浸在奢华与刺激的世界中。只有最好的游戏、独家奖励和最高地位的氛围。',
        'hero_play': '立即游戏', 'hero_promo': '促销',

        // Steam 充值
        'topup_title': '充值Steam余额',
        'topup_subtitle': '即时充值Steam钱包',
        'topup_refills': '充值次数',
        'region_ru': '俄罗斯', 'region_kz': '哈萨克斯坦', 'region_sbp': 'SBP',
        'discount_current': '当前折扣: <b>-2%</b>',
        'topup_login_label': '账户登录名', 'topup_login_hint': '如何找到登录名？',
        'topup_login_ph': '请输入您的登录名',
        'topup_amount_label': '充值金额', 'topup_amount_prefix': '您获得',
        'fee_progress_text': '再充 1000 ₽ 以减少手续费', 'fee_commission': '含手续费 ~7.4%',
        'quick_sum_label': '快速选择金额',

        // 支付
        'pay_header': '支付<span class="gold">方式</span>', 'pay_subtitle': '选择便捷的方式',
        'pay_card': '银行卡', 'pay_sbp': 'SBP',
        'pay_sum_amount': '充值金额', 'pay_sum_fee': '服务手续费', 'pay_sum_total': '应付总额',
        'pay_promo_label': '优惠码', 'pay_promo_ph': '输入优惠码（如有）',
        'pay_warning': '⚠️ 为确保支付成功，建议关闭VPN并刷新页面',
        'pay_submit': '支付',
        'pay_agree_text': '点击「支付」即表示您同意服务协议',
        'pay_legal_rules': '我已阅读支付规则、退款条款和个人数据处理说明',

        // 热门游戏和新闻
        'top_title': '热门<span class="gold">游戏</span>', 'top_viewall': '查看全部 →',
        'news_title': '博客 & <span class="gold">新闻</span>', 'news_tag_new': '新游',
        'readmore': '阅读更多 →',
        'news1_title': '《赛博朋克2077》：重大画面更新',
        'news1_text': '光线追踪和新的性能设置让夜之城更加美丽。开发者发布了大型补丁，增加了DLSS 4支持、改进的反射和新一代显卡的优化。',
        'news2_tag': '电竞',
        'news2_title': '《艾尔登法环》：秘密与困难Boss攻略',
        'news2_text': '如何击败交界地最难的Boss——经过验证的配装和策略。本指南汇集了职业玩家的最佳建议：每个Boss使用什么武器和法术。',
        'news3_tag': '策略',
        'news3_title': '《Dota 2》：2025年版本与最佳英雄',
        'news3_text': '分析当前版本、最强英雄和上分建议。我们分析了高分段比赛数据，为每个位置准备了最有效的英雄列表。',
        'news4_tag': '指南',
        'news4_title': '《星露谷物语》：最佳农场策略',
        'news4_text': '如何快速致富、哪些作物更划算以及与村民交流的秘诀。本详细指南将介绍每个季节最赚钱的作物。',
        'news5_tag': '评测',
        'news5_title': '《荒野大镖客2》：为何是杰作',
        'news5_text': '分析近年最具氛围感的游戏的开放世界、剧情和玩法。《荒野大镖客2》继续保持着西部题材最佳游戏的标准。',
        'news6_tag': '技巧',
        'news6_title': '《博德之门3》：角色创建指南',
        'news6_text': '适合新手和老玩家的最佳职业、种族和配装。在《博德之门3》中创建角色是游戏最重要的阶段之一。',
        'guide_badge': '✦ 本周指南',
        'guide_title': '如何在2025年组装完美的<span class="gold">游戏电脑</span>',
        'guide_text': '处理器、显卡、内存和散热——任何预算下组装PC每个组件的详细解析。',
        'guide_l1': '显卡——性能核心', 'guide_l2': '适合网游和直播的处理器',
        'guide_l3': '32GB内存——新标准', 'guide_l4': '快速NVMe硬盘，瞬时加载',
        'guide_btn': '阅读完整指南',

        // 游戏目录
        'games_breadcrumb': '游戏',
        'catalog_title': '游戏<span style="color:var(--gold);">目录</span>',
        'search_ph': '搜索游戏...',
        'filter_all': '全部', 'filter_shooter': '射击', 'filter_strategy': '策略', 'filter_rpg': 'RPG',
        'filter_survival': '生存', 'filter_sandbox': '沙盒', 'filter_sport': '体育',
        'filter_indie': '独立', 'filter_horror': '恐怖',
        'cat_shooter': '射击', 'cat_strategy': '策略', 'cat_rpg': 'RPG', 'cat_survival': '生存',
        'cat_sandbox': '沙盒', 'cat_sport': '体育', 'cat_indie': '独立', 'cat_horror': '恐怖',
        'desc_shooter': '一款动感十足的射击游戏，拥有激动人心的枪战、竞技多人模式和出色的武器手感。',
        'desc_strategy': '一款深度策略游戏，需要深思熟虑的规划、资源管理和战术思维。',
        'desc_rpg': '一款大型RPG，拥有精细的世界、升级系统和众多剧情分支。',
        'desc_survival': '一款紧张的生存恐怖游戏，探索危险世界、制作物品并努力生存。',
        'desc_sandbox': '一个开放的沙盒世界，为创造和实验提供无限可能。',
        'desc_sport': '一款逼真的体育模拟器，拥有精确的物理效果和激动人心的竞技模式。',
        'desc_indie': '一款原创独立游戏，具有独特的艺术风格和非同寻常的机制。',
        'desc_horror': '一款氛围感十足的恐怖游戏，紧张的游戏玩法、惊吓和深度沉浸。',
        'desc_default': '一款玩法独特、世界观深刻的引人入胜的游戏。',
        'gd_specs': '规格', 'gd_features': '特色', 'gd_languages': '语言',
        'gd_sysreq': '系统要求', 'gd_minreq': '最低配置：', 'gd_recreq': '推荐配置：',
        'gd_genre': '类型', 'gd_dev': '开发商', 'gd_pub': '发行商', 'gd_release': '发行日期', 'gd_age': '年龄', 'gd_online': '在线',
        'gd_reviews': '条评价', 'gd_buy': '购买', 'gd_close': '✕ 关闭',
        'gd_online_multi': '50,000+ 玩家', 'gd_online_single': '单人',
        'gd_lang_list': '俄语, English, Deutsch, Français, Español, 中文, 日本語, Português',
        'gd_minreq_text': '系统：Windows 10 64位 · CPU：Intel Core i3-8100 / AMD Ryzen 3 1200 · 内存：8GB · 显卡：NVIDIA GTX 960 / AMD R9 380 · DirectX 11 · 30GB硬盘空间',
        'gd_recreq_text': '系统：Windows 11 64位 · CPU：Intel Core i7-9700K / AMD Ryzen 5 3600 · 内存：16GB · 显卡：NVIDIA RTX 2060 / AMD RX 5700 · DirectX 12 · 30GB SSD',

        // 促销
        'promo_breadcrumb': '促销',
        'promo_title': '促销 & <span style="color:var(--gold);">折扣</span>',
        'promo1_tag': '新', 'promo1_title': '首次购买立减20%', 'promo1_desc': '新客户首款游戏立减20%',
        'promo2_tag': '奖励', 'promo2_title': '最高25%奖励积分', 'promo2_desc': '每次购买最高返还25%积分',
        'promo3_tag': 'VIP', 'promo3_title': 'VIP专属折扣', 'promo3_desc': '个性化优惠和更高奖励',

        // VIP
        'vip_breadcrumb': 'VIP',
        'vip_title': 'VIP<span style="color:var(--gold);">订阅</span>',
        'vip_subtitle': '选择订阅级别，在我们的游戏商店获得独家特权。级别越高 — 奖金和折扣越多。',
        'vip_silver_1': '所有游戏5%折扣', 'vip_silver_2': '抢先体验新游戏',
        'vip_silver_3': '积分×1.5', 'vip_silver_4': '优先支持',
        'vip_subscribe': '订阅 Silver',
        'vip_gold_1': '所有游戏12%折扣', 'vip_gold_2': '每月免费DLC',
        'vip_gold_3': '积分×3', 'vip_gold_4': '个人经理',
        'vip_gold_5': '独家锦标赛', 'vip_gold_6': 'Beta测试资格',
        'vip_subscribe_gold': '订阅 Gold',
        'vip_platinum_1': '所有游戏20%折扣', 'vip_platinum_2': '每月免费游戏',
        'vip_platinum_3': '积分×5', 'vip_platinum_4': '个性化奖金',
        'vip_platinum_5': '活动邀请', 'vip_platinum_6': '24/7个人管家',
        'vip_platinum_7': '所有游戏的抢先体验',
        'vip_subscribe_platinum': '订阅 Platinum',

        // 合作伙伴
        'affiliate_breadcrumb': '合作伙伴',
        'affiliate_title': '与<span class="gold">Crown</span>一起赚钱',
        'affiliate_subtitle': '邀请朋友并永久获得其收益的30%！',
        'affiliate_invited': '已邀请', 'affiliate_active': '活跃', 'affiliate_earned': '已赚取',
        'affiliate_feature1': '即时支付', 'affiliate_feature1_desc': '资金立即到账',
        'affiliate_feature2': '统计', 'affiliate_feature2_desc': '跟踪您的进度',
        'affiliate_feature3': 'VIP身份', 'affiliate_feature3_desc': '独家奖金',
        'affiliate_share': '分享链接',

        // 个人资料
        'profile_breadcrumb': '个人资料', 'profile_name': '玩家', 'profile_level': '12级',
        'profile_online': '在线', 'profile_online_dot': '在线',
        'profile_overview': '概览', 'profile_country': '国家', 'profile_country_val': '🇷🇺 俄罗斯',
        'profile_reg': '注册日期', 'profile_reg_val': '2024年3月15日',
        'profile_steam_level': 'Steam等级', 'profile_time': '游戏时间', 'profile_hours': '342小时',
        'profile_library': '游戏库', 'profile_games': '游戏', 'profile_ach_count': '成就', 'profile_done': '已完成',
        'profile_friends': '好友', 'profile_badges': '成就', 'profile_ach_65': '108个成就的65%',
        'tab_activity': '动态', 'tab_library': '游戏库', 'tab_badges': '成就', 'tab_settings': '设置',
        'act1': '游玩了 <strong>《反恐精英2》</strong>', 'act1_time': '今天, 14:32',
        'act2': '在 <strong>《Dota 2》</strong> 中获得成就', 'act2_time': '今天, 12:15',
        'act3': '购买了 <strong>《艾尔登法环》</strong>', 'act3_time': '昨天, 21:40',
        'stats_title': '📊 玩家统计', 'stat_total': '游戏总数', 'stat_done': '已完成',
        'stat_ach': '成就', 'stat_hours': '游戏时长',
        'label_name': '姓名', 'label_email': '邮箱', 'label_lang': '语言',
        'save_settings': '保存设置',

        // 关于我们
        'about_breadcrumb': '关于我们',
        'about_title': '皇家<span style="color:var(--gold);">地位</span>',
        'about_p1': '<strong>Crown Games</strong> 是一家高级在线游戏商店，专为重视品质、刺激和完美服务的人打造。我们将全球550多款顶级游戏汇集在一处。',
        'about_p2': '我们的使命是带给您难忘的情感和最高地位的氛围。我们关心每一位玩家，保证诚信、安全和即时支付。',
        'about_p3': '<strong>加入王者游戏！</strong>',
        'about_img_sub': 'Crown Games — 地位的象征',
        'about_hist_title': '我们的<span style="color:var(--gold);">历史</span>',
        'about_h1': '<strong>2020年</strong> — Crown Games 作为一个小型爱好者团队起步，立志打造完美的游戏平台。',
        'about_h2': '<strong>2022年</strong> — 我们达到10万玩家，并将目录扩展到300款来自顶级工作室的游戏。',
        'about_h3': '<strong>2024年</strong> — 更新后的平台，支持即时支付、VIP计划和24/7支持。',
        'about_h4': '<strong>2025年</strong> — 超过550款游戏、数百万场游戏和全球数千名满意的玩家。',
        'about_today': '今天，Crown Games 不仅仅是一个游戏商店，更是博彩爱好者的完整生态系统。我们不断发展、添加新游戏并每天改进服务。',
        'about_values_label': '<strong>我们的价值观：</strong>',
        'about_v1': '诚信与透明', 'about_v2': '全方位安全',
        'about_v3': '对每位玩家的个性化服务', 'about_v4': '持续发展与创新',
        'about_values_title': '我们的<span style="color:var(--gold);">价值观</span>',
        'value_security': '安全', 'value_security_desc': '现代数据保护',
        'value_speed': '速度', 'value_speed_desc': '即时支付',
        'value_choice': '选择', 'value_choice_desc': '来自顶级供应商的550+款游戏',
        'contact_title': '联系<span class="gold">我们</span>',
        'contact_email': '邮箱', 'contact_phone': '电话', 'contact_chat': '在线客服', 'contact_chat_val': '24/7在线',
        'contact_form_title': '给我们留言', 'contact_name': '您的姓名', 'contact_msg': '留言',
        'contact_msg_hint': '（最多500个字符）', 'contact_msg_ph': '您的留言...', 'contact_send': '发送',

        // 页脚
        'footer_desc': '为真正的游戏玩家提供的高级在线游戏商店。皇家风格的游戏体验。',
        'footer_menu': '菜单', 'footer_info': '信息', 'footer_social': '社交',
        'footer_policy': '隐私政策', 'footer_terms': '条款',
        'footer_copyright': '© 2025 Crown Games. 保留所有权利。',
        'footer_contacts': '联系方式',

        // 弹窗
        'auth_login_tab': '登录', 'auth_register_tab': '注册',
        'login_title': '登录', 'login_sub': '登录您的账户以继续',
        'label_password': '密码', 'btn_continue': '继续 →',
        'code_label': '邮件中的验证码', 'code_ph': '6位验证码',
        'resend_code': '重新发送验证码', 'btn_login': '登录',
        'register_title': '注册', 'register_sub': '创建账户并在首次充值获得100%奖励',
        'label_name_input': '姓名', 'btn_register': '注册',
        'steam_help_title': '如何找到您的<span class="gold">Steam</span>登录名？',
        'steam_help_text': '按照简单说明查找您的Steam登录名：',
        'steam_help_1': '打开Steam应用或网站 <strong>store.steampowered.com</strong>。',
        'steam_help_2': '登录您的账户。', 'steam_help_3': '点击右上角的登录名。',
        'steam_help_4': '在下拉菜单中选择「关于我的账户」。',
        'steam_help_5': '您的登录名显示在页面顶部。',
        'steam_help_6': '复制登录名并粘贴到输入框中。',
        'steam_help_example': '🖼️ 示例：您的登录名显示在Steam个人资料顶部',
        'steam_help_gotit': '明白了',
        'buy_added': '商品已添加到购物车', 'buy_cart': '前往购物车', 'buy_continue': '继续购物',
        'card_title': '银行卡<span class="gold">支付</span>',
        'card_secure': '安全连接（SSL）• 3-D Secure',
        'card_number': '卡号', 'card_number_ph': '0000 0000 0000 0000',
        'card_expiry': '有效期', 'card_expiry_ph': 'MM/YY', 'card_cvv': 'CVV/CVC', 'card_cvv_ph': '•••',
        'card_holder': '持卡人姓名', 'card_holder_ph': 'IVAN IVANOV',
        'card_save': '保存卡片用于以后支付',
        'card_secure_notice': '🔒 您的数据受到保护。支付通过PCI DSS认证网关进行。',
        'card_sum': '应付金额：', 'card_pay': '支付',
        'card_agree': '点击「支付」即表示您同意支付条款',
        'qr_title': 'SBP<span class="gold">支付</span>',
        'qr_scan': '在银行应用中扫描二维码',
        'qr_expires': '验证码有效期：', 'qr_paid': '我已支付', 'qr_cancel': '取消',
        'chat_title': '💬 支持', 'chat_greeting': '👋 您好！我能帮您什么？',

        // 日历
        'cal_badge': '新品',
        'cal_title': '您的个人日历',
        'cal_subtitle': '个性化新游戏和即将推出游戏的列表',
        'cal_explore': '探索更多',

        // 个人资料 (Steam风格)
        'sp_level': '等级',
        'sp_badge_title': '工龄',
        'sp_badge_xp': '400经验值',
        'sp_edit': '编辑个人资料',
        'sp_showcase': '成就展示',
        'sp_ach': '成就',
        'sp_perfect_games': '完美游戏',
        'sp_avg_ach': '平均成就完成率',
        'sp_started': '已启动游戏',
        'sp_sessions': '游戏会话',
        'sp_new_games': '新游戏',
        'sp_fav_game': '最喜爱的游戏',
        'sp_hours_played': '游戏时长',
        'sp_ach_count': '成就',
        'sp_ach_progress': '57/57个成就',
        'sp_review': '👍 1条评测',
        'sp_recent_activity': '最近活动',
        'sp_recent_hours': '最近2周 31.3小时',
        'sp_total_hours': '共623小时',
        'sp_last_launch': '最近启动 {DATE}',
        'sp_ach_recent': '64个成就中的13个',
        'sp_recent_links': '所有最近启动 | 愿望单 | 评测',
        'sp_comments': '评论',
        'sp_subscribe': '订阅 ({N})',
        'sp_online': '在线',
        'sp_badges': '13个徽章',
        'sp_games': '游戏',
        'sp_inventory': '库存',
        'sp_screenshots': '截图',
        'sp_video': '视频',
        'sp_workshop': '创意工坊物品',
        'sp_reviews': '评测',
        'sp_guides': '指南',
        'sp_artwork': '艺术作品',
        'sp_friends': '18个好友',
        'sp_online_now': '在线',
        'sp_online_days': '在线：{N}天前',

        // 游戏库
        'lib_select': '游戏和软件',
        'lib_search_ph': '搜索游戏库...',
        'lib_whats_new': '最新动态',
        'lib_recent': '最近游戏',
        'lib_suggest': '玩什么？',
        'lib_suggest_sub': '您还没有玩过这些游戏，但和您相似的玩家喜欢它们',
        'lib_all_games': '所有游戏 ',
        'lib_sort': '排序',
        'lib_asc': '按字母顺序',
        'lib_desc': '反向',

        // 主题按钮
        'theme_toggle_title': '深色/浅色主题', 'theme_customize_title': '更换主题',
    }
};

function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;
    // 1. Переводим элементы с data-lang-key (старая система, обратная совместимость)
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });
    // 2. Переводим элементы с data-i18n (новая система)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });
    // 3. Переводим placeholder'ы
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.dataset.i18nPh;
        if (t[key] !== undefined) {
            el.placeholder = t[key].replace(/<[^>]*>/g, '');
        }
    });
    // 4. Переводим title/aria-label атрибуты
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (t[key] !== undefined) {
            el.title = t[key].replace(/<[^>]*>/g, '');
            el.setAttribute('aria-label', t[key].replace(/<[^>]*>/g, ''));
        }
    });
    // 5. Подсветка активного языка
    document.querySelectorAll('.header-lang-dropdown button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // 6. Обновляем title на кнопках темы
    const themeBtns = document.querySelectorAll('.theme-toggle');
    if (themeBtns.length >= 2) {
        themeBtns[0].title = t['theme_customize_title'] || 'Сменить тему';
        themeBtns[1].title = t['theme_toggle_title'] || 'Тёмная/светлая тема';
    }
}
window.applyTranslations = applyTranslations;

// ================================================================
// ПРОФИЛЬ — СОХРАНЕНИЕ НАСТРОЕК
// ================================================================
function saveSettings() {
    const name = document.getElementById('settingsName').value;
    const email = document.getElementById('settingsEmail').value;
    const lang = document.getElementById('languageSelect').value;
    updateProfileName(name);
    setLanguage(lang);
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
        setLanguage(savedLang);
    }
});

// ================================================================
// ИГРЫ
// ================================================================
function playGame(gameName) {
    // Тихо открываем страницу игры без фейерверков и сообщений
    if (typeof openGameDetail === 'function') {
        openGameDetail(gameName);
    }
}

// ================================================================
function buyGame(gameName) {
    const game = GAMES.find(g => g.name === gameName);
    if (!game) { showToast('⚠️ Игра не найдена'); return; }
    const idx = GAMES.indexOf(game);
    const p = gamePrice(game, idx);
    const priceStr = p.discount > 0
        ? `${p.price} ₽ (скидка ${p.discount}%, было ${p.original} ₽)`
        : `${p.price} ₽`;
    // Открываем Steam-подобное окно «Перейти в корзину / Продолжить покупки»
    const info = document.getElementById('buyModalInfo');
    if (info) info.innerHTML = `<strong>${game.name}</strong><br>${priceStr}`;
    openModal('buyModal');
    addNotification('🛒', 'Корзина', `"${game.name}" добавлена за ${priceStr}`, 'info');
}

// ================================================================
function renderProfileLibrary() {
    const container = document.getElementById('profileLibrary');
    if (!container || typeof GAMES === 'undefined') return;
    // Берём первые 12 игр для библиотеки профиля
    const games = GAMES.slice(0, 12);
    container.innerHTML = games.map((g, i) => {
        const p = gamePrice(g, i);
        const priceHtml = p.discount > 0
            ? `<span class="price-discount">-${p.discount}%</span><span class="price-current">${p.price} ₽</span>`
            : `<span class="price-current">${p.price} ₽</span>`;
        return `<div class="lib-game-card" onclick="openGameDetail('${g.name.replace(/'/g, "\\'")}')">
            <div class="lib-game-img"><img src="${gameImg(g)}" alt="${g.name}" loading="lazy"></div>
            <div class="lib-game-info">
                <span class="lib-game-name">${g.name}</span>
                <span class="lib-game-cat">${gameCatLabel(g)}</span>
                <span class="lib-game-hours">${Math.floor(Math.random() * 200 + 10)} ч</span>
            </div>
            <div class="lib-game-price">${priceHtml}</div>
        </div>`;
    }).join('');
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

/** Переключение между модальными окнами «Войти» и «Зарегистрироваться» */
function switchAuthModal(mode) {
    if (mode === 'login') {
        closeModal('registerModal');
        openModal('loginModal');
    } else {
        closeModal('loginModal');
        openModal('registerModal');
    }
}
window.switchAuthModal = switchAuthModal;

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
// АНИМАЦИИ ПОЯВЛЕНИЯ (с защитой от отсутствия IntersectionObserver)
// ================================================================
if (typeof IntersectionObserver !== 'undefined') {
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
}

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
// Оптимизация: используем делегирование и проверку наличия элементов
(function() {
  let timerInterval = null;
  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      const timers = document.querySelectorAll('.promo-image .timer');
      if (!timers.length) return; // нет таймеров — не тратим ресурсы
      timers.forEach(el => {
        let t = el.textContent.replace('⏱️ ', '').split(':');
        let h = parseInt(t[0]), m = parseInt(t[1]), s = parseInt(t[2]);
        s--;
        if (s < 0) { s = 59; m--; if (m < 0) { m = 59; h--; if (h < 0) { h = 0; m = 0; s = 0; } } }
        el.textContent = `⏱️ ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      });
    }, 1000);
  }
  startTimer();
})();

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
window.buyGame = buyGame;
window.renderProfileLibrary = renderProfileLibrary;
window.showToast = showToast;
window.submitContact = submitContact;
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.toggleTheme = toggleTheme;
window.toggleThemeCustomizer = toggleThemeCustomizer;
window.setTheme = setTheme;
window.toggleFav = toggleFav;
window.filterGames = filterGames;
window.switchProfileTab = switchProfileTab;
window.enableNotifications = enableNotifications;
window.denyNotifications = denyNotifications;
window.exportProfileTXT = exportProfileTXT;
window.copyRefLink = copyRefLink;
window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.changeLanguage = setLanguage;
window.saveSettings = saveSettings;
window.updateProfileName = updateProfileName;
window.createConfetti = createConfetti;
window.showSkeletonLoader = showSkeletonLoader;
window.hideSkeletonLoader = hideSkeletonLoader;
window.addNotification = addNotification;
window.removeNotification = removeNotification;
window.dismissPWA = dismissPWA;
window.installPWA = installPWA;
window.renderAchievements = renderAchievements;
const GAMES = [{"name":"7 Days to Die","img":"7_days_to_die.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"A Short Hike","img":"a_short_hike.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Abzu","img":"abzu.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Act Of Aggression","img":"act_of_aggression.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Against The Storm","img":"against_the_storm.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age of Empires II: DE","img":"age_of_empires_2_de.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age of Empires III: DE","img":"age_of_empires_3_de.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age Of Empires 4","img":"age_of_empires_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age Of Wonders 3","img":"age_of_wonders_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Age Of Wonders 4","img":"age_of_wonders_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Alan Wake","img":"alan_wake.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Alien Isolation","img":"alien_isolation.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"American Truck Simulator","img":"american_truck_simulator.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amid Evil","img":"amid_evil.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amnesia","img":"amnesia.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amnesia Rebirth","img":"amnesia_rebirth.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Amnesia The Bunker","img":"amnesia_the_bunker.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Anno 1800","img":"anno_1800.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Apex Legends","img":"apex_legends.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ark Survival Ascended","img":"ark_survival_ascended.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Assassins Creed Valhalla","img":"assassins_creed_valhalla.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Assetto Corsa","img":"assetto_corsa.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Assetto Corsa Competizione","img":"assetto_corsa_competizione.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Atomic Heart","img":"atomic_heart.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Avowed","img":"avowed.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Baldurs Gate 1","img":"baldurs_gate_1.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Baldurs Gate 2","img":"baldurs_gate_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Baldur's Gate 3","img":"baldurs_gate_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Banished","img":"banished.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 1","img":"battlefield_1.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 2042","img":"battlefield_2042.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 4","img":"battlefield_4.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Battlefield 5","img":"battlefield_5.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bayonetta","img":"bayonetta.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Beamng Drive","img":"beamng_drive.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bendy And Ink Machine","img":"bendy_and_ink_machine.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Besiege","img":"besiege.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bioshock 1","img":"bioshock_1.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bioshock 2","img":"bioshock_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bioshock Infinite","img":"bioshock_infinite.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Black Desert","img":"black_desert.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Black Desert Online","img":"black_desert_online.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blair Witch","img":"blair_witch.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blasphemous","img":"blasphemous.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blasphemous 2","img":"blasphemous_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Blazblue Centralfiction","img":"blazblue_centralfiction.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bloodstained Ritual","img":"bloodstained_ritual.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Borderlands 3","img":"borderlands_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Braid","img":"braid.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bright Memory","img":"bright_memory.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bug Snax","img":"bug_snax.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bulletstorm","img":"bulletstorm.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Burnout Paradise","img":"burnout_paradise.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bus Simulator 18","img":"bus_simulator_18.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Bus Simulator 21","img":"bus_simulator_21.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"C And C Red Alert 3","img":"c_and_c_red_alert_3.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Call Of Duty Warzone","img":"call_of_duty_warzone.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Call To Arms","img":"call_to_arms.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Call To Arms Gates Of Hell","img":"call_to_arms_gates_of_hell.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Callisto Protocol","img":"callisto_protocol.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Case Of Golden Idol","img":"case_of_golden_idol.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cave Story","img":"cave_story.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Celeste","img":"celeste.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Chronicon","img":"chronicon.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cities Skylines","img":"cities_skylines.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cities Skylines 2","img":"cities_skylines_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Civilization 6","img":"civilization_6.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Code Vein","img":"code_vein.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Command And Conquer","img":"command_and_conquer.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Company Of Heroes","img":"company_of_heroes.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Company Of Heroes 2","img":"company_of_heroes_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Company Of Heroes 3","img":"company_of_heroes_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Conan Exiles","img":"conan_exiles.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Construction Simulator","img":"construction_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Control","img":"control.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Core Keeper","img":"core_keeper.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter Strike 1 6","img":"counter_strike_1_6.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter-Strike 2","img":"counter_strike_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter Strike Condition Zero","img":"counter_strike_condition_zero.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Counter Strike Source","img":"counter_strike_source.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cozy Grove","img":"cozy_grove.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Crusader Kings 3","img":"crusader_kings_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Crysis 2","img":"crysis_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Crysis Remastered","img":"crysis_remastered.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cult Of The Lamb","img":"cult_of_the_lamb.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cuphead","img":"cuphead.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Cyberpunk 2077","img":"cyberpunk_2077.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dark Souls 3","img":"dark_souls_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Darktide","img":"darktide.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dave The Diver","img":"dave_the_diver.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Day Of Defeat","img":"day_of_defeat.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Day Of Defeat Source","img":"day_of_defeat_source.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dayz","img":"dayz.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dcs World","img":"dcs_world.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ddo","img":"ddo.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead By Daylight","img":"dead_by_daylight.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead Cells","img":"dead_cells.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead Space 3","img":"dead_space_3.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dead Space Remake","img":"dead_space_remake.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dear Esther","img":"dear_esther.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deathloop","img":"deathloop.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deaths Gambit","img":"deaths_gambit.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deep Rock Galactic","img":"deep_rock_galactic.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Delta Force","img":"delta_force.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Demon Slayer Hinokami","img":"demon_slayer_hinokami.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Descenders","img":"descenders.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deserts Of Kharak","img":"deserts_of_kharak.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Desperados 3","img":"desperados_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Destiny 2","img":"destiny_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Detroit Become Human","img":"detroit_become_human.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deus Ex","img":"deus_ex.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Deus Ex Mankind Divided","img":"deus_ex_mankind_divided.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Devil May Cry 4","img":"devil_may_cry_4.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Devil May Cry 5","img":"devil_may_cry_5.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Devour","img":"devour.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Diablo 4","img":"diablo_4.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Disco Elysium","img":"disco_elysium.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dishonored","img":"dishonored.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dishonored 2","img":"dishonored_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Divinity Original Sin 2","img":"divinity_original_sin_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Doom 2016","img":"doom_2016.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Doom 64","img":"doom_64.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Doom Eternal","img":"doom_eternal.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dota 2","img":"dota_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age 2","img":"dragon_age_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age Inquisition","img":"dragon_age_inquisition.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age Origins","img":"dragon_age_origins.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Age Veilguard","img":"dragon_age_veilguard.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Ball Fighterz","img":"dragon_ball_fighterz.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Ball Sparking Zero","img":"dragon_ball_sparking_zero.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Ball Xenoverse 2","img":"dragon_ball_xenoverse_2.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Quest 11","img":"dragon_quest_11.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dragon Quest Builders 2","img":"dragon_quest_builders_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dredge","img":"dredge.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Drift21","img":"drift21.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dst","img":"dst.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dusk","img":"dusk.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Dyson Sphere Program","img":"dyson_sphere_program.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Eco Global","img":"eco_global.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Elden Ring","img":"elden_ring.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Elder Scrolls Online","img":"elder_scrolls_online.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Empire Of Sin","img":"empire_of_sin.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ender Lillies","img":"ender_lillies.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Enlisted","img":"enlisted.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Enter The Gungeon","img":"enter_the_gungeon.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Escape From Tarkov","img":"escape_from_tarkov.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Eso Necrom","img":"eso_necrom.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Eso Summerset","img":"eso_summerset.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Euro Truck Simulator 2","img":"euro_truck_simulator_2.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Europa Universalis 4","img":"europa_universalis_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Evil West","img":"evil_west.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Evil Within","img":"evil_within.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Evil Within 2","img":"evil_within_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"F1 2024","img":"f1_2024.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Factorio","img":"factorio.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout 3","img":"fallout_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout 4","img":"fallout_4.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout 76","img":"fallout_76.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fallout: New Vegas","img":"fallout_new_vegas.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Far Cry 5","img":"far_cry_5.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Far Cry 6","img":"far_cry_6.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Farm Simulator 19","img":"farm_simulator_19.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Farm Simulator 22","img":"farm_simulator_22.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Farthest Frontier","img":"farthest_frontier.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fc 24","img":"fc_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fez","img":"fez.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 21","img":"fifa_21.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 22","img":"fifa_22.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 23","img":"fifa_23.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Fifa 24","img":"fifa_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Final Fantasy 14","img":"final_fantasy_14.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Final Fantasy 14 Endwalker","img":"final_fantasy_14_endwalker.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Firewatch","img":"firewatch.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Forgive Me Father","img":"forgive_me_father.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Forza Horizon 5","img":"forza_horizon_5.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"From The Depths","img":"from_the_depths.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Frostpunk","img":"frostpunk.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gates Of Hell","img":"gates_of_hell.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gears Tactics","img":"gears_tactics.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghost Recon Breakpoint","img":"ghost_recon_breakpoint.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghost Warrior 3","img":"ghost_warrior_3.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghostrunner","img":"ghostrunner.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ghostrunner 2","img":"ghostrunner_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Going Medieval","img":"going_medieval.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Golf With Friends","img":"golf_with_friends.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gone Home","img":"gone_home.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Graveyard Keeper","img":"graveyard_keeper.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Green Hell","img":"green_hell.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grid Legends","img":"grid_legends.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grim Dawn","img":"grim_dawn.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grime","img":"grime.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gris","img":"gris.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grounded","img":"grounded.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Grand Theft Auto V","img":"gta_5.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guardians Of The Galaxy","img":"guardians_of_the_galaxy.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guild Wars 2","img":"guild_wars_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guild Wars 2 Secrets","img":"guild_wars_2_secrets.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guilty Gear Strive","img":"guilty_gear_strive.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Guilty Gear Xrd","img":"guilty_gear_xrd.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Gunfire Reborn","img":"gunfire_reborn.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hades","img":"hades.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hades 2","img":"hades_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Half-Life","img":"half_life.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Half-Life 2","img":"half_life_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Half Life Alyx","img":"half_life_alyx.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hard West","img":"hard_west.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Haven","img":"haven.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hearts of Iron IV","img":"hearts_of_iron_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Heavy Rain","img":"heavy_rain.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hedon","img":"hedon.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hell Let Loose","img":"hell_let_loose.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Helldivers 2","img":"helldivers_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hero Siege","img":"hero_siege.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hi Fi Rush","img":"hi_fi_rush.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman 2","img":"hitman_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman 2016","img":"hitman_2016.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman 3","img":"hitman_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hitman Absolution","img":"hitman_absolution.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hogwarts Legacy","img":"hogwarts_legacy.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hollow Knight","img":"hollow_knight.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hollow Knight 2","img":"hollow_knight_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Homeworld 3","img":"homeworld_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Homeworld Remastered","img":"homeworld_remastered.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"House Flipper 2","img":"house_flipper_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hunt Showdown","img":"hunt_showdown.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Hunter Call Of Wild","img":"hunter_call_of_wild.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Icewind Dale","img":"icewind_dale.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Il 2 Sturmovik","img":"il_2_sturmovik.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Inscryption","img":"inscryption.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Inside","img":"inside.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Inside Playdead","img":"inside_playdead.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Insurgency Sandstorm","img":"insurgency_sandstorm.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Jade Empire","img":"jade_empire.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Jump Force","img":"jump_force.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kentucky Route Zero","img":"kentucky_route_zero.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kerbal Space Program","img":"kerbal_space_program.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"King Of Fighters 15","img":"king_of_fighters_15.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kingdom Come Deliverance 2","img":"kingdom_come_deliverance_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kingdoms And Castles","img":"kingdoms_and_castles.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kotor","img":"kotor.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Kotor 2","img":"kotor_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lake","img":"lake.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Last Epoch","img":"last_epoch.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lawn Mowing Simulator","img":"lawn_mowing_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Layers Of Fear 2023","img":"layers_of_fear_2023.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Left 4 Dead","img":"left_4_dead.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Left 4 Dead 2","img":"left_4_dead_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Batman 3","img":"lego_batman_3.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego City Undercover","img":"lego_city_undercover.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Harry Potter","img":"lego_harry_potter.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Lord Of The Rings","img":"lego_lord_of_the_rings.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lego Marvel Avengers","img":"lego_marvel_avengers.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Library Of Ruina","img":"library_of_ruina.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lies Of P","img":"lies_of_p.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange","img":"life_is_strange.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange 2","img":"life_is_strange_2.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange Bts","img":"life_is_strange_bts.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Life Is Strange Tcw","img":"life_is_strange_tcw.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Limbo","img":"limbo.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Limbo Playdead","img":"limbo_playdead.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Limbus Company","img":"limbus_company.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Little Nightmares","img":"little_nightmares.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Little Nightmares 2","img":"little_nightmares_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lobotomy Corporation","img":"lobotomy_corporation.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lost Ark","img":"lost_ark.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Lotro","img":"lotro.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Madden Nfl 24","img":"madden_nfl_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Main Assembly","img":"main_assembly.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Manor Lords","img":"manor_lords.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Marvel Guardians","img":"marvel_guardians.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Marvel Rivals","img":"marvel_rivals.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect 2","img":"mass_effect_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect 3","img":"mass_effect_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect Andromeda","img":"mass_effect_andromeda.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mass Effect: Legendary","img":"mass_effect_legendary.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Medieval Engineers","img":"medieval_engineers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Melty Blood","img":"melty_blood.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Men Of War 2","img":"men_of_war_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Men Of War Assault Squad 2","img":"men_of_war_assault_squad_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metal Gear Rising","img":"metal_gear_rising.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metaphor Refantazio","img":"metaphor_refantazio.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metro 2033","img":"metro_2033.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metro Exodus","img":"metro_exodus.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Metro Last Light","img":"metro_last_light.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mindustry","img":"mindustry.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Monster Hunter Wilds","img":"monster_hunter_wilds.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Morrowind","img":"morrowind.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mortal Kombat 11","img":"mortal_kombat_11.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mortal Kombat X","img":"mortal_kombat_x.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ms Flight Simulator 2024","img":"ms_flight_simulator_2024.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Mutant Year Zero","img":"mutant_year_zero.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"My Time At Portia","img":"my_time_at_portia.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"My Time At Sandrock","img":"my_time_at_sandrock.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Myst","img":"myst.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Naraka Bladepoint","img":"naraka_bladepoint.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Naruto Storm 4","img":"naruto_storm_4.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nba 2K24","img":"nba_2k24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nba 2K25","img":"nba_2k25.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Need For Speed Heat","img":"need_for_speed_heat.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Need For Speed Most Wanted","img":"need_for_speed_most_wanted.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Need For Speed Payback","img":"need_for_speed_payback.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Neva","img":"neva.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"New World","img":"new_world.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nfs Unbound","img":"nfs_unbound.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nhl 24","img":"nhl_24.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ni No Kuni 2","img":"ni_no_kuni_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nier Automata","img":"nier_automata.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nioh","img":"nioh.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nioh 2","img":"nioh_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"No Man's Sky","img":"no_mans_sky.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Northgard","img":"northgard.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Nuclear Throne","img":"nuclear_throne.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Obduction","img":"obduction.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Oblivion","img":"oblivion.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Observer","img":"observer.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Octopath Traveler","img":"octopath_traveler.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Octopath Traveler 2","img":"octopath_traveler_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Omerta","img":"omerta.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"One Piece Odyssey","img":"one_piece_odyssey.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"One Piece Pirate Warriors 4","img":"one_piece_pirate_warriors_4.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ori And The Blind Forest","img":"ori_and_the_blind_forest.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ori And The Will Of The Wisps","img":"ori_and_the_will_of_the_wisps.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ori And The Will Of The Wisps 2","img":"ori_and_the_will_of_the_wisps_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Outer Wilds","img":"outer_wilds.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Outriders","img":"outriders.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Overwatch 2","img":"overwatch_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Oxenfree","img":"oxenfree.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Oxygen Not Included","img":"oxygen_not_included.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Path Of Exile","img":"path_of_exile.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Path Of Exile 2","img":"path_of_exile_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Path Of Exile Sentinel","img":"path_of_exile_sentinel.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pathfinder Kingmaker","img":"pathfinder_kingmaker.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pathfinder Wrath Of Righteous","img":"pathfinder_wrath_of_righteous.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Payday 3","img":"payday_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pc Building Simulator","img":"pc_building_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pc Building Simulator 2","img":"pc_building_simulator_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Penumbra","img":"penumbra.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Penumbra Black Plague","img":"penumbra_black_plague.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Penumbra Requiem","img":"penumbra_requiem.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 3 Reload","img":"persona_3_reload.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 4 Golden","img":"persona_4_golden.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 5 Royal","img":"persona_5_royal.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Persona 5 Strikers","img":"persona_5_strikers.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Phasmophobia","img":"phasmophobia.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Phoenix Point","img":"phoenix_point.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pillars Of Eternity","img":"pillars_of_eternity.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pillars Of Eternity 2","img":"pillars_of_eternity_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planescape Torment","img":"planescape_torment.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Coaster","img":"planet_coaster.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Crafter","img":"planet_crafter.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Of Lana","img":"planet_of_lana.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planet Zoo","img":"planet_zoo.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Planetary Annihilation","img":"planetary_annihilation.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Police Simulator","img":"police_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Poppy Playtime","img":"poppy_playtime.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Poppy Playtime Chapter 2","img":"poppy_playtime_chapter_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Portal","img":"portal.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Portal 2","img":"portal_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Post Void","img":"post_void.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Postal 2","img":"postal_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Power Washer Simulator","img":"power_washer_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Powerwash Simulator","img":"powerwash_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Prey 2017","img":"prey_2017.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Prison Architect","img":"prison_architect.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Project Cars 2","img":"project_cars_2.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Project Cars 3","img":"project_cars_3.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Project Zomboid","img":"project_zomboid.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Pubg Battlegrounds","img":"pubg_battlegrounds.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Punch Club","img":"punch_club.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Punch Club 2","img":"punch_club_2.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Quake Champions","img":"quake_champions.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Quantum Break","img":"quantum_break.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Raft","img":"raft.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Raft 2","img":"raft_2.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rainbow Six Siege","img":"rainbow_six_siege.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ranch Simulator","img":"ranch_simulator.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ready Or Not","img":"ready_or_not.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Red Dead Redemption 2","img":"red_dead_redemption_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Remnant 2","img":"remnant_2.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil 2","img":"resident_evil_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil 3","img":"resident_evil_3.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil 4","img":"resident_evil_4.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Resident Evil Village","img":"resident_evil_village.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Return Of The Obra Dinn","img":"return_of_the_obra_dinn.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ride 4","img":"ride_4.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Riders Republic","img":"riders_republic.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rift","img":"rift.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rimworld","img":"rimworld.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rise Of Golden Idol","img":"rise_of_golden_idol.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Risk Of Rain 2","img":"risk_of_rain_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Risk Of Rain Returns","img":"risk_of_rain_returns.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Road 96","img":"road_96.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rocket League","img":"rocket_league.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Rust","img":"rust.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Salt And Sacrifice","img":"salt_and_sacrifice.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Salt And Sanctuary","img":"salt_and_sanctuary.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Samurai Shodown","img":"samurai_shodown.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Satisfactory","img":"satisfactory.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Satisfactory 2","img":"satisfactory_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Scarlet Nexus","img":"scarlet_nexus.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Scrap Mechanic","img":"scrap_mechanic.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Scum","img":"scum.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sekiro","img":"sekiro.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Selaco","img":"selaco.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Session","img":"session.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shadow Gambit","img":"shadow_gambit.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shadow Tactics","img":"shadow_tactics.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shadow Warrior 3","img":"shadow_warrior_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shapez 2","img":"shapez_2.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Shovel Knight","img":"shovel_knight.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Silent Hill 2","img":"silent_hill_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Silksong","img":"silksong.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sins Of Solar Empire","img":"sins_of_solar_empire.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Skater Xl","img":"skater_xl.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Skullgirls","img":"skullgirls.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Skyrim","img":"skyrim.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Slay The Spire","img":"slay_the_spire.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Slime Rancher","img":"slime_rancher.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Slime Rancher 2","img":"slime_rancher_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Smite","img":"smite.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Elite 3","img":"sniper_elite_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Elite 4","img":"sniper_elite_4.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Elite 5","img":"sniper_elite_5.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Ghost Warrior 3","img":"sniper_ghost_warrior_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Ghost Warrior Contracts","img":"sniper_ghost_warrior_contracts.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sniper Ghost Warrior Contracts 2","img":"sniper_ghost_warrior_contracts_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Snowrunner","img":"snowrunner.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Soma","img":"soma.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Song Of Horror","img":"song_of_horror.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sons Of The Forest","img":"sons_of_the_forest.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Space Engine","img":"space_engine.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Space Engineers","img":"space_engineers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Spiritfarer","img":"spiritfarer.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stalker 2","img":"stalker_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stalker Call Of Pripyat","img":"stalker_call_of_pripyat.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stalker Shadow Of Chernobyl","img":"stalker_shadow_of_chernobyl.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Trek Online","img":"star_trek_online.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Battlefront 2","img":"star_wars_battlefront_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Jedi Fallen","img":"star_wars_jedi_fallen.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Jedi Survivor","img":"star_wars_jedi_survivor.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Old Republic","img":"star_wars_old_republic.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Star Wars Squadrons","img":"star_wars_squadrons.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Starbound","img":"starbound.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stardew Valley","img":"stardew_valley.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stardew Valley 2","img":"stardew_valley_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Starfield","img":"starfield.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stationeers","img":"stationeers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Steel Division 2","img":"steel_division_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Steel Division Normandy","img":"steel_division_normandy.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stellaris","img":"stellaris.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Sto Legacy","img":"sto_legacy.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stormworks","img":"stormworks.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stormworks 2","img":"stormworks_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stranded Deep","img":"stranded_deep.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stranger Of Paradise","img":"stranger_of_paradise.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Stray","img":"stray.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Street Fighter 5","img":"street_fighter_5.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Street Fighter 6","img":"street_fighter_6.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Subnautica","img":"subnautica.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Subnautica Below Zero","img":"subnautica_below_zero.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Super Mega Baseball 4","img":"super_mega_baseball_4.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Supreme Commander 2","img":"supreme_commander_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Surviving Mars","img":"surviving_mars.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Surviving The Aftermath","img":"surviving_the_aftermath.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"System Shock 2","img":"system_shock_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"System Shock Remake","img":"system_shock_remake.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tales Of Berseria","img":"tales_of_berseria.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tales Of Vesperia","img":"tales_of_vesperia.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Talos Principle","img":"talos_principle.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Talos Principle 2","img":"talos_principle_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Team Fortress 2","img":"team_fortress_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tekken 7","img":"tekken_7.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tell Me Why","img":"tell_me_why.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tennis Elbow 2013","img":"tennis_elbow_2013.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Terraria","img":"terraria.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Terraria 2","img":"terraria_2.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Binding of Isaac: Rebirth","img":"the_binding_of_isaac_rebirth.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Crew 2","img":"the_crew_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Finals","img":"the_finals.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Forest","img":"the_forest.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Hunter","img":"the_hunter.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Isle","img":"the_isle.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Outlast Trials","img":"the_outlast_trials.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Outlast Trials 2","img":"the_outlast_trials_2.jpg","cat":"horror","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Room","img":"the_room.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Sims 4","img":"the_sims_4.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Walking Dead","img":"the_walking_dead.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Walking Dead Final Season","img":"the_walking_dead_final_season.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Walking Dead Season 2","img":"the_walking_dead_season_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Them Fightin Herds","img":"them_fightin_herds.jpg","cat":"fighting","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"They Are Billions","img":"they_are_billions.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"They Are Billions 2","img":"they_are_billions_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief","img":"thief.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief 2","img":"thief_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief Deadly Shadows","img":"thief_deadly_shadows.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief Gold","img":"thief_gold.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Thief Simulator 2","img":"thief_simulator_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"This War Of Mine","img":"this_war_of_mine.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Throne And Liberty","img":"throne_and_liberty.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Titanfall 2","img":"titanfall_2.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Torchlight 2","img":"torchlight_2.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Torchlight Infinite","img":"torchlight_infinite.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Torment Tides Of Numenera","img":"torment_tides_of_numenera.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tormented Souls","img":"tormented_souls.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Total War Three Kingdoms","img":"total_war_three_kingdoms.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Total War Warhammer 3","img":"total_war_warhammer_3.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Trailmakers","img":"trailmakers.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Train Simulator 2024","img":"train_simulator_2024.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Transport Fever 2","img":"transport_fever_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Trials Of Mana","img":"trials_of_mana.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Two Point Hospital","img":"two_point_hospital.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Tyranny","img":"tyranny.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ultrakill","img":"ultrakill.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Undertale","img":"undertale.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Universe Sandbox","img":"universe_sandbox.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Unravel 2","img":"unravel_2.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Valheim","img":"valheim.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Vampire Survivors","img":"vampire_survivors.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Vanquish","img":"vanquish.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Vrising","img":"vrising.jpg","cat":"survival","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"War Thunder","img":"war_thunder.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"War Thunder Ground","img":"war_thunder_ground.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warface","img":"warface.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warframe","img":"warframe.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wargame Airland Battle","img":"wargame_airland_battle.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wargame European Escalation","img":"wargame_european_escalation.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wargame Red Dragon","img":"wargame_red_dragon.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warhammer Boltgun","img":"warhammer_boltgun.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Warno","img":"warno.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wasteland 3","img":"wasteland_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Way Of The Hunter","img":"way_of_the_hunter.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"What Remains Edith Finch","img":"what_remains_edith_finch.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"The Witcher 3","img":"witcher_3.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Witness","img":"witness.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wo Long","img":"wo_long.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolcen","img":"wolcen.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolf Among Us","img":"wolf_among_us.jpg","cat":"adventure","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolfenstein Colossus","img":"wolfenstein_colossus.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolfenstein New Order","img":"wolfenstein_new_order.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wolfenstein Youngblood","img":"wolfenstein_youngblood.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"World Of Warships","img":"world_of_warships.jpg","cat":"sandbox","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"World War 3","img":"world_war_3.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wreckfest","img":"wreckfest.jpg","cat":"sport","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Wytchwood","img":"wytchwood.jpg","cat":"indie","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xcom 2","img":"xcom_2.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xcom Chimera Squad","img":"xcom_chimera_squad.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xcom Enemy Unknown","img":"xcom_enemy_unknown.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Xplane","img":"xplane.jpg","cat":"strategy","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ys Ix","img":"ys_ix.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Ys Viii","img":"ys_viii.jpg","cat":"rpg","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"},{"name":"Zero Sievert","img":"zero_sievert.jpg","cat":"shooter","desc":"Популярная игра с высоким рейтингом и увлекательным геймплеем"}];

// ================================================================
// НОВЫЕ ФУНКЦИИ: игра из Steam-обложек, каталог, слайдер, hero
// ================================================================
// Все обложки игр хранятся в папке images/games/ (551 файл напрямую в корне).
const IMG_BASE = "images/games/";
function gameImg(g) {
  return IMG_BASE + g.img;
}

/** Возвращает перевод по ключу для текущего языка (fallback на русский) */
function t(key) {
  const lang = translations[currentLanguage] ? currentLanguage : 'ru';
  const val = translations[lang][key];
  if (val !== undefined) return val;
  const ru = translations.ru[key];
  return ru !== undefined ? ru : key;
}

/** Уникальное описание игры на основе жанра и названия (переводится) */
function gameDescription(g) {
  const base = t('desc_' + g.cat) || t('desc_default');
  // Добавляем уникальную фразу с названием игры, чтобы описание отличалось
  const q = (currentLanguage === 'zh') ? '《' : '«';
  const qe = (currentLanguage === 'zh') ? '》' : '»';
  return q + g.name + qe + ' — ' + base;
}

/** Локализованное название жанра для карточек */
function gameCatLabel(g) {
  return t('cat_' + g.cat) || g.cat;
}

/** Steam-стиль цены для игры: базовые цены + случайные скидки */
function gamePrice(g, index) {
  const basePrices = [499, 799, 999, 1249, 1499, 1999, 2499, 2999, 3499, 3999, 4499, 4999, 5999, 6999];
  const basePrice = basePrices[(index || 0) % basePrices.length];
  // Каждая 3-я игра со скидкой (как в Steam)
  const hasDiscount = ((index || 0) % 3 === 0);
  if (hasDiscount) {
    const discount = [10, 20, 25, 33, 40, 50][((index || 0) / 3) % 6];
    const discounted = Math.round(basePrice * (100 - discount) / 100);
    return { price: discounted, original: basePrice, discount };
  }
  return { price: basePrice, discount: 0 };
}

// ================================================================
// ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК ИЗОБРАЖЕНИЙ
// Если картинка не загрузилась (например, старый путь images/games/без_подпапки),
// ищем её в подпапках images1..images6 и показываем вместо пустого места.
// ================================================================
(function() {
  // Кэш: имя файла -> уже проверенная подпапка (или null, если не нашли)
  const folderCache = {};
  // Запоминаем, какие src уже пробовали, чтобы не зациклиться
  const attempted = new Set();
  const FOLDERS = ['images1', 'images2', 'images3', 'images4', 'images5', 'images6'];

  function findFolder(fileName) {
    if (folderCache.hasOwnProperty(fileName)) return folderCache[fileName];
    // Пытаемся определить папку через имена в GAMES (если игра есть в каталоге)
    if (typeof GAMES !== 'undefined' && GAMES.length) {
      const g = GAMES.find(x => x.img === fileName);
      if (g) {
        try { folderCache[fileName] = gameImg(g).replace(IMG_BASE, '').split('/')[0]; return folderCache[fileName]; }
        catch (e) {}
      }
    }
    // Иначе — перебор всех подпапок через Image-объект
    for (const f of FOLDERS) {
      const probe = new Image();
      probe.src = IMG_BASE + f + '/' + fileName;
      // Мы не можем синхронно узнать, существует ли файл; поэтому используем
      // разумный подход: по умолчанию кладём в images1 и пробуем при ошибке дальше.
      folderCache[fileName] = f;
      break;
    }
    return folderCache[fileName];
  }

  document.addEventListener('error', function(e) {
    const img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    const src = img.getAttribute('src') || '';
    if (!src || attempted.has(src)) return;
    attempted.add(src);
    // Извлекаем имя файла из пути
    const parts = src.split('/');
    const fileName = parts[parts.length - 1];
    if (!fileName) return;
    const folder = findFolder(fileName);
    if (folder) {
      // Показываем заглушку-подпись и пытаемся загрузить правильный путь
      const alt = img.getAttribute('alt') || fileName;
      img.setAttribute('data-fallback', '1');
      img.src = IMG_BASE + folder + '/' + fileName;
      // Если и это не загрузилось — оставляем подпись
      if (!img.onerror) img.onerror = function() { this.outerHTML = '<div class="img-fallback">' + alt + '</div>'; };
    } else {
      // Не нашли папку — показываем подпись вместо картинки
      const alt = img.getAttribute('alt') || fileName;
      img.outerHTML = '<div class="img-fallback">' + alt + '</div>';
    }
  }, true); // перехватываем в фазе capture, чтобы ловить все img
})();

function renderHeroGames() {
  const box = document.getElementById('heroGames');
  if (!box || typeof GAMES === 'undefined' || !GAMES.length) return;
  // Рандомный выбор 6 обложек, который меняется каждый час
  const HOUR = 60 * 60 * 1000;
  let heroIdx = null;
  try {
    const saved = JSON.parse(localStorage.getItem('crownHeroIdx') || 'null');
    if (saved && Date.now() - saved.time < HOUR) {
      heroIdx = saved.idx;
    }
  } catch (e) {}
  if (heroIdx === null) {
    // Случайный сдвиг: берём 6 подряд с случайного места (не пересекаются с топ-32 лентой полностью)
    const maxStart = Math.max(0, GAMES.length - 6);
    heroIdx = Math.floor(Math.random() * maxStart);
    try {
      localStorage.setItem('crownHeroIdx', JSON.stringify({ idx: heroIdx, time: Date.now() }));
    } catch (e) {}
  }
  const top = [];
  for (let i = 0; i < 6; i++) {
    top.push(GAMES[(heroIdx + i) % GAMES.length]);
  }
  box.innerHTML = top.map((g, i) =>
    `<div class="hero-game-card" onclick="playGame('${g.name}')">
       <img src="${gameImg(g)}" alt="${g.name}" loading="lazy">
       <div class="hero-game-caption">${g.name}</div>
     </div>`).join('');
}

function renderTopGames() {
  const track = document.getElementById('gamesSliderTrack');
  if (!track || typeof GAMES === 'undefined' || !GAMES.length) return;
  // Берём 32 игры (топ) и строим непрерывную ленту с дублированием для бесшовной прокрутки
  const top = GAMES.slice(0, 32);
  const ranks = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV','XXV','XXVI','XXVII','XXVIII','XXIX','XXX','XXXI','XXXII'];

  function card(g, absIdx) {
    const p = gamePrice(g, absIdx);
    const priceHtml = p.discount > 0
      ? `<span class="price-discount">-${p.discount}%</span><span class="price-original">${p.original} ₽</span><span class="price-current">${p.price} ₽</span>`
      : `<span class="price-current">${p.price} ₽</span>`;
    return `<div class="game-card" data-game="${g.name.replace(/'/g, "\\'")}" onclick="openGameDetail('${g.name.replace(/'/g, "\\'")}')" style="background-image:url('${gameImg(g)}')">
      <div class="card-fav" data-game="${g.name}" onclick="event.stopPropagation();toggleFav(this)">♡</div>
      <div class="rank ${absIdx===0?'gold':''}">${ranks[absIdx]}</div>
      <div class="card-image"><img src="${gameImg(g)}" alt="${g.name}" loading="lazy" onerror="this.style.visibility='hidden'"></div>
      <div class="card-overlay">
        <h4 class="card-title">${g.name}</h4>
        <p class="card-sub">${gameCatLabel(g)}</p>
      </div>
      <div class="card-price">${priceHtml}</div>
      <div class="game-tooltip">${gameDescription(g)}</div>
      <button class="btn-buy" onclick="event.stopPropagation();buyGame('${g.name.replace(/'/g, "\\'")}')">Купить</button>
    </div>`;
  }

  // Одна непрерывная лента: 32 карточки + ещё 32 дубликата (для бесшовной прокрутки)
  let html = top.map((g, i) => card(g, i)).join('') + top.map((g, i) => card(g, i)).join('');
  // Упаковываем в контейнер-ленту (marquee)
  track.innerHTML = `<div class="games-marquee">${html}</div>`;
  // Помечаем трек как marquee-режим (скрываем скролл, включаем анимацию)
  track.classList.add('marquee-mode');

  // Индикаторы (точки) не нужны для бесконечной прокрутки — удаляем старые, если есть
  const sliderWrap = track.closest('.games-slider-wrapper');
  if (sliderWrap) {
    const oldDots = sliderWrap.querySelector('.slider-dots');
    if (oldDots) oldDots.remove();
  }
}

// Инициализация marquee: пауза при наведении + drag-to-scroll на мобильных
function initTopMarquee() {
  const wrap = document.querySelector('.games-slider-wrapper');
  const track = document.getElementById('gamesSliderTrack');
  if (!wrap || !track) return;
  wrap.addEventListener('mouseenter', () => track.classList.add('paused'));
  wrap.addEventListener('mouseleave', () => track.classList.remove('paused'));
  // Анимация marquee работает через CSS на всех размерах экрана
}
window.initTopMarquee = initTopMarquee;

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid || typeof GAMES === 'undefined' || !GAMES.length) return;
  grid.classList.add('steam-list');
  grid.innerHTML = GAMES.map((g, idx) => {
    const p = gamePrice(g, idx);
    const d = gameDetails(g, idx);
    const priceHtml = p.discount > 0
      ? `<span class="price-discount">-${p.discount}%</span><span class="price-original">${p.original} ₽</span><span class="price-current">${p.price} ₽</span>`
      : `<span class="price-current">${p.price} ₽</span>`;
    return `<div class="catalog-item steam-row" data-type="${g.cat}" data-game="${g.name}" onclick="openGameDetail('${g.name.replace(/'/g, "\\'")}')">
      <div class="row-img"><img src="${gameImg(g)}" alt="${g.name}" loading="lazy"></div>
      <div class="row-info">
        <h4>${g.name}</h4>
        <p class="row-desc">${gameDescription(g)} Особенности: ${d.tags.join(', ')}.</p>
        <span class="row-date">${t('gd_release')}: ${d.release}</span>
      </div>
      <div class="row-price">${priceHtml}</div>
      <button class="row-fav" data-game="${g.name}" onclick="event.stopPropagation();toggleFav(this)">♡</button>
    </div>`;
  }).join('');
}
window.renderCatalog = renderCatalog;

function filterGames(type, btn) {
  if (btn) {
    // Снимаем active со всех элементов фильтра (кнопки и genre-card)
    document.querySelectorAll('.catalog-filters button, .genre-card').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  document.querySelectorAll('#catalogGrid .catalog-item').forEach(item => {
    const show = type === 'all' || item.dataset.type === type;
    item.style.display = show ? '' : 'none';
  });
}

// «Топ игр» — непрерывная marquee-лента (плавная, зацикленная, без скролла)
function initSliderAutoplay() {
  initTopMarquee();
}

// Авто-раст поля + счётчик символов
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 300) + 'px';
}
function updateCharCount(el) {
  const counter = el.nextElementSibling;
  const span = counter && counter.classList.contains('char-counter')
    ? counter.querySelector('span')
    : null;
  if (span) {
    span.textContent = el.value.length;
    counter.classList.toggle('danger', el.value.length >= 500);
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
  try { renderLibrary(); } catch (e) { console.warn('library err', e); }
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
  if (!game) { buyGame(name); return; }
  const body = document.getElementById('gameDetailBody');
  if (!body) { buyGame(name); return; }
  const gIdx = GAMES.indexOf(game);
  const p = gamePrice(game, gIdx);
  const priceHtml = p.discount > 0
    ? `<span class="gd-price-block"><span class="price-discount">-${p.discount}%</span><span class="price-original">${p.original} ₽</span><span class="price-current">${p.price} ₽</span></span>`
    : `<span class="gd-price-block"><span class="price-current">${p.price} ₽</span></span>`;
  // Расширенные данные об игре (как в Steam)
  const d = gameDetails(game, gIdx);
  const specKeys = [t('gd_genre'), t('gd_dev'), t('gd_pub'), t('gd_release'), t('gd_age'), t('gd_online')];
  const specVals = [d.genre, d.developer, d.publisher, d.release, d.age, d.online];
  body.innerHTML = `
    <div class="gd-layout">
      <div class="gd-image"><img src="${gameImg(game)}" alt="${game.name}"></div>
      <div class="gd-info">
        <span class="gd-cat">${gameCatLabel(game)}</span>
        <h3>${game.name}</h3>
        <div class="gd-rating">★★★★★ <span>${d.rating} · ${d.reviews} ${t('gd_reviews')}</span></div>
        <p class="gd-desc">${gameDescription(game)}</p>
        ${priceHtml}
        <div class="gd-specs">
          <h4>${t('gd_specs')}</h4>
          ${specKeys.map((k, i) => `<div class="gd-spec-row"><span class="gd-spec-name">${k}</span><span class="gd-spec-val">${specVals[i]}</span></div>`).join('')}
        </div>
        <div class="gd-features">
          <h4>${t('gd_features')}</h4>
          <div class="gd-tags">${d.tags.map(t => `<span class="gd-tag">${t}</span>`).join('')}</div>
        </div>
        <div class="gd-languages">
          <h4>${t('gd_languages')}</h4>
          <p>${d.languages}</p>
        </div>
        <div class="gd-sysreq">
          <h4>${t('gd_sysreq')}</h4>
          <div class="sysreq-block">
            <span class="sysreq-title">${t('gd_minreq')}</span>
            <p>${d.minReq}</p>
          </div>
          <div class="sysreq-block">
            <span class="sysreq-title">${t('gd_recreq')}</span>
            <p>${d.recReq}</p>
          </div>
        </div>
        <div class="gd-buttons">
          <button class="btn-gold" onclick="closeModal('gameDetailModal');buyGame('${game.name.replace(/'/g, "\\'")}')">${t('gd_buy')}</button>
          <button class="btn-secondary" onclick="closeModal('gameDetailModal')">${t('gd_close')}</button>
        </div>
      </div>
    </div>`;
  openModal('gameDetailModal');
}
window.openGameDetail = openGameDetail;

/** Расширенные данные об игре, сгенерированные по жанру и названию (как в Steam) */
function gameDetails(g, idx) {
  const devs = ['Valve', 'CD Projekt RED', 'FromSoftware', 'Rockstar Games', 'Blizzard Entertainment', 'Electronic Arts', 'Ubisoft', 'Bethesda', 'Square Enix', 'Capcom', 'Bandai Namco', 'Paradox Interactive', 'Larian Studios', 'ConcernedApe', 'Frictional Games', 'Amanita Design', 'Team Cherry', 'Mojang', 'Epic Games', 'Naughty Dog'];
  const pubs = ['Crown Games', '2K Games', 'Activision', 'Sony Interactive', 'Microsoft Studios', 'Deep Silver', 'Focus Home', 'Devolver Digital', 'tinyBuild', 'Team17', '505 Games', 'Warner Bros', 'Sega', 'Konami', 'Nintendo'];
  const dev = devs[(idx + g.name.length) % devs.length];
  const pub = pubs[(idx * 3 + g.name.length) % pubs.length];
  const year = 2015 + (idx % 10);
  const month = 1 + (idx % 12);
  const day = 1 + ((idx * 7) % 28);
  const ratings = ['4.5', '4.6', '4.7', '4.8', '4.9', '5.0'];
  const reviews = [1234, 2340, 3456, 5678, 8900, 12345, 23456][idx % 7];
  const tagsByGenre = {
    shooter: ['Экшен', 'От первого лица', 'Мультиплеер', 'Соревновательный'],
    strategy: ['Пошаговая', 'Реалтайм', 'Управление ресурсами', 'Глубокая тактика'],
    rpg: ['Открытый мир', 'Прокачка', 'Сюжет', 'Выборы и последствия'],
    survival: ['Крафт', 'Исследование', 'Опасный мир', 'База'],
    sandbox: ['Творчество', 'Модификации', 'Открытый мир', 'Строительство'],
    sport: ['Симуляция', 'Карьера', 'Онлайн-матчи', 'Реализм'],
    indie: ['Уникальный стиль', 'Атмосфера', 'Головоломки', 'Художественная ценность'],
    horror: ['Атмосфера', 'Скримеры', 'Сюжет', 'Напряжение'],
  };
  const ageByGenre = { shooter: '16+', strategy: '10+', rpg: '16+', survival: '18+', sandbox: '7+', sport: '3+', indie: '12+', horror: '18+' };
  return {
    genre: t('cat_' + g.cat) || t('gd_genre'),
    developer: dev,
    publisher: pub,
    release: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`,
    age: ageByGenre[g.cat] || '12+',
    online: (idx % 3 === 0) ? t('gd_online_multi') : t('gd_online_single'),
    rating: ratings[idx % ratings.length],
    reviews: reviews.toLocaleString(currentLanguage === 'zh' ? 'zh-CN' : currentLanguage === 'en' ? 'en-US' : 'ru-RU'),
    tags: tagsByGenre[g.cat] || [t('gd_specs')],
    languages: t('gd_lang_list'),
    minReq: t('gd_minreq_text'),
    recReq: t('gd_recreq_text'),
  };
}

// ================================================================
// LIVE-ЧАТ: ОТПРАВКА СООБЩЕНИЯ И БОТЫ (удалено — страница LIVE больше не используется)
// ================================================================

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
  const isMobile = window.innerWidth <= 768;
  // Контейнер 300% × 300%, повёрнут на 30°. Лент нужно ×3 от высоты экрана + запас.
  // На мобильных создаём меньше лент для производительности (но фон сохраняем)
  const RIBBON_COUNT = Math.ceil((window.innerHeight * 3) / (s.ribbonH + s.gap)) + (isMobile ? 2 : 6);
  // Обложек: ширина ленты = s.ribbonW vw, каждая занимает step px. Запас +50%.
  const needed = Math.ceil((window.innerWidth * s.ribbonW / 100) / step) * 1.5;
  const COVERS_PER_RIBBON = Math.max(isMobile ? 16 : 24, Math.ceil(needed));
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

// ================================================================
// ПОПОЛНЕНИЕ СЕРВИСОВ — табы, быстрые суммы, расчёт комиссии
// ================================================================
const TOPUP_COMMISSION = 0.074; // комиссия ~7.4%

/** Переключение табов сервиса */
function initTopupTabs() {
  const tabs = document.querySelectorAll('.topup-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      updateTopupPrice(); // пересчёт цены при смене сервиса
    });
  });
}

/** Автозаполнение суммы по кнопкам быстрого выбора с плавным счётом */
function initQuickSums() {
  const buttons = document.querySelectorAll('.quick-sum');
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      const amountEl = document.getElementById('topupAmount');
      if (!amountEl) return;
      const target = parseInt(this.dataset.amount, 10) || 0;
      // Плавный счёт от текущего значения до целевого
      animateAmountCount(amountEl, target);
    });
  });
}

/** Плавный счёт суммы в поле ввода */
function animateAmountCount(amountEl, target) {
  const from = parseFloat(amountEl.value) || 0;
  const duration = 500; // мс
  const startTime = performance.now();
  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Плавное замедление (ease-out)
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (target - from) * eased);
    amountEl.value = current;
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      amountEl.value = target;
      updateTopupPrice(); // после завершения счёта — пересчитываем цену
    }
  }
  requestAnimationFrame(frame);
}

/** Переключение кнопок выбора региона */
function initRegionTabs() {
  const tabs = document.querySelectorAll('.region-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/** Расчёт итоговой цены с комиссией и обновление pay-summary и прогресс-бара */
function updateTopupPrice() {
  const amountEl = document.getElementById('topupAmount');
  const priceEl = document.getElementById('topupPrice');
  if (!amountEl) return;
  let amount = parseFloat(amountEl.value);
  if (isNaN(amount) || amount <= 0) amount = 0;

  // Динамическая комиссия в зависимости от суммы
  let feePercent = 7.4;
  if (amount >= 15000) {
    feePercent = 2;
  } else if (amount >= 7500) {
    feePercent = 3.5;
  } else if (amount >= 5000) {
    feePercent = 5;
  } else if (amount >= 3000) {
    feePercent = 6;
  } else if (amount >= 2000) {
    feePercent = 6.5;
  }

  const total = Math.round(amount * (1 + feePercent / 100));
  if (priceEl) priceEl.textContent = total + ' ₽';

  // Обновляем панель «Способ оплаты»
  const paySum = document.getElementById('paySumAmount');
  const payFee = document.getElementById('paySumFee');
  const payTotal = document.getElementById('paySumTotal');
  const shown = (amount > 0) ? amount + ' ₽' : '0 ₽';
  if (paySum) paySum.textContent = shown;
  if (payFee) payFee.textContent = (amount > 0) ? (feePercent + '% (' + Math.round(amount * feePercent / 100) + ' ₽)') : '0 ₽';
  if (payTotal) payTotal.textContent = (amount > 0) ? (total + ' ₽') : '0 ₽';

  // Обновляем прогресс-бар комиссии
  updateFeeProgress(amount);
}

/** Обновление прогресс-бара и индикатора скидки */
function updateFeeProgress(amount) {
  // Прогресс: 0 → 15000 руб (от 7.4% до 2%)
  const maxForDiscount = 15000;
  const progress = Math.min(amount / maxForDiscount, 1);
  const fillEl = document.querySelector('.fee-progress-fill');
  const labelEl = document.querySelector('.fee-progress-label');
  const pctEl = document.querySelector('.fee-pct');
  const badgeEl = document.querySelector('.discount-badge b');

  if (fillEl) fillEl.style.width = Math.round(progress * 100) + '%';
  if (pctEl) {
    let currentFee = 7.4;
    if (amount >= 15000) currentFee = 2;
    else if (amount >= 7500) currentFee = 3.5;
    else if (amount >= 5000) currentFee = 5;
    else if (amount >= 3000) currentFee = 6;
    else if (amount >= 2000) currentFee = 6.5;
    pctEl.textContent = currentFee + '%';
  }
  if (badgeEl) {
    let discount = 0;
    if (amount >= 15000) discount = 5.4;
    else if (amount >= 7500) discount = 3.9;
    else if (amount >= 5000) discount = 2.4;
    else if (amount >= 3000) discount = 1.4;
    else if (amount >= 2000) discount = 0.9;
    badgeEl.textContent = '-' + discount + '%';
  }
  if (labelEl) {
    const nextTier = amount < 2000 ? 2000 : amount < 3000 ? 3000 : amount < 5000 ? 5000 : amount < 7500 ? 7500 : amount < 15000 ? 15000 : 0;
    if (nextTier > 0) {
      const need = nextTier - amount;
      labelEl.innerHTML = 'Ещё ' + need + ' ₽ чтобы уменьшить комиссию';
    } else {
      labelEl.innerHTML = 'Минимальная комиссия!';
    }
  }
}

/** Валидация и «покупка» */
function submitTopup() {
  const amountEl = document.getElementById('topupAmount');
  const loginEl = document.getElementById('topupLogin');
  if (!amountEl || !loginEl) return;
  const amount = parseFloat(amountEl.value) || 0;
  const login = loginEl.value.trim();
  if (amount <= 0) {
    showToast('⚠️ Введите сумму больше 0');
    return;
  }
  if (!login) {
    showToast('⚠️ Введите логин аккаунта');
    return;
  }
  const total = Math.round(amount * (1 + TOPUP_COMMISSION));
  showToast(`✅ Заявка на пополнение ${total} ₽ создана!`);
  addNotification('💳', 'Пополнение сервисов', `Заявка на ${total} ₽ для "${login}" принята`, 'bonus');
}

/** Инициализация блока пополнения */
function initTopup() {
  initTopupTabs();
  initQuickSums();
  initPayMethods();
  initRegionTabs();

  // При любом input или change обновляем цену и прогресс
  document.addEventListener('input', updateTopupPrice);
  document.addEventListener('change', updateTopupPrice);

  // При клике на кнопки быстрой суммы — обновление с задержкой
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('quick-sum')) {
      setTimeout(updateTopupPrice, 50);
    }
  });

  // При загрузке — сразу обновляем
  updateTopupPrice();
  // Загружаем актуальный курс валют
  updateExchangeRates();
  // Обновляем курс каждые 10 минут
  setInterval(updateExchangeRates, 10 * 60 * 1000);
  if (document.readyState === 'complete') {
    setTimeout(updateTopupPrice, 100);
  } else {
    window.addEventListener('load', function() { setTimeout(updateTopupPrice, 100); });
  }
}
window.initTopup = initTopup;
window.submitTopup = submitTopup;
window.updateTopupPrice = updateTopupPrice;

/** Получение актуального курса валют к рублю и обновление на странице */
function updateExchangeRates() {
  const usdEl = document.getElementById('fxUsd');
  const eurEl = document.getElementById('fxEur');
  const cnyEl = document.getElementById('fxCny');
  if (!usdEl && !eurEl && !cnyEl) return;

  // Функция отображения курса с округлением до сотых
  function apply(usd, eur, cny) {
    if (usdEl && usd) usdEl.textContent = usd.toFixed(2) + ' ₽';
    if (eurEl && eur) eurEl.textContent = eur.toFixed(2) + ' ₽';
    if (cnyEl && cny) cnyEl.textContent = cny.toFixed(2) + ' ₽';
  }

  // Попытка 1: бесплатный API exchangerate-api (USD/EUR/CNY → RUB)
  fetch('https://open.er-api.com/v6/latest/RUB')
    .then(r => r.ok ? r.json() : Promise.reject('HTTP ' + r.status))
    .then(data => {
      if (!data || data.result !== 'success' || !data.rates) throw new Error('bad data');
      // API отдаёт 1 RUB = X USD, инвертируем в цену за 1 USD
      const usd = 1 / data.rates.USD;
      const eur = 1 / data.rates.EUR;
      const cny = 1 / data.rates.CNY;
      apply(usd, eur, cny);
    })
    .catch(() => {
      // Попытка 2: API ЦБ РФ (ежедневные официальные курсы)
      fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(r => r.ok ? r.json() : Promise.reject('HTTP ' + r.status))
        .then(d => {
          if (!d || !d.Valute) throw new Error('bad data');
          const usd = d.Valute.USD && d.Valute.USD.Value;
          const eur = d.Valute.EUR && d.Valute.EUR.Value;
          // CNY берём из ЦБ
          let cny = d.Valute.CNY && d.Valute.CNY.Value;
          if (!cny) cny = usd ? usd / 7.2 : null; // аппроксимация CNY через USD
          apply(usd, eur, cny);
        })
        .catch(() => {
          // Попытка 3: другой бесплатный API (exchangerate.host)
          fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(r => r.ok ? r.json() : Promise.reject('HTTP ' + r.status))
            .then(d => {
              if (!d || !d.rates || !d.rates.RUB) throw new Error('bad data');
              const usd = d.rates.RUB;
              const eur = d.rates.RUB / d.rates.EUR;
              const cny = d.rates.RUB / d.rates.CNY;
              apply(usd, eur, cny);
            })
            .catch(() => {
              // Все API недоступны — используем актуальные приближённые значения
              apply(88.5, 96.2, 12.4);
            });
        });
    });
}
window.updateExchangeRates = updateExchangeRates;

/** Открывает модальное окно с инструкцией «Как узнать логин Steam?» */
function openSteamLoginHelp() {
  const modal = document.getElementById('steamLoginHelpModal');
  if (modal) modal.classList.add('active');
}
window.openSteamLoginHelp = openSteamLoginHelp;

// ================================================================
// СПОСОБ ОПЛАТЫ — переключение «Картой» / «СБП»
// ================================================================
function initPayMethods() {
  const methods = document.querySelectorAll('.pay-method');
  if (!methods.length) return;
  methods.forEach(btn => {
    btn.addEventListener('click', function() {
      methods.forEach(m => m.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/** Получить выбранный способ оплаты: 'card' | 'sbp' */
function getSelectedPayMethod() {
  const active = document.querySelector('.pay-method.active');
  return active ? active.dataset.method : 'card';
}

/** Обработка нажатия «Оплатить» */
function submitPayment() {
  // Проверка логина
  const loginEl = document.getElementById('topupLogin');
  if (!loginEl || !loginEl.value.trim()) {
    showToast('⚠️ Введите логин аккаунта Steam');
    if (loginEl) {
      loginEl.focus();
      loginEl.classList.add('input-error');
      loginEl.style.borderColor = '#ff6b6b';
      loginEl.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
      setTimeout(() => {
        loginEl.classList.remove('input-error');
        loginEl.style.borderColor = '';
        loginEl.style.boxShadow = '';
      }, 3000);
    }
    return;
  }
  const agree = document.getElementById('payAgree');
  const rules = document.getElementById('legalRules');
  const promo = document.getElementById('payPromo');
  if (agree && !agree.checked) {
    showToast('⚠️ Подтвердите согласие с офертой об оказании услуг');
    return;
  }
  if (rules && !rules.checked) {
    showToast('⚠️ Подтвердите, что ознакомлены с правилами оплаты и условиями возврата');
    return;
  }
  const method = getSelectedPayMethod();
  // Если выбран СБП — открываем окно с QR-кодом для оплаты
  if (method === 'sbp') {
    openQRPayment();
    return;
  }
  // Если выбрана карта — открываем окно ввода банковской карты
  if (method === 'card') {
    openCardPayment();
    return;
  }
  const promoText = promo && promo.value ? promo.value.trim() : 'без промокода';
  showToast('✅ Заявка на оплату создана (' + promoText + ')');
  addNotification('💳', 'Оплата', 'Заявка на оплату принята', 'bonus');
}

/** Открыть окно оплаты через СБП с QR-кодом */
function openQRPayment() {
  const amountEl = document.getElementById('topupAmount');
  const amount = amountEl ? (parseFloat(amountEl.value) || 0) : 0;
  // Расчёт итоговой суммы с комиссией (как в панели оплаты)
  let feePercent = 7.4;
  if (amount >= 15000) feePercent = 2;
  else if (amount >= 7500) feePercent = 3.5;
  else if (amount >= 5000) feePercent = 5;
  else if (amount >= 3000) feePercent = 6;
  else if (amount >= 2000) feePercent = 6.5;
  const total = Math.round(amount * (1 + feePercent / 100));
  // Показываем итоговую сумму к оплате в QR-коде
  const amountBox = document.getElementById('qrAmount');
  if (amountBox) {
    amountBox.innerHTML = (amount > 0 ? total : 500) + ' ₽' +
      `<div class="qr-amount-detail">сумма ${(amount > 0 ? amount : 500)} ₽ + комиссия ${feePercent}%</div>`;
  }
  generateQR();
  openModal('qrPaymentModal');
  startQRCountdown();
}

/** Генерация псевдо-QR-кода (детерминированный узор) */
function generateQR() {
  const grid = document.getElementById('qrGrid');
  if (!grid) return;
  const size = 21; // 21x21 модулей, как у настоящего QR
  let cells = '';
  // Детерминированный генератор на основе времени (меняется каждую генерацию)
  let seed = Date.now() % 100000;
  function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Три угловых маркера (как у QR)
      const inFinder = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      let dark = rand() > 0.48;
      if (inFinder) {
        // Угловой квадрат
        const fx = x % 7, fy = y % 7;
        dark = (fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4));
      } else if (x === 6 || y === 6) {
        dark = (x + y) % 2 === 0; // линия разделителя
      }
      cells += `<div class="qr-cell ${dark ? 'dark' : ''}"></div>`;
    }
  }
  grid.innerHTML = cells;
}

/** Таймер истечения QR-кода (5 минут) */
let qrTimerInterval = null;
function startQRCountdown() {
  if (qrTimerInterval) clearInterval(qrTimerInterval);
  let seconds = 300; // 5:00
  const timerEl = document.getElementById('qrTimer');
  function tick() {
    if (!timerEl) { clearInterval(qrTimerInterval); return; }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    seconds--;
    if (seconds < 0) {
      clearInterval(qrTimerInterval);
      timerEl.textContent = 'Истёк — обновите код';
      generateQR(); // автоматически обновляем
      startQRCountdown();
    }
  }
  tick();
  qrTimerInterval = setInterval(tick, 1000);
}
window.initPayMethods = initPayMethods;
window.submitPayment = submitPayment;
window.openQRPayment = openQRPayment;
window.generateQR = generateQR;

// ================================================================
// ОПЛАТА КАРТОЙ — модальное окно с формой банковской карты
// ================================================================
/** Открыть окно оплаты картой */
function openCardPayment() {
  const amountEl = document.getElementById('topupAmount');
  const amount = amountEl ? (parseFloat(amountEl.value) || 0) : 0;
  let feePercent = 7.4;
  if (amount >= 15000) feePercent = 2;
  else if (amount >= 7500) feePercent = 3.5;
  else if (amount >= 5000) feePercent = 5;
  else if (amount >= 3000) feePercent = 6;
  else if (amount >= 2000) feePercent = 6.5;
  const total = Math.round(amount * (1 + feePercent / 100));
  const totalEl = document.getElementById('cardPayTotal');
  if (totalEl) totalEl.textContent = (amount > 0 ? total : 500) + ' ₽';
  // Сброс формы при открытии
  const num = document.getElementById('cardNumber');
  if (num) { num.value = ''; }
  const exp = document.getElementById('cardExpiry');
  if (exp) { exp.value = ''; }
  const cvv = document.getElementById('cardCvv');
  if (cvv) { cvv.value = ''; }
  const holder = document.getElementById('cardHolder');
  if (holder) { holder.value = ''; }
  updateCardDisplay();
  openModal('cardPaymentModal');
}
window.openCardPayment = openCardPayment;

/** Форматирование номера карты: группы по 4 цифры */
function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
  updateCardDisplay();
}

/** Форматирование срока действия: ММ/ГГ */
function formatCardExpiry(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) {
    v = v.slice(0, 2) + '/' + v.slice(2);
  }
  input.value = v;
  updateCardDisplay();
}

/** Ограничение CVV: только цифры */
function formatCardCvv(input) {
  input.value = input.value.replace(/\D/g, '').slice(0, 3);
}

/** Обновление виртуальной карты на основе ввода */
function updateCardDisplay() {
  const num = document.getElementById('cardNumber');
  const numDisp = document.getElementById('cardNumberDisplay');
  if (numDisp && num) {
    numDisp.textContent = num.value.trim() || '•••• •••• •••• ••••';
  }
  const exp = document.getElementById('cardExpiry');
  const expDisp = document.getElementById('cardExpiryDisplay');
  if (expDisp && exp) {
    expDisp.textContent = exp.value.trim() || 'ММ/ГГ';
  }
  const holder = document.getElementById('cardHolder');
  const holderDisp = document.getElementById('cardHolderDisplay');
  if (holderDisp && holder) {
    holderDisp.textContent = holder.value.trim().toUpperCase() || 'ДЕРЖАТЕЛЬ КАРТЫ';
  }
}
window.updateCardDisplay = updateCardDisplay;

/** Обработка оплаты картой */
function processCardPayment() {
  const num = document.getElementById('cardNumber');
  const exp = document.getElementById('cardExpiry');
  const cvv = document.getElementById('cardCvv');
  const holder = document.getElementById('cardHolder');
  // Валидация
  if (!num || num.value.replace(/\s/g, '').length !== 16) {
    showToast('⚠️ Введите корректный номер карты (16 цифр)');
    if (num) num.focus();
    return;
  }
  if (!exp || exp.value.length !== 5) {
    showToast('⚠️ Введите срок действия карты (ММ/ГГ)');
    if (exp) exp.focus();
    return;
  }
  if (!cvv || cvv.value.length !== 3) {
    showToast('⚠️ Введите CVV-код (3 цифры)');
    if (cvv) cvv.focus();
    return;
  }
  if (!holder || !holder.value.trim()) {
    showToast('⚠️ Введите имя держателя карты');
    if (holder) holder.focus();
    return;
  }
  const totalEl = document.getElementById('cardPayTotal');
  const total = totalEl ? totalEl.textContent : '0 ₽';
  closeModal('cardPaymentModal');
  showToast(`✅ Оплата картой на сумму ${total} прошла успешно!`);
  addNotification('💳', 'Оплата картой', `Платёж ${total} подтверждён`, 'bonus');
  createConfetti();
}
window.processCardPayment = processCardPayment;
window.formatCardNumber = formatCardNumber;
window.formatCardExpiry = formatCardExpiry;
window.formatCardCvv = formatCardCvv;

/** Анимированный счётчик пополнений */
function animateRefillCounter() {
  const el = document.getElementById('refillCounter');
  if (!el) return;
  const target = 31448536;
  const duration = 3000;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Плавное замедление (ease-out)
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString('ru-RU');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initTopup();
    animateRefillCounter();
    initResponsiveScale();
  });
} else {
  initTopup();
  animateRefillCounter();
  initResponsiveScale();
}

/**
 * Адаптивное масштабирование для мобильных устройств.
 * При уменьшении окна (вплоть до 100%) весь контент сайта
 * пропорционально уменьшается, чтобы всё вмещалось без переполнения.
 * Работает только на мобильных экранах (<= 820px).
 */
function initResponsiveScale() {
  function applyScale() {
    const width = window.innerWidth;
    // Масштабирование только для мобильных/планшетов (<= 900px)
    if (width > 900) {
      document.documentElement.style.zoom = '100%';
      return;
    }
    // Плавное уменьшение масштаба от 100% до 50%:
    //   на 900px  -> 100%
    //   на 650px  ->  75%
    //   на 450px  ->  50%
    //   <= 450px  ->  50% (не ниже)
    // Линейная формула: scale = width / 900, ограничено [0.5, 1]
    const scale = Math.max(0.5, Math.min(1, width / 900));
    document.documentElement.style.zoom = (scale * 100) + '%';
  }
  // Применяем сразу и при изменении размера окна
  applyScale();
  window.addEventListener('resize', applyScale);
}
window.initResponsiveScale = initResponsiveScale;

// ================================================================
// ЛИЧНЫЙ КАЛЕНДАРЬ (Steam New & Upcoming)
// ================================================================
(function(){
function init(){
  const track=document.getElementById('calTrack'),dotsBox=document.getElementById('calDots'),next=document.getElementById('calNext'),prev=document.getElementById('calPrev');
  if(!track||typeof GAMES==='undefined'||!GAMES.length)return;
  const WD=['ПН','ВТ','СР','ЧТ','ПТ'],EXTRA=[0,2,0,1,0];
  const REPEAT=4; // 4 итерации прокрутки
  const now=new Date(),mon=new Date(now);mon.setDate(now.getDate()-((now.getDay()+6)%7));
  let html='';
  for(let r=0;r<REPEAT;r++){
    WD.forEach((wd,i)=>{
      // Каждая неделя — смещение на +7 дней от предыдущей
      const dayIdx=r*5+i;
      const dt=new Date(mon);dt.setDate(mon.getDate()+dayIdx);
      const label=String(dt.getDate()).padStart(2,'0')+'.'+String(dt.getMonth()+1).padStart(2,'0');
      // Уникальные обложки для каждого дня (сдвиг по индексу)
      const a=GAMES[(dayIdx*3)%GAMES.length],b=GAMES[(dayIdx*3+1)%GAMES.length];
      html+=`<div class="cal-day">
        <div class="cal-day-head"><span>${wd}</span><b>${label}</b></div>
        <img src="${gameImg(a)}" alt="${a.name}" loading="lazy" onclick="openGameDetail('${a.name.replace(/'/g,"\\'")}')">
        <img src="${gameImg(b)}" alt="${b.name}" loading="lazy" onclick="openGameDetail('${b.name.replace(/'/g,"\\'")}')">
        ${EXTRA[i]?`<div class="cal-more">и ещё ${EXTRA[i]}</div>`:''}
      </div>`;
    });
  }
  track.innerHTML=html;
  function updNav(){
    // Ровно REPEAT прокруток (4), значит ровно 4 точки
    const pages=REPEAT;
    const idx=Math.min(pages-1,Math.max(0,Math.round(track.scrollLeft/(track.clientWidth||1))));
    // Точки-пагинация (по количеству прокруток)
    if(dotsBox.children.length!==pages){
      dotsBox.innerHTML=Array.from({length:pages},(_,i)=>`<span data-i="${i}"></span>`).join('');
    }
    [...dotsBox.children].forEach((s,i)=>s.classList.toggle('active',i===idx));
    // Стрелки: прячем у краёв
    if(prev)prev.classList.toggle('hidden',idx<=0);
    if(next)next.classList.toggle('hidden',idx>=pages-1);
  }
  track.addEventListener('scroll',updNav);
  dotsBox.addEventListener('click',e=>{const s=e.target.closest('span');if(s)track.scrollTo({left:+s.dataset.i*track.clientWidth,behavior:'smooth'});});
  if(next)next.addEventListener('click',()=>track.scrollBy({left:track.clientWidth,behavior:'smooth'}));
  if(prev)prev.addEventListener('click',()=>track.scrollBy({left:-track.clientWidth,behavior:'smooth'}));
  window.addEventListener('resize',updNav);
  updNav();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();

// ================================================================
// ЛЕНТА ВЫБОРА ЖАНРА — картинки-обложки (страница «Игры»)
// ================================================================
(function(){
function initGenreCarousel(){
  const track=document.getElementById('genreTrack');
  if(!track||typeof GAMES==='undefined'||!GAMES.length)return;
  // Жанры с переводом и порядком: сначала «Все», затем остальные
  const genres=[
    {key:'all',label:translations[currentLanguage]?translations[currentLanguage]['filter_all']:'Все'},
    {key:'shooter',label:translations[currentLanguage]?translations[currentLanguage]['filter_shooter']:'Шутеры'},
    {key:'strategy',label:translations[currentLanguage]?translations[currentLanguage]['filter_strategy']:'Стратегии'},
    {key:'rpg',label:translations[currentLanguage]?translations[currentLanguage]['filter_rpg']:'RPG'},
    {key:'survival',label:translations[currentLanguage]?translations[currentLanguage]['filter_survival']:'Выживание'},
    {key:'sandbox',label:translations[currentLanguage]?translations[currentLanguage]['filter_sandbox']:'Песочницы'},
    {key:'sport',label:translations[currentLanguage]?translations[currentLanguage]['filter_sport']:'Спорт'},
    {key:'indie',label:translations[currentLanguage]?translations[currentLanguage]['filter_indie']:'Инди'},
    {key:'horror',label:translations[currentLanguage]?translations[currentLanguage]['filter_horror']:'Хоррор'}
  ];
  // Представительная узнаваемая игра для каждого жанра (по имени файла)
  function coverFor(key){
    const byImg={
      all:'7_days_to_die.jpg',
      shooter:'apex_legends.jpg',
      strategy:'age_of_empires_4.jpg',
      rpg:'baldurs_gate_3.jpg',
      survival:'dayz.jpg',
      sandbox:'beamng_drive.jpg',
      sport:'assetto_corsa.jpg',
      indie:'celeste.jpg',
      horror:'alien_isolation.jpg'
    };
    // Ищем игру по имени файла, иначе — первую игру жанра
    const g=GAMES.find(x=>x.img===byImg[key])||GAMES.find(x=>x.cat===key)||GAMES[0];
    return gameImg(g);
  }
  track.innerHTML=genres.map((gr,i)=>{
    const img=coverFor(gr.key);
    const active=i===0?'active':'';
    return `<div class="genre-card ${active}" data-genre="${gr.key}" onclick="filterGames('${gr.key}', this)">
      <img src="${img}" alt="${gr.label}" loading="lazy">
      <div class="genre-label">${gr.label}</div>
    </div>`;
  }).join('');
  const prev=document.getElementById('gPrev'),next=document.getElementById('gNext');
  const step=()=>Math.max(150, Math.round(track.clientWidth*0.7));
  if(prev)prev.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  if(next)next.addEventListener('click',()=>track.scrollBy({left: step(),behavior:'smooth'}));
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',initGenreCarousel):initGenreCarousel();
})();

// ================================================================
// БИБЛИОТЕКА (страница «Библиотека»)
// ================================================================
let libSort = 'asc';
function libCard(g, overlay){
  return `<div class="lib-card${overlay?'':''}" onclick="openGameDetail('${g.name.replace(/'/g, "\\'")}')">
    <img src="${gameImg(g)}" alt="${g.name}" loading="lazy">
    ${overlay||''}
  </div>`;
}
function libWideCard(g, dateLabel, title, gameName){
  return `<div class="lib-card wide" onclick="openGameDetail('${g.name.replace(/'/g, "\\'")}')">
    <img src="${gameImg(g)}" alt="${g.name}" loading="lazy">
    <div class="lib-date">${dateLabel}</div>
    <div class="lib-news-title">${title||g.name}</div>
    <div class="lib-news-chip">${g.name}</div>
  </div>`;
}
function renderLibrary(){
  const listEl=document.getElementById('libList');
  const gridEl=document.getElementById('libGrid');
  const recentEl=document.getElementById('libRecent');
  const newsEl=document.getElementById('libWhatsNew');
  const suggestEl=document.getElementById('libSuggest');
  const countEl=document.getElementById('libCount');
  if(typeof GAMES==='undefined'||!GAMES.length)return;

  // Алфавитный список (сайдбар)
  const sorted=[...GAMES].sort((a,b)=>a.name.localeCompare(b.name));
  if(listEl){
    listEl.innerHTML=sorted.map(g=>`<div class="lib-list-item" onclick="openGameDetail('${g.name.replace(/'/g,"\\'")}')">
      <img src="${gameImg(g)}" alt=""><span>${g.name}</span>
    </div>`).join('');
  }
  // Сетка «Все игры»
  if(gridEl) renderLibGrid(sorted);
  if(countEl) countEl.textContent=GAMES.length;

  // Недавние игры — 6 штук, у первой оверлей «ВЫ ИГРАЛИ»
  if(recentEl){
    const recent=GAMES.slice(0,6);
    recentEl.innerHTML=recent.map((g,i)=>{
      if(i===0){
        const mins=Math.floor(Math.random()*400+60);
        const total=Math.floor(Math.random()*2000+500);
        const ov=`<div class="lib-overlay"><strong>ВЫ ИГРАЛИ</strong><br>${mins} мин. за последние две недели / ${total} мин. всего</div>`;
        return libCard(g,ov);
      }
      return libCard(g);
    }).join('');
  }
  // Что нового — 4 широких карточки
  if(newsEl){
    const dates=['Вчера','на этой неделе','август','июль'];
    const newsGames=GAMES.slice(40,44);
    newsEl.innerHTML=newsGames.map((g,i)=>libWideCard(g,dates[i]||'',g.name,'')).join('');
  }
  // Во что поиграть? — рекомендации, у первой «САМЫЕ ПОПУЛЯРНЫЕ»
  if(suggestEl){
    const suggest=GAMES.slice(32,36);
    suggestEl.innerHTML=suggest.map((g,i)=>{
      if(i===0){
        const ov=`<div class="lib-overlay">САМЫЕ ПОПУЛЯРНЫЕ<br>среди игроков, похожих на вас</div>`;
        return libCard(g,ov);
      }
      return libCard(g);
    }).join('');
  }
}
function renderLibGrid(list){
  const gridEl=document.getElementById('libGrid');
  if(!gridEl)return;
  const arr=[...list];
  if(libSort==='desc') arr.reverse();
  gridEl.innerHTML=arr.map(g=>libCard(g)).join('');
}
function filterLibrary(q){
  const query=(q||'').trim().toLowerCase();
  const listEl=document.getElementById('libList');
  const all=typeof GAMES==='undefined'?[]:[...GAMES].sort((a,b)=>a.name.localeCompare(b.name));
  if(listEl){
    listEl.innerHTML=all.filter(g=>g.name.toLowerCase().includes(query)).map(g=>`<div class="lib-list-item" onclick="openGameDetail('${g.name.replace(/'/g,"\\'")}')">
      <img src="${gameImg(g)}" alt=""><span>${g.name}</span>
    </div>`).join('');
  }
  renderLibGrid(all.filter(g=>g.name.toLowerCase().includes(query)));
}
function sortLibrary(v){
  libSort=v;
  const all=typeof GAMES==='undefined'?[]:[...GAMES].sort((a,b)=>a.name.localeCompare(b.name));
  renderLibGrid(all);
}
window.renderLibrary=renderLibrary;
window.filterLibrary=filterLibrary;
window.sortLibrary=sortLibrary;

