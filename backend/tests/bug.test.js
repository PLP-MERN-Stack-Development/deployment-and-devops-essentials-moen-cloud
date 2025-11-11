import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Bug from '../models/Bug.js';
import connectDB from '../config/db.js';

// Test database connection
beforeAll(async () => {
  await connectDB();
});

// Clear database before each test
beforeEach(async () => {
  await Bug.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await Bug.deleteMany({});
  await mongoose.connection.close();
});

describe('Bug API Endpoints', () => {
  
  describe('POST /api/bugs', () => {
    it('should create a new bug with valid data', async () => {
      const bugData = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        severity: 'high',
        status: 'open'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe(bugData.title);
      expect(response.body.data.severity).toBe(bugData.severity);
    });

    it('should return 400 for missing title', async () => {
      const bugData = {
        description: 'Missing title'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 400 for invalid severity', async () => {
      const bugData = {
        title: 'Invalid Severity Bug',
        description: 'Testing invalid severity',
        severity: 'super-critical' // Invalid value
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bugs', () => {
    it('should return empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return all bugs', async () => {
      // Create test bugs
      await Bug.create([
        { title: 'Bug 1', description: 'Description 1', severity: 'low' },
        { title: 'Bug 2', description: 'Description 2', severity: 'high' },
        { title: 'Bug 3', description: 'Description 3', severity: 'medium' }
      ]);

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    it('should filter bugs by status', async () => {
      await Bug.create([
        { title: 'Open Bug', description: 'Desc', status: 'open' },
        { title: 'Closed Bug', description: 'Desc', status: 'closed' }
      ]);

      const response = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe('open');
    });
  });

  describe('GET /api/bugs/:id', () => {
    it('should return a single bug by ID', async () => {
      const bug = await Bug.create({
        title: 'Single Bug',
        description: 'Test Description',
        severity: 'medium'
      });

      const response = await request(app)
        .get(`/api/bugs/${bug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(bug._id.toString());
      expect(response.body.data.title).toBe('Single Bug');
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    it('should update a bug', async () => {
      const bug = await Bug.create({
        title: 'Original Title',
        description: 'Original Description',
        status: 'open'
      });

      const updateData = {
        status: 'in-progress',
        assignedTo: 'John Doe'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('in-progress');
      expect(response.body.data.assignedTo).toBe('John Doe');
      expect(response.body.data.title).toBe('Original Title'); // Unchanged
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({ status: 'closed' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('should delete a bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to Delete',
        description: 'This will be deleted'
      });

      const response = await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify bug is deleted
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bugs/stats', () => {
    it('should return bug statistics', async () => {
      await Bug.create([
        { title: 'Bug 1', description: 'Desc', status: 'open', severity: 'high' },
        { title: 'Bug 2', description: 'Desc', status: 'open', severity: 'low' },
        { title: 'Bug 3', description: 'Desc', status: 'closed', severity: 'high' }
      ]);

      const response = await request(app)
        .get('/api/bugs/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.byStatus).toBeInstanceOf(Array);
      expect(response.body.data.bySeverity).toBeInstanceOf(Array);
    });
  });
});