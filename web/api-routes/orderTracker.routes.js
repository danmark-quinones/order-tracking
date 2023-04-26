import express from "express";
import {
  createOrderTracker,
  deleteOrderTracker,
  getAllOrderTracker,
  getOrderTrackerById,
  updateOrderTracker,
} from "../controllers/orderTracker.controller.js";

const router = express.Router();

router.get("/get", getAllOrderTracker);
router.get("/get/:id", getOrderTrackerById);
router.post("/create", createOrderTracker);
router.put("/update", updateOrderTracker);
router.delete("/delete/:id", deleteOrderTracker);

router.post("/test", (req, res) => {
  res.status(200).message({
    message: "CONNECTED",
  });
});

export default router;
