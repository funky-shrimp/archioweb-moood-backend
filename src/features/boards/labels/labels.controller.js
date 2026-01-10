import * as labelsService from "./labels.service.js";

import { isUserAdmin } from "../../../middlewares/utils.middleware.js";

async function getAllLabels(req, res, next) {
  try {
    res.json(await labelsService.getAllLabels());
  } catch (err) {
    next(err);
  }
}

async function createLabel(req, res, next) {
  try {

    const userRole = req.user.role;

    const isAdmin = await isUserAdmin(userRole);

    if (!isAdmin) {
      const error = new Error(
        "Unauthorized: Only admins can create labels"
      );
      error.status = 403;
      throw error;
    }

    res.json(await labelsService.createLabel(req.body));
  } catch (err) {
    next(err);
  }
}

async function deleteLabel(req, res, next) {
  try {
    const userRole = req.user.role;

    const isAdmin = await isUserAdmin(userRole);

    if (!isAdmin) {
      const error = new Error(
        "Unauthorized: Only admins can delete labels"
      );
      error.status = 403;
      throw error;
    }

    res.json(await labelsService.deleteLabel(req.params.labelId));
  } catch (err) {
    next(err);
  }
}

export { getAllLabels, createLabel, deleteLabel };
