/**
 * Back to Top Button
 * - Smooth scrolling with requestAnimationFrame for better performance
 * - Throttled scroll event for better performance
 * - Fallback for browsers that don't support smooth scrolling
 */
const BackToTop = (() => {
    // Configuration
    const config = {
        buttonId: 'scrollToTopBtn',
        scrollThreshold: 0.1, // Show button after scrolling 10% of the page
        animationDuration: 300, // ms
        visibleClass: 'visible',
        hiddenClass: 'hidden',
        scrollBehavior: 'smooth', // 'smooth' or 'auto'
    };

    // State
    let isVisible = false;
    let scrollTimeout = null;
    let animationFrame = null;
    let button = null;

    // Initialize the back to top button
    const init = () => {
        button = document.getElementById(config.buttonId);

        if (!button) {
            console.warn('Back to Top: Button element not found');
            return;
        }

        // Initial setup
        button.setAttribute('aria-label', 'Scroll to top');
        button.setAttribute('role', 'button');
        button.classList.add(config.hiddenClass);

        // Set up event listeners
        setupEventListeners();

        // Initial check
        checkScrollPosition();
    };

    // Set up event listeners
    const setupEventListeners = () => {
        // Throttled scroll event
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Click event for the button
        button.addEventListener('click', scrollToTop, { passive: true });

        // Keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
    };

    // Handle scroll event with throttling
    const handleScroll = () => {
        // Use requestAnimationFrame for better performance
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(() => {
                checkScrollPosition();
                animationFrame = null;
            });
        }
    };

    // Check scroll position and toggle button visibility
    const checkScrollPosition = () => {
        const scrollPosition =
            window.scrollY || document.documentElement.scrollTop;
        const windowHeight =
            window.innerHeight || document.documentElement.clientHeight;
        const documentHeight =
            document.documentElement.scrollHeight - windowHeight;
        const scrollPercentage =
            documentHeight > 0 ? scrollPosition / documentHeight : 0;

        if (scrollPercentage >= config.scrollThreshold) {
            showButton();
        } else {
            hideButton();
        }
    };

    // Show the button
    const showButton = () => {
        if (isVisible) return;

        button.classList.remove(config.hiddenClass);
        button.classList.add(config.visibleClass);
        button.setAttribute('aria-hidden', 'false');
        isVisible = true;
    };

    // Hide the button
    const hideButton = () => {
        if (!isVisible) return;

        button.classList.remove(config.visibleClass);
        button.classList.add(config.hiddenClass);
        button.setAttribute('aria-hidden', 'true');
        isVisible = false;
    };

    // Smooth scroll to top
    const scrollToTop = () => {
        const startPosition =
            window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();

        // If no duration, use native scroll behavior
        if (config.animationDuration <= 0) {
            window.scrollTo({ top: 0, behavior: config.scrollBehavior });
            return;
        }

        // Custom smooth scroll with requestAnimationFrame
        const animateScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(
                elapsedTime / config.animationDuration,
                1
            );

            // Easing function (easeInOutCubic)
            const easeInOutCubic = (t) =>
                t < 0.5
                    ? 4 * t * t * t
                    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

            const scrollY = startPosition * (1 - easeInOutCubic(progress));

            if (progress < 1) {
                window.scrollTo(0, scrollY);
                requestAnimationFrame(animateScroll);
            } else {
                window.scrollTo(0, 0);
            }
        };

        // Start the animation
        requestAnimationFrame(animateScroll);
    };

    // Public API
    return {
        init,
        show: showButton,
        hide: hideButton,
        scrollToTop,
    };
})();

// Initialize when DOM is ready
const initBackToTop = () => {
    try {
        BackToTop.init();
    } catch (error) {
        console.error('Error initializing back to top button:', error);
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop);
} else {
    initBackToTop();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BackToTop, initBackToTop };
}
