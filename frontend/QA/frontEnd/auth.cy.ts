import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

describe('Authentication Flow', () => {

  it('should display all login fields', () => {
    LoginPage.visit();

    LoginPage.title().should('exist');
    LoginPage.emailLabel().should('exist');
    LoginPage.emailInput().should('exist');
    LoginPage.passwordLabel().should('exist');
    LoginPage.passwordInput().should('exist');
    LoginPage.loginButton().should('exist');
    LoginPage.noAccountText().should('exist');
    LoginPage.registerHereLink().should('exist');
  });

  it('should navigate to register page and display all fields', () => {
    LoginPage.visit();
    LoginPage.registerHereLink().click();

    RegisterPage.title().should('exist');
    RegisterPage.nameLabel().should('exist');
    RegisterPage.nameInput().should('exist');

    RegisterPage.emailLabel().should('exist');
    RegisterPage.emailInput().should('exist');

    RegisterPage.passwordLabel().should('exist');
    RegisterPage.passwordInput().should('exist');

    RegisterPage.birthDateLabel().should('exist');
    RegisterPage.birthDateInput().should('have.attr', 'placeholder', 'mm/dd/yyyy');

    RegisterPage.genderLabel().should('exist');
    RegisterPage.genderSelect().should('exist');
    RegisterPage.genderPlaceholder().should('exist');

    RegisterPage.registerButton().should('exist');
    RegisterPage.backToLoginLink().should('exist');
  });

  it('should show error and loading on failed login', () => {
    LoginPage.visit();

    LoginPage.login('wrong@mail.com', 'wrongpassword');

    cy.contains('common.loading').should('exist');
    cy.contains('error').should('exist');
  });

});
