import { test, expect } from '@playwright/test';

test.afterEach(async ({ page }, testInfo) => {
  if (page.isClosed()) return;
  const screenshotPath = testInfo.outputPath('page.png');
  await page.screenshot({
    path: screenshotPath,
    fullPage: testInfo.project.name === 'desktop-chromium',
    animations: 'disabled',
  });
  await testInfo.attach('Volledig scherm', {
    path: screenshotPath,
    contentType: 'image/png',
  });
});

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.goto('/');
});

test('toont het dispatchdashboard met inzetkaart en teamstatussen', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Goedemorgen, dispatch' })).toBeVisible();
  await expect(page.getByText('Live inzetkaart')).toBeVisible();
  await expect(page.getByRole('button', { name: /Sofie Peeters/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Interventies', exact: true })).toBeVisible();
});

test('zoekt, filtert en opent interventiedetails', async ({ page }) => {
  await page.getByRole('button', { name: 'Interventies', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Interventies' })).toBeVisible();

  const search = page.getByRole('textbox', { name: 'Zoek interventies' });
  await search.fill('Noorderlaan');
  await expect(page.getByRole('row').filter({ hasText: 'INT-2046' })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: 'INT-2048' })).toHaveCount(0);

  await search.clear();
  await page.getByLabel('Filter op status').selectOption('Afgerond');
  const completedRow = page.getByRole('row').filter({ hasText: 'INT-2045' });
  await expect(completedRow).toBeVisible();
  await completedRow.getByRole('button', { name: 'Details' }).click();
  await expect(page.getByRole('heading', { name: 'Overdracht aan ambulance' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Overdracht aan ambulance' }).getByText('Hulppost Centrum')).toBeVisible();
});

test('registreert een interventie in de demo-omgeving', async ({ page }) => {
  await page.getByRole('button', { name: 'Interventies', exact: true }).click();
  await page.getByRole('button', { name: 'Nieuwe interventie' }).first().click();
  await page.getByLabel('Locatie / zone').fill('Testlocatie · zone 7');
  await page.getByRole('button', { name: 'Melding registreren' }).click();
  await expect(page.getByText('Testlocatie · zone 7')).toBeVisible();
  await expect(page.getByText('Interventie toegevoegd aan demo-overzicht.')).toBeVisible();
});
