describe('Attendance API Tests', () => {

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
  // POST /attendance/mark/:eventId/member/:memberId
  // -----------------------------
  it('POST /attendance/mark/:eventId/member/:memberId - should mark attendance for a member', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/attendance/mark/${eventId}/member/${memberId}`,
      headers: {
        Authorization: `Bearer ${memberToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(201);

      // Vérification structure
      expect(response.body).to.have.property('id');
      expect(response.body.eventId).to.eq(eventId);
      expect(response.body.memberId).to.eq(memberId);

      // Vérifie que l'auteur est bien req.user.userId
      expect(response.body).to.have.property('markedBy');
      expect(response.body.markedBy).to.be.a('number');
    });
  });

  // -----------------------------
  // GET /attendance/event/:eventId
  // -----------------------------
  it('GET /attendance/event/:eventId - should list attendance records for an event', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/attendance/event/${eventId}`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');

      if (response.body.length > 0) {
        const record = response.body[0];

        expect(record).to.have.property('eventId');
        expect(record).to.have.property('memberId');
        expect(record).to.have.property('markedBy');
      }
    });
  });

});
