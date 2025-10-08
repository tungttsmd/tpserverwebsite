// Hide content until language is set
document.documentElement.style.visibility = 'hidden';

async function getMyIpAndCountry() {
    try {
        const response = await fetch('https://api.myip.com');
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('IP API response:', data);

        return {
            country: data.cc,
            countryName: data.country,
        };
    } catch (error) {
        console.error('Error detecting country:', error);
        return {
            country: null,
            error: error.message,
        };
    }
}

async function initLanguageDetection() {
    // Wait for language switcher to be available
    const maxAttempts = 10;
    let attempts = 0;

    while (!window.languageSwitcher && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
    }

    if (!window.languageSwitcher) {
        console.warn('Language switcher not found, showing content');
        document.documentElement.style.visibility = '';
        return;
    }

    // Check if language is already set
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        console.log('Using saved language:', savedLang);
        await window.languageSwitcher.switchLanguage(savedLang, true);
        return;
    }

    // Detect language based on IP
    try {
        console.log('Detecting country to set language...');
        const { country, countryName } = await getMyIpAndCountry();
        const lang = country === 'VN' ? 'vi' : 'en';
        console.log(
            `Country detected: ${countryName} (${
                country || 'unknown'
            }), using ${lang}`
        );
        await window.languageSwitcher.switchLanguage(lang, true);
    } catch (error) {
        console.error(
            'Error in language detection, using English as fallback:',
            error
        );
        await window.languageSwitcher.switchLanguage('en', true);
    }
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageDetection);
} else {
    initLanguageDetection();
}
