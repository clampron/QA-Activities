class RegisterPage {
  // Selectors
  title = () => cy.contains('auth.registerTitle');
  nameLabel = () => cy.contains('auth.name');
  nameInput = () => cy.get('input[name="name"]');

  emailLabel = () => cy.contains('auth.email');
  emailInput = () => cy.get('input[type="email"]');

  passwordLabel = () => cy.contains('auth.password');
  passwordInput = () => cy.get('input[type="password"]');

  birthDateLabel = () => cy.contains('auth.birthDate');
  birthDateInput = () => cy.get('input[type="date"]');

  genderLabel = () => cy.contains('auth.gender');
  genderSelect = () => cy.get('select[name="gender"]');
  genderPlaceholder = () => cy.contains('auth.selectGender');

  registerButton = () => cy.contains('auth.registerButton');
  backToLoginLink = () => cy.contains('auth.backToLogin');

  // Actions
  visit() {
    cy.visit('/register');
  }

  register(name: string, email: string, password: string, birthDate: string, gender: string) {
    this.nameInput().type(name);
    this.emailInput().type(email);
    this.passwordInput().type(password);
    this.birthDateInput().type(birthDate);
    this.genderSelect().select(gender);
    this.registerButton().click();
  }
}

export default new RegisterPage();
