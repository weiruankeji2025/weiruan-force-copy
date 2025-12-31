# 网页强制复制破解工具 / Force Copy - Bypass Copy Protection

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-orange.svg)

一个功能强大的油猴脚本，用于破解网站复制限制、防止复制后跳转，并支持图片OCR文字提取。

[简体中文](#简体中文) | [English](#english)

</div>

---

## 简体中文

### ✨ 功能特性

1. **🔓 破解复制限制**
   - 移除网站的CSS复制限制（user-select: none等）
   - 解除右键菜单禁用
   - 移除选择文本限制
   - 劫持原生事件监听器，防止网站禁用复制
   - 清除内联事件处理器（oncopy、oncontextmenu等）
   - 支持几乎所有网站的复制限制破解

2. **🛡️ 防止复制后跳转**
   - 拦截 window.open 弹窗
   - 阻止 location.href 修改
   - 拦截 meta refresh 自动刷新
   - 检测并阻止复制后的延迟跳转
   - 保护用户浏览体验不被打断

3. **📝 图片OCR文字提取**
   - 鼠标悬停图片显示"提取文字"按钮
   - 支持中文、英文等多语言识别
   - 一键提取图片中的文字内容
   - 自动复制到剪贴板
   - 弹窗显示提取结果
   - 基于 OCR.space 免费API

### 📦 安装方法

#### 1. 安装油猴插件

首先需要在浏览器中安装油猴（Tampermonkey）扩展：

- **Chrome/Edge**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/)
- **Safari**: [App Store](https://apps.apple.com/app/tampermonkey/id1482490089)
- **Opera**: [Opera Add-ons](https://addons.opera.com/zh-cn/extensions/details/tampermonkey-beta/)

#### 2. 安装脚本

安装油猴后，有以下几种方式安装本脚本：

**方式一：直接安装**
1. 点击 [force-copy.user.js](force-copy.user.js) 文件
2. 点击 "Raw" 按钮
3. 油猴会自动识别并提示安装
4. 点击"安装"即可

**方式二：手动安装**
1. 点击浏览器工具栏中的油猴图标
2. 选择"添加新脚本"
3. 复制 [force-copy.user.js](force-copy.user.js) 中的全部代码
4. 粘贴到编辑器中
5. 按 Ctrl+S 保存

### 🚀 使用方法

#### 基础使用

1. **复制文字**
   - 安装脚本后，访问任何网站
   - 直接选择文字并复制（Ctrl+C 或 右键复制）
   - 无需任何额外操作，脚本自动破解限制

2. **提取图片文字**
   - 将鼠标悬停在图片上
   - 点击右上角出现的"📝 提取文字"按钮
   - 等待识别完成（通常2-5秒）
   - 文字自动复制到剪贴板，并显示弹窗

#### 高级设置

点击油猴图标 → 选择"网页强制复制破解工具"，可以看到以下菜单命令：

- **🔄 切换OCR功能**: 启用/禁用图片文字提取功能
- **🔔 切换通知**: 启用/禁用操作通知提示
- **🛡️ 切换防跳转**: 启用/禁用复制后防跳转功能
- **🐛 切换调试模式**: 启用/禁用控制台调试日志

### ⚙️ 配置说明

可以编辑脚本修改配置项（在油猴管理面板中编辑）：

```javascript
const config = {
    enableOCR: true,           // 是否启用图片OCR功能
    enableNotification: true,  // 是否启用通知
    preventRedirect: true,     // 是否防止复制后跳转
    ocrApiKey: 'K87899142388957', // OCR API密钥
    debug: false               // 调试模式
};
```

#### 自定义OCR API密钥

默认使用免费的OCR.space API密钥，每月有限额。如需更高配额：

1. 访问 [OCR.space](https://ocr.space/ocrapi) 注册免费账号
2. 获取API密钥
3. 在脚本配置中替换 `ocrApiKey` 的值

### 🎯 适用场景

- 📚 学术研究：从限制复制的文献网站复制资料
- 📰 新闻阅读：从禁止复制的新闻网站摘录内容
- 💼 工作学习：从各类限制复制的网站获取信息
- 🖼️ 图片处理：从图片中提取文字信息
- 📖 电子书：从在线阅读平台复制笔记

### 🛠️ 技术原理

1. **CSS破解**: 通过注入自定义样式覆盖 `user-select: none` 等限制
2. **事件劫持**: 拦截和替换原生事件监听器方法
3. **属性清除**: 定期清除DOM元素上的限制性事件处理器
4. **跳转拦截**: 监控和阻止 window.open、location.href 等跳转方法
5. **OCR识别**: 使用OCR.space API进行图片文字识别

### ⚠️ 注意事项

1. **版权提示**: 请尊重原创内容，合理使用复制功能，不要用于侵犯版权
2. **OCR限额**: 免费API每月有请求限额，大量使用建议申请自己的密钥
3. **兼容性**: 支持主流浏览器（Chrome、Firefox、Edge、Safari、Opera）
4. **隐私安全**: 本脚本所有操作在本地执行，不收集用户数据
5. **网站规则**: 某些网站可能禁止使用此类工具，使用前请了解相关规定

### 🐛 问题反馈

如遇到问题或有改进建议，欢迎：
- 提交 [Issue](../../issues)
- 发起 [Pull Request](../../pulls)
- 联系作者反馈

### 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## English

### ✨ Features

1. **🔓 Bypass Copy Protection**
   - Remove CSS copy restrictions (user-select: none, etc.)
   - Enable right-click context menu
   - Remove text selection restrictions
   - Hijack native event listeners to prevent copy blocking
   - Clear inline event handlers (oncopy, oncontextmenu, etc.)
   - Support almost all websites

2. **🛡️ Prevent Redirect After Copy**
   - Intercept window.open popups
   - Block location.href modifications
   - Intercept meta refresh auto-redirects
   - Detect and block delayed redirects after copying
   - Protect user browsing experience

3. **📝 Image OCR Text Extraction**
   - Hover over images to show "Extract Text" button
   - Support multiple languages (Chinese, English, etc.)
   - One-click text extraction from images
   - Auto-copy to clipboard
   - Display results in popup modal
   - Based on OCR.space free API

### 📦 Installation

#### 1. Install Tampermonkey

First, install Tampermonkey extension in your browser:

- **Chrome/Edge**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Safari**: [App Store](https://apps.apple.com/app/tampermonkey/id1482490089)
- **Opera**: [Opera Add-ons](https://addons.opera.com/en/extensions/details/tampermonkey-beta/)

#### 2. Install Script

After installing Tampermonkey:

**Method 1: Direct Installation**
1. Click [force-copy.user.js](force-copy.user.js) file
2. Click "Raw" button
3. Tampermonkey will auto-detect and prompt for installation
4. Click "Install"

**Method 2: Manual Installation**
1. Click Tampermonkey icon in browser toolbar
2. Select "Create a new script"
3. Copy all code from [force-copy.user.js](force-copy.user.js)
4. Paste into editor
5. Press Ctrl+S to save

### 🚀 Usage

#### Basic Usage

1. **Copy Text**
   - After installation, visit any website
   - Select and copy text directly (Ctrl+C or right-click copy)
   - No additional actions needed

2. **Extract Text from Images**
   - Hover mouse over an image
   - Click "📝 Extract Text" button at top-right
   - Wait for recognition (usually 2-5 seconds)
   - Text auto-copied to clipboard with popup display

#### Advanced Settings

Click Tampermonkey icon → Select "Force Copy - Bypass Copy Protection":

- **🔄 Toggle OCR**: Enable/disable image text extraction
- **🔔 Toggle Notification**: Enable/disable operation notifications
- **🛡️ Toggle Anti-Redirect**: Enable/disable redirect prevention
- **🐛 Toggle Debug Mode**: Enable/disable console debug logs

### ⚙️ Configuration

Edit script configuration in Tampermonkey dashboard:

```javascript
const config = {
    enableOCR: true,           // Enable image OCR feature
    enableNotification: true,  // Enable notifications
    preventRedirect: true,     // Prevent redirect after copy
    ocrApiKey: 'K87899142388957', // OCR API key
    debug: false               // Debug mode
};
```

#### Custom OCR API Key

Default uses free OCR.space API key with monthly limits. For higher quota:

1. Visit [OCR.space](https://ocr.space/ocrapi) to register free account
2. Get API key
3. Replace `ocrApiKey` value in script config

### 🎯 Use Cases

- 📚 Academic Research: Copy content from restricted literature websites
- 📰 News Reading: Extract content from copy-protected news sites
- 💼 Work & Study: Get information from various restricted websites
- 🖼️ Image Processing: Extract text from images
- 📖 E-books: Copy notes from online reading platforms

### 🛠️ Technical Details

1. **CSS Bypass**: Inject custom styles to override `user-select: none` restrictions
2. **Event Hijacking**: Intercept and replace native event listener methods
3. **Property Clearing**: Periodically clear restrictive event handlers on DOM elements
4. **Redirect Interception**: Monitor and block window.open, location.href, etc.
5. **OCR Recognition**: Use OCR.space API for image text recognition

### ⚠️ Disclaimer

1. **Copyright**: Respect original content, use copy feature responsibly
2. **OCR Limits**: Free API has monthly request limits
3. **Compatibility**: Supports mainstream browsers (Chrome, Firefox, Edge, Safari, Opera)
4. **Privacy**: All operations execute locally, no data collection
5. **Website Rules**: Some websites may prohibit such tools

### 🐛 Feedback

For issues or suggestions:
- Submit an [Issue](../../issues)
- Create a [Pull Request](../../pulls)
- Contact author

### 📄 License

This project is licensed under [MIT License](LICENSE).

---

<div align="center">

**如果这个脚本对你有帮助，请给个 ⭐️ Star 支持一下！**

**If this script helps you, please give it a ⭐️ Star!**

</div>
