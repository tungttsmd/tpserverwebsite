// Language Switcher
class LanguageSwitcher {
    constructor() {
        this.elements = document.querySelectorAll('[data-i18n]');
        this.currentLang = localStorage.getItem('language') || 'vi';
        this.init();
        // Don't initialize language here, it will be handled by national-detection.js
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`resources/lang/${lang}.json`);
            if (!response.ok) throw new Error('Language file not found');
            return await response.json();
        } catch (error) {
            console.error('Error loading language file:', error);
            // Try to load default language if preferred language fails
            if (lang !== 'vi') {
                return this.loadLanguage('vi');
            }
            return null;
        }
    }

    async initLanguage() {
        const translations = await this.loadLanguage(this.currentLang);
        if (translations) {
            this.updateContent(translations);
            document.documentElement.lang = this.currentLang;
            this.updateActiveButton(this.currentLang);
            this.updateFlag(this.currentLang);
        }
    }

    async switchLanguage(lang, force = false) {
        if (!force && lang === this.currentLang) return false;

        // Hide content while switching languages
        document.documentElement.style.visibility = 'hidden';
        document.body.classList.remove('i18n-loaded');
        
        try {
            const translations = await this.loadLanguage(lang);
            if (!translations) {
                // If loading fails, show content anyway but don't mark as loaded
                document.documentElement.style.visibility = '';
                return false;
            }

            this.currentLang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;

            // Update content and UI
            this.updateContent(translations);
            this.updateActiveButton(lang);
            this.updateFlag(lang);

            // Show content and mark as loaded after a small delay to ensure rendering is complete
            setTimeout(() => {
                document.documentElement.style.visibility = '';
                document.body.classList.add('i18n-loaded');
            }, 50);

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

            return true;
        } catch (error) {
            console.error('Error switching language:', error);
            // Make sure content is visible even if there was an error
            document.documentElement.style.visibility = '';
            return false;
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

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.language-dropdown');
            const menu = document.querySelector('.language-dropdown-menu');
            const isClickInside = dropdown?.contains(e.target);

            if (!isClickInside && menu) {
                menu.classList.remove('show');
            }
        });
    }
}

// Initialize language switcher when DOM is fully loaded
function initLanguageSwitcher() {
    if (!window.languageSwitcher) {
        window.languageSwitcher = new LanguageSwitcher();
        // If national detection hasn't set the language yet, set it now
        if (!localStorage.getItem('language')) {
            window.languageSwitcher.switchLanguage('en');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
}

// Language Dropdown Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Toggle dropdown menu
    document.querySelectorAll('.language-dropdown-toggle').forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other dropdowns
            document
                .querySelectorAll('.language-dropdown-menu')
                .forEach((m) => {
                    if (m !== menu) {
                        m.classList.remove('show');
                        const toggleBtn = m.previousElementSibling;
                        if (toggleBtn) {
                            toggleBtn.setAttribute('aria-expanded', 'false');
                            const svg = toggleBtn.querySelector('svg');
                            if (svg) svg.style.transform = 'rotate(0deg)';
                        }
                    }
                });

            // Toggle current dropdown
            if (isExpanded) {
                menu.classList.remove('show');
                this.setAttribute('aria-expanded', 'false');
                const svg = this.querySelector('svg');
                if (svg) svg.style.transform = 'rotate(0deg)';
            } else {
                menu.classList.add('show');
                this.setAttribute('aria-expanded', 'true');
                const svg = this.querySelector('svg');
                if (svg) svg.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.language-dropdown')) {
            document
                .querySelectorAll('.language-dropdown-menu')
                .forEach((menu) => {
                    menu.classList.remove('show');
                    const toggle = menu.previousElementSibling;
                    if (toggle) {
                        toggle.setAttribute('aria-expanded', 'false');
                        const svg = toggle.querySelector('svg');
                        if (svg) svg.style.transform = 'rotate(0deg)';
                    }
                });
        }
    });

    // Handle language selection
    document.querySelectorAll('.language-option').forEach((option) => {
        option.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            const dropdown = this.closest('.language-dropdown');
            if (!dropdown) return;

            const toggle = dropdown.querySelector('.language-dropdown-toggle');
            const menu = dropdown.querySelector('.language-dropdown-menu');
            const currentFlag = dropdown.querySelector('.current-flag');
            const selectedFlag = this.querySelector('img')?.cloneNode(true);

            if (currentFlag && selectedFlag) {
                currentFlag.src = selectedFlag.src;
                currentFlag.alt = selectedFlag.alt;
            }

            // Update toggle text if it exists (for mobile)
            const toggleText = toggle?.querySelector('span[data-i18n]');
            if (toggleText) {
                const selectedText = this.textContent.trim();
                toggleText.textContent = selectedText;
            }

            // Close the menu
            if (menu) menu.classList.remove('show');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
                const svg = toggle.querySelector('svg');
                if (svg) svg.style.transform = 'rotate(0deg)';
            }

            // Trigger language change
            if (window.languageSwitcher) {
                window.languageSwitcher.switchLanguage(lang);
            }
        });
    });
});
