/**
 * Polyfills for older browser compatibility
 * Add this script BEFORE other scripts in HTML
 */

// 1. Promise polyfill for IE11
if (typeof Promise === 'undefined') {
    window.Promise = function(executor) {
        var self = this;
        self.state = 'pending';
        self.value = undefined;
        self.handlers = [];
        
        function resolve(value) {
            if (self.state !== 'pending') return;
            self.state = 'fulfilled';
            self.value = value;
            self.handlers.forEach(handle);
        }
        
        function reject(error) {
            if (self.state !== 'pending') return;
            self.state = 'rejected';
            self.value = error;
            self.handlers.forEach(handle);
        }
        
        function handle(handler) {
            if (self.state === 'fulfilled') {
                handler.onSuccess(self.value);
            } else {
                handler.onFail(self.value);
            }
        }
        
        this.then = function(onSuccess, onFail) {
            return new Promise(function(resolve, reject) {
                self.handlers.push({
                    onSuccess: function(value) {
                        try {
                            if (onSuccess) resolve(onSuccess(value));
                            else resolve(value);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onFail: function(error) {
                        try {
                            if (onFail) resolve(onFail(error));
                            else reject(error);
                        } catch (e) {
                            reject(e);
                        }
                    }
                });
            });
        };
        
        this.catch = function(onFail) {
            return this.then(null, onFail);
        };
        
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    };
}

// 2. Fetch API polyfill for IE11
if (typeof fetch === 'undefined') {
    window.fetch = function(url, options) {
        options = options || {};
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(options.method || 'GET', url, true);
            
            // Set headers
            if (options.headers) {
                for (var header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }
            }
            
            xhr.onload = function() {
                var response = {
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    url: url,
                    text: function() {
                        return Promise.resolve(xhr.responseText);
                    },
                    json: function() {
                        try {
                            return Promise.resolve(JSON.parse(xhr.responseText));
                        } catch (e) {
                            return Promise.reject(e);
                        }
                    }
                };
                resolve(response);
            };
            
            xhr.onerror = function() {
                reject(new Error('Network request failed'));
            };
            
            xhr.send(options.body);
        });
    };
}

// 3. Object.assign polyfill for IE11
if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

// 4. Array.from polyfill for IE11
if (!Array.from) {
    Array.from = function(arrayLike) {
        var result = [];
        for (var i = 0; i < arrayLike.length; i++) {
            result.push(arrayLike[i]);
        }
        return result;
    };
}

// 5. CustomEvent polyfill for IE11
if (typeof CustomEvent !== 'function') {
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
}

// 6. IntersectionObserver polyfill for older browsers
if (typeof IntersectionObserver === 'undefined') {
    window.IntersectionObserver = function(callback, options) {
        this.callback = callback;
        this.options = options || {};
        this.elements = [];
        
        this.observe = function(element) {
            this.elements.push(element);
            // Simple fallback - just trigger callback immediately
            setTimeout(function() {
                callback([{
                    target: element,
                    isIntersecting: true,
                    intersectionRatio: 1
                }]);
            }, 100);
        };
        
        this.unobserve = function(element) {
            var index = this.elements.indexOf(element);
            if (index > -1) {
                this.elements.splice(index, 1);
            }
        };
        
        this.disconnect = function() {
            this.elements = [];
        };
    };
}

// 7. requestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// 8. Performance.now polyfill for IE9+
if (!window.performance || !window.performance.now) {
    window.performance = {
        now: function() {
            return Date.now();
        }
    };
}

// 9. String.prototype.includes polyfill for IE11
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// 10. NodeList.prototype.forEach polyfill for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

console.log('Polyfills loaded for browser compatibility');
