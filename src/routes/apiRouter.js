import express from "express";

import {boards} from "../features/boards/boards/index.js";
import {comments} from "../features/socials/comments/index.js";
import {labels} from "../features/boards/labels/index.js";
import {elements} from "../features/boards/elements/index.js";
import {users} from "../features/socials/users/index.js";

const router = express.Router();

router.use("/boards", boards);
router.use("/comments", comments);
router.use("/labels", labels);
router.use("/elements", elements);
router.use("/users", users);



export default router;