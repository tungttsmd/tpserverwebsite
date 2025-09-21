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
