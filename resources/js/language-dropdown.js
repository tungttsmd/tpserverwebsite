// Language Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdown menu
    document.querySelectorAll('.language-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other dropdowns
            document.querySelectorAll('.language-dropdown-menu').forEach(m => {
                if (m !== menu) {
                    m.classList.remove('show');
                    m.previousElementSibling.setAttribute('aria-expanded', 'false');
                    m.previousElementSibling.querySelector('svg').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current dropdown
            if (isExpanded) {
                menu.classList.remove('show');
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('svg').style.transform = 'rotate(0deg)';
            } else {
                menu.classList.add('show');
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('svg').style.transform = 'rotate(180deg)';
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-dropdown')) {
            document.querySelectorAll('.language-dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
                const toggle = menu.previousElementSibling;
                toggle.setAttribute('aria-expanded', 'false');
                const svg = toggle.querySelector('svg');
                if (svg) svg.style.transform = 'rotate(0deg)';
            });
        }
    });

    // Handle language selection
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            const dropdown = this.closest('.language-dropdown');
            const toggle = dropdown.querySelector('.language-dropdown-toggle');
            const menu = dropdown.querySelector('.language-dropdown-menu');
            const currentFlag = dropdown.querySelector('.current-flag');
            const selectedFlag = this.querySelector('img').cloneNode(true);
            
            // Update current flag and text
            currentFlag.src = selectedFlag.src;
            currentFlag.alt = selectedFlag.alt;
            
            // Update toggle text if it exists (for mobile)
            const toggleText = toggle.querySelector('span[data-i18n]');
            if (toggleText) {
                const selectedText = this.textContent.trim();
                toggleText.textContent = selectedText;
            }
            
            // Close the menu
            menu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            const svg = toggle.querySelector('svg');
            if (svg) svg.style.transform = 'rotate(0deg)';
            
            // Trigger language change
            if (window.languageSwitcher) {
                window.languageSwitcher.switchLanguage(lang);
            }
        });
    });
});

// Update language switcher to work with dropdown
const originalSwitchLanguage = window.languageSwitcher?.switchLanguage;
if (originalSwitchLanguage) {
    window.languageSwitcher.switchLanguage = async function(lang) {
        await originalSwitchLanguage.call(this, lang);
        
        // Update dropdown toggles
        document.querySelectorAll('.language-dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.language-dropdown-toggle');
            const currentFlag = toggle.querySelector('.current-flag');
            const toggleText = toggle.querySelector('span[data-i18n]');
            
            // Find the selected option
            const selectedOption = dropdown.querySelector(`.language-option[data-lang="${lang}"]`);
            if (selectedOption) {
                const selectedFlag = selectedOption.querySelector('img');
                if (selectedFlag) {
                    currentFlag.src = selectedFlag.src;
                    currentFlag.alt = selectedFlag.alt;
                }
                
                if (toggleText) {
                    const selectedText = selectedOption.textContent.trim();
                    toggleText.textContent = selectedText;
                }
            }
        });
    };
}
