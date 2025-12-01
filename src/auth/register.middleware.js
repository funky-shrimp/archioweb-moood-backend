import bcrypt from "bcrypt";
import User from "../models/users.model.js";

export default async function register(req, res, next) {
    const {username,email,password} = req.body;
    console.log(username,email,password);
    next();
}