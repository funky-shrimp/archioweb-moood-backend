import express from "express";

import {boards} from "../features/boards/boards/index.js";
/*
import {elements} from "../features/boards/elements/index.js";
import {labels} from "../features/boards/labels/index.js";
import {comments} from "../features/socials/comments/index.js";
import {users} from "../features/socials/users/index.js";
*/

const router = express.Router();

router.use("/boards", boards);
/*
app.use("/users", users);
app.use("/elements", elements);
app.use("/labels", labels);
app.use("/comments", comments);
*/

export default router;