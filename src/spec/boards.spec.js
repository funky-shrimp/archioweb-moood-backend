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
      //create 2 boards
      const boards = await createFewBoards();

      //create test user and generate token
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
  });

  describe("POST /api/boards", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail creating boards if user is not authenticated", async () => {
      const response = await supertest(app).post("/api/boards").expect(401);
    });

    it("should create a new board if user is authenticated", async () => {
      //create test user and generate token
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "applicaton/json")
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
    });
  });

  describe("PUT /api/boards", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail updating a board if user is not authenticated", async () => {
      const boards = await createFewBoards();

      let boardId = boards[0]._id;

      const response = await supertest(app)
        .put(`/api/boards/${boardId}`)
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

    it("shouldn't update a board if user is authenticated and is not the owner", async () => {
      //user is funky shrimp
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const testBoards = await createFewBoards();

      //first board is owned by bob
      let testBoardIdNotOwned = testBoards[0]._id;

      const response = await supertest(app)
        .put(`/api/boards/${testBoardIdNotOwned._id}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({
          title: "Updated Test Board",
        })
        .expect(403);
    });
  });

  describe("DELETE /api/boards", () => {
    beforeEach(() => cleanUpDatabase());

    it("should fail deleting a board if user is not authenticated", async () => {
      const boards = await createFewBoards();

      let boardId = boards[0]._id;

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
    });

    it("shouldn't delete a board if user is authenticated and is not the owner", async () => {
      //user is funky shrimp
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const testBoards = await createFewBoards();

      //first board is owned by bob
      let testBoardIdNotOwned = testBoards[0]._id;

      const response = await supertest(app)
        .put(`/api/boards/${testBoardIdNotOwned._id}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .expect(403);
    });
  });

  afterAll(async () => {
    await cleanUpDatabase();
    await mongoose.disconnect();
  });
});
