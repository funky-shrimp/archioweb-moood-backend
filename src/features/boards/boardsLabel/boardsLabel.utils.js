import Labels from "../labels/label.model.js";
import { createLabel } from "../labels/labels.service.js";
import { createLabelBoardLink } from "./boardsLabel.service.js";

async function checkLabelExists(labels) {

  let labelsIds = [];

  for (const labelName of labels) {

    let label = await Labels.findOne({ name: labelName });

    if (!label) {
      label = await createLabel({ name: labelName });

    }

    labelsIds.push(label._id);

  }


  return labelsIds;
}

async function linkLabelsToBoard(boardId, labelsIds) {
  //batch Promise to create all links
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled

  const linkPromises = labelsIds.map((labelId) => {
    return createLabelBoardLink(boardId, labelId);
  });

  return await Promise.allSettled(linkPromises);
}

export {checkLabelExists, linkLabelsToBoard};
