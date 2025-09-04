import { Layout, ConfigProvider } from "antd";
import { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../../config/authConfig";
import { Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  getThemeConfig,
  ColorSchemeOption,
  ThemeMode,
  defaultColorScheme,
  defaultThemeMode,
} from "../../config/themeConfig";
import Login from "../Login/Login";
import { CreateModule } from "../Modules/Create";
import { ModuleDetails } from "../Modules/Details";
import { ModuleList } from "../Modules/List";
import { CreateOrganization } from "../Organizations/Create";
import { OrganizationSettings } from "../Settings/Settings";
import { CreateWorkspace } from "../Workspaces/Create";
import { WorkspaceDetails } from "../Workspaces/Details";
import { ImportWorkspace } from "../Workspaces/Import";
import "./App.css";
import MainMenu from "./MainMenu";
import { ProfilePicture } from "./ProfilePicture";
import logo from "./earthling-logo.png";
import { UserSettingsPage } from "@/modules/user/UserSettingsPage";
import OrganizationsPickerPage from "@/modules/organizations/OrganizationsPickerPage";
import OrganizationsDetailPage from "@/modules/organizations/OrganizationDetailsPage";
import { ORGANIZATION_ARCHIVE, ORGANIZATION_NAME } from "../../config/actionTypes";
import axiosInstance from "../../config/axiosConfig";
const { Sider, Header, Content, Footer } = Layout;
import codeOpsLogo from "./Mediamodifier-Design (2).svg";
// Helper component to extract URL parameters for collection routes
const CollectionSettingsWrapper = ({ mode }: { mode: "edit" | "detail" }) => {
  const { collectionid } = useParams();
  return <OrganizationSettings selectedTab="9" collectionMode={mode} collectionId={collectionid} />;
};

const App = () => {
  const auth = useAuth();
  const [organizationName, setOrganizationName] = useState<string>("");
  const [colorScheme, setColorScheme] = useState<ColorSchemeOption>(defaultColorScheme);
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultThemeMode);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const expiry = auth?.user?.expires_at;

  // Ant Design theme token for background color
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Load color scheme and theme mode preferences from localStorage
    const savedScheme = localStorage.getItem("terrakube-color-scheme") as ColorSchemeOption;
    const savedThemeMode = localStorage.getItem("terrakube-theme-mode") as ThemeMode;
    if (savedScheme) {
      setColorScheme(savedScheme);
    }
    if (savedThemeMode) {
      setThemeMode(savedThemeMode);
    }

    // Initialize organization name from URL or session storage
    const pathname = window.location.pathname;
    const paths = pathname.split("/");
    const orgIdIndex = paths.indexOf("organizations") + 1;

    if (orgIdIndex > 0 && orgIdIndex < paths.length) {
      const orgId = paths[orgIdIndex];
      if (orgId) {
        // Check if we already have the org name in session storage
        const storedOrgName = sessionStorage.getItem(ORGANIZATION_NAME);
        const storedOrgId = sessionStorage.getItem(ORGANIZATION_ARCHIVE);

        if (storedOrgName && storedOrgId === orgId) {
          setOrganizationName(storedOrgName);
        } else {
          // Fetch the organization name
          axiosInstance
            .get(`organization/${orgId}`)
            .then((response) => {
              if (response.data && response.data.data) {
                const orgName = response.data.data.attributes.name;
                sessionStorage.setItem(ORGANIZATION_ARCHIVE, orgId);
                sessionStorage.setItem(ORGANIZATION_NAME, orgName);
                setOrganizationName(orgName);
              }
            })
            .catch((err) => {
              console.error("Failed to load cloud:", err);
            });
        }
      }
    } else {
      // No org ID in URL, use session storage if available
      const storedOrgName = sessionStorage.getItem(ORGANIZATION_NAME);
      if (storedOrgName) {
        setOrganizationName(storedOrgName);
      }
    }
  }, []);

  // Checking with the expiry time in the localstorage and when it has crossed the access has been revoked so It will clear the local storage and by default with no localstorage object it will route to login page.
  if (auth.isAuthenticated && auth?.user && expiry !== undefined && Math.floor(Date.now() / 1000) > expiry) {
    localStorage.clear();
  }

  if (!auth.isAuthenticated) {
    console.warn("User is not authenticated, redirecting to login");
    return <Login />;
  }

  const LayoutWrapper = () => (
  <ConfigProvider>
    <Layout style={{ border: "1px solid #1F2937" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          borderRight: "1px solid #1F2937",
          // background: "#0f172a",
          marginTop: "64px",
        }}
      >
        <MainMenu
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
          themeMode={themeMode}
        />
      </Sider>

      <Layout style={{ borderLeft: "1px solid #1F2937" }}>
        <Header
          style={{
            padding: 0,
            borderBottom: "1px solid #1F2937",
            background: "#111827",
            marginLeft:"-200px"
          }}
        >  
        <div className="demo-logo-vertical" />
        <a className="image-crop">
          <img
            className="logo"
            src={codeOpsLogo}
            alt="Logo"
            height={80}
            
            // width={80}
          />
        </a>
          <div style={{ float: "right", display: "flex", alignItems: "center",margin:"15px" }}>
            <ProfilePicture />
          </div>
        </Header>

        <Content
          style={{
            minHeight: 280,
            background: colorBgContainer,
            border: "0px solid #1F2937",
            // margin: 16,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#111827",
            borderTop: "1px solid #1F2937",
          }}
        >
          CodeOps {window._env_.REACT_APP_TERRAKUBE_VERSION} ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  </ConfigProvider>
);


  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutWrapper />,
      children: [
        {
          path: "/",
          element: <OrganizationsPickerPage />,
        },
        {
          path: "/organizations/create",
          element: <CreateOrganization setOrganizationName={setOrganizationName} />,
        },
        {
          path: "/organizations/:id/workspaces",
          element: (
            <OrganizationsDetailPage setOrganizationName={setOrganizationName} organizationName={organizationName} />
          ),
        },
        {
          path: "/workspaces/create",
          element: <CreateWorkspace />,
        },
        {
          path: "/workspaces/import",
          element: <ImportWorkspace />,
        },
        {
          path: "/workspaces/:id",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} />,
        },
        {
          path: "/organizations/:orgid/workspaces/:id",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} />,
        },
        {
          path: "/workspaces/:id/runs",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="2" />,
        },
        {
          path: "/organizations/:orgid/workspaces/:id/runs",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="2" />,
        },
        {
          path: "/workspaces/:id/runs/:runid",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="2" />,
        },
        {
          path: "/organizations/:orgid/workspaces/:id/runs/:runid",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="2" />,
        },
        {
          path: "/workspaces/:id/states",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="3" />,
        },
        {
          path: "/organizations/:orgid/workspaces/:id/states",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="3" />,
        },
        {
          path: "/workspaces/:id/variables",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="4" />,
        },
        {
          path: "/organizations/:orgid/workspaces/:id/variables",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="4" />,
        },
        {
          path: "/workspaces/:id/schedules",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="5" />,
        },
        {
          path: "/organizations/:orgid/workspaces/:id/schedules",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="5" />,
        },
        {
          path: "/workspaces/:id/settings",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="6" />,
        },
        {
          path: "/organizations/:orgid/workspaces/:id/settings",
          element: <WorkspaceDetails setOrganizationName={setOrganizationName} selectedTab="6" />,
        },
        {
          path: "/organizations/:orgid/registry/create",
          element: <CreateModule />,
        },
        {
          path: "/organizations/:orgid/registry",
          element: <ModuleList setOrganizationName={setOrganizationName} organizationName={organizationName} />,
        },
        {
          path: "/organizations/:orgid/registry/:id",
          element: <ModuleDetails organizationName={organizationName} />,
        },
        {
          path: "/organizations/:orgid/settings",
          element: <OrganizationSettings />,
        },
        {
          path: "/organizations/:orgid/settings/general",
          element: <OrganizationSettings selectedTab="1" />,
        },
        {
          path: "/organizations/:orgid/settings/teams",
          element: <OrganizationSettings selectedTab="2" />,
        },
        {
          path: "/organizations/:orgid/settings/vcs",
          element: <OrganizationSettings selectedTab="4" />,
        },
        {
          path: "/organizations/:orgid/settings/vcs/new/:vcsName",
          element: <OrganizationSettings selectedTab="4" vcsMode="new" />,
        },
        {
          path: "/settings/tokens",
          element: <UserSettingsPage />,
        },
        {
          path: "/settings/theme",
          element: <UserSettingsPage />,
        },
        {
          path: "/organizations/:orgid/settings/ssh",
          element: <OrganizationSettings selectedTab="6" />,
        },
        {
          path: "/organizations/:orgid/settings/tags",
          element: <OrganizationSettings selectedTab="7" />,
        },
        {
          path: "/organizations/:orgid/settings/actions",
          element: <OrganizationSettings selectedTab="10" />,
        },
        {
          path: "/organizations/:orgid/settings/collection",
          element: <OrganizationSettings selectedTab="9" />,
        },
        {
          path: "/organizations/:orgid/settings/collection/new",
          element: <OrganizationSettings selectedTab="9" collectionMode="new" />,
        },
        {
          path: "/organizations/:orgid/settings/collection/edit/:collectionid",
          element: <CollectionSettingsWrapper mode="edit" />,
        },
        {
          path: "/organizations/:orgid/settings/collection/:collectionid",
          element: <CollectionSettingsWrapper mode="detail" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
