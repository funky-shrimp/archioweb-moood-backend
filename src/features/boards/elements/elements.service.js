import Elements from './elements.model.js';

async function getElements() {
  return Elements.find();
}

async function createElement(data) {
  const element = new Elements(data);
  return element.save();
};


async function updateElement(elementId, data) {
  return Elements.findByIdAndUpdate(elementId, data, { new: true });
}

async function deleteElement(elementId) {
  return Elements.findByIdAndDelete(elementId);
}

export { getElements, createElement, updateElement, deleteElement };