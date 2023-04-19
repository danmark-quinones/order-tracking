import React, { useEffect, useState } from "react";
import styles from "../src/styles/Layout.module.scss";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import moment from "moment/moment";
import {
  Button,
  Icon,
  IndexTable,
  TextField,
  useIndexResourceState,
  Badge,
} from "@shopify/polaris";
import { RefreshMajor, SearchMinor } from "@shopify/polaris-icons";

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    search: "",
  });
  const fetch = useAuthenticatedFetch();

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const setDestinationStatusOnly = ["picked-up", "failed", "departed"];

  const rowMarkup = orders.map(
    (
      {
        _id,
        order_id,
        tracking_number,
        createdAt,
        status,
        additional_destination,
        line_items,
      },
      index
    ) => (
      <IndexTable.Row
        id={_id}
        key={_id}
        selected={selectedResources.includes(_id)}
        position={index}
        styles={{ width: "300px" }}
      >
        <IndexTable.Cell>
          <p>{order_id}</p>
        </IndexTable.Cell>
        <IndexTable.Cell>{tracking_number}</IndexTable.Cell>
        <IndexTable.Cell>{moment(createdAt).format("ll")}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge>{status.replace("-", " ").toUpperCase()}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div className={styles.journeyContainer}>
            <p>{additional_destination[0].notes}</p>
            <Button plain>View Full Journey</Button>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div className={styles.lineItemsContainer}>
            <p>{`${line_items.length} Item(s)`} </p>
            <Button plain>View Line Item</Button>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div className={styles.actionContainers}>
            {additional_destination[0].status === "arrived" ? (
              <div className={styles.orangeBtn}>
                <Button size="slim">Set Departure</Button>
              </div>
            ) : setDestinationStatusOnly.includes(
                additional_destination[0].status
              ) ? (
              <div className={styles.blueBtn}>
                <Button size="slim">Set Destination</Button>
              </div>
            ) : additional_destination[0].status === "delivery-ready" ? (
              <div className={styles.redBtn}>
                <Button size="slim">Mark as Failed</Button>
              </div>
            ) : (
              <div className={styles.completedStatus}>
                <p>Completed</p>
              </div>
            )}

            {additional_destination[0].status === "departed" ? (
              <div className={styles.greenBtn}>
                <Button size="slim">Ready for Delivery</Button>
              </div>
            ) : additional_destination[0].status === "delivery-ready" ? (
              <div className={styles.greenBtn}>
                <Button size="slim">Mark as Delivered</Button>
              </div>
            ) : null}
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  useEffect(() => {
    setIsLoading(true);
    refetchOrder();
  }, []);

  const {
    data,
    refetch: refetchOrder,
    isLoading: isLoadingOrder,
    isRefetching: isRefetchingOrder,
  } = useAppQuery({
    url: "/api/trackers/get",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
        setOrders(data.data);
      },
    },
  });

  const onButtonClick = () => {
    setIsLoading(true);
    refetchOrder();
  };

  const handleSearchChange = (name, value) => {
    console.log(name, value);
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className={styles.trackContainer}>
      <div className={styles.tableTitleContainer}>
        <div className={styles.titleContainer}>
          <Button size="slim" onClick={() => onButtonClick()}>
            <Icon source={RefreshMajor} color="base" />
          </Button>
          <h1>Ongoing Fullfilled Order</h1>
        </div>
        <TextField
          placeholder="Search Order via ID , Tracking Number"
          value={form.search}
          onChange={(value) => handleSearchChange("search", value)}
          prefix={<Icon source={SearchMinor} color="base" />}
        />
      </div>

      <div className={styles.tableContainer}>
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "OrderID" },
            { title: "Tracking#" },
            { title: "Date Created" },
            { title: "Status" },
            { title: "Journey" },
            { title: "Line Items" },
            { title: "Actions", alignment: "end" },
          ]}
          loading={isLoading}
          lastColumnSticky={true}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </div>
    </div>
  );
};

export default TrackOrders;
