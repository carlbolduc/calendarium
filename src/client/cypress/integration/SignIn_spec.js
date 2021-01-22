describe('Sign In', () => {
  it('displays the app sign in page', () => {
    cy.visit('sign-in');
  });

  it('contains a sign in header', () => {
    cy.contains('Sign in');
  });

  it('contains an email field', () => {
    cy.get('#input-email');
  });

  it('contains a password field', () => {
    cy.get('#input-password');
  });

  it('requires an email to sign in', () => {
    cy.get('#button-sign-in').click();
    cy.get('#input-email')
      .should('have.focus');
  });

  it('requires a password to sign in', () => {
    cy.get('#input-email')
      .type('bi@du.io')
      .should('have.value', 'bi@du.io');
    cy.get('#button-sign-in').click();
    cy.get('#input-password')
      .should('have.focus');
  });

  it('rejects sign in for an incorrect user', () => {
    cy.get('#input-password')
      .type('bidu1234')
      .should('have.value', 'bidu1234');
    cy.get('#button-sign-in').click();
    cy.contains('Sorry, we didn’t recognize your email address or your password. Want to try again?');
  });

  it('accepts sign in for an existing user', () => {
    cy.get('#input-email')
      .clear()
      .type('magalieallard@icloud.com')
      .should('have.value', 'magalieallard@icloud.com');
    cy.get('#input-password')
      .clear()
      .type('ivoloj77nh')
      .should('have.value', 'ivoloj77nh');
    cy.get('#button-sign-in').click();
    cy.contains('Home');
  });
})