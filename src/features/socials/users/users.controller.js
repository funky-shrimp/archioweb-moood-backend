import * as usersService from './users.service.js';

// Get all users
async function getAllUsers(req, res, next) {
  try {
    console.log('Fetching all users');
    res.json(await usersService.getAllUsers());
  } catch (error) {
    next(error);
  }
};

// Get user by ID
async function getUserById(req, res, next) {
  try {
    res.json(await usersService.getUserById(req.params.id));
    } catch (error) {
    next(error);
  }
}

export {
  getAllUsers,
  getUserById,
};