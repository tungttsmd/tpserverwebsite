/**
 * Enhanced Swiper Slider Initialization
 * - Better error handling and fallbacks
 * - Performance optimizations
 * - Improved accessibility
 */
const TestimonialSlider = (() => {
    // Configuration
    const config = {
        selector: '.testimonial-swiper',
        swiperOptions: {
            // Core parameters
            init: false,
            loop: true,
            speed: 600,
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            watchSlidesProgress: true,
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },

            // Coverflow effect
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2,
                slideShadows: true,
            },

            // Autoplay
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },

            // Pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
            },

            // Navigation
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // Breakpoints
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    coverflowEffect: {
                        depth: 50,
                        modifier: 1,
                    },
                },
                640: {
                    slidesPerView: 1,
                    spaceBetween: 25,
                    coverflowEffect: {
                        depth: 75,
                        modifier: 1.5,
                    },
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    coverflowEffect: {
                        depth: 100,
                        modifier: 2,
                    },
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                    coverflowEffect: {
                        depth: 100,
                        modifier: 2,
                    },
                },
            },

            // Accessibility
            a11y: {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
                firstSlideMessage: 'This is the first slide',
                lastSlideMessage: 'This is the last slide',
                paginationBulletMessage: 'Go to slide {{index}}',
                notificationClass: 'swiper-notification',
            },

            // Events
            on: {
                init: function () {
                    // Add ARIA attributes for better accessibility
                    this.el.setAttribute('role', 'region');
                    this.el.setAttribute('aria-label', 'Testimonials carousel');

                    // Add loading="lazy" to images that are not in the initial view
                    const slides = this.slides;
                    const slidesPerView = this.params.slidesPerView;

                    for (let i = slidesPerView; i < slides.length; i++) {
                        const images = slides[i].querySelectorAll('img');
                        images.forEach((img) => {
                            if (!img.loading) {
                                img.loading = 'lazy';
                            }
                        });
                    }
                },
                slideChange: function () {
                    // Lazy load images when they come into view
                    const activeSlides = this.slides.slice(
                        this.activeIndex,
                        this.activeIndex + (this.params.slidesPerView || 1)
                    );

                    activeSlides.forEach((slide) => {
                        const images = slide.querySelectorAll('img[data-src]');
                        images.forEach((img) => {
                            if (!img.src && img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                        });
                    });
                },
                resize: function () {
                    // Handle any resize-specific logic
                    this.update();
                },
            },
        },
    };

    // State
    let swiperInstance = null;

    // Initialize the slider
    const init = () => {
        const sliderElement = document.querySelector(config.selector);

        if (!sliderElement) {
            console.warn('Testimonial slider: Element not found');
            return;
        }

        try {
            // Check if Swiper is available
            if (typeof Swiper === 'undefined') {
                console.error('Swiper is not loaded');
                return;
            }

            // Initialize Swiper
            swiperInstance = new Swiper(sliderElement, config.swiperOptions);

            // Initialize the slider
            swiperInstance.init();

            // Add custom event when slider is ready
            document.dispatchEvent(
                new CustomEvent('testimonialSlider:ready', {
                    detail: { swiper: swiperInstance },
                })
            );

            return swiperInstance;
        } catch (error) {
            console.error('Error initializing testimonial slider:', error);

            // Fallback: Make sure all slides are visible if Swiper fails
            sliderElement.classList.add('swiper-fallback');

            // Dispatch error event
            document.dispatchEvent(
                new CustomEvent('testimonialSlider:error', {
                    detail: { error },
                })
            );

            return null;
        }
    };

    // Public API
    return {
        init,
        getInstance: () => swiperInstance,
        update: () => swiperInstance && swiperInstance.update(),
        destroy: () => {
            if (swiperInstance) {
                swiperInstance.destroy(true, true);
                swiperInstance = null;
            }
        },
    };
})();

// Initialize when DOM is ready
const initTestimonialSlider = () => {
    try {
        TestimonialSlider.init();
    } catch (error) {
        console.error('Error initializing testimonial slider:', error);
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialSlider);
} else {
    initTestimonialSlider();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestimonialSlider, initTestimonialSlider };
}
