
/**
 * Check if the user is the owner of the given Thing (e.g., Board)
 * @param {*} Thing Mongoose Model
 * @param {*} boardId 
 * @param {*} userId 
 * @returns 
 */
async function isUserThingOwner(Thing, thingId, userId) {
  const thing = await Thing.findOne({ _id: thingId, userId: userId }).exec();
  if (!thing) {
    return false;
  }
  return true;
}

async function isUserAdmin(userRole) {
  return userRole === 'admin';
}

export { isUserThingOwner, isUserAdmin};