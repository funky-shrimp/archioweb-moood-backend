import * as elementsService from './elements.service.js';

async function getElements(req, res, next) {
  try {
    const elements = await elementsService.getElements();
    res.json(elements);
    } catch (err) {
    next(err);
  }
}

async function createElement(req, res, next) {
  try {
    res.json(await elementsService.createElement(req.body));
  } catch (err) {
    next(err);
  } 
}

async function updateElement(req, res, next) {
  try {
    res.json(await elementsService.updateElement(req.params.elementId, req.body));
  } catch (err) {
    next(err);
  }
}

async function deleteElement(req, res, next) {
  try {
    res.json(await elementsService.deleteElement(req.params.elementId));
  } catch (err) {
    next(err);
  }
}

export { getElements, createElement, updateElement, deleteElement };