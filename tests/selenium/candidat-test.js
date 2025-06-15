const { Builder, By, until } = require('selenium-webdriver');

(async function runFrontendTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {

    await driver.get('http://localhost:3000/');
    const signInLink = await driver.findElement(By.linkText('Sign In'));
    
    await signInLink.click();
    await driver.wait(until.urlContains('/login/Candidat'), 5000);
    const signUpLink = await driver.findElement(By.linkText('Sign Up'));
    
    await signUpLink.click();
    await driver.wait(until.urlContains('/register/Candidat'), 5000);

    // 2. Test création d'un candidat
    await driver.findElement(By.css('input[placeholder="First Name"]')).sendKeys('TestCandidat');
    await driver.findElement(By.css('input[placeholder="Last Name"]')).sendKeys('Selenium');
    const uniqueId = Date.now();
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys(`seleniumuser_${uniqueId}`);
    const email = `selenium.candidat1+${uniqueId}@test.com`;
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('TestPassword123!');
    await driver.findElement(By.css('input[type="checkbox"]')).click();
    await driver.findElement(By.css('button[type="submit"]')).click();
    // Attendre la redirection ou un message de succès
    await driver.wait(until.urlContains('/login/Candidat'), 5000);

    // 3. Test connexion du candidat
    await driver.get('http://localhost:3000/login/Candidat');
    await driver.findElement(By.css('input[type="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[type="password"]')).sendKeys('TestPassword123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/Candidat/dashboard'), 5000);

    // Test scroll sur la page d'accueil (juste après la connexion dashboard)
    await driver.get('http://localhost:3000/');
    // Scroll jusqu'en bas de la page
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    await driver.sleep(1000);
    // Log la position de scroll (utilise des noms uniques pour éviter les redeclarations)
    const scrollYHome = await driver.executeScript('return window.scrollY;');
    const innerHeightHome = await driver.executeScript('return window.innerHeight;');
    const bodyHeightHome = await driver.executeScript('return document.body.scrollHeight;');
    console.log('Scroll position (home):', scrollYHome, 'Window height:', innerHeightHome, 'Body height:', bodyHeightHome);

    // 4. Test navigation vers la liste des offres
    await driver.get('http://localhost:3000/Candidat/Listoffres');
    await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(),'Explore Job Opportunities')]")), 5000);

    // 5. Test recherche d'une offre (si offres présentes)
    const offers = await driver.findElements(By.css('a[href^="/Candidat/viewOffers/"]'));
    if (offers.length > 0) {
      await offers[0].click();
      try {
        await driver.wait(until.urlContains('/Candidat/viewOffers/'), 5000);
        // 6. Test postuler à une offre (bouton "Postuler")
        const postulerBtn = await driver.wait(
          until.elementLocated(By.xpath("//button[contains(.,'Postuler')]")),
          5000
        );
        await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", postulerBtn);
        await driver.wait(until.elementIsVisible(postulerBtn), 2000);
        await driver.wait(until.elementIsEnabled(postulerBtn), 2000);
        // Attendre la disparition d'un éventuel loader si présent (optionnel, ignore si absent)
        try {
          await driver.wait(until.elementIsNotVisible(await driver.findElement(By.css('.loader, [aria-busy="true"]'))), 2000);
        } catch (e) {}
        // Clic natif puis fallback JS si intercepté
        try {
          await postulerBtn.click();
        } catch (err) {
          console.warn('Clic natif échoué, tentative via JS:', err.message);
          await driver.executeScript("arguments[0].click();", postulerBtn);
        }
        // Après le clic, attends un court instant puis log le body pour debug
        await driver.sleep(1000);
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        await driver.wait(until.urlContains('/Candidat/PostulerOffre/'), 5000);
      } catch (e) {
        const currentUrl = await driver.getCurrentUrl();
        console.error('Impossible d\'accéder au détail de l\'offre. URL courante:', currentUrl);
        throw e;
      }
    } else {
      console.error('Aucune offre trouvée pour le test.');
    }

    // 8. Test accès aux notifications
    await driver.get('http://localhost:3000/Candidat/notification');
    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Notifications')]")), 5000);

    // 9. Test logout du candidat
    // Aller sur le dashboard candidat (ou une page où le bouton/logout est visible)
    await driver.get('http://localhost:3000/Candidat/dashboard');
    // Cliquer sur le bouton/logout (adapter le sélecteur si besoin)
    const logoutBtn = await driver.findElement(By.xpath("//button[contains(.,'Logout')] | //a[contains(.,'Logout')]"));
    await logoutBtn.click();
    // Vérifier la redirection vers la page d'accueil ou de login
    await driver.wait(until.urlIs('http://localhost:3000/'), 5000);
    console.log('Déconnexion du candidat testée avec succès.');

    // Test scroll sur la page d'accueil
    await driver.get('http://localhost:3000/');
    // Scroll jusqu'en bas de la page
    await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
    // Attendre un court instant pour simuler le scroll utilisateur
    await driver.sleep(1000);
    // Vérifier qu'on est bien en bas (optionnel, log la position)
    const scrollY = await driver.executeScript('return window.scrollY;');
    const innerHeight = await driver.executeScript('return window.innerHeight;');
    const bodyHeight = await driver.executeScript('return document.body.scrollHeight;');
    console.log('Scroll position:', scrollY, 'Window height:', innerHeight, 'Body height:', bodyHeight);
  } catch (err) {
    console.error('Erreur lors des tests Selenium:', err);
  } finally {
    await driver.quit();
  }
})();