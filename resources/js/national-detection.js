// Hide content until language is set
document.documentElement.style.visibility = 'hidden';

async function getMyIpAndCountry() {
    console.log('Starting IP detection...');
    const startTime = Date.now();

    try {
        console.log('Fetching IP information from api.myip.com...');
        const response = await fetch('https://api.myip.com', {
            method: 'GET',
            cache: 'no-store',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}`, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const requestTime = Date.now() - startTime;

        console.log('IP API response:', {
            data,
            status: response.status,
            responseTime: `${requestTime}ms`,
        });

        return {
            ip: data.ip,
            country: data.cc,
            countryName: data.country,
            responseTime: requestTime,
        };
    } catch (error) {
        console.error('Error in getMyIpAndCountry:', {
            error: error.message,
            stack: error.stack,
            time: new Date().toISOString(),
        });

        // Fallback to a different IP API if the first one fails
        try {
            console.log('Trying fallback IP API (ipapi.co)...');
            const fallbackResponse = await fetch('https://ipapi.co/json/');
            if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                console.log('Fallback IP API response:', fallbackData);
                return {
                    ip: fallbackData.ip,
                    country: fallbackData.country_code,
                    countryName: fallbackData.country_name,
                    isFallback: true,
                };
            }
        } catch (fallbackError) {
            console.error('Fallback IP API also failed:', fallbackError);
        }

        return {
            country: null,
            error: error.message,
            timestamp: new Date().toISOString(),
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
