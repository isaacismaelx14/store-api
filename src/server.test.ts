import App from './app';
import request from 'supertest';
const server = new App(3001);

describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(server.app)
            .get('/')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});

describe('Test the users path', () => {
    test('Getting all users', (done) => {
        request(server.app)
            .get('/users')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });

    test('Getting one user', (done) => {
        request(server.app)
            .get('/users/1')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
  
    test('Change pwd user', (done) => {
        request(server.app)
            .patch('/users/change-password/1')
            .type('json')
            .send({new_pwd:'1234', old_pwd:'postmalone'})
            .then((response) => {
                expect(response.status).toBe(400);
                done();
            });
    });

    test('Login user', (done) => {
        request(server.app)
            .post('/users/login').type('json').send({email:'isaacismaelx14@gmail.com', password:'1234'})
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
});

describe('Product path', () => {
    test('Getting all products', (done) => {
        request(server.app)
            .get('/products')
            .then((response) => {
                expect(response.status).toBe(200);
                done();
            });
    });
    // test('Getting all products', (done) => {
    //   request(server.app)
    //     .post('/products')
    //     .type('json').send({
    //       'picture_id': 1,
    //       'seller_id': 1,
    //       'category_id': 1,
    //       'title': 'Test Product',
    //       'price':50.99 ,
    //       'stock':61,			
    //       'about': 'This is only a product test',
    //       'tags': 'test, first_product'
    //     })
    //     .then((response) => {
    //       expect(response.status).toBe(200);
    //       done();
    //     });
    // });

});
