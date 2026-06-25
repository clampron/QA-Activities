describe('Events API Tests', () => {

  const baseUrl = 'http://localhost:3000'; // 👉 adapte selon ton API
  let adminToken: string;
  let staffToken: string;
  let createdEventId: number;

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
  // GET /events (PUBLIC)
  // -----------------------------
  it('GET /events - should return all events', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/events`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  // -----------------------------
  // CREATE EVENT (ADMIN or STAFF)
  // -----------------------------
  it('POST /events - should create an event (ADMIN)', () => {
    const payload = {
      title: 'Cypress Test Event',
      description: 'Event created during automated tests',
      date: '2030-01-01',
      location: 'Montreal',
    };

    cy.request({
      method: 'POST',
      url: `${baseUrl}/events`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      body: payload
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');

      createdEventId = response.body.id;
    });
  });

  // -----------------------------
  // GET /events/:id (PUBLIC)
  // -----------------------------
  it('GET /events/:id - should return event details', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/events/${createdEventId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(createdEventId);
    });
  });

  // -----------------------------
  // UPDATE EVENT (ADMIN or STAFF)
  // -----------------------------
  it('PUT /events/:id - should update event (STAFF)', () => {
    const payload = {
      title: 'Updated Cypress Event',
      location: 'Quebec City'
    };

    cy.request({
      method: 'PUT',
      url: `${baseUrl}/events/${createdEventId}`,
      headers: {
        Authorization: `Bearer ${staffToken}`
      },
      body: payload
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.title).to.eq(payload.title);
      expect(response.body.location).to.eq(payload.location);
    });
  });

  // -----------------------------
  // DELETE EVENT (ADMIN ONLY)
  // -----------------------------
  it('DELETE /events/:id - should delete event (ADMIN)', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/events/${createdEventId}`,
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    }).then((response) => {
      expect([200, 204]).to.include(response.status);
    });
  });

});
