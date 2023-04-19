import { Card, Page, Layout, Grid } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ProductsCard } from "../components";
import { useEffect, useState } from "react";
import { OverviewCardWidget, CardWidget } from "../components/CardWidgets";
import styles from "../src/styles/Layout.module.scss";

const { Cell } = Grid;

export default function HomePage() {
  const [trackers, setTrackers] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const response = await fetch("/api/trackers/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("RESPONSE", response);

    // response
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };

  return (
    <div>
      <TitleBar title="ORDER TRACKER MANAGEMENT" primaryAction={null} />
      <div className={styles.dashboardTopSection}>
        <p>HELLO</p>
      </div>
    </div>
  );
}
