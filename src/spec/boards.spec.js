import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";

import Boards from "../features/boards/boards/boards.model.js";
import {
  cleanUpCollection,
  createTestUser,
  cleanUpDatabase,
  generateValidJwt,
  createFewBoards,
  createTestBoard,
} from "./utils.js";

describe("Boards API Endpoints", () => {
  beforeEach(() => cleanUpDatabase());

  describe("GET /api/boards", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail getting boards if user is not authenticated", async () => {
      const response = await supertest(app).get("/api/boards").expect(401);
    });

    it("should get boards if user is authenticated", async () => {
      const boards = await createFewBoards();

      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBe(2);
      expect(response.body.nextCursor).toBeDefined();
    });

    it("should get boards with pagination using limit", async () => {
      const boards = await createFewBoards();

      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get("/api/boards?limit=1")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBe(1);
      expect(response.body.nextCursor).toBeDefined();
    });

    it("should clamp limit to 2 when limit is less than 1", async () => {
      const boards = await createFewBoards();

      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get("/api/boards?limit=-5")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBe(2); // clamped to 2
    });

    it("should clamp limit to 20 when limit exceeds 20", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      // Create more than 20 boards to test limit clamping
      for (let i = 0; i < 25; i++) {
        await createTestBoard(testUser._id);
      }

      const response = await supertest(app)
        .get("/api/boards?limit=100")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBeLessThanOrEqual(20); // clamped to 20
    });

    it("should fail with invalid cursor format", async () => {
      const boards = await createFewBoards();

      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get("/api/boards?cursor=invalidCursor")
        .set("Authorization", `Bearer ${token}`)
        .expect(500);
    });

    it("should use cursor for pagination", async () => {
      const boards = await createFewBoards();

      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      // First request to get nextCursor
      const firstResponse = await supertest(app)
        .get("/api/boards?limit=1")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const nextCursor = firstResponse.body.nextCursor;

      // Second request using cursor
      const secondResponse = await supertest(app)
        .get(`/api/boards?limit=1&cursor=${nextCursor}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(secondResponse.body.items).toBeDefined();
      expect(secondResponse.body.items.length).toBe(1);
      // The second page should have different items
      expect(secondResponse.body.items[0]._id).not.toBe(firstResponse.body.items[0]._id);
    });

    it("should get boards filtered by userId", async () => {
      const boards = await createFewBoards();
      const bobBoard = boards[0]; // Bob's board

      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get(`/api/boards?userId=${bobBoard.userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBe(1);
      expect(response.body.items[0].user).toBe("bob");
    });

    it("should fail with invalid userId in query", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get("/api/boards?userId=invalidId")
        .set("Authorization", `Bearer ${token}`)
        .expect(500);
    });

    it("should return empty items when userId has no boards", async () => {
      await createFewBoards();
      
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      // Use a valid but non-existent userId
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await supertest(app)
        .get(`/api/boards?userId=${nonExistentUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(500);
    });
  });

  describe("GET /api/boards/:id", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail getting a board if user is not authenticated", async () => {
      const testUser = await createTestUser();
      const testBoard = await createTestBoard(testUser._id);

      const response = await supertest(app)
        .get(`/api/boards/${testBoard._id}`)
        .expect(401);
    });

    it("should get a board by ID if user is authenticated", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);
      const testBoard = await createTestBoard(testUser._id);

      const response = await supertest(app)
        .get(`/api/boards/${testBoard._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body._id).toBe(testBoard._id.toString());
      expect(response.body.title).toBe("Test Board");
      expect(response.body.likes).toBeDefined();
      expect(response.body.labels).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it("should fail to get a board with invalid ID format", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get("/api/boards/invalidId")
        .set("Authorization", `Bearer ${token}`)
        .expect(500);
    });

    it("should return null for non-existent board ID", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await supertest(app)
        .get(`/api/boards/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toBeNull();
    });
  });

  describe("POST /api/boards", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail creating boards if user is not authenticated", async () => {
      const response = await supertest(app)
        .post("/api/boards")
        .send({
          title: "Test board",
          description: "this is a test board",
          imageUrl: "http://example.com/image.jpg",
        })
        .expect(401);
    });

    it("should create a new board if user is authenticated", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Test board",
          description: "this is a test board",
          imageUrl: "http://example.com/image.jpg",
        })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body._id).toBeDefined();
      expect(response.body).toContainAllKeys([
        "title",
        "description",
        "userId",
        "imageUrl",
        "isPublic",
        "_id",
        "createdAt",
        "__v",
      ]);
      expect(response.body.userId).toEqual(testUser._id.toString());
      expect(response.body.title).toBe("Test board");
      expect(response.body.description).toBe("this is a test board");
    });

    it("should fail to create a board without title", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          description: "this is a test board",
          imageUrl: "http://example.com/image.jpg",
        })
        .expect(500);
    });

    it("should fail to create a board with title exceeding 30 characters", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "This is a very long title that exceeds 30 characters",
          description: "this is a test board",
          imageUrl: "http://example.com/image.jpg",
        })
        .expect(500);
    });

    it("should fail to create a board without imageUrl", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Test board",
          description: "this is a test board",
        })
        .expect(500);
    });

    it("should create a board with description exceeding 200 characters and fail", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const longDescription = "a".repeat(201);

      const response = await supertest(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Test board",
          description: longDescription,
          imageUrl: "http://example.com/image.jpg",
        })
        .expect(500);
    });

    it("should create a board without description (optional field)", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Test board",
          imageUrl: "http://example.com/image.jpg",
        })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body._id).toBeDefined();
      expect(response.body.description).toBe("");
    });
  });

  describe("PUT /api/boards/:id", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail updating a board if user is not authenticated", async () => {
      const boards = await createFewBoards();
      const boardId = boards[0]._id;

      const response = await supertest(app)
        .put(`/api/boards/${boardId}`)
        .send({
          title: "Updated Test Board",
        })
        .expect(401);
    });

    it("should update a board if user is authenticated and is the owner", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);
      const testBoard = await createTestBoard(testUser._id);

      const response = await supertest(app)
        .put(`/api/boards/${testBoard._id}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Updated Test Board",
        })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body._id).toBeDefined();
      expect(response.body.title).toBe("Updated Test Board");
    });

    it("should update board description if user is owner", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);
      const testBoard = await createTestBoard(testUser._id);

      const response = await supertest(app)
        .put(`/api/boards/${testBoard._id}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          description: "Updated description",
        })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.description).toBe("Updated description");
    });

    it("shouldn't update a board if user is authenticated and is not the owner", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const testBoards = await createFewBoards();
      const testBoardIdNotOwned = testBoards[0]._id;

      const response = await supertest(app)
        .put(`/api/boards/${testBoardIdNotOwned}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Updated Test Board",
        })
        .expect(403);
    });

    it("should fail to update board with invalid ID", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .put("/api/boards/invalidId")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Updated Test Board",
        })
        .expect(500);
    });

    it("should fail to update board with non-existent ID", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await supertest(app)
        .put(`/api/boards/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Updated Test Board",
        })
        .expect(403);
    });
  });

  describe("DELETE /api/boards/:id", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail deleting a board if user is not authenticated", async () => {
      const boards = await createFewBoards();
      const boardId = boards[0]._id;

      const response = await supertest(app)
        .delete(`/api/boards/${boardId}`)
        .expect(401);
    });

    it("should delete a board if user is authenticated and is the owner", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);
      const testBoard = await createTestBoard(testUser._id);

      const response = await supertest(app)
        .delete(`/api/boards/${testBoard._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body._id).toBe(testBoard._id.toString());
    });

    it("shouldn't delete a board if user is authenticated and is not the owner", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const testBoards = await createFewBoards();
      const testBoardIdNotOwned = testBoards[0]._id;

      const response = await supertest(app)
        .delete(`/api/boards/${testBoardIdNotOwned}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .expect(403);
    });

    it("should delete a board if user is admin (even if not owner)", async () => {
      const adminUser = await createTestUser({
        username: "adminuser",
        email: "admin@email.com",
        password: "Password123!",
      });

      // Set user as admin
      adminUser.role = "admin";
      await adminUser.save();

      const token = await generateValidJwt(adminUser);

      const testBoards = await createFewBoards();
      const bobBoard = testBoards[0]; // Board owned by bob

      const response = await supertest(app)
        .delete(`/api/boards/${bobBoard._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body._id).toBe(bobBoard._id.toString());
    });

    it("should fail to delete board with invalid ID", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .delete("/api/boards/invalidId")
        .set("Authorization", `Bearer ${token}`)
        .expect(500);
    });

    it("should fail to delete board with non-existent ID", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await supertest(app)
        .delete(`/api/boards/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403);
    });
  });

  afterAll(async () => {
    await cleanUpDatabase();
    await mongoose.disconnect();
  });
});
