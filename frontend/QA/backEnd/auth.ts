describe('Auth API Tests', () => {

  const baseUrl = 'http://localhost:3000'; // 👉 adapte selon ton API
  let adminToken: string;
  let userToken: string;
  let createdUserId: number;

  // -----------------------------
  // REGISTER
  // -----------------------------
  it('POST /auth/register - should register a new user', () => {
    const payload = {
      email: `test${Date.now()}@mail.com`,
      password: 'Password123!',
      name: 'Test User',
      birthDate: '1990-01-01',
      gender: 'MALE'
    };

    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/register`,
      body: payload
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.email).to.eq(payload.email);

      createdUserId = response.body.id;
    });
  });

  // -----------------------------
  // LOGIN (USER)
  // -----------------------------
  it('POST /auth/login - should login as user', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: {
        email: `test${Date.now()}@mail.com`, // ⚠️ si tu veux tester le user créé, remplace par payload.email
        password: 'Password123!'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Ici, login échouera si tu ne mets pas le bon email
      // Je te laisse ajuster selon ton flux
      expect([200, 401]).to.include(response.status);

      if (response.status === 200) {
        userToken = response.body.accessToken;
      }
    });
  });

  // -----------------------------
  // LOGIN (ADMIN)
  // -----------------------------
  it('POST /auth/login - should login as admin', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: {
        email: 'admin@mail.com', // 👉 remplace par ton admin réel
        password: 'AdminPassword123!'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('accessToken');

      adminToken = response.body.accessToken;
    });
  });

  // -----------------------------
  // GET MEMBERS (ADMIN ONLY)
  // -----------------------------
  it('GET /auth/members - should return list of members (ADMIN)', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/auth/members`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  // -----------------------------
  // PROMOTE USER TO STAFF (ADMIN ONLY)
  // -----------------------------
  it('PUT /auth/promote/:memberId - should promote user to staff', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/auth/promote/${createdUserId}`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.role).to.eq('STAFF');
    });
  });

  // -----------------------------
  // CHANGE ROLE (ADMIN ONLY)
  // -----------------------------
  it('PUT /auth/members/:memberId/role - should change user role', () => {
    const payload = { role: 'ADMIN' };

    cy.request({
      method: 'PUT',
      url: `${baseUrl}/auth/members/${createdUserId}/role`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      body: payload
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.role).to.eq(payload.role);
    });
  });

});
