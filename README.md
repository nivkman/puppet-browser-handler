# puppet-browser-handler 🎭

A Node.js package that provides a convenient wrapper around Puppeteer for handling browser automation tasks. This package simplifies common browser operations like navigation, downloads management, screenshots, and page interactions.

## 🚀 Installation

```bash
npm install puppet-browser-handler
```

## ⚡ Prerequisites

- Node.js (v14 or higher recommended)
- Google Chrome browser installed at `/usr/bin/google-chrome`
- `logger-standard` package (will be installed as a dependency)
- `puppeteer` package (will be installed as a dependency)

## 📚 Usage

```javascript
import BrowserHandler from 'puppet-browser-handler';

// Initialize the browser handler with a download path
const browser = new BrowserHandler('./downloads');

// Example usage
async function example() {
  try {
    // Open browser (optional: provide cookies and headless configuration)
    await browser.openBrowser();
    
    // Navigate to a webpage
    await browser.goToPage('https://example.com');
    
    // Take a screenshot
    await browser.screenshot('example', 'png');
    
    // Close the browser
    await browser.closeBrowser();
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## ✨ Features

### 🌐 Browser Management
- Open and close browser sessions
- Configure download behavior
- Handle cookies
- Manage multiple pages

### 🔍 Page Navigation and Interaction
- Navigate to URLs
- Click elements
- Check element existence
- Get href links from elements
- Scroll pages
- Take screenshots

### 🛠️ Utility Functions
- Configurable sleep/delay function
- Download path management
- Viewport configuration

## 📖 API Reference

### Constructor
```javascript
const browser = new BrowserHandler(downloadPath);
```
Creates a new browser handler instance with optional download path.

### Methods

#### 🌐 Browser Control
- `openBrowser()` - Launches a new browser instance
- `closeBrowser()` - Closes the browser and all its pages
- `openNewPage()` - Opens a new browser tab
- `closeCurrentPage()` - Closes the current tab

#### 🔍 Navigation & Interaction
- `goToPage(url)` - Navigates to specified URL
- `click(selector)` - Clicks an element on the page
- `elementExists(selector)` - Checks if an element is present
- `getElementHrefLink(selector)` - Gets href attribute from element
- `scrollDown()` - Scrolls page to bottom

#### 📸 Page Utilities
- `screenshot(fileName, fileExt)` - Takes full page screenshot
- `sleep(limit, start)` - Adds configurable delay between actions
- `configureDownloadsFolder()` - Sets up download directory

## 🔒 Error Handling

The package includes built-in error handling and logging using the `logger-standard` package. All operations are logged with timestamps and service information.

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

If you find a bug or want to request a new feature, please open an issue.