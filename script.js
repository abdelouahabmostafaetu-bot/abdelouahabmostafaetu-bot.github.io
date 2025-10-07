// ==================== THEME TOGGLE FUNCTIONALITY ====================
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);

// Toggle theme
themeBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Add a small animation effect
    themeBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeBtn.style.transform = 'rotate(0deg)';
    }, 300);
});

// ==================== SEARCH FUNCTIONALITY ====================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionsContainer = document.getElementById('suggestions');

// Sample search suggestions (you can expand this list)
const searchSuggestions = [
    { text: 'Mathematics tutorials', icon: '📐' },
    { text: 'Web development', icon: '💻' },
    { text: 'JavaScript programming', icon: '⚡' },
    { text: 'CSS animations', icon: '🎨' },
    { text: 'HTML5 features', icon: '🌐' },
    { text: 'React framework', icon: '⚛️' },
    { text: 'Python programming', icon: '🐍' },
    { text: 'Data structures', icon: '📊' },
    { text: 'Algorithms', icon: '🔍' },
    { text: 'Machine learning', icon: '🤖' },
    { text: 'Artificial intelligence', icon: '🧠' },
    { text: 'Database design', icon: '💾' },
    { text: 'Cloud computing', icon: '☁️' },
    { text: 'Mobile development', icon: '📱' },
    { text: 'UI/UX design', icon: '🎯' }
];

// Filter and display suggestions
function showSuggestions(query) {
    if (query.length < 1) {
        suggestionsContainer.classList.remove('active');
        return;
    }

    const filtered = searchSuggestions.filter(item =>
        item.text.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        suggestionsContainer.classList.remove('active');
        return;
    }

    suggestionsContainer.innerHTML = filtered.map(item => `
        <div class="suggestion-item" data-value="${item.text}">
            <span class="suggestion-icon">${item.icon}</span>
            <span>${highlightMatch(item.text, query)}</span>
        </div>
    `).join('');

    suggestionsContainer.classList.add('active');

    // Add click event to suggestions
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            searchInput.value = item.getAttribute('data-value');
            suggestionsContainer.classList.remove('active');
            performSearch(item.getAttribute('data-value'));
        });
    });
}

// Highlight matching text in suggestions
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--accent-color)">$1</strong>');
}

// Search input event listener
searchInput.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
});

// Search button click
searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
});

// Enter key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});

// Perform search (simulated - opens Google search)
function performSearch(query) {
    if (query.trim() === '') {
        showNotification('Please enter a search query', 'warning');
        return;
    }

    showNotification(`Searching for: "${query}"`, 'success');

    // Open Google search in new tab
    setTimeout(() => {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank');
    }, 500);
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        suggestionsContainer.classList.remove('active');
    }
});

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">✕</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        font-size: 14px;
    `;

    document.body.appendChild(notification);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add notification animations to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
    }

    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c👋 Welcome to Abdelouahab Mostafa\'s Website!', 'font-size: 20px; color: #4285f4; font-weight: bold;');
console.log('%c🚀 Built with HTML, CSS, and JavaScript', 'font-size: 14px; color: #34a853;');
console.log('%c✨ Featuring dark/light mode and Google-style search', 'font-size: 14px; color: #fbbc04;');
