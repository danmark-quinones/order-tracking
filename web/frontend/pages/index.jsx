import { Card, Page, Layout, Grid } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ProductsCard } from "../components";
import { useEffect } from "react";
import { OverviewCardWidget, CardWidget } from "../components/CardWidgets";
import styles from "../src/styles/Layout.module.scss";

const { Cell } = Grid;

export default function HomePage() {
  // useEffect(() => {
  //   getOrders();
  // }, []);

  // const getOrders = async () => {
  //   const response = await fetch("/api/orders");

  //   if (response.ok) {
  //     console.log(response);
  //   } else {
  //     console.log(response);
  //   }
  // };

  return (
    <div>
      <TitleBar title="SALES" primaryAction={null} />
      <div className={styles.dashboardTopSection}>
        <div columnSpan={{ md: 9, lg: 9 }}>
          <Grid>
            <Cell columnSpan={{ lg: 3 }}>
              <OverviewCardWidget />
            </Cell>
            <Cell columnSpan={{ lg: 3 }}>
              <OverviewCardWidget />
            </Cell>
            <Cell columnSpan={{ lg: 3 }}>
              <OverviewCardWidget />
            </Cell>
            <Cell columnSpan={{ lg: 3 }}>
              <OverviewCardWidget />
            </Cell>
            <Cell columnSpan={{ lg: 9 }}>
              <CardWidget />
            </Cell>
            <Cell columnSpan={{ lg: 3 }}>
              <CardWidget />
            </Cell>
          </Grid>
          <Grid></Grid>
        </div>

        <div columnSpan={{ md: 3, lg: 3 }}>
          <CardWidget />
          <CardWidget />
        </div>
      </div>
      <div className={styles.dashboardBottomSection}>
        <Grid>
          <Cell columnSpan={{ md: 3, lg: 4 }}>
            <CardWidget />
          </Cell>
          <Cell columnSpan={{ md: 3, lg: 4 }}>
            <CardWidget />
          </Cell>
          <Cell columnSpan={{ md: 3, lg: 4 }}>
            <CardWidget />
          </Cell>
        </Grid>
      </div>
    </div>
  );
}
