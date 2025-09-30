const btnScrollToTop = document.getElementById('scrollToTopBtn');
const docEl = document.documentElement;

// Function to handle scroll event
function handleScroll() {
    const scrollTotal = docEl.scrollHeight - docEl.clientHeight;

    if (docEl.scrollTop / scrollTotal >= 0.1) {
        btnScrollToTop.style.display = 'flex'; // or 'block' depending on your layout
    } else {
        btnScrollToTop.style.display = 'none';
    }
}

// Set initial state
window.addEventListener('load', () => {
    btnScrollToTop.style.display = 'none';
});

// Listen for scroll events
window.addEventListener('scroll', handleScroll);

// Smooth scroll to top
btnScrollToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});
