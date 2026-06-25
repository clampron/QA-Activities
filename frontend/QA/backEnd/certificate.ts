describe('Certificates API Tests', () => {

  const baseUrl = 'http://localhost:3000'; // 👉 adapte selon ton API
  let adminToken: string;
  let registrationId = 1; // 👉 remplace par un registration réel
  let issuedVerificationCode: string;

  // -----------------------------
  // LOGIN ADMIN (JWT REQUIRED)
  // -----------------------------
  before(() => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: {
        email: 'admin@mail.com', // 👉 remplace par ton admin réel
        password: 'AdminPassword123!'
      }
    }).then((response) => {
      adminToken = response.body.accessToken;
    });
  });

  // -----------------------------
  // POST /certificates/issue/:registrationId
  // -----------------------------
  it('POST /certificates/issue/:registrationId - should issue a certificate', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/certificates/issue/${registrationId}`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(201);

      // Vérification structure
      expect(response.body).to.have.property('verificationCode');
      expect(response.body).to.have.property('pdfPath');

      issuedVerificationCode = response.body.verificationCode;

      // Vérifie que le PDF est bien généré
      expect(response.body.pdfPath).to.be.a('string');
      expect(response.body.pdfPath).to.include('.pdf');
    });
  });

  // -----------------------------
  // GET /certificates/verify/:registrationId?code=xxxx
  // -----------------------------
  it('GET /certificates/verify/:registrationId - should verify certificate validity', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/certificates/verify/${registrationId}?code=${issuedVerificationCode}`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Vérification structure
      expect(response.body).to.have.property('valid');
      expect(response.body.valid).to.eq(true);
    });
  });

  // -----------------------------
  // TEST NÉGATIF : mauvais code
  // -----------------------------
  it('GET /certificates/verify/:registrationId - should return invalid for wrong code', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/certificates/verify/${registrationId}?code=WRONGCODE`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.valid).to.eq(false);
    });
  });

});
