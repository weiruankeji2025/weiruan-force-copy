// ==UserScript==
// @name         网页强制复制破解工具
// @name:en      Force Copy - Bypass Copy Protection
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  破解网站复制限制，防止复制后跳转，支持图片OCR文字提取
// @description:en Bypass website copy protection, prevent redirect after copy, support image OCR text extraction
// @author       WeiRuan
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @connect      api.ocr.space
// @connect      *
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置项 ==========
    const config = {
        enableOCR: true,           // 是否启用图片OCR功能
        enableNotification: true,  // 是否启用通知
        preventRedirect: true,     // 是否防止复制后跳转
        ocrApiKey: 'K87899142388957', // OCR.space API密钥（免费）
        debug: false               // 调试模式
    };

    // ========== 工具函数 ==========
    const log = (...args) => config.debug && console.log('[强制复制]', ...args);

    const notify = (message) => {
        if (config.enableNotification && typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                title: '强制复制',
                timeout: 3000
            });
        }
        log(message);
    };

    // ========== 1. 破解复制限制核心功能 ==========

    // 移除所有禁用复制的CSS样式
    const removeCopyProtectionCSS = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
            }
            body {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);
        log('已移除CSS复制限制');
    };

    // 移除禁用右键、复制、选择等事件
    const removeEventListeners = () => {
        // 禁用的事件列表
        const events = [
            'contextmenu',    // 右键菜单
            'copy',           // 复制
            'cut',            // 剪切
            'paste',          // 粘贴
            'selectstart',    // 选择开始
            'select',         // 选择
            'drag',           // 拖拽
            'dragstart',      // 拖拽开始
            'mousedown',      // 鼠标按下
            'mouseup',        // 鼠标抬起
            'keydown',        // 键盘按下
            'keyup'           // 键盘抬起
        ];

        // 阻止所有限制性事件
        events.forEach(event => {
            document.addEventListener(event, (e) => {
                e.stopPropagation();
            }, true);

            // 移除现有的事件监听器
            window.addEventListener(event, (e) => {
                e.stopPropagation();
                return true;
            }, true);
        });

        // 允许右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.stopPropagation();
            return true;
        }, true);

        log('已移除事件监听器限制');
    };

    // 清除页面上的oncopy、oncontextmenu等属性
    const clearInlineHandlers = () => {
        const elements = document.querySelectorAll('*');
        const handlers = [
            'oncopy', 'oncut', 'onpaste', 'oncontextmenu',
            'onselectstart', 'onselect', 'ondragstart',
            'onmousedown', 'onmouseup', 'onkeydown', 'onkeyup'
        ];

        elements.forEach(el => {
            handlers.forEach(handler => {
                if (el[handler]) {
                    el[handler] = null;
                }
            });
        });

        // 清除body和document上的处理器
        handlers.forEach(handler => {
            if (document.body && document.body[handler]) {
                document.body[handler] = null;
            }
            if (document[handler]) {
                document[handler] = null;
            }
        });

        log('已清除内联事件处理器');
    };

    // 劫持原生方法，防止网站禁用复制
    const hijackNativeMethods = () => {
        // 保存原生方法
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

        // 需要拦截的事件
        const blockedEvents = ['copy', 'cut', 'contextmenu', 'selectstart', 'select'];

        // 劫持addEventListener
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (blockedEvents.includes(type)) {
                log(`拦截了 ${type} 事件的绑定`);
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };

        // 劫持document.oncopy等属性
        ['copy', 'cut', 'paste', 'contextmenu', 'selectstart'].forEach(event => {
            Object.defineProperty(document, 'on' + event, {
                set: function() {
                    log(`拦截了 on${event} 属性设置`);
                },
                get: function() {
                    return null;
                }
            });
        });

        log('已劫持原生方法');
    };

    // ========== 2. 防止复制后跳转 ==========

    const preventCopyRedirect = () => {
        if (!config.preventRedirect) return;

        // 拦截页面跳转
        const originalOpen = window.open;
        window.open = function(...args) {
            log('拦截了 window.open 调用', args);
            notify('已阻止弹窗跳转');
            return null;
        };

        // 拦截location变更
        let currentLocation = window.location.href;
        const locationProxy = new Proxy(window.location, {
            set(target, property, value) {
                if (property === 'href') {
                    log('拦截了 location.href 修改', value);
                    notify('已阻止页面跳转');
                    return true;
                }
                return Reflect.set(target, property, value);
            }
        });

        // 监控复制事件并阻止后续跳转
        let copyEventTriggered = false;
        document.addEventListener('copy', () => {
            copyEventTriggered = true;
            setTimeout(() => {
                copyEventTriggered = false;
            }, 1000);
        }, true);

        // 拦截在复制后的跳转
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            if (copyEventTriggered && delay < 2000) {
                log('拦截了复制后的延迟跳转');
                return -1;
            }
            return originalSetTimeout.call(this, callback, delay, ...args);
        };

        // 拦截meta refresh
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'META' && node.getAttribute('http-equiv') === 'refresh') {
                        node.remove();
                        log('移除了 meta refresh 标签');
                        notify('已阻止页面刷新跳转');
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        log('已启用防跳转功能');
    };

    // ========== 3. 图片OCR文字提取 ==========

    // 创建OCR按钮
    const createOCRButton = (img) => {
        const button = document.createElement('button');
        button.innerHTML = '📝 提取文字';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        button.onmouseover = () => button.style.background = '#45a049';
        button.onmouseout = () => button.style.background = '#4CAF50';

        button.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await extractTextFromImage(img, button);
        };

        return button;
    };

    // 执行OCR提取
    const extractTextFromImage = async (img, button) => {
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ 识别中...';
        button.disabled = true;

        try {
            // 获取图片URL
            let imageUrl = img.src;

            // 如果是相对路径，转换为绝对路径
            if (!imageUrl.startsWith('http')) {
                imageUrl = new URL(imageUrl, window.location.href).href;
            }

            log('开始OCR识别:', imageUrl);

            // 调用OCR API
            const formData = new FormData();
            formData.append('url', imageUrl);
            formData.append('apikey', config.ocrApiKey);
            formData.append('language', 'chs'); // 中文简体
            formData.append('isOverlayRequired', 'false');

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://api.ocr.space/parse/image',
                    data: formData,
                    onload: resolve,
                    onerror: reject,
                    timeout: 30000
                });
            });

            const result = JSON.parse(response.responseText);

            if (result.ParsedResults && result.ParsedResults.length > 0) {
                const text = result.ParsedResults[0].ParsedText;

                if (text && text.trim()) {
                    // 复制到剪贴板
                    if (typeof GM_setClipboard !== 'undefined') {
                        GM_setClipboard(text);
                        notify('✓ 图片文字已复制到剪贴板');
                    } else {
                        // 降级方案
                        await navigator.clipboard.writeText(text);
                        notify('✓ 图片文字已复制到剪贴板');
                    }

                    // 显示提取的文字
                    showExtractedText(text, img);
                    button.innerHTML = '✓ 已提取';
                    button.style.background = '#2196F3';
                } else {
                    throw new Error('未识别到文字');
                }
            } else {
                throw new Error(result.ErrorMessage || '识别失败');
            }
        } catch (error) {
            log('OCR错误:', error);
            notify('✗ 文字提取失败: ' + error.message);
            button.innerHTML = '✗ 失败';
            button.style.background = '#f44336';
        } finally {
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '#4CAF50';
            }, 2000);
        }
    };

    // 显示提取的文字
    const showExtractedText = (text, img) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 100000;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
        `;

        const title = document.createElement('h3');
        title.textContent = '提取的文字内容';
        title.style.marginTop = '0';

        const content = document.createElement('pre');
        content.textContent = text;
        content.style.cssText = `
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 400px;
            overflow: auto;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            margin-top: 10px;
            padding: 8px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => modal.remove();

        modal.appendChild(title);
        modal.appendChild(content);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);

        // 点击背景关闭
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 99999;
        `;
        overlay.onclick = () => {
            modal.remove();
            overlay.remove();
        };
        document.body.appendChild(overlay);
    };

    // 为图片添加OCR功能
    const enableImageOCR = () => {
        if (!config.enableOCR) return;

        const addOCRToImages = () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                // 跳过已处理的图片
                if (img.dataset.ocrEnabled) return;

                // 只处理足够大的图片
                if (img.width < 50 || img.height < 50) return;

                img.dataset.ocrEnabled = 'true';

                // 创建容器
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    position: relative;
                    display: inline-block;
                `;

                // 包装图片
                if (img.parentNode) {
                    img.parentNode.insertBefore(wrapper, img);
                    wrapper.appendChild(img);

                    // 添加OCR按钮
                    const button = createOCRButton(img);
                    button.style.display = 'none';
                    wrapper.appendChild(button);

                    // 鼠标悬停显示按钮
                    wrapper.onmouseenter = () => button.style.display = 'block';
                    wrapper.onmouseleave = () => button.style.display = 'none';
                }
            });
        };

        // 初始加载
        addOCRToImages();

        // 监听DOM变化
        const observer = new MutationObserver(() => {
            addOCRToImages();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('已启用图片OCR功能');
    };

    // ========== 主初始化函数 ==========

    const init = () => {
        log('开始初始化强制复制工具...');

        // 在文档开始时立即执行
        hijackNativeMethods();
        removeCopyProtectionCSS();

        // DOM加载后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                removeEventListeners();
                clearInlineHandlers();
                preventCopyRedirect();
                enableImageOCR();
            });
        } else {
            removeEventListeners();
            clearInlineHandlers();
            preventCopyRedirect();
            enableImageOCR();
        }

        // 持续监控和清除限制
        setInterval(() => {
            clearInlineHandlers();
        }, 1000);

        log('强制复制工具初始化完成');
        notify('✓ 复制限制已破解');
    };

    // ========== 用户菜单命令 ==========

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('🔄 切换OCR功能', () => {
            config.enableOCR = !config.enableOCR;
            notify(config.enableOCR ? '✓ OCR功能已启用' : '✗ OCR功能已禁用');
            if (config.enableOCR) {
                enableImageOCR();
            }
        });

        GM_registerMenuCommand('🔔 切换通知', () => {
            config.enableNotification = !config.enableNotification;
            alert(config.enableNotification ? '✓ 通知已启用' : '✗ 通知已禁用');
        });

        GM_registerMenuCommand('🛡️ 切换防跳转', () => {
            config.preventRedirect = !config.preventRedirect;
            notify(config.preventRedirect ? '✓ 防跳转已启用' : '✗ 防跳转已禁用');
        });

        GM_registerMenuCommand('🐛 切换调试模式', () => {
            config.debug = !config.debug;
            alert(config.debug ? '✓ 调试模式已启用' : '✗ 调试模式已禁用');
        });
    }

    // 启动脚本
    init();

})();
