// cypress/e2e/spec.cy.js
describe('Testes da API', () => {
  const email = 'test@example.com';
  let authToken = '';

  it('Deve solicitar código de login', () => {
    cy.request('POST', 'http://127.0.0.1:8000/api/login', { email })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Notificação de código de verificação enviada para o seu e-mail.');
      });
  });

  it('Deve verificar o código de login e obter token', () => {

    cy.obterCodigoDeVerificacao(email).then((codigoDeVerificacao) => {

      cy.request('POST', 'http://127.0.0.1:8000/api/login/verify', {
        email,
        login_code: codigoDeVerificacao
      }).then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body; 
      });
    });
  });

  it('Deve obter dados do usuário', () => {
    cy.request({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/user',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('Deve atualizar dados do motorista', () => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/driver',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      },
      body: {
        year: 2020,
        make: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        license_plate: 'ABC123',
        name: 'John Doe'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('Deve criar uma viagem', () => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/trip',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        destination_name: 'starbucks',
        destination: { lat: 12.323536, lng: 23.353636 },
        origin: { lat: 11.323536, lng: 13.353636 }
      }
    }).then((response) => {
      expect(response.status).to.eq(201); 
    });
  });

  it('Deve obter detalhes da viagem', () => {
    cy.request({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/trip/1',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe('Testes de falha na API', () => {
  const email = 'testexample.com';
  let authToken = '';

  it('Deve falhar ao solicitar código de login com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/login',
      body: { email },
      failOnStatusCode: false 
    }).then((response) => {
      expect(response.status).to.eq(500); 
    });
  });

  it('Deve falhar ao verificar o código de login com código inválido', () => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/login/verify',
      body: { email, login_code: 'invalid_code' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(500); 
    });
  });

  it('Deve falhar ao obter dados do usuário sem token de autenticação', () => {
    cy.request({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/user',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(500); 
    });
  });

  it('Deve falhar ao atualizar dados do motorista sem fornecer token de autenticação', () => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/driver',
      headers: { 'Accept': 'application/json' },
      body: {
        year: 2020,
        make: 'Toyota',
        model: 'Corolla',
        color: 'Red',
        license_plate: 'ABC123',
        name: 'John Doe'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401); 
    });
  });

  it('Deve falhar ao criar uma viagem sem fornecer token de autenticação', () => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/trip',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: {
        destination_name: 'starbucks',
        destination: { lat: 12.323536, lng: 23.353636 },
        origin: { lat: 11.323536, lng: 13.353636 }
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('Deve falhar ao obter detalhes de uma viagem inexistente', () => {
    cy.request({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/trip/99999', 
      headers: { 'Authorization': `Bearer ${authToken}` },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(500); 
    });
  });
});
