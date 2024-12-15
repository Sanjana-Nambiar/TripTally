import http from 'http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.mjs';
import { expect } from 'chai';

describe('Backend API Unit Tests with Mock MongoDB', () => {
  let server;
  let mongoServer;
  let testUser = null;
  let testTrip = null;
  let sessionCookie = null;

  before(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mockUri = mongoServer.getUri();

    // Connect to the in-memory MongoDB server
    mongoose.set('strictQuery', true); // Suppress deprecation warnings
    await mongoose.connect(mockUri);

    // Start the Express server
    server = app.listen(3001);
  });

  after(async () => {
    // Disconnect and stop the mock MongoDB server
    await mongoose.disconnect();
    await mongoServer.stop();

    // Close the Express server
    server.close();
  });

  const makeRequest = (options, body) =>
    new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) }));
      });
      req.on('error', (err) => reject(err));
      if (body) req.write(JSON.stringify(body));
      req.end();
    });

  it('should register a new user', async () => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    const res = await makeRequest(options, {
      username: 'testuser123',
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'User registered successfully');
  });

  it('should login the user', async () => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    const res = await makeRequest(options, {
      username: 'testuser123',
      password: 'password123',
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Login successful');

    // Save session cookie for authorized requests
    sessionCookie = res.headers['set-cookie'][0].split(';')[0];
  });

  it('should create a new trip', async () => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/trip/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie, // Use session cookie from login
      },
    };

    const res = await makeRequest(options, {
      title: 'Test Trip',
      destination: 'Test Destination',
      start_date: '2024-12-01',
      end_date: '2024-12-05',
      estimated_budget: 500,
      participants: [],
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message', 'Trip added successfully');
    testTrip = res.body.trip; // Capture the created trip
  });

  it('should delete the trip', async () => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/trip/${testTrip._id}`,
      method: 'DELETE',
      headers: {
        Cookie: sessionCookie, // Use session cookie from login
      },
    };

    const res = await makeRequest(options);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Trip and related data deleted successfully');
  });
});
