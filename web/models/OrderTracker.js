import mongoose from "mongoose";

const orderTrackerSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
    },
    order_line_item_id: {
      type: String,
    },
    location_lists: {
      type: Array,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const OrderTracker = mongoose.model("OrderTracker", orderTrackerSchema);

export default OrderTracker;
