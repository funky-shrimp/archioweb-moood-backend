import express from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";


import {boards} from "../features/boards/boards/index.js";
import {comments} from "../features/socials/comments/index.js";
import {labels} from "../features/boards/labels/index.js";
import {elements} from "../features/boards/elements/index.js";

import {auth} from "../auth/auth.route.js";

/*

import {labels} from "../features/boards/labels/index.js";

import {users} from "../features/socials/users/index.js";
*/


const router = express.Router();

// Swagger set up for JS Doc
const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moood API Documentation',
      description: 'This is the API documentation for the Moood application.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server',
        },
    ],
    // These are used to group endpoints in the sidebar
    tags: [
      {
        name: "boards",
        description: "All APIs related to the /boards/ endpoints.",
      },
      {
        name: "labels",
        description: "All APIs related to the /labels/ endpoints.",
      },
      {
        name: "elements",
        description: "All APIs related to the /elements/ endpoints.",
      }
    ],
  },
  apis: ['./src/features/**/**/*.route.js',"./src/auth/auth.route.js"], //files with *.route.js 
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use("/auth", auth);
router.use("/boards", boards);
router.use("/comments", comments);
router.use("/labels", labels);
router.use("/elements", elements);

export default router;