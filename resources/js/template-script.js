/**
 * Modern Mobile Menu
 * - Enhanced with better performance and accessibility
 * - Uses event delegation for dynamic elements
 * - Adds keyboard navigation support
 */
const MobileMenu = (() => {
    // Cache DOM elements
    const selectors = {
        menu: '#mobileMenu',
        menuBtn: '#mobileMenuBtn',
        closeBtn: '#mobileMenuClose',
        overlay: '#mobileMenuOverlay',
        navLinks: '.mobile-menu-nav a',
        activeClass: 'active',
        noScrollClass: 'no-scroll',
    };

    // State
    let isOpen = false;
    let firstFocusableElement = null;
    let lastFocusableElement = null;

    // Initialize the mobile menu
    const init = () => {
        try {
            // Check for required elements
            const requiredElements = [
                document.querySelector(selectors.menu),
                document.querySelector(selectors.overlay),
                document.querySelector(selectors.menuBtn),
            ];

            if (requiredElements.some((el) => !el)) {
                console.warn('Mobile menu: Required elements not found', {
                    menu: selectors.menu,
                    overlay: selectors.overlay,
                    menuBtn: selectors.menuBtn,
                });
                return;
            }

            // Set up event listeners
            setupEventListeners();

            // Set initial state
            document.body.classList.add('js-mobile-menu-initialized');
        } catch (error) {
            console.error('Error initializing mobile menu:', error);
        }
    };

    // Set up all event listeners
    const setupEventListeners = () => {
        const { menuBtn, menu, overlay, closeBtn, navLinks } = selectors;

        // Toggle menu button
        const menuButton = document.querySelector(menuBtn);
        if (!menuButton) {
            console.warn('Menu button not found:', menuBtn);
            return;
        }
        menuButton.addEventListener('click', toggleMenu, { passive: false });

        // Overlay
        const overlayElement = document.querySelector(overlay);
        if (overlayElement) {
            overlayElement.addEventListener('click', closeMenu, {
                passive: true,
            });
        } else {
            console.warn('Overlay not found:', overlay);
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown, { passive: true });

        // Close on resize (if menu is open and we cross the mobile breakpoint)
        window.addEventListener('resize', () => handleResize(), {
            passive: true,
        });

        // Close menu when clicking on nav links
        if (navLinks) {
            const navLinksElements = document.querySelectorAll(navLinks);
            if (navLinksElements.length > 0) {
                navLinksElements.forEach((link) => {
                    link.addEventListener('click', closeMenu, {
                        passive: true,
                    });
                });
            } else {
                console.warn(
                    'No navigation links found with selector:',
                    navLinks
                );
            }
        }
    };

    // Toggle menu state
    const toggleMenu = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        isOpen ? closeMenu() : openMenu();
    };

    // Open the mobile menu
    const openMenu = () => {
        if (isOpen) return;

        const { menuBtn, menu, overlay, activeClass, noScrollClass } =
            selectors;
        const menuEl = document.querySelector(menu);

        // Add active classes
        document.querySelector(menuBtn).classList.add(activeClass);
        menuEl.classList.add(activeClass);
        document.querySelector(overlay).classList.add(activeClass);
        document.body.classList.add(noScrollClass);

        // Set focus to first focusable element
        const focusableElements = getFocusableElements(menuEl);
        if (focusableElements.length > 0) {
            firstFocusableElement = focusableElements[0];
            lastFocusableElement =
                focusableElements[focusableElements.length - 1];
            setTimeout(() => firstFocusableElement.focus(), 100);
        }

        // Animate menu items
        animateMenuItems();

        isOpen = true;

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('mobileMenu:opened'));
    };

    // Close the mobile menu
    const closeMenu = () => {
        if (!isOpen) return;

        const { menuBtn, menu, overlay, activeClass, noScrollClass } =
            selectors;

        // Remove active classes
        document.querySelector(menuBtn).classList.remove(activeClass);
        document.querySelector(menu).classList.remove(activeClass);
        document.querySelector(overlay).classList.remove(activeClass);
        document.body.classList.remove(noScrollClass);

        // Return focus to menu button
        document.querySelector(menuBtn).focus();

        isOpen = false;

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('mobileMenu:closed'));
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) return;

        const { key } = e;
        const activeElement = document.activeElement;

        // Close on Escape
        if (key === 'Escape') {
            e.preventDefault();
            closeMenu();
            return;
        }

        // Handle tab navigation within menu
        if (key === 'Tab') {
            if (e.shiftKey) {
                if (activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    };

    // Get all focusable elements within an element
    const getFocusableElements = (element) => {
        return [
            ...element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ),
        ].filter(
            (el) =>
                !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
        );
    };

    // Animate menu items with staggered delay
    const animateMenuItems = () => {
        const { navLinks, cta } = selectors;
        const links = document.querySelectorAll(navLinks);
        const ctaElement = document.querySelector(cta);

        // Reset animations
        links.forEach((link) => {
            link.style.animation = 'none';
            link.offsetHeight; // Trigger reflow
            link.style.animation = '';
            link.style.animationDelay = '';
        });

        // Set staggered delays
        links.forEach((link, index) => {
            link.style.animationDelay = `${0.25 + index * 0.1}s`;
        });

        // Animate CTA if exists
        if (ctaElement) {
            ctaElement.style.animation = 'none';
            ctaElement.offsetHeight; // Trigger reflow
            ctaElement.style.animation = '';
            ctaElement.style.animationDelay = '0.5s';
        }
    };
    // Handle window resize
    const handleResize = () => {
        clearTimeout(window.mobileMenuResizeTimer);
        window.mobileMenuResizeTimer = setTimeout(() => {
            if (isOpen && window.innerWidth >= 1024) {
                closeMenu();
            }
        }, 250);
    };

    // Public API
    return {
        init,
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        isOpen: () => isOpen,
        handleResize,
    };
})();
// Handle window resize
const handleResize = () => {
    clearTimeout(window.mobileMenuResizeTimer);
    window.mobileMenuResizeTimer = setTimeout(() => {
        if (isOpen && window.innerWidth >= 1024) {
            closeMenu();
        }
    }, 250);
    // Public API
    return {
        init,
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        isOpen: () => isOpen,
        handleResize,
    };
};
// Initialize all components
const initAll = () => {
    // Initialize mobile menu
    MobileMenu.init();

    // Remove the window resize event listener if it was added globally
    window.removeEventListener('resize', handleResize);

    // Add the resize handler through the MobileMenu's API
    window.addEventListener('resize', () => MobileMenu.handleResize(), {
        passive: true,
    });
};
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    // DOM already loaded, initialize immediately
    initAll();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileMenu, initAll };
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default and scroll if href is more than just '#'
        if (href && href.length > 1) {
            e.preventDefault();
            if (href === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            } else {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 15, 35, 0.95)';
        nav.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.2)';
    } else {
        nav.style.background = 'rgba(15, 15, 35, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el);
});

// Button effects
document.querySelectorAll('.btn-primary, .btn-secondary').forEach((button) => {
    button.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
    });

    button.addEventListener('mouseleave', function () {
        this.style.boxShadow = '';
    });
});

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat) => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        let count = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(timer);
                count = target;
            }
            const suffix = stat.textContent.replace(/[\d]/g, '');
            stat.textContent = Math.floor(count) + suffix;
        }, 20);
    });
};

// Trigger stats animation when section is visible
const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Glitch effect on hover for feature cards
document.querySelectorAll('.feature-card').forEach((card) => {
    card.addEventListener('mouseenter', function () {
        this.style.animation = 'glitch1 0.3s ease-in-out';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

// Random cyber text effects
const cyberTexts = [
    'CONNECTING...',
    'NEURAL LINK ESTABLISHED',
    'QUANTUM SYNC ACTIVE',
    'REALITY MATRIX LOADED',
];

setInterval(() => {
    const randomText =
        cyberTexts[Math.floor(Math.random() * cyberTexts.length)];
    const tempElement = document.createElement('div');
    tempElement.textContent = randomText;
    tempElement.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                color: var(--primary-cyan);
                font-size: 0.8rem;
                font-weight: 700;
                z-index: 1000;
                opacity: 0.7;
                pointer-events: none;
                animation: fadeOut 3s ease-out forwards;
                text-shadow: 0 0 10px var(--primary-cyan);
            `;
    document.body.appendChild(tempElement);

    setTimeout(() => {
        if (tempElement && tempElement.parentNode === document.body) {
            document.body.removeChild(tempElement);
        }
    }, 3000);
}, 5000);

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 0.7; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-50px); }
            }
        `;
document.head.appendChild(style);

// Contact form submission
if (document.querySelector('.btn-submit')) {
    document
        .querySelector('.btn-submit')
        .addEventListener('click', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                // Simulate form submission
                this.textContent = 'TRANSMITTING...';
                this.style.background =
                    'linear-gradient(135deg, var(--primary-cyan), var(--primary-pink))';

                setTimeout(() => {
                    this.textContent = 'TRANSMISSION COMPLETE';
                    this.style.background = 'var(--primary-cyan)';

                    // Clear form
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('message').value = '';

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        this.textContent = 'Transmit Message';
                        this.style.background = '';
                    }, 3000);
                }, 2000);
            }
        });
}
