describe('Audit API Tests', () => {

  const baseUrl = 'http://localhost:3000'; // 👉 adapte selon ton API
  let adminToken: string;
  let staffToken: string;

  // -----------------------------
  // LOGIN ADMIN
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
  // LOGIN STAFF
  // -----------------------------
  before(() => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: {
        email: 'staff@mail.com', // 👉 remplace par un staff réel
        password: 'StaffPassword123!'
      }
    }).then((response) => {
      staffToken = response.body.accessToken;
    });
  });

  // -----------------------------
  // GET /audit?limit=100 (ADMIN)
  // -----------------------------
  it('GET /audit?limit=100 - should return audit logs for ADMIN', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/audit?limit=100`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.lte(100);

      if (response.body.length > 0) {
        const log = response.body[0];

        expect(log).to.have.property('id');
        expect(log).to.have.property('action');
        expect(log).to.have.property('timestamp');
        expect(log).to.have.property('performedBy');
      }
    });
  });

  // -----------------------------
  // GET /audit?limit=50 (STAFF)
  // -----------------------------
  it('GET /audit?limit=50 - should return audit logs for STAFF', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/audit?limit=50`,
      headers: {
        Authorization: `Bearer ${staffToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.lte(50);
    });
  });

  // -----------------------------
  // TEST NÉGATIF : USER NON AUTORISÉ
  // -----------------------------
  it('GET /audit - should fail for regular member (403)', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: {
        email: 'member@mail.com', // 👉 remplace par un membre réel
        password: 'MemberPassword123!'
      }
    }).then((loginResponse) => {
      const memberToken = loginResponse.body.accessToken;

      cy.request({
        method: 'GET',
        url: `${baseUrl}/audit`,
        headers: {
          Authorization: `Bearer ${memberToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });
  });

});
