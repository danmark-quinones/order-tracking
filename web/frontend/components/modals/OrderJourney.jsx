import { Button, Modal, TextContainer } from "@shopify/polaris";
import styles from "../../src/styles/OrderJourney.module.scss";
import moment from "moment/moment";

const OrderJourneyModal = (props) => {
  const { config, onClose } = props;

  return (
    <div style={{ height: "500px" }}>
      <Modal
        open={config.showOrderJourney}
        onClose={onClose}
        title="Parcel's Full Journey"
        primaryAction={null}
        secondaryActions={null}
      >
        <Modal.Section>
          <div className={styles.timelineContainer}>
            {!config.data.length
              ? null
              : config?.data?.map((journey, i) => (
                  <div className={styles.timeline} key={i}>
                    <p>{journey.notes}</p>
                    <small>{moment(journey.date_created).format("LLLL")}</small>
                  </div>
                ))}
          </div>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default OrderJourneyModal;
