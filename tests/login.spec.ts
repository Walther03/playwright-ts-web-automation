import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as userData from '../data/users.json'; // Importamos los datos

test('Debería iniciar sesión correctamente con credenciales válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    
    // Usamos los datos del JSON en lugar de escribir el texto aquí
    await loginPage.login(userData.validUser.username, userData.validUser.password);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
});

test('Debería mostrar error con usuario bloqueado', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(userData.invalidUser.username, userData.invalidUser.password);

    // Verificamos que aparezca el mensaje de error
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Sorry, this user has been locked out');
});