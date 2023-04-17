import mongoose from "mongoose";
import OrderTracker from "../models/OrderTracker.js";

export const getAllOrderTracker = async (_req, res) => {
  try {
    const orders = await OrderTracker.find();
    return res.status(200).json({
      message: "SUCCESS FETCH",
      data: orders,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const getOrderTrackerById = async (_req, res) => {
  try {
    const params = _req.params;
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return res.status(402).json({ message: "No Order with that id" });
    }

    const order = await OrderTracker.findById(params.id);
    return res.status(200).json({
      message: "SUCCESS FETCH",
      data: order,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const createOrderTracker = async (_req, res) => {
  try {
    const data = new OrderTracker(_req.body);

    const newData = await data.save();
    return res.status(200).json({
      message: "SUCCESS CREATE",
      data: newData,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const updateOrderTracker = async (_req, res) => {
  try {
    const tracker = _req.body;

    if (!mongoose.Types.ObjectId.isValid(tracker._id)) {
      return res.status(402).json({ message: "No Order Tracker with that id" });
    }

    const updatedTracker = await OrderTracker.findByIdAndUpdate(
      tracker._id,
      tracker,
      { new: true }
    );

    return res.status(200).json({
      message: "SUCCESS UPDATE",
      data: updatedTracker,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const deleteOrderTracker = async (_req, res) => {
  try {
    const params = _req.params;
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return res.status(402).json({ message: "No Order with that id" });
    }

    const order = await OrderTracker.findByIdAndRemove(params.id);
    return res.status(200).json({
      message: "SUCCESS DELETE",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};