import supertest from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import app from "../../app.js";

import User from "../features/socials/users/users.model.js";
import { jwt_secret } from "../../config.js";

import {
  cleanUpCollection,
  createTestUser,
  cleanUpDatabase,
  generateValidJwt,
} from "./utils.js";

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
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body.message).toBeString();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe("funkytest");
      expect(response.body.user.email).toBe("funkytest@email.com");
      expect(response.body.user.password).toBeUndefined();
      expect(response.body.user._id).toBeDefined();
      expect(response.body.user.role).toBe("user");
    });

    it("should fail to register a user with existing username", async () => {
      await createTestUser();
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "funkytest",
          email: "different@email.com",
          password: "Password123!",
        })
        .expect(409)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Email or username already in use");
    });

    it("should fail to register a user with existing email", async () => {
      await createTestUser();
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "funkyusername",
          email: "funkytest@email.com",
          password: "Password123!",
        })
        .expect(409)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Email or username already in use");
    });

    it("should fail to register a user with incorrect password", async () => {
      /* password rule :
        at least 8 characters, one uppercase, one lowercase, one number, one special character.
        e.g : Sausage6!
      */
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "funkyusername",
          email: "emailtest@email.com",
          password: "password",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Password is not valid");
    });

    it("should fail to register a user with missing username", async () => {
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          email: "test@email.com",
          password: "Password123!",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Username, email and password required");
    });

    it("should fail to register a user with missing email", async () => {
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "testuser",
          password: "Password123!",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Username, email and password required");
    });

    it("should fail to register a user with missing password", async () => {
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "testuser",
          email: "test@email.com",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Username, email and password required");
    });

    it("should fail to register a user with invalid email format", async () => {
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "testuser",
          email: "invalidemail",
          password: "Password123!",
        })
        .expect(500);
    });

    it("should fail to register a user with invalid username format", async () => {
      const response = await supertest(app)
        .post("/api/auth/register")
        .set("Accept", "application/json")
        .send({
          username: "ab", // too short (less than 3 characters)
          email: "test@email.com",
          password: "Password123!",
        })
        .expect(500);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(() => cleanUpCollection(User));

    it("should login a user successfully", async () => {
      await createTestUser();

      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .auth("funkytest", "Password123!", { type: "basic" })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.token).toBeString();
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it("should fail to login with wrong password", async () => {
      await createTestUser();

      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .auth("funkytest", "WrongPassword123!", { type: "basic" })
        .expect(401);

      expect(response.text).toBe("Invalid authentication credentials");
    });

    it("should fail to login with non-existent user", async () => {
      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .auth("nonexistent", "Password123!", { type: "basic" })
        .expect(401);

      expect(response.text).toBe("User not found");
    });

    it("should fail to login without Authorization header", async () => {
      await createTestUser();

      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .expect(401);

      expect(response.text).toBe("Authentication required");
    });

    it("should fail to login with invalid Authorization header format", async () => {
      await createTestUser();

      const response = await supertest(app)
        .post("/api/auth/login")
        .set("Accept", "application/json")
        .set("Authorization", "InvalidFormat")
        .expect(401);

      expect(response.text).toBe("Authentication required");
    });
  });

  describe("GET /api/auth/protected", () => {
    beforeEach(() => cleanUpCollection(User));

    it("should return user data when provided a valid token", async () => {
      const testUser = await createTestUser();

      const token = await generateValidJwt(testUser);
      const response = await supertest(app)
        .get("/api/auth/protected")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.message).toBe("Protected data");
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(testUser._id.toString());
    });

    it("should fail when no token is provided", async () => {
      const response = await supertest(app)
        .get("/api/auth/protected")
        .set("Accept", "application/json")
        .expect(401);
    });

    it("should fail when invalid token is provided", async () => {
      const response = await supertest(app)
        .get("/api/auth/protected")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer invalid.token.here")
        .expect(403)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Invalid or expired token");
    });

    it("should fail when Authorization header is missing Bearer prefix", async () => {
      const testUser = await createTestUser();
      const token = await generateValidJwt(testUser);

      const response = await supertest(app)
        .get("/api/auth/protected")
        .set("Accept", "application/json")
        .set("Authorization", token)
        .expect(401)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Authentication required");
    });

    it("should fail when token is expired", async () => {
      const testUser = await createTestUser();
      
      // Generate an expired token (expired 1 hour ago)
      const exp = (new Date().getTime() - 3600 * 1000) / 1000;
      const claims = { sub: testUser._id.toString(), exp: exp };
      const expiredToken = await promisify(jwt.sign)(claims, jwt_secret);

      const response = await supertest(app)
        .get("/api/auth/protected")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(403)
        .expect("Content-Type", /json/);

      expect(response.body.error).toBe("Invalid or expired token");
    });
  });

  afterAll(async () => {
    await cleanUpDatabase();
    await mongoose.disconnect();
  });
});
