/**
 * Browser Detection and Feature Support
 * Add this script FIRST in HTML head
 */

(function() {
    'use strict';
    
    // 1. CSS Variables Support Detection
    function supportsCssVariables() {
        if (window.CSS && CSS.supports) {
            return CSS.supports('color', 'var(--test)');
        }
        
        // Manual test for older browsers
        var element = document.createElement('div');
        element.style.cssText = 'color: var(--test-color)';
        return element.style.color.indexOf('var(') === -1;
    }
    
    // 2. Backdrop-filter Support Detection
    function supportsBackdropFilter() {
        if (window.CSS && CSS.supports) {
            return CSS.supports('backdrop-filter', 'blur(10px)') || 
                   CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
        }
        return false;
    }
    
    // 3. CSS Grid Support Detection
    function supportsGrid() {
        if (window.CSS && CSS.supports) {
            return CSS.supports('display', 'grid');
        }
        return false;
    }
    
    // 4. Gap Support Detection
    function supportsGap() {
        if (window.CSS && CSS.supports) {
            return CSS.supports('gap', '10px');
        }
        return false;
    }
    
    // 5. Fetch API Support Detection
    function supportsFetch() {
        return typeof fetch !== 'undefined';
    }
    
    // 6. Async/Await Support Detection
    function supportsAsyncAwait() {
        try {
            new Function('async function test() { await 1; }');
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // 7. Intersection Observer Support Detection
    function supportsIntersectionObserver() {
        return 'IntersectionObserver' in window;
    }
    
    // 8. Browser Detection
    function detectBrowser() {
        var userAgent = navigator.userAgent;
        var browser = 'unknown';
        var version = 'unknown';
        
        // Chrome
        if (/Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)) {
            browser = 'chrome';
            version = userAgent.match(/Chrome\/(\d+)/)[1];
        }
        // Firefox
        else if (/Firefox/.test(userAgent)) {
            browser = 'firefox';
            version = userAgent.match(/Firefox\/(\d+)/)[1];
        }
        // Safari
        else if (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)) {
            browser = 'safari';
            version = userAgent.match(/Version\/(\d+)/)[1];
        }
        // Edge
        else if (/Edg/.test(userAgent)) {
            browser = 'edge';
            version = userAgent.match(/Edg\/(\d+)/)[1];
        }
        // IE11
        else if (/Trident.*rv:11/.test(userAgent)) {
            browser = 'ie';
            version = '11';
        }
        // IE10
        else if (/MSIE 10/.test(userAgent)) {
            browser = 'ie';
            version = '10';
        }
        
        return { browser: browser, version: parseInt(version) };
    }
    
    // 9. Device Detection
    function detectDevice() {
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768;
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        var isAndroid = /Android/.test(navigator.userAgent);
        
        return {
            isMobile: isMobile && !isTablet,
            isTablet: isTablet,
            isDesktop: !isMobile,
            isIOS: isIOS,
            isAndroid: isAndroid
        };
    }
    
    // 10. Apply feature classes to HTML element
    function applyFeatureClasses() {
        var html = document.documentElement;
        var browser = detectBrowser();
        var device = detectDevice();
        
        // Remove existing feature classes
        html.className = html.className.replace(/no-\S+/g, '').trim();
        
        // Add browser classes
        html.classList.add('browser-' + browser.browser);
        html.classList.add('browser-' + browser.browser + '-' + browser.version);
        
        // Add device classes
        if (device.isMobile) html.classList.add('device-mobile');
        if (device.isTablet) html.classList.add('device-tablet');
        if (device.isDesktop) html.classList.add('device-desktop');
        if (device.isIOS) html.classList.add('device-ios');
        if (device.isAndroid) html.classList.add('device-android');
        
        // Add feature support classes
        if (!supportsCssVariables()) html.classList.add('no-cssvars');
        if (!supportsBackdropFilter()) html.classList.add('no-backdrop-filter');
        if (!supportsGrid()) html.classList.add('no-grid');
        if (!supportsGap()) html.classList.add('no-gap');
        if (!supportsFetch()) html.classList.add('no-fetch');
        if (!supportsAsyncAwait()) html.classList.add('no-async');
        if (!supportsIntersectionObserver()) html.classList.add('no-intersection-observer');
        
        // Add legacy browser class for IE
        if (browser.browser === 'ie') {
            html.classList.add('legacy-browser');
        }
        
        // Log detected features for debugging
        console.log('Browser Detection Results:', {
            browser: browser,
            device: device,
            features: {
                cssVariables: supportsCssVariables(),
                backdropFilter: supportsBackdropFilter(),
                grid: supportsGrid(),
                gap: supportsGap(),
                fetch: supportsFetch(),
                asyncAwait: supportsAsyncAwait(),
                intersectionObserver: supportsIntersectionObserver()
            }
        });
    }
    
    // 11. Add polyfill warning for old browsers
    function addCompatibilityWarning() {
        var browser = detectBrowser();
        var needsWarning = false;
        var warningMessage = '';
        
        if (browser.browser === 'ie' && browser.version <= 11) {
            needsWarning = true;
            warningMessage = 'Your browser (Internet Explorer ' + browser.version + ') is outdated. Some features may not work properly. Please upgrade to a modern browser for the best experience.';
        } else if (browser.browser === 'chrome' && browser.version < 60) {
            needsWarning = true;
            warningMessage = 'Your browser version is outdated. Please update Chrome for the best experience.';
        } else if (browser.browser === 'firefox' && browser.version < 55) {
            needsWarning = true;
            warningMessage = 'Your browser version is outdated. Please update Firefox for the best experience.';
        } else if (browser.browser === 'safari' && browser.version < 12) {
            needsWarning = true;
            warningMessage = 'Your browser version is outdated. Please update Safari for the best experience.';
        }
        
        if (needsWarning && document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                var warning = document.createElement('div');
                warning.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #ff6b6b; color: white; padding: 10px; text-align: center; z-index: 99999; font-family: Arial, sans-serif; font-size: 14px;';
                warning.innerHTML = warningMessage + ' <button onclick="this.parentElement.remove()" style="background: white; color: #ff6b6b; border: none; padding: 2px 8px; margin-left: 10px; cursor: pointer;">×</button>';
                document.body.insertBefore(warning, document.body.firstChild);
            });
        }
    }
    
    // 12. Initialize when DOM is ready
    function init() {
        applyFeatureClasses();
        addCompatibilityWarning();
    }
    
    // Run detection immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose detection functions globally
    window.BrowserDetection = {
        supportsCssVariables: supportsCssVariables,
        supportsBackdropFilter: supportsBackdropFilter,
        supportsGrid: supportsGrid,
        supportsGap: supportsGap,
        supportsFetch: supportsFetch,
        supportsAsyncAwait: supportsAsyncAwait,
        supportsIntersectionObserver: supportsIntersectionObserver,
        detectBrowser: detectBrowser,
        detectDevice: detectDevice
    };
    
})();
