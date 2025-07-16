import {
  AppstoreOutlined,
  CloudOutlined,
  DownCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ORGANIZATION_ARCHIVE, ORGANIZATION_NAME } from "../../config/actionTypes";
import axiosInstance from "../../config/axiosConfig";
import { ApiResponse, FlatOrganization, Organization } from "../types";
import "./Home.css";
import { ThemeMode } from "../../config/themeConfig";

type Props = {
  organizationName: string;
  setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
  themeMode?: ThemeMode;
};

const ensureOrganizationName = (
  orgId: string,
  currentOrgName: string,
  setOrgName: (name: string) => void,
  onComplete: () => void
) => {
  if (orgId && currentOrgName && currentOrgName !== "select organization") {
    sessionStorage.setItem(ORGANIZATION_ARCHIVE, orgId);
    sessionStorage.setItem(ORGANIZATION_NAME, currentOrgName);
    onComplete();
  } else {
    axiosInstance
      .get(`organization/${orgId}`)
      .then((response) => {
        if (response.data?.data) {
          const orgName = response.data.data.attributes.name;
          sessionStorage.setItem(ORGANIZATION_ARCHIVE, orgId);
          sessionStorage.setItem(ORGANIZATION_NAME, orgName);
          setOrgName(orgName);
          onComplete();
        }
      })
      .catch((error) => console.error("Failed to fetch organization:", error));
  }
};

export const MainMenu = ({ organizationName, setOrganizationName }: Props) => {
  const [orgs, setOrgs] = useState<FlatOrganization[]>([]);
  const [defaultSelected, setDefaultSelected] = useState(["workspaces"]);
  const location = useLocation();
  const navigate = useNavigate();
  const params = location.pathname.split("/");
  const orgIdFromUrl = params.length > 2 && params[1] === "organizations" ? params[2] : null;
  const organizationId = sessionStorage.getItem(ORGANIZATION_ARCHIVE) || orgIdFromUrl;

  useEffect(() => {
    if (organizationId && (!sessionStorage.getItem(ORGANIZATION_NAME) || organizationName === "select organization")) {
      ensureOrganizationName(
        organizationId,
        organizationName,
        setOrganizationName,
        () => {}
      );
    }
  }, [organizationId, organizationName, setOrganizationName]);

  useEffect(() => {
    axiosInstance.get("organization").then((response: AxiosResponse<ApiResponse<Organization[]>>) => {
      const organizations = prepareOrgs(response.data.data);
      setOrgs(organizations);

      if (orgIdFromUrl && (!sessionStorage.getItem(ORGANIZATION_NAME) || organizationName === "select organization")) {
        const foundOrg = organizations.find((org) => org.id === orgIdFromUrl);
        if (foundOrg) {
          sessionStorage.setItem(ORGANIZATION_ARCHIVE, orgIdFromUrl);
          sessionStorage.setItem(ORGANIZATION_NAME, foundOrg.name);
          setOrganizationName(foundOrg.name);
        } else {
          ensureOrganizationName(orgIdFromUrl, "", setOrganizationName, () => {});
        }
      } else {
        setOrganizationName(sessionStorage.getItem(ORGANIZATION_NAME) || "select organization");
      }
    });

    if (location.pathname.includes("registry")) {
      setDefaultSelected(["registry"]);
    } else if (location.pathname.includes("settings")) {
      setDefaultSelected(["settings"]);
    } else {
      setDefaultSelected(["workspaces"]);
    }
  }, [orgIdFromUrl, location.pathname, setOrganizationName]);

  const handleClick = (e: { key: string }) => {
    if (e.key === "new") {
      navigate("/organizations/create");
    } else {
      ensureOrganizationName(e.key, "", setOrganizationName, () => {
        window.location.href = `/organizations/${e.key}/workspaces`;
      });
    }
  };

  const handleSectionNavigation = (section: string) => {
    ensureOrganizationName(organizationId!, organizationName, setOrganizationName, () => {
      navigate(`/organizations/${organizationId}/${section}`);
      setDefaultSelected([section]);
    });
  };

  const items = [
    {
      label: organizationName,
      key: "organization-name",
      icon: <DownCircleOutlined />,
      children: [
        {
          label: "Create new organization",
          key: "new",
          icon: <PlusCircleOutlined />,
          onClick: handleClick,
        },
        {
          type: "divider",
        },
        {
          type: "group",
          label: "Organizations",
          children: orgs
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((org) => ({
              label: org.name,
              key: org.id,
              onClick: handleClick,
            })),
        },
      ],
    },
    ...(organizationId
      ? [
          {
            label: "Workspaces",
            key: "workspaces",
            icon: <AppstoreOutlined />,
            onClick: () => handleSectionNavigation("workspaces"),
          },
          {
            label: "Registry",
            key: "registry",
            icon: <CloudOutlined />,
            onClick: () => handleSectionNavigation("registry"),
          },
          {
            label: "Settings",
            key: "settings",
            icon: <SettingOutlined />,
            onClick: () => handleSectionNavigation("settings"),
          },
        ]
      : []),
  ];

  return (
    <Menu
      selectedKeys={defaultSelected}
      theme="dark"
      mode="inline" // vertical
      items={items}
      style={{ height: "100vh", borderRight: 0 }}
    />
  );
};

function prepareOrgs(organizations: Organization[]): FlatOrganization[] {
  return organizations.map((element) => ({
    id: element.id,
    name: element.attributes.name,
    description: element.attributes.description,
  }));
}

export default MainMenu;
