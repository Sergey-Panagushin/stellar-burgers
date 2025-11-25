describe('Конструктор бургеров', () => {
  const BUN_NAME = 'Краторная булка N-200i';
  const FILLING_NAME = 'Филе Люминесцентного тетраодонтимформа';
  const ORDER_BUTTON = 'Оформить заказ';
  const FILLINGS_TAB = 'Начинки';

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });

    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json' 
    });

    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    });

    cy.visit('/');
    
    cy.get('body').then(($body) => {
      const overlay = $body.find('#webpack-dev-server-client-overlay');
      if (overlay.length > 0) {
        overlay.remove();
      }
    });
  });

  afterEach(() => {
    cy.clearCookies();
    window.localStorage.clear();
  });

  describe('Добавление ингредиентов', () => {
    it('добавляет булку', () => {
      cy.contains(BUN_NAME)
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains(`${BUN_NAME} (верх)`).should('exist');
      cy.contains(`${BUN_NAME} (низ)`).should('exist');
    });

    it('добавляет начинку', () => {
      cy.contains(BUN_NAME)
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains(FILLINGS_TAB).click({ force: true });
      cy.contains(FILLING_NAME)
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains(FILLING_NAME).should('exist');
    });
  });

  describe('Модальное окно', () => {
    it('открывается при клике и показывает правильный ингредиент', () => {
      cy.contains(BUN_NAME).click({ force: true });
      cy.url().should('include', '/ingredients/');
      
      cy.contains(BUN_NAME).should('exist');
      cy.contains('Калории, ккал').should('exist');
      cy.contains('420').should('exist');
    });

    it('показывает данные другого ингредиента', () => {
      cy.contains(FILLINGS_TAB).click({ force: true });
      cy.contains(FILLING_NAME).click({ force: true });
      
      cy.contains(FILLING_NAME).should('exist');
      cy.contains('Калории, ккал').should('exist');
      cy.contains('643').should('exist');
    });

    it('закрывается', () => {
      cy.contains(BUN_NAME).click({ force: true });
      cy.go('back');
      cy.url().should('eq', 'http://localhost:4000/');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      window.localStorage.setItem('accessToken', 'test-token');
      cy.setCookie('accessToken', 'test-token');
    });

    it('создает заказ', () => {
      cy.contains(BUN_NAME)
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains(FILLINGS_TAB).click({ force: true });
      cy.contains(FILLING_NAME)
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('button', ORDER_BUTTON).click({ force: true });

      cy.contains('12345').should('exist');
    });
  });
});