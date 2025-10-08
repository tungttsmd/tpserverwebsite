/**
 * Enhanced Accordion Component
 * - Better accessibility (ARIA attributes, keyboard navigation)
 * - Smooth animations with requestAnimationFrame
 * - Event delegation for better performance
 * - Configurable options
 */
const Accordion = (() => {
    // Default configuration
    const defaults = {
        selector: '.accordion',
        itemSelector: '.accordion-item',
        headerSelector: '.accordion-header',
        contentSelector: '.accordion-content',
        activeClass: 'active',
        animate: true,
        duration: 300,
        easing: 'ease-in-out',
        openFirst: true,
        onlyOneOpen: true,
        onOpen: null,
        onClose: null,
        onInit: null,
    };

    // State
    let config = {};
    let accordion = null;
    let items = [];
    let isAnimating = false;

    // Initialize the accordion
    const init = (options = {}) => {
        // Merge defaults with user options
        config = { ...defaults, ...options };

        // Get the accordion element
        accordion =
            typeof config.selector === 'string'
                ? document.querySelector(config.selector)
                : config.selector;

        if (!accordion) {
            console.warn(
                'Accordion: No element found with selector',
                config.selector
            );
            return;
        }

        // Initialize accordion items
        initItems();

        // Open first item if configured
        if (config.openFirst && items.length > 0) {
            openItem(items[0], false);
        }

        // Add event delegation for accordion headers
        accordion.addEventListener('click', handleClick);
        accordion.addEventListener('keydown', handleKeyDown);

        // Call onInit callback if provided
        if (typeof config.onInit === 'function') {
            config.onInit(accordion, items);
        }

        return {
            open: openItem,
            close: closeItem,
            toggle: toggleItem,
            destroy,
            getItems: () => items,
        };
    };

    // Initialize accordion items
    const initItems = () => {
        items = [];
        const itemElements = accordion.querySelectorAll(config.itemSelector);

        itemElements.forEach((item, index) => {
            const header = item.querySelector(config.headerSelector);
            const content = item.querySelector(config.contentSelector);

            if (!header || !content) {
                console.warn(
                    'Accordion: Missing header or content element in item',
                    item
                );
                return;
            }

            // Set ARIA attributes
            const itemId = `accordion-item-${index}`;
            const contentId = `accordion-content-${index}`;

            header.setAttribute('id', itemId);
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', contentId);
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');

            content.setAttribute('id', contentId);
            content.setAttribute('aria-labelledby', itemId);
            content.setAttribute('aria-hidden', 'true');
            content.style.overflow = 'hidden';
            content.style.transition = config.animate
                ? `max-height ${config.duration}ms ${config.easing}, opacity ${config.duration}ms ${config.easing}`
                : 'none';

            // Store item data
            items.push({
                element: item,
                header,
                content,
                isOpen: false,
                id: itemId,
            });
        });
    };

    // Handle click events on accordion headers
    const handleClick = (e) => {
        const header = e.target.closest(config.headerSelector);
        if (!header) return;

        e.preventDefault();

        const item = header.closest(config.itemSelector);
        const itemData = items.find((i) => i.element === item);

        if (!itemData) return;

        toggleItem(itemData);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        const header = e.target.closest(config.headerSelector);
        if (!header) return;

        const item = header.closest(config.itemSelector);
        const itemData = items.find((i) => i.element === item);

        if (!itemData) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                toggleItem(itemData);
                break;

            case 'ArrowDown':
                e.preventDefault();
                focusNextItem(itemData);
                break;

            case 'ArrowUp':
                e.preventDefault();
                focusPrevItem(itemData);
                break;

            case 'Home':
                e.preventDefault();
                if (items.length > 0) focusItem(items[0]);
                break;

            case 'End':
                e.preventDefault();
                if (items.length > 0) focusItem(items[items.length - 1]);
                break;
        }
    };

    // Toggle accordion item
    const toggleItem = (itemData, animate = true) => {
        if (isAnimating) return;

        if (itemData.isOpen) {
            closeItem(itemData, animate);
        } else {
            openItem(itemData, animate);
        }
    };

    // Open accordion item
    const openItem = (itemData, animate = true) => {
        if (itemData.isOpen || isAnimating) return;

        // Close other items if only one can be open
        if (config.onlyOneOpen) {
            items.forEach((item) => {
                if (item !== itemData && item.isOpen) {
                    closeItem(item, animate);
                }
            });
        }

        const content = itemData.content;
        
        // Set initial state before animation
        content.style.display = 'block';
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-8px)';
        
        // Force reflow to ensure initial state is applied
        content.offsetHeight;

        // Start animation
        isAnimating = true;
        itemData.isOpen = true;
        itemData.element.classList.add(config.activeClass);
        itemData.header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');

        if (animate && config.animate) {
            // Use CSS transitions for better performance
            content.style.maxHeight = '2000px';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            
            // Set up transition end event
            const onTransitionEnd = () => {
                content.removeEventListener('transitionend', onTransitionEnd);
                isAnimating = false;
                
                // Call onOpen callback if provided
                if (typeof config.onOpen === 'function') {
                    config.onOpen(itemData);
                }
            };
            
            content.addEventListener('transitionend', onTransitionEnd, { once: true });
        } else {
            // No animation
            content.style.maxHeight = '';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            isAnimating = false;

            // Call onOpen callback if provided
            if (typeof config.onOpen === 'function') {
                config.onOpen(itemData);
            }
        }
    };

    // Close accordion item
    const closeItem = (itemData, animate = true) => {
        if (!itemData.isOpen || isAnimating) return;

        const content = itemData.content;
        
        // Start animation
        isAnimating = true;
        itemData.isOpen = false;
        itemData.element.classList.remove(config.activeClass);
        itemData.header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');

        if (animate && config.animate) {
            // Set up transition end event first
            const onTransitionEnd = () => {
                content.removeEventListener('transitionend', onTransitionEnd);
                content.style.display = 'none';
                content.style.maxHeight = '';
                content.style.opacity = '';
                content.style.transform = '';
                isAnimating = false;
                
                // Call onClose callback if provided
                if (typeof config.onClose === 'function') {
                    config.onClose(itemData);
                }
            };
            
            content.addEventListener('transitionend', onTransitionEnd, { once: true });
            
            // Start close animation
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            content.style.transform = 'translateY(-8px)';
        } else {
            // No animation
            content.style.display = 'none';
            content.style.maxHeight = '';
            content.style.opacity = '';
            content.style.transform = '';
            isAnimating = false;

            // Call onClose callback if provided
            if (typeof config.onClose === 'function') {
                config.onClose(itemData);
            }
        }
    };

    // Focus management
    const focusItem = (itemData) => {
        if (itemData && itemData.header) {
            itemData.header.focus();
        }
    };

    const focusNextItem = (currentItem) => {
        const currentIndex = items.indexOf(currentItem);
        const nextIndex = (currentIndex + 1) % items.length;
        focusItem(items[nextIndex]);
    };

    const focusPrevItem = (currentItem) => {
        const currentIndex = items.indexOf(currentItem);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        focusItem(items[prevIndex]);
    };

    // Destroy the accordion and clean up
    const destroy = () => {
        if (!accordion) return;

        // Remove event listeners
        accordion.removeEventListener('click', handleClick);
        accordion.removeEventListener('keydown', handleKeyDown);

        // Reset ARIA attributes and styles
        items.forEach((item) => {
            if (item) {
                item.header.removeAttribute('aria-expanded');
                item.header.removeAttribute('aria-controls');
                item.header.removeAttribute('tabindex');
                item.header.removeAttribute('role');

                item.content.removeAttribute('aria-labelledby');
                item.content.removeAttribute('aria-hidden');
                item.content.style.cssText = '';

                if (item.element) {
                    item.element.classList.remove(config.activeClass);
                }
            }
        });

        // Reset state
        accordion = null;
        items = [];
        isAnimating = false;
    };

    // Public API
    return {
        init,
        destroy,
    };
})();

// Initialize accordion when DOM is ready
const initAccordion = () => {
    try {
        Accordion.init({
            // Custom options can be passed here
            onOpen: (item) => {},
            onClose: (item) => {},
            onInit: (accordion, items) => {},
        });
    } catch (error) {}
};

// Initialize contact button animations
const initContactButtons = () => {
    const contactButtons = document.querySelectorAll('.contact-btn');

    const handleMouseEnter = (e) => {
        const button = e.currentTarget;
        button.classList.add('animate__animated', 'animate__pulse');
    };

    const handleAnimationEnd = (e) => {
        const button = e.currentTarget;
        if (e.animationName === 'pulse') {
            button.classList.remove('animate__animated', 'animate__pulse');
        }
    };

    contactButtons.forEach((button) => {
        if (button) {
            button.addEventListener('mouseenter', handleMouseEnter);
            button.addEventListener('animationend', handleAnimationEnd);
        }
    });

    // Return cleanup function
    return () => {
        contactButtons.forEach((button) => {
            if (button) {
                button.removeEventListener('mouseenter', handleMouseEnter);
                button.removeEventListener('animationend', handleAnimationEnd);
            }
        });
    };
};

// Initialize accordion module
const initAccordionModule = () => {
    initAccordion();
    initContactButtons();
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Accordion,
        initAccordion,
        initContactButtons,
        initAccordionModule,
    };
}

// Auto-initialize if not in a module
if (typeof module === 'undefined' || !module.exports) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccordionModule);
    } else {
        initAccordionModule();
    }
}
