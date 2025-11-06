// Terms Update Popup Script
document.addEventListener('DOMContentLoaded', function () {
    const termsPopup = document.getElementById('termsPopup');
    const acceptTerms = document.getElementById('acceptTerms');

    // Check if user has acknowledged the popup in this session
    const hasAcknowledgedTerms = sessionStorage.getItem('termsAcknowledged');

    // Show popup after a short delay if user hasn't acknowledged in this session
    if (!hasAcknowledgedTerms) {
        setTimeout(() => {
            termsPopup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }, 500);
    }

    // Close popup functions
    function closePopup() {
        termsPopup.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Acknowledge popup - saves to sessionStorage (only for current session)
    function acknowledgePopup() {
        closePopup();
        sessionStorage.setItem('termsAcknowledged', 'true');
    }

    // Close popup when clicking "Tôi Đã Hiểu" button (acknowledge)
    if (acceptTerms) {
        acceptTerms.addEventListener('click', acknowledgePopup);
    }

    // Close popup when clicking outside the popup content (doesn't save)
    termsPopup.addEventListener('click', function (e) {
        if (e.target === termsPopup) {
            closePopup();
        }
    });

    // Close popup with Escape key (doesn't save)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && termsPopup.classList.contains('active')) {
            closePopup();
        }
    });

    // Track when user clicks "Xem Toàn Bộ Điều Khoản" link (doesn't save)
    const viewTermsLink = termsPopup.querySelector('a[href="terms.html"]');
    if (viewTermsLink) {
        viewTermsLink.addEventListener('click', function () {
            // User navigates to terms page
        });
    }
});
