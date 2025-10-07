// Language Switcher
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'vi';
        this.elements = document.querySelectorAll('[data-i18n]');
        this.init();
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`resources/lang/${lang}.json`);
            if (!response.ok) throw new Error('Language file not found');
            return await response.json();
        } catch (error) {
            console.error('Error loading language file:', error);
            return null;
        }
    }

    async switchLanguage(lang) {
        if (this.currentLang === lang) return;

        const translations = await this.loadLanguage(lang);
        if (!translations) return;

        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        this.updateContent(translations);
        this.updateActiveButton(lang);
        this.updateFlag(lang);

        // Close mobile menu after language change
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const hamburgerBtn = document.querySelector('.mobile-menu-button');

        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');

            if (hamburgerBtn) {
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }

    updateContent(translations) {
        this.elements.forEach((element) => {
            const keys = element.getAttribute('data-i18n').split('.');
            let text = keys.reduce((obj, key) => obj?.[key], translations);
            if (text) {
                if (
                    element.tagName === 'INPUT' &&
                    element.hasAttribute('placeholder')
                ) {
                    element.placeholder = text;
                } else if (
                    element.tagName === 'INPUT' ||
                    element.tagName === 'TEXTAREA'
                ) {
                    element.value = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    updateActiveButton(lang) {
        document.querySelectorAll('.language-option').forEach((btn) => {
            const isActive = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
    }

    updateFlag(lang) {
        const flagImg = document.querySelector('.current-flag');
        if (!flagImg) return;

        const newFlag = document.querySelector(
            `.language-option[data-lang="${lang}"] img`
        )?.src;
        if (newFlag) {
            flagImg.src = newFlag;
        }
    }

    init() {
        // Add click event listeners to language options
        document.querySelectorAll('.language-option').forEach((option) => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                if (lang) {
                    this.switchLanguage(lang);
                }
            });
        });

        // Load current language
        const savedLang = localStorage.getItem('language') || 'vi';
        if (savedLang) {
            this.switchLanguage(savedLang);
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.language-dropdown');
            const isClickInside = dropdown?.contains(e.target);
            if (!isClickInside) {
                const menu = document.querySelector('.language-dropdown-menu');
                if (menu) {
                    menu.classList.remove('show');
                }
            }
        });
    }
}

// Initialize language switcher when DOM is fully loaded
function initLanguageSwitcher() {
    new LanguageSwitcher();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
}
