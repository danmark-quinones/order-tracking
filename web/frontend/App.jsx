import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import SideNavigation from "./components/SideNavigation";
import { Grid } from "@shopify/polaris";
import styles from "./src/styles/Layout.module.scss";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Dashboard",
                  destination: "/dashboard",
                },
                {
                  label: "Product Management",
                  destination: "/products",
                },
              ]}
            />
            <Grid>
              <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 2, xl: 2 }}>
                <SideNavigation />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 9, sm: 9, md: 9, lg: 10, xl: 10 }}>
                <div className={styles.rightSideContainer}>
                  <Routes pages={pages} />
                </div>
              </Grid.Cell>
            </Grid>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
