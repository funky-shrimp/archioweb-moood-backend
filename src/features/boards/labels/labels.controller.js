import * as labelsService from "./labels.service.js";

async function getAllLabels(req, res, next) {
  try {
    res.json(await labelsService.getAllLabels());
  } catch (err) {
    next(err);
  }
}

async function createLabel(req, res, next) {
  try {
    res.json(await labelsService.createLabel(req.body));
  } catch (err) {
    next(err);
  }
}

async function deleteLabel(req, res, next) {
  try {
    res.json(await labelsService.deleteLabel(req.params.labelId));
  } catch (err) {
    next(err);
  }
}

export { getAllLabels, createLabel, deleteLabel };