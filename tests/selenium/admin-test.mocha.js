const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const os = require('os');
const fs = require('fs');
const assert = require('assert');

describe('Selenium Admin E2E', function () {
  this.timeout(60000); // 60s timeout par test
  let driver;
  let userDataDir;

  before(async () => {
    userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-user-data-'));
    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${userDataDir}`);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--headless=new');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Inscription et connexion admin', async () => {
    await driver.get('http://localhost:3000/');
    const links = await driver.findElements(By.tagName('a'));
    assert.ok(links.length > 0, 'Des liens doivent être présents');
    const postJobLink = await driver.findElement(By.partialLinkText('Post Job'));
    await postJobLink.click();
    await driver.wait(until.urlContains('/login'), 5000);
    await driver.wait(until.elementLocated(By.tagName('body')), 5000);
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    await driver.sleep(1000);
    const signUpLink = await driver.wait(until.elementLocated(By.xpath("//a[normalize-space(text())='Sign Up']")), 5000);
    await driver.wait(until.elementIsVisible(signUpLink), 5000);
    await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', signUpLink);
    await driver.sleep(500);
    await signUpLink.click();
    await driver.wait(until.urlContains('/register/Admin'), 15000);
    const uniqueId = Date.now();
    const adminEmail = `selenium.admin+${uniqueId}@test.com`;
    await driver.findElement(By.css('input[placeholder="First Name"]')).sendKeys('SeleniumAdmin');
    await driver.findElement(By.css('input[placeholder="Last Name"]')).sendKeys('Test');
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys(`adminuser_${uniqueId}`);
    await driver.findElement(By.css('input[type="email"]')).sendKeys(adminEmail);
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('AdminPassword123!');
    await driver.findElement(By.css('input[type="checkbox"]')).click();
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/login'), 5000);
    // Connexion admin après inscription
    await driver.findElement(By.css('input[type="email"]')).clear();
    await driver.findElement(By.css('input[type="email"]')).sendKeys(adminEmail);
    await driver.findElement(By.css('input[type="password"]')).clear();
    await driver.findElement(By.css('input[type="password"]')).sendKeys('AdminPassword123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes('/Admin/Create-profile') || url.includes('/Admin/Dashboard');
    }, 20000);
    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/Admin/Create-profile') || currentUrl.includes('/Admin/Dashboard'), 'Redirection après connexion admin');
  });

  // Vous pouvez ajouter d'autres tests ici, en suivant le même schéma
});
