import mongoose from "mongoose";

const orderTrackerSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
    },
    tracking_number: {
      type: String,
    },
    graph_ql_id: {
      type: String,
    },
    additional_destination: {
      type: Array,
    },
    line_items: {
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
