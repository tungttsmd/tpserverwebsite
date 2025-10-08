console.log('[National Detection] Initializing...');

// Hide content until language is set
document.documentElement.style.visibility = 'hidden';
console.log('[National Detection] Content hidden, starting language detection');

async function detectCountry() {
    console.log('[National Detection] Starting country detection');
    
    try {
        // First check if language is already set in localStorage
        const savedLang = localStorage.getItem('language');
        console.log('[National Detection] Saved language from localStorage:', savedLang || 'not set');
        
        if (savedLang) {
            console.log('[National Detection] Using saved language:', savedLang);
            return savedLang;
        }

        console.log('[National Detection] No saved language, detecting from IP...');
        
        // If not, detect country from IP
        const startTime = performance.now();
        const response = await fetch('https://ipapi.co/json/');
        const requestTime = performance.now() - startTime;
        
        console.log(`[National Detection] IP API response received in ${requestTime.toFixed(0)}ms`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[National Detection] IP API data:', {
            country: data.country_code,
            country_name: data.country_name,
            ip: data.ip
        });
        
        // Chỉ trả về ngôn ngữ nếu xác định được quốc gia là Việt Nam
        if (data.country_code === 'VN') {
            console.log('[National Detection] Detected Vietnam, using Vietnamese');
            return 'vi';
        }
        
        // Nếu không phải Việt Nam, trả về null để giữ nguyên ngôn ngữ hiện tại
        console.log(`[National Detection] Non-Vietnam country detected (${data.country_name}), keeping current language`);
        return null;
    } catch (error) {
        console.error('[National Detection] Error detecting country, falling back to English:', {
            error: error.message,
            stack: error.stack
        });
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
                    
                    console.log(`[National Detection] Check ${attempts}/${maxAttempts}:`, 
                        hasSwitcher ? 'Language switcher found!' : 'Language switcher not ready');
                    
                    if (hasSwitcher || lastAttempt) {
                        if (lastAttempt && !hasSwitcher) {
                            console.warn('[National Detection] Language switcher not found after max attempts');
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
            console.log('[National Detection] Setting language using language switcher');
            await window.languageSwitcher.switchLanguage(lang, true);
            console.log('[National Detection] Language set successfully');
        } else {
            console.warn('[National Detection] Language switcher not found, setting language manually');
            document.documentElement.lang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.style.visibility = '';
            console.log('[National Detection] Language set manually');
        }
    } catch (error) {
        console.error('[National Detection] Error in language detection:', {
            error: error.message,
            stack: error.stack
        });
        document.documentElement.style.visibility = '';
        console.log('[National Detection] Made content visible after error');
    }
}

// Start initialization
console.log('[National Detection] Starting initialization');
if (document.readyState === 'loading') {
    console.log('[National Detection] DOM not ready, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[National Detection] DOMContentLoaded fired, starting detection');
        initLanguageDetection().catch(console.error);
    });
} else {
    console.log('[National Detection] DOM already ready, starting detection');
    initLanguageDetection().catch(console.error);
}
