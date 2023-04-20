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
  Pagination,
} from "@shopify/polaris";
import { RefreshMajor, SearchMinor } from "@shopify/polaris-icons";
import OrderJourneyModal from "./modals/OrderJourney";
import OrderStatusFormModal from "./modals/OrderStatusForm";
import Filters from "./Filters";

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    start: moment().format("YYYY/MM/DD"),
    end: moment().add(7, "days").format("YYYY/MM/DD"),
    page: 1,
    limit: 10,
  });

  const [modals, setModals] = useState({
    showOrderJourney: false,
    showOrderStatusForm: false,
    title: "",
    type: "",
    data: {},
  });

  const fetch = useAuthenticatedFetch();

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const setDestinationStatusOnly = ["picked-up", "failed", "departed"];

  useEffect(() => {
    applyFilter(null);
  }, []);

  useEffect(() => {
    if (filters.page || filters.limit) {
      applyFilter("pagination");
    }
  }, [filters.page, filters.limit]);

  const onButtonClick = () => {
    applyFilter(null);
  };

  const handleSearchChange = (name, value) => {
    console.log(name, value);
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const closeModal = (name) => {
    setModals({ ...modals, [name]: false });
  };

  const openModal = (name, data, title, type) => {
    setModals({
      ...modals,
      [name]: true,
      data: data,
      title: title,
      type: type,
    });
  };

  const applyFilter = (trigger) => {
    setIsLoading(true);
    const page = trigger === "pagination" ? filters.page : 1;
    fetch(
      `/api/trackers/get?page=${page}&limit=${filters.limit}&keyword=${filters.search}&status=${filters.status}&start=${filters.start}&end=${filters.end}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((orders) => {
        console.log("DATA", orders);
        setOrders(orders.data);
        setTotalCount(orders.total);
        if (!trigger) {
          setFilters({ ...filters, page: 1 });
        }
        setIsLoading(false);
      });
  };

  const handleEnter = (event) => {
    const enterKeyPressed = event.keyCode === 13;
    if (enterKeyPressed) {
      event.preventDefault();
      applyFilter(null);
    }
  };

  const rowMarkup = orders.map((order, index) => (
    <IndexTable.Row
      id={order._id}
      key={order._id}
      selected={selectedResources.includes(order._id)}
      position={index}
      styles={{ width: "300px" }}
    >
      <IndexTable.Cell>
        <p>{order.order_name}</p>
      </IndexTable.Cell>
      <IndexTable.Cell>{order.tracking_number}</IndexTable.Cell>
      <IndexTable.Cell>{moment(order.createdAt).format("ll")}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge>{order.status.replace("-", " ").toUpperCase()}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className={styles.journeyContainer}>
          <p>{order.additional_destination[0].notes}</p>
          <Button
            onClick={() =>
              openModal("showOrderJourney", order.additional_destination)
            }
            plain
          >
            View Full Journey
          </Button>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className={styles.lineItemsContainer}>
          <p>{`${order.line_items.length} Item(s)`} </p>
          <Button plain>View Line Item</Button>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className={styles.actionContainers}>
          {order.additional_destination[0].status === "arrived" ? (
            <div className={styles.orangeBtn}>
              <Button
                onClick={() =>
                  openModal(
                    "showOrderStatusForm",
                    order,
                    "Set Departure",
                    "departed"
                  )
                }
                size="slim"
              >
                Set Departure
              </Button>
            </div>
          ) : setDestinationStatusOnly.includes(
              order.additional_destination[0].status
            ) ? (
            <div className={styles.blueBtn}>
              <Button
                onClick={() =>
                  openModal(
                    "showOrderStatusForm",
                    order,
                    "Set Destination",
                    "arrived"
                  )
                }
                size="slim"
              >
                Set Destination
              </Button>
            </div>
          ) : order.additional_destination[0].status === "delivery-ready" ? (
            <div className={styles.redBtn}>
              <Button
                onClick={() =>
                  openModal(
                    "showOrderStatusForm",
                    order,
                    "Failed Order",
                    "failed"
                  )
                }
                size="slim"
              >
                Mark as Failed
              </Button>
            </div>
          ) : (
            <div className={styles.completedStatus}>
              <p>Completed</p>
            </div>
          )}

          {order.additional_destination[0].status === "departed" ? (
            <div className={styles.greenBtn}>
              <Button
                onClick={() =>
                  openModal(
                    "showOrderStatusForm",
                    order,
                    "Delivery Ready",
                    "delivery-ready"
                  )
                }
                size="slim"
              >
                Ready for Delivery
              </Button>
            </div>
          ) : order.additional_destination[0].status === "delivery-ready" ? (
            <div className={styles.greenBtn}>
              <Button
                onClick={() =>
                  openModal(
                    "showOrderStatusForm",
                    order,
                    "Complete Order",
                    "delivered"
                  )
                }
                size="slim"
              >
                Mark as Delivered
              </Button>
            </div>
          ) : null}
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <div className={styles.trackContainer}>
      <div className={styles.tableTitleContainer}>
        <div className={styles.titleContainer}>
          <h1>Parcel Lists</h1>
        </div>
        <div className={styles.filterContainer}>
          <div style={{ width: "300px" }} onKeyDown={(e) => handleEnter(e)}>
            <TextField
              placeholder="Search Order via ID , Tracking Number"
              value={filters.search}
              onChange={(value) => handleSearchChange("search", value)}
              prefix={<Icon source={SearchMinor} color="base" />}
              o
            />
          </div>
          <Filters
            filters={filters}
            setFilters={setFilters}
            applyFilter={() => applyFilter(null)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.queryBadgeContainer}>
          <p>
            Found {totalCount} orders from your query :
            {filters.search && <Badge>{`keywords : ${filters.search}`}</Badge>}
            <Badge>{`date : ${moment(filters.start).format(
              "MM/DD/YYYY"
            )} - ${moment(filters.end).format("MM/DD/YYYY")}`}</Badge>
            {filters.status && <Badge>{`status : ${filters.status}`}</Badge>}
          </p>
        </div>
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Order" },
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

      <div className={styles.paginationContainer}>
        <p>
          {filters.page} of {Math.ceil(totalCount / filters.limit)}
        </p>

        <Pagination
          hasNext={filters.page !== Math.ceil(totalCount / filters.limit)}
          hasPrevious={filters.page !== 1}
          onNext={() => {
            setFilters({ ...filters, page: filters.page + 1 });
          }}
          onPrevious={() => {
            setFilters({ ...filters, page: filters.page - 1 });
          }}
        />
      </div>

      <OrderJourneyModal
        config={modals}
        onClose={() => closeModal("showOrderJourney")}
      />
      <OrderStatusFormModal
        config={modals}
        onClose={() => closeModal("showOrderStatusForm")}
        refreshLists={() => onButtonClick()}
      />
    </div>
  );
};

export default TrackOrders;
