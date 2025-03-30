const express=require('express');
const request=require('supertest');




describe('API Authentication workflow testing',()=>{
    let app;
    let userPayload;
    beforeAll(async()=>{
        const Application = require('../../Application');
        app=express();
        await new Application().testing().run(app);
        const authConfig = require('../../config/authConfig');
        userPayload={
            name:'abood-test',
            email:'abood@hotmail.com',
            guard:authConfig.defaults.defaultGuard,
            password:'Abood123456*',
            confirmPassword:'Abood123456*'
        };
        console.log('App is running in testing mode');
    })

    describe('User Registeration',()=>{
        it('should create new user and return 201 statusCode',async()=>{
            const response=await request(app).post('/api/register').send(userPayload);
            expect(response.body.status).toBe(true);
            expect(response.status).toBe(201);
        });

        it('with user already exist  payload it should return 400 with error type => Validation',async()=>{
            const response=await request(app).post('/api/register').send(userPayload);
            expect(response.body.status).toBe(false);
            expect(response.body.error.type).toBe('Validation');
            expect(response.status).toBe(400);
        });

        it('with invalid userPayload it should return 400 with error type => Validation',async()=>{
            const copyUserPayload={...userPayload};
            copyUserPayload.email='invalid email';
            const response=await request(app).post('/api/register').send(copyUserPayload);
            expect(response.body.status).toBe(false);
            expect(response.body.error.type).toBe('Validation');
            expect(response.status).toBe(400);
        });
    })

    describe('User Authentication',()=>{
        let userToken;
        it('should autheticate the user with 200 status',async()=>{
            const copyUserPayload={...userPayload};
            delete copyUserPayload.confirmPassword;
            delete copyUserPayload.name;
            const response=await request(app).post('/api/login').send(copyUserPayload);
            expect(response.body.status).toBe(true);
            expect(response.status).toBe(200);
            userToken=response.body.result.token;
        });
        
        it('with Unauthorized userPayload it should return 401 with error type => Authentication',async()=>{
            const copyUserPayload={...userPayload};
            delete copyUserPayload.confirmPassword;
            delete copyUserPayload.name;
            copyUserPayload.email='notfound@gmail.com';
            const response=await request(app).post('/api/login').send(copyUserPayload);
            expect(response.body.status).toBe(false);
            expect(response.body.error.type).toBe('Authentication');
            expect(response.status).toBe(401);
        });

        it('with invalid userPayload it should return 400 with error type => Validation',async()=>{
            const copyUserPayload={...userPayload};
            delete copyUserPayload.confirmPassword;
            delete copyUserPayload.name;
            copyUserPayload.email='invalid email';
            const response=await request(app).post('/api/login').send(copyUserPayload);
            expect(response.body.status).toBe(false);
            expect(response.body.error.type).toBe('Validation');
            expect(response.status).toBe(400);
        });

        describe('Access Protected Routes',()=>{
            it('when unauthorized user try to access protected route it should return 401 with error type => Authentication',async()=>{
                const response=await request(app).get('/api/test');
                expect(response.body.status).toBe(false);
                expect(response.body.error.type).toBe('Authentication');
                expect(response.status).toBe(401);
            });
            it('authorized user try to access protected route it should return 200',async()=>{
                const response=await request(app).get('/api/test').set('authorization',`Bearer ${userToken}`);
                expect(response.body.status).toBe(true);
                expect(response.status).toBe(200);
            });
        });

        describe('Logout authorized user',()=>{
            it('should logout and return 200 status',async()=>{
                const response=await request(app).get('/api/logout').set('authorization',`Bearer ${userToken}`);
                expect(response.body.status).toBe(true);
                expect(response.status).toBe(200);
            });
            it('when try to access protected route with our token it should return 401 with error type => Authentication',async()=>{
                const response=await request(app).get('/api/test').set('authorization',`Bearer ${userToken}`);
                expect(response.body.status).toBe(false);
                expect(response.body.error.type).toBe('Authentication');
                expect(response.status).toBe(401);
            });
        });
        
    afterAll(async()=>{
        const Application = require('../../Application');
        await new Application().dropDatabase();
    })
    
    })
})