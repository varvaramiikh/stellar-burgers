import { test, expect } from '@playwright/test';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/';
    });

    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0; path=/';
    });
  });

  test('отображает моковые ингредиенты на странице', async ({ page }) => {
    await expect(page.getByText('Тестовая булка')).toBeVisible();
    await expect(page.getByText('Тестовая начинка')).toBeVisible();
    await expect(page.getByText('Тестовый соус')).toBeVisible();
  });

  test('добавляет булку из списка ингредиентов в конструктор', async ({
    page
  }) => {
    const bunCard = page
      .getByText('Тестовая булка')
      .locator('..')
      .locator('..');

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Тестовая булка')).toHaveCount(3);
  });

  test('добавляет начинку из списка ингредиентов в конструктор', async ({
    page
  }) => {
    const mainCard = page
      .getByText('Тестовая начинка')
      .locator('..')
      .locator('..');

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Тестовая начинка')).toHaveCount(2);
  });

  test('открывает модальное окно с данными выбранного ингредиента', async ({
    page
  }) => {
    await page.getByText('Тестовая булка').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Тестовая булка' })
    ).toBeVisible();

    await expect(modal.getByText('Калории, ккал')).toBeVisible();
    await expect(modal.getByText('Белки, г')).toBeVisible();
    await expect(modal.getByText('Жиры, г')).toBeVisible();
    await expect(modal.getByText('Углеводы, г')).toBeVisible();
  });

  test('закрывает модальное окно ингредиента по клику на крестик', async ({
    page
  }) => {
    await page.getByText('Тестовая булка').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({
    page
  }) => {
    await page.getByText('Тестовая булка').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 }
    });

    await expect(modal).not.toBeVisible();
  });

  test('создаёт заказ, показывает номер заказа и очищает конструктор', async ({
    page
  }) => {
    const bunCard = page
      .getByText('Тестовая булка')
      .locator('..')
      .locator('..');

    const mainCard = page
      .getByText('Тестовая начинка')
      .locator('..')
      .locator('..');

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal.getByText('12345')).toBeVisible();

    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });
});
