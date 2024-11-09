import puppeteer from "puppeteer";
import { Logger } from "logger-standard";
import fs from "fs";

const SERVICE_NAME = "BrowserHandler";

export default class BrowserHandler {
  constructor(downloadPath = null) {
    this._logger = new Logger({
      service: SERVICE_NAME,
      showDate: true,
    });
    this._page = null;
    this._browser = null;
    this.downloadPath = downloadPath;
  }

  async configureDownloadsFolder() {
    try {
      await this._page._client().send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: this.downloadPath,
      });

      if (!fs.existsSync(this.downloadPath)) {
        fs.mkdirSync(this.downloadPath, { recursive: true });
        this._logger.info("Downloads folder successfully created");
      }
      this._logger.info("Downloads folder configuration complete");
    } catch (error) {
      throw error;
    }
  }

  async openBrowser(cookies = null, headless = "new", slowMo = 30) {
    try {
      this._browser = await puppeteer.launch({
        headless,
        pipe: true,
        executablePath: "/usr/bin/google-chrome",
        args: ["--disable-setuid-sandbox", "--no-sandbox"],
        slowMo,
      });

      this._page = await this._browser.newPage();
      this._logger.info("Browser initialized successfully");

      await this.configureDownloadsFolder();
      await this._page.setDefaultNavigationTimeout(0);
      await this._page.setViewport({ width: 1920, height: 1080 });

      if (cookies) {
        for (let cookie of cookies) {
          await this._page.setCookie({
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
          });
          this._logger.info(`"${cookie.name}" cookie configured successfully`);
        }
      }
    } catch (error) {
      this._logger.error(error.message);
    }
  }

  async closeBrowser() {
    try {
      if (this._page) {
        await this._page.close();
      }

      if (this._browser) {
        await this._browser.close();
      }

      this._logger.info("Browser terminated successfully");
    } catch (error) {
      this._logger.error(error.message);
    }
  }

  async sleep(limit, start = 0) {
    try {
      const range = limit - start;
      const randomSeconds = Math.random() * range + start;
      const pause = Math.floor(randomSeconds * 1000);
      return new Promise((resolve) => setTimeout(resolve, pause));
    } catch (error) {
      this._logger.error(error.message);
    }
  }

  async screenshot(fileName, fileExt) {
    await this._page.screenshot({
      path: `${this.downloadPath}/${fileName}.${fileExt}`,
      fullPage: true,
      type: "png",
    });
  }

  async goToPage(url) {
    try {
      this._logger.info(`Navigating to ${url}`);
      await this._page.goto(url);
    } catch (error) {
      this._logger.error(error.message);
    }
  }

  async scrollDown() {
    try {
      await this._page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          const distance = 1000;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 1000);
        });
      });
    } catch (error) {
      this._logger.error(error.message);
    }
  }

  async click(selector) {
    try {
      if (!this.elementExists(selector)) {
        throw new Error(`Failed to click element: ${selector}`);
      }
      await this._page.click(selector);
    } catch (error) {
      throw error;
    }
  }

  async getElementHrefLink(selector) {
    try {
      if (!this.elementExists(selector)) {
        throw new Error(`Failed to get href link from element: ${selector}`);
      }
      return await this._page.$eval(selector, (el) => el.href);
    } catch (error) {
      throw error;
    }
  }

  async elementExists(selector, timeout = 5000) {
    try {
      await page.waitForSelector(selector, {
        visible: true,
        timeout,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async openNewPage() {
    this._page = await this._browser.newPage();
  }

  async closeCurrentPage() {
    if (this._page) {
      await this._page.close();
    }
  }
}
