describe('Конструктор бургеров', () => {
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
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('(верх)').should('exist');
      cy.contains('(низ)').should('exist');
    });

    it('добавляет начинку', () => {
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Начинки').click({ force: true });
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Выберите начинку').should('not.exist');
    });
  });

  describe('Модальное окно', () => {
    it('открывается при клике', () => {
      cy.contains('Краторная булка N-200i').click({ force: true });
      cy.url().should('include', '/ingredients/');
    });

    it('показывает данные', () => {
      cy.contains('Краторная булка N-200i').click({ force: true });
      cy.contains('Калории, ккал').should('exist');
    });

    it('закрывается', () => {
      cy.contains('Краторная булка N-200i').click({ force: true });
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
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.contains('Начинки').click({ force: true });
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .find('button')
        .contains('Добавить')
        .click({ force: true });

      cy.get('button').contains('Оформить заказ').click({ force: true });

      cy.contains('12345').should('exist');
    });
  });
});