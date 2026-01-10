import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {

  //respond with a simple message and link to API documentation

  res.send(`<h1>Welcome to the Moood Backend API</h1>
    <p>Explore the API documentation at <a href="/api/docs">/api-docs</a></p>
  `);
});

export default router;
