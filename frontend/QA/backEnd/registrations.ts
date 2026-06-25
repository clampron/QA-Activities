describe('Registrations API Tests', () => {

  const baseUrl = 'http://localhost:3000'; // 👉 adapte selon ton API
  let adminToken: string;
  let memberToken: string;

  // IDs utilisés pour les tests
  const eventId = 1;   // 👉 remplace par un event réel
  const memberId = 1;  // 👉 remplace par un membre réel

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
  // LOGIN MEMBER
  // -----------------------------
  before(() => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: {
        email: 'member@mail.com', // 👉 remplace par un membre réel
        password: 'MemberPassword123!'
      }
    }).then((response) => {
      memberToken = response.body.accessToken;
    });
  });

  // -----------------------------
  // POST /registrations/:eventId/member/:memberId
  // -----------------------------
  it('POST /registrations/:eventId/member/:memberId - should register a member to an event', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/registrations/${eventId}/member/${memberId}`,
      headers: {
        Authorization: `Bearer ${memberToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.eventId).to.eq(eventId);
      expect(response.body.memberId).to.eq(memberId);
    });
  });

  // -----------------------------
  // GET /registrations/event/:eventId
  // -----------------------------
  it('GET /registrations/event/:eventId - should return registrations for an event', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/registrations/event/${eventId}`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');

      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property('eventId');
        expect(response.body[0]).to.have.property('memberId');
      }
    });
  });

});
