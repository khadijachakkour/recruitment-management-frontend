const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const os = require('os');
const fs = require('fs');

(async function runAdminTests() {
  // Crée un dossier temporaire unique pour le profil Chrome
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-user-data-'));
  const options = new chrome.Options();
  options.addArguments(`--user-data-dir=${userDataDir}`);
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  try {
    await driver.get('http://localhost:3000/');
    const links = await driver.findElements(By.tagName('a'));
    for (const link of links) {
      const text = await link.getText();
    }
    const postJobLink = await driver.findElement(By.partialLinkText('Post Job'));
    await postJobLink.click();
    await driver.wait(until.urlContains('/login'), 5000);

    await driver.wait(until.elementLocated(By.tagName('body')), 5000);
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    await driver.sleep(1000); 
    const signUpLink = await driver.wait(until.elementLocated(By.xpath("//a[normalize-space(text())='Sign Up']")), 5000);
    const signUpText = await signUpLink.getText();
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
    console.log('Inscription admin testée.');

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
    let currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/Admin/Create-profile')) {
      // Étape 1 : Tell us about your company
      await driver.wait(until.elementLocated(By.css('input[placeholder="Company Name"]')), 10000);
      await driver.findElement(By.css('input[placeholder="Company Name"]')).sendKeys('SeleniumTestCompany');
      const industrySelect2 = await driver.findElement(By.css('select[name="industry"]'));
      const industryOptions = await industrySelect2.findElements(By.css('option'));
      let validIndustry = null;
      for (const opt of industryOptions) {
        const val = await opt.getAttribute('value');
        if (val && val !== '' && val.toLowerCase() !== 'other') {
          validIndustry = val;
          break;
        }
      }
      if (!validIndustry) throw new Error('Aucune valeur valide trouvée pour le select industry');
      await industrySelect2.sendKeys(validIndustry);
      const selectedIndustry = await industrySelect2.getAttribute('value');
      await driver.findElement(By.css('textarea[name="companyDescription"]')).sendKeys('Entreprise de test créée par Selenium.');
      await driver.findElement(By.css('input[placeholder="CEO / Founder"]')).sendKeys('Selenium CEO');
      const nextBtn1b = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Next')]")), 5000);
      // S'assurer que le bouton est visible et activé
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', nextBtn1b);
      await driver.wait(until.elementIsVisible(nextBtn1b), 5000);
      await driver.wait(until.elementIsEnabled(nextBtn1b), 5000);
      // Attendre la disparition d'un éventuel overlay/loader
      try {
        await driver.wait(until.elementIsNotVisible(await driver.findElement(By.css('.loader, [aria-busy="true"]'))), 2000);
      } catch (e) {}
      // Essayer le clic natif puis JS si intercepté
      try {
        await nextBtn1b.click();
      } catch (err) {
        console.warn('Clic natif échoué, tentative via JS:', err.message);
        await driver.executeScript('arguments[0].click();', nextBtn1b);
      }
      // Étape 2 : Company Address
      await driver.wait(until.elementLocated(By.css('input[placeholder="Company Address"]')), 10000);
      await driver.findElement(By.css('input[placeholder="Company Address"]')).sendKeys('123 Rue de Test');
      await driver.findElement(By.css('input[placeholder="Pays"]')).sendKeys('Maroc');
      await driver.findElement(By.css('input[placeholder="Region"]')).sendKeys('Laarache');
      const nextBtn2 = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Next')]")), 5000);
      await driver.wait(until.elementIsEnabled(nextBtn2), 5000);
      await nextBtn2.click();
      // Étape 3 : History
      await driver.wait(until.elementLocated(By.css('input[placeholder="Year Founded"]')), 10000);
      await driver.findElement(By.css('input[placeholder="Year Founded"]')).sendKeys('2000');
      await driver.findElement(By.css('input[placeholder="Number of Employees"]')).sendKeys('50');
      const nextBtn3 = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Next')]")), 5000);
      await driver.wait(until.elementIsEnabled(nextBtn3), 5000);
      await nextBtn3.click();
      // Étape 4 : Organization 
      const nextBtn4 = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Next')]")), 5000);
      await driver.wait(until.elementIsEnabled(nextBtn4), 5000);
      await nextBtn4.click();
      // Étape 5 : Contact details 
      const saveBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Save Changes')]")), 5000);
      await driver.wait(until.elementIsEnabled(saveBtn), 5000);
      await saveBtn.click();
      await driver.wait(until.urlContains('/Admin/Company-profile'), 15000);
      currentUrl = await driver.getCurrentUrl();
      await driver.get('http://localhost:3000/Admin/Dashboard');
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Admin Dashboard')]")), 15000);
      // Scroll sur le dashboard admin
      await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
      await driver.sleep(1000);
    } else {
      await driver.wait(until.urlContains('/Admin/Dashboard'), 20000);
      await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
      await driver.sleep(1000);
    }
    
    // 5. Accès à la gestion des utilisateurs
    await driver.get('http://localhost:3000/Admin/Manage-users');
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Add User')]")), 5000);

    // Création d'un utilisateur manager
    const uniqueManagerId = Date.now();
    const managerEmail = `selenium.manager+${uniqueManagerId}@test.com`;
    await driver.findElement(By.xpath("//button[contains(.,'Add User')]")).click();
    // Attendre que le formulaire soit visible (modale ou overlay)
    await driver.sleep(500);
    // Scroll pour s'assurer que le champ Firstname est bien visible
    const firstNameInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Firstname"]')), 5000);
    await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', firstNameInput);
    await driver.wait(until.elementIsVisible(firstNameInput), 3000);
    await firstNameInput.sendKeys('SeleniumManager');
    const lastNameInput = await driver.findElement(By.css('input[placeholder="Lastname"]'));
    await lastNameInput.sendKeys('Test');
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys(`manageruser_${uniqueManagerId}`);
    await driver.findElement(By.css('input[type="email"]')).sendKeys(managerEmail);
    const roleSelect = await driver.findElement(By.css('select[name="role"]'));
    await roleSelect.sendKeys('manager');
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', submitBtn);
    await driver.wait(until.elementIsVisible(submitBtn), 2000);
    await driver.wait(until.elementIsEnabled(submitBtn), 2000);
    try {
      await submitBtn.click();
    } catch (err) {
      console.warn('Clic natif échoué sur submit, tentative via JS:', err.message);
      await driver.executeScript('arguments[0].click();', submitBtn);
    }
    // Vérifier que l'utilisateur manager apparaît dans la liste
    await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(),'${managerEmail}')]`)), 10000);
    console.log('Création utilisateur manager testée.');

    // Suppression de l'utilisateur manager
    const deleteBtn = await driver.findElement(By.xpath(`//td[contains(text(),'${managerEmail}')]/following-sibling::td//button[contains(.,'Delete')]`));
    await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', deleteBtn);
    await driver.wait(until.elementIsVisible(deleteBtn), 2000);
    await driver.wait(until.elementIsEnabled(deleteBtn), 2000);
    try {
      await deleteBtn.click();
    } catch (err) {
      console.warn('Clic natif échoué sur Delete, tentative via JS:', err.message);
      await driver.executeScript('arguments[0].click();', deleteBtn);
    }
    // Attendre que la modale soit bien affichée
    await driver.sleep(700);
    // Confirmer la suppression si une modal apparaît (adapter le sélecteur si besoin)
    try {
      const confirmBtn = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'fixed') and contains(@class,'z-50')]//button[contains(.,'Delete')]")),
        3000
      );
      await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', confirmBtn);
      await driver.wait(until.elementIsVisible(confirmBtn), 2000);
      await driver.wait(until.elementIsEnabled(confirmBtn), 2000);
      // Utiliser actions().move() pour cliquer sur le bouton Delete de la modale
      try {
        await driver.actions({ bridge: true }).move({ origin: confirmBtn }).click().perform();
      } catch (err) {
        console.warn('Clic natif échoué sur Delete (modal), tentative via JS:', err.message);
        await driver.executeScript('arguments[0].click();', confirmBtn);
      }
    } catch (e) {}
    // Attendre la disparition de l'utilisateur dans la liste
    await driver.sleep(1000);
    await driver.wait(async () => {
      const elements = await driver.findElements(By.xpath(`//td[contains(text(),'${managerEmail}')]`));
      return elements.length === 0;
    }, 10000);
    console.log('Suppression utilisateur manager testée.');

    // Attendre la disparition du toast de succès avant de cliquer sur Logout
    await driver.wait(async () => {
      const toasts = await driver.findElements(By.css('.Toastify__toast'));
      return toasts.length === 0;
    }, 5000);
    // 9. Test logout admin
    const logoutBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Logout')]")), 5000);
    await driver.wait(until.elementIsVisible(logoutBtn), 5000);
    await logoutBtn.click();
    await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);
    console.log('Déconnexion admin testée avec succès.');
  } catch (err) {
    console.error('Erreur lors des tests Selenium admin:', err);
  } finally {
    await driver.quit();
  }
})();