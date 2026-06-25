class LoginPage {
  // Selectors
  title = () => cy.contains('app.login');
  emailLabel = () => cy.contains('auth.email');
  emailInput = () => cy.get('input[type="email"]');
  passwordLabel = () => cy.contains('auth.password');
  passwordInput = () => cy.get('input[type="password"]');
  loginButton = () => cy.contains('auth.loginButton');
  noAccountText = () => cy.contains('auth.noAccount');
  registerHereLink = () => cy.contains('auth.registerHere');

  // Actions
  visit() {
    cy.visit('/login');
  }

  login(email: string, password: string) {
    this.emailInput().type(email);
    this.passwordInput().type(password);
    this.loginButton().click();
  }
}

export default new LoginPage();
