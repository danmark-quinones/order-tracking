import { Button, DatePicker, Popover } from "@shopify/polaris";
import styles from "../src/styles/Layout.module.scss";
import moment from "moment";
import { useState, useCallback, useEffect } from "react";

const Filters = (props) => {
  const { filters, setFilters, applyFilter } = props;

  const statuses = [
    { label: "All", value: "" },
    { label: "In Progreess", value: "in-progress" },
    { label: "Delivery Ready", value: "delivery-ready" },
    { label: "Delivered", value: "delivered" },
    { label: "Failed", value: "failed" },
  ];
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openStatusPicker, setOpenStatusPicker] = useState(false);
  const [{ month, year }, setDate] = useState({
    month: +moment().format("M") - 1,
    year: moment().format("YYYY"),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: moment()._d,
    end: moment().add(7, "days")._d,
  });

  useEffect(() => {
    if (selectedDates) {
      setFilters({
        ...filters,
        start: selectedDates.start,
        end: selectedDates.end,
      });
    }
  }, [selectedDates]);

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  const togglePopoverActive = (name) => {
    switch (name) {
      case "date":
        setOpenDatePicker(!openDatePicker);
        break;
      case "status":
        setOpenStatusPicker(!openStatusPicker);
        break;
      default:
        break;
    }
  };

  const handleSelectStatus = (value) => {
    setOpenStatusPicker(!openStatusPicker);
    setFilters({ ...filters, status: value });
  };

  return (
    <div className={styles.popOverContainer}>
      <Popover
        activator={
          <Button onClick={() => togglePopoverActive("date")} disclosure>
            {`${moment(selectedDates.start).format("YYYY/MM/DD")} - ${moment(
              selectedDates.end
            ).format("YYYY/MM/DD")}`}
          </Button>
        }
        active={openDatePicker}
        autofocusTarget="first-node"
        onClose={() => togglePopoverActive("date")}
      >
        <div style={{ height: "300px", width: "350px", padding: "20px" }}>
          <DatePicker
            month={month}
            year={year}
            onChange={setSelectedDates}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
            allowRange
          />
        </div>
      </Popover>
      <Popover
        activator={
          <Button onClick={() => togglePopoverActive("status")} disclosure>
            Status :{" "}
            {statuses.map((status) =>
              status.value === filters.status ? status.label : null
            )}
          </Button>
        }
        active={openStatusPicker}
        autofocusTarget="first-node"
        onClose={() => togglePopoverActive("status")}
      >
        <div className={styles.statusMenuContainer}>
          {statuses.map((status, i) => (
            <p
              className={styles.statusMenu}
              key={i}
              onClick={() => handleSelectStatus(status.value)}
            >
              {status.label}
            </p>
          ))}
        </div>
      </Popover>
      <div className={styles.blueBtn}>
        <Button onClick={() => applyFilter()}>Apply Filter</Button>
      </div>
      {/* <div className={styles.greenBtn}>
        <Button onClick={() => applyFilter()}>Refresh</Button>
      </div> */}
    </div>
  );
};

export default Filters;
