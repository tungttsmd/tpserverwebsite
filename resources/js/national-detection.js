console.log('[National Detection] Initializing...');

// Hide content until language is set
document.documentElement.style.visibility = 'hidden';
console.log('[National Detection] Content hidden, starting language detection');

async function detectCountry() {
    console.log('[National Detection] Starting country detection');

    try {
        // First check if language is already set in localStorage
        const savedLang = localStorage.getItem('language');
        console.log(
            '[National Detection] Saved language from localStorage:',
            savedLang || 'not set'
        );

        if (savedLang) {
            console.log(
                '[National Detection] Using saved language:',
                savedLang
            );
            return savedLang;
        }

        console.log(
            '[National Detection] No saved language, detecting from IP...'
        );

        // If not, detect country from IP using api.myip.com
        const startTime = performance.now();
        const response = await fetch('https://api.myip.com');
        const requestTime = performance.now() - startTime;

        console.log(
            `[National Detection] IP API response received in ${requestTime.toFixed(
                0
            )}ms`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log all received data for debugging
        console.log('[National Detection] Full API response:', data);

        // Log specific fields we're interested in
        if (data) {
            console.log('[National Detection] IP:', data.ip);
            console.log('[National Detection] Country Code:', data.cc);
            console.log('[National Detection] Country:', data.country);
        }
        // Check if we have valid country data
        if (data && data.cc) {
            if (data.cc === 'VN') {
                console.log(
                    '[National Detection] Detected Vietnam, using Vietnamese'
                );
                return 'vi';
            } else {
                console.log(
                    `[National Detection] Non-Vietnam country detected (${data.country}), using English`
                );
                return 'en';
            }
        } else {
            console.log('Không tìm thấy');
        }
        // If we can't determine the country, return null to keep current language
        console.log(
            '[National Detection] Could not determine country from IP, keeping current language'
        );
        return null;
    } catch (error) {
        console.error(
            '[National Detection] Error detecting country, falling back to English:',
            {
                error: error.message,
                stack: error.stack,
            }
        );
        return 'en'; // Default to English on error
    }
}

// Initialize language detection and switcher
async function initLanguageDetection() {
    console.log('[National Detection] Initializing language detection');

    try {
        const detectedLang = await detectCountry();
        console.log('[National Detection] Detection result:', detectedLang);

        // Nếu không xác định được quốc gia (trả về null) thì không thay đổi ngôn ngữ
        if (detectedLang === null) {
            console.log('[National Detection] No language change needed');
            document.documentElement.style.visibility = ''; // Hiển thị nội dung
            return;
        }

        const lang = detectedLang || 'en'; // Fallback về tiếng Anh nếu có lỗi

        // Wait for language switcher to be available
        const maxAttempts = 10;
        let attempts = 0;

        console.log('[National Detection] Waiting for language switcher...');

        const waitForSwitcher = () => {
            return new Promise((resolve) => {
                const checkSwitcher = () => {
                    attempts++;
                    const hasSwitcher = !!window.languageSwitcher;
                    const lastAttempt = attempts >= maxAttempts;

                    console.log(
                        `[National Detection] Check ${attempts}/${maxAttempts}:`,
                        hasSwitcher
                            ? 'Language switcher found!'
                            : 'Language switcher not ready'
                    );

                    if (hasSwitcher || lastAttempt) {
                        if (lastAttempt && !hasSwitcher) {
                            console.warn(
                                '[National Detection] Language switcher not found after max attempts'
                            );
                        }
                        resolve();
                    } else {
                        setTimeout(checkSwitcher, 100);
                    }
                };
                checkSwitcher();
            });
        };

        await waitForSwitcher();

        if (window.languageSwitcher) {
            console.log(
                '[National Detection] Setting language using language switcher'
            );
            await window.languageSwitcher.switchLanguage(lang, true);
            console.log('[National Detection] Language set successfully');
        } else {
            console.warn(
                '[National Detection] Language switcher not found, setting language manually'
            );
            document.documentElement.lang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.style.visibility = '';
            console.log('[National Detection] Language set manually');
        }
    } catch (error) {
        console.error('[National Detection] Error in language detection:', {
            error: error.message,
            stack: error.stack,
        });
        document.documentElement.style.visibility = '';
        console.log('[National Detection] Made content visible after error');
    }
}

// Start initialization
console.log('[National Detection] Starting initialization');
if (document.readyState === 'loading') {
    console.log(
        '[National Detection] DOM not ready, waiting for DOMContentLoaded'
    );
    document.addEventListener('DOMContentLoaded', () => {
        console.log(
            '[National Detection] DOMContentLoaded fired, starting detection'
        );
        initLanguageDetection().catch(console.error);
    });
} else {
    console.log('[National Detection] DOM already ready, starting detection');
    initLanguageDetection().catch(console.error);
}
