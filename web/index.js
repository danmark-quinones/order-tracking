// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import cors from "cors";
import express from "express";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import orderTrackingRoutes from "./api-routes/orderTracker.routes.js";
import dotenv from "dotenv";
import {
  fetchProducts,
  getProductById,
} from "./controllers/orderGraphQL.controller.js";

dotenv.config();

const mongoDB = process.env.DB_CONN_STRING;

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

export const Orders = async (session, count) => {
  const ORDER_PRODUCTS_QUERY = `{
      orders(first:${count}, reverse:true, query: "fulfillment_status:any"){
          edges{
              node{
                name
                id
                displayFulfillmentStatus
                displayFinancialStatus
              }
          }
      }
  }`;
  const client = new shopify.api.clients.Graphql({ session });
  console.log("SESSION", session);
  const res = await client.query({
    data: {
      query: ORDER_PRODUCTS_QUERY,
    },
  });

  return res;
};

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await fetchProducts(
      res.locals.shopify.session,
      req.query.id
    );
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/product", async (req, res) => {
  try {
    const product = await getProductById(
      res.locals.shopify.session,
      req.query.id
    );
    res.status(200).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use("/api/trackers", orderTrackingRoutes);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

mongoose
  .connect(mongoDB, {})
  .then(() => app.listen(PORT, () => console.log("Connected")))
  .catch((error) => console.log(error));
