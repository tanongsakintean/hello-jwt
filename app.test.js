const request = require("supertest");
const express = require("express");
const app = require("./app"); // Adjust if your app is in a different file
require("dotenv").config();

describe("JWT Auth API", () => {
  let token;

  it("should return a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Hello JWT");
  });

  it("should login and return a token", async () => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const res = await request(app)
      .post("/login")
      .send({ username: username, password: password });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should access protected route with token", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Hello! You are authorized");
  });

  it("should fail to access protected route without token", async () => {
    const res = await request(app).get("/protected");
    expect(res.statusCode).toEqual(401);
  });
});
