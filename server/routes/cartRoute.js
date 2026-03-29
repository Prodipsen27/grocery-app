import express from "express";
import authUser from "../middleware/authUser.js";
import { updateCart } from "../configs/controllers/cartController.js";


const cartRouter = express.Router();

cartRouter.post('/update', authUser,updateCart)

export default cartRouter 