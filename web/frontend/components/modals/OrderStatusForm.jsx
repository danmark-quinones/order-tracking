import { Button, Modal, TextField } from "@shopify/polaris";
import styles from "../../src/styles/OrderJourney.module.scss";
import { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks";

const OrderStatusFormModal = (props) => {
  const { config, onClose, refreshLists } = props;
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    status: "",
    location: "",
    recipient: "",
    notes: "",
  });

  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    if (config.showOrderStatusForm) {
      const current_location =
        config.type === "departed"
          ? config.data.additional_destination[0].location
          : "";
      setForm({
        ...form,
        status: config.type,
        location: current_location,
      });
    } else {
      resetForm();
    }
  }, [config.showOrderStatusForm]);

  const resetForm = () => {
    setForm({
      ...form,
      status: "",
      notes: "",
      location: "",
      recipient: "",
    });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    var message = "";
    var overall_status = ["arrived", "departed"].includes(form.status)
      ? "in-progress"
      : form.status;

    if (!form.notes) {
      if (["arrived", "departed"].includes(form.status)) {
        message = `Parcel has ${form.status} ${form.location}`;
      } else if (form.status === "delivery-ready") {
        message = `Parcel is out for delivery`;
      } else if (form.status === "delivered") {
        message = `Parcel has been delivered to ${form.recipient}`;
      }
    } else {
      message = form.notes;
    }

    const payload = {
      _id: config.data._id,
      status: overall_status,
      additional_destination: [
        {
          status: form.status,
          location: form.location,
          notes: message,
          date_created: new Date().toLocaleString(),
        },
        ...config.data.additional_destination,
      ],
    };

    console.log("PAYLOAD", payload);

    const response = await fetch("/api/trackers/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("OK", response);
      refreshLists();
      setTimeout(() => {
        setUpdating(false);
        onClose();
        refreshLists();
      }, 3000);
    } else {
      console.log("ERR", response);
      setUpdating(false);
    }
  };

  const handleFieldChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  return (
    <div style={{ height: "500px" }}>
      <Modal
        open={config.showOrderStatusForm}
        onClose={onClose}
        title={config.title}
        primaryAction={{
          content: "Confirm Update",
          onAction: handleUpdate,
          loading: updating,
        }}
        secondaryActions={null}
      >
        <Modal.Section>
          <div className={styles.orderStatusFormContainer}>
            {["delivered", "delivery-ready", "failed"].includes(
              config.type
            ) && (
              <p>
                {`Are you sure you want to mark this order as "${config.type}"? This
                action is irreversible once completed. If you wish to continue, kindly provide data below`}
              </p>
            )}
            {config.type === "departed" && (
              <p>{`This action will tag the order as "${config.type}" from its current location "${form.location}" , click "Confirm Update" if you want to proceed.`}</p>
            )}

            {config.type === "delivered" && (
              <TextField
                label="Recipient"
                value={form.recipient}
                placeholder="Juan dela Cruz"
                onChange={(val) => handleFieldChange("recipient", val)}
              />
            )}
            {config.type === "failed" && (
              <TextField
                label="Reason for failed delivery"
                value={form.notes}
                placeholder="Unable to contact the recipient."
                onChange={(val) => handleFieldChange("notes", val)}
              />
            )}
            {config.type === "arrived" && (
              <TextField
                label="Location/Hub name"
                value={form.location}
                placeholder="e.g : Hub619 , China's Hub 123"
                onChange={(val) => handleFieldChange("location", val)}
              />
            )}
          </div>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default OrderStatusFormModal;
