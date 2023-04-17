import { Card } from "@shopify/polaris";
import styles from "../src/styles/Layout.module.scss";

export const OverviewCardWidget = () => {
  return (
    <Card className={styles.sideNavContainer}>
      <div className={styles.overviewCardContainer}>
        <p>Card</p>
      </div>
    </Card>
  );
};

export const CardWidget = () => {
  return (
    <Card className={styles.sideNavContainer}>
      <div className={styles.squareCardContainer}>
        <p>Card</p>
      </div>
    </Card>
  );
};
