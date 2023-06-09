import { useEffect, useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  // const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    getOrders;
  }, []);

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/orders",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  const getOrders = async () => {
    const responseTrack = await fetch("/api/trackers/get", {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
    });
  };

  const handleCreateTracker = async () => {
    const data = {
      order_id: "2",
      order_line_item_id: "2",
      location_lists: [{ location: "Huanli", status: "shipped" }],
      status: "In Progress",
    };

    const response = await fetch(
      "https://a5a7-180-190-110-221.ngrok-free.app/ex-api/tracker/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  };

  const handleUpdateTracker = async () => {
    const data = {
      _id: "643cd655be13498dcc475aff",
      order_id: "2",
      order_line_item_id: "2",
      location_lists: [
        { location: "China Store", status: "shipped" },
        { location: "Huanli", status: "shipped" },
        { location: "Ready to Deliver", status: "shipped" },
      ],
      status: "In Progress",
    };
    const response = await fetch(
      "https://a5a7-180-190-110-221.ngrok-free.app/ex-api/tracker/update",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  };

  const handleDeleteTracker = async () => {
    const response = await fetch(
      "https://a5a7-180-190-110-221.ngrok-free.app/ex-api/tracker/delete/643e0bb0d8f83fe7db32d483",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return (
    <>
      {toastMarkup}
      <Card
        title="Product Counter"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handleCreateTracker,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <button onClick={() => getOrders()}>FETCH</button>
          <button onClick={() => handleCreateTracker()}>Create</button>
          <button onClick={() => handleUpdateTracker()}>Update</button>
          <button onClick={() => handleDeleteTracker()}>Delete</button>

          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCount ? "-" : data.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
      </Card>
    </>
  );
}
