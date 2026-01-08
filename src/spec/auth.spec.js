import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";

import User from "../features/socials/users/users.model.js";

import { cleanUpCollection, createTestUser, cleanUpDatabase, generateValidJwt } from "./utils.js";

/*pour isoler les tests, on peut insérer un utilisateur dans la DB avant chaque test.
 */
describe("Auth API Endpoints", () => {
  beforeEach(() => cleanUpDatabase());

  describe("POST /api/auth/register", () => {
    //Clean collection before each test
    beforeEach(() => cleanUpCollection(User));

    it("should register a new user successfully", async () => {
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "funkytest",
          email: "funkytest@email.com",
          password: "Password123!",
        })
        .expect(201);
    });

    it("should fail to register a user with existing username", async () => {
      await createTestUser();
      //then try to create another user with the same username
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "funkytest",
          email: "funkytest@email.com",
          password: "Password123!",
        })
        .expect(409);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(() => cleanUpCollection(User));

    it("should login a user successfully", async () => {
      //create user to login
      await createTestUser();

      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .auth("funkytest", "Password123!", { type: "basic" })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.token).toBeString();
    });
  });

  describe("GET api/auth/protected", () => {
    it("should return user data when provided a valid token", async () => {
      //create user to login
      const testUser = await createTestUser();

      const token = await generateValidJwt(testUser);
      const response = await supertest(app)
        .get("/api/auth/protected")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.user).toBeDefined();
    });
  });

  afterAll(async () => {
    await cleanUpDatabase();
    await mongoose.disconnect();
  });
});
