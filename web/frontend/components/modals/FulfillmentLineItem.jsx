import { Button, Modal, Spinner, TextContainer } from "@shopify/polaris";
import styles from "../../src/styles/OrderLineItem.module.scss";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { useEffect, useState } from "react";

const FulfillmentLineItemModal = (props) => {
  const { config, onClose } = props;
  const fetch = useAuthenticatedFetch();

  const [lineItems, setLineItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (config.showFulfillmentLineItem) {
      getProducts();
    }
  }, [config.showFulfillmentLineItem]);

  const getProducts = () => {
    var container = [];
    setIsLoading(true);
    config.data.line_items.forEach((item) => {
      const res = fetch(`/api/products?id=${item.id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((lineItem) => {
          const obj = {
            id: lineItem.data[0]?.id || item.id,
            image:
              lineItem.data[0]?.imageUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png",
            title: item.title,
            total_amount: +item.price * item.quantity,
            quantity: item.quantity,
          };
          container.push(obj);
          if (config.data.line_items.length === container.length) {
            setLineItems(container);
            setIsLoading(false);
          }
        });
    });
  };

  return (
    <div className={styles.lineItemModalContainer} style={{ height: "500px" }}>
      <Modal
        open={config.showFulfillmentLineItem}
        onClose={onClose}
        title="Fulfillment's Line Items"
        primaryAction={null}
        secondaryActions={null}
      >
        <Modal.Section>
          <div className={styles.lineItemContainer}>
            {isLoading ? (
              <div className={styles.loaderContainer}>
                <Spinner />
              </div>
            ) : !isLoading && lineItems.length ? (
              lineItems.map((item, i) => (
                <div key={i} className={styles.lineItem}>
                  <img src={item.image} />
                  <p>{item.title}</p>
                  <p>Qty : {item.quantity}</p>
                  <p>Total : {item.total_amount} USD</p>
                </div>
              ))
            ) : null}
          </div>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default FulfillmentLineItemModal;
