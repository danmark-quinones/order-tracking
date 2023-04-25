import shopify from "../shopify.js";
import { GraphqlQueryError } from "@shopify/shopify-api";

export const fetchProducts = async (session, id) => {
  const PRODUCTS_QUERY = `{
    products(first:1 , query: "id:${id}") {
      edges{
        node{
          id
          description
          title
          featuredImage {
            url
          }
        }
      }
    }
  }`;
  const client = new shopify.api.clients.Graphql({ session });
  const productsData = await client.query({
    data: {
      query: PRODUCTS_QUERY,
    },
  });

  const { edges } = productsData?.body?.data?.products || [];

  const response = edges.map(({ node }) => {
    const { id, title, featuredImage } = node;

    const obj = {
      id,
      title,
      imageUrl: featuredImage.url,
    };
    return obj;
  });

  return response;
};

export const getProductById = async (session, id) => {
  console.log("SESSION", session, id);
  const PRODUCT_QUERY = `{
    product(id:${id}) {
    title
    description
    featuredImage {
      url
      }
    }
  }`;

  const client = new shopify.api.clients.Graphql({ session });
  const product = await client.query({
    data: {
      query: PRODUCT_QUERY,
    },
  });

  return product;
};
