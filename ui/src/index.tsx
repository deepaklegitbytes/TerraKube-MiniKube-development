import "github-markdown-css/github-markdown-light.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./config/authConfig";
import App from "./domain/Home/App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";

// Get the root element from the DOM
const container = document.getElementById("root");

// Create a root
const root = createRoot(container!);

// Initial render
root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#4dd69b",
            colorLink: "#4dd69b",
            colorText: "#f4f4f5", //white text
             colorTextDescription: "#9CA3AF", // red description text
            colorTextSecondary: "#9CA3AF",
            colorBgContainer: "#111827",
            colorBorderSecondary: "#1F2937",
            colorBgElevated: "#1F2937",
            colorTextPlaceholder: "#9CA3AF", // red placeholder text
            colorTextLabel: "#9CA3AF", // red labels
            colorTextDisabled: "#9CA3AF", // red disabled text
            colorTextHeading: "#ffffff", // white headings
          },
          components: {
            Layout: {
              headerBg: "#111827",
              siderBg: "#0f172a",
              footerBg: "#111827",
              bodyBg: "#111827",
            },
            Menu: {
              itemColor: "#e5e7eb",
              itemHoverColor: "#ffffff",
              darkItemHoverBg: "#1F2937",
              darkItemSelectedColor: "#111827",
              darkItemSelectedBg: "#4dd69b",
            },
            Button: {
              colorPrimary: "#4dd69b",
              colorPrimaryHover: "#34d399",
              colorPrimaryActive: "#22c55e",
              colorTextLightSolid: "#111827",
            },
            Card: {
              headerBg: "#1F2937",
              actionsBg: "#1F2937",
              colorBgContainer: "#1F2937",
            },
            Input: {
              colorBgContainer: "#1F2937",
              colorBorder: "#374151",
              colorTextPlaceholder: "#9ca3af",
              activeBorderColor: "#4dd69b",
            },
            Select: {
              colorBgContainer: "#1F2937",
              selectorBg: "#1F2937",
              colorBorder: "#374151",
              colorTextPlaceholder: "#9ca3af",
              optionSelectedBg: "#4dd69b",
              optionSelectedColor: "#111827",
              optionActiveBg: "#374151",
            },
            Tabs: {
              itemSelectedColor: "#4dd69b",
              inkBarColor: "#4dd69b",
              itemColor: "#e5e7eb",
            },
            Breadcrumb: {
              itemColor: "#e5e7eb",
              linkColor: "#e5e7eb",
              linkHoverColor: "#4dd69b",
              separatorColor: "#e5e7eb",
            },
            Table: {
              headerBg: "#1F2937",
              rowHoverBg: "#1F2937",
              borderColor: "#374151",
            },
            Modal: {
              headerBg: "#1F2937",
              footerBg: "#1F2937",
              contentBg: "#1F2937",
            },
            Drawer: {
              colorBgElevated: "#1F2937",
            },
            Tag: {
              defaultBg: "#1F2937",
              defaultColor: "#e5e7eb",
            },
            Alert: {
              colorErrorBg: "#6e212e",
              colorErrorBorder: "#ff4d4f",
              colorInfoBorder: "#4dd69b",
            },
            Segmented: {
              trackBg: "#1F2937",
              itemColor: "#e5e7eb",
              itemSelectedBg: "#4dd69b",
            },
            Typography: {
              colorTextSecondary: "#9CA3AF",
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
