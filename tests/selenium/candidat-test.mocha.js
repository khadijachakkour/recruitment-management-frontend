const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const os = require('os');
const fs = require('fs');
const assert = require('assert');

describe('Selenium Candidat E2E', function () {
  this.timeout(90000); // 90s timeout par test
  let driver;
  let userDataDir;
  let email;

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

  it('Inscription, connexion et navigation candidat', async () => {
    await driver.get('http://localhost:3000/');
    const signInLink = await driver.findElement(By.linkText('Sign In'));
    await signInLink.click();
    await driver.wait(until.urlContains('/login/Candidat'), 5000);
    const signUpLink = await driver.findElement(By.linkText('Sign Up'));
    await signUpLink.click();
    await driver.wait(until.urlContains('/register/Candidat'), 5000);
    await driver.findElement(By.css('input[placeholder="First Name"]')).sendKeys('TestCandidat');
    await driver.findElement(By.css('input[placeholder="Last Name"]')).sendKeys('Selenium');
    const uniqueId = Date.now();
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys(`seleniumuser_${uniqueId}`);
    email = `selenium.candidat1+${uniqueId}@test.com`;
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('TestPassword123!');
    await driver.findElement(By.css('input[type="checkbox"]')).click();
    await driver.findElement(By.css('button[type="submit"]')).click();
    try {
      await driver.wait(until.urlContains('/login/Candidat'), 15000);
    } catch (e) {
      const currentUrl = await driver.getCurrentUrl();
      assert.fail('Timeout: Redirection vers /login/Candidat non détectée. URL actuelle :' + currentUrl);
    }
    // Connexion du candidat
    await driver.get('http://localhost:3000/login/Candidat');
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys('TestPassword123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/Candidat/dashboard'), 5000);
    // Scroll sur le dashboard
    await driver.get('http://localhost:3000/Candidat/dashboard');
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    await driver.sleep(1000);
    // Navigation vers la liste des offres
    await driver.get('http://localhost:3000/Candidat/Listoffres');
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(),'Explore Job Opportunities')]")), 5000);
    // Test recherche d'une offre (si offres présentes)
    const offers = await driver.findElements(By.css('a[href^="/Candidat/viewOffers/"]'));
    if (offers.length > 0) {
      await offers[0].click();
      try {
        await driver.wait(until.urlContains('/Candidat/viewOffers/'), 5000);
        // Test postuler à une offre
        const postulerBtn = await driver.wait(
          until.elementLocated(By.xpath("//button[contains(.,'Postuler')]")),
          5000
        );
        await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", postulerBtn);
        await driver.wait(until.elementIsVisible(postulerBtn), 2000);
        await driver.wait(until.elementIsEnabled(postulerBtn), 2000);
        try {
          await driver.wait(until.elementIsNotVisible(await driver.findElement(By.css('.loader, [aria-busy="true"]'))), 2000);
        } catch (e) {}
        try {
          await postulerBtn.click();
        } catch (err) {
          await driver.executeScript("arguments[0].click();", postulerBtn);
        }
        await driver.sleep(1000);
        await driver.wait(until.urlContains('/Candidat/PostulerOffre/'), 10000);
      } catch (e) {
        const currentUrl = await driver.getCurrentUrl();
        assert.fail('Impossible d\'accéder au détail de l\'offre. URL courante:' + currentUrl);
      }
    }
    // Accès aux notifications
    await driver.get('http://localhost:3000/Candidat/notification');
    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Notifications')]")), 5000);
    // Logout
    const logoutBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Logout')]")), 5000);
    await driver.wait(until.elementIsVisible(logoutBtn), 5000);
    await logoutBtn.click();
    await driver.wait(until.urlIs('http://localhost:3000/login/Candidat'), 5000);
  });
});
