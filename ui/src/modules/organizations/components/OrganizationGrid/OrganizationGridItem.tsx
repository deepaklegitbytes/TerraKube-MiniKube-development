import { Flex, Typography, Card } from "antd";
import stringToDeterministicColor from "@/modules/utils/stringToDeterministicColor";
import { OrganizationModel } from "../../types";
import * as FaIcons from "react-icons/fa6";
import { ORGANIZATION_ARCHIVE, ORGANIZATION_NAME } from "../../../../config/actionTypes";
import AWSIcon from "../../../../Icons/AWSIcons";
import AzureCloudIcon from "../../../../Icons/AzureIcons";
import GoogleCloudIcon from "../../../../Icons/GCPIcons";
const DEFAULT_ICON = "FaBuilding";
const DEFAULT_COLOR = "#000000";

// Helper to parse icon field and get icon name and color
function parseIconField(iconField: string | undefined, orgId: string): { iconName: string; color: string } {
  if (!iconField) {
    // If icon field is empty, use FaBuilding and deterministic color
    return { iconName: DEFAULT_ICON, color: stringToDeterministicColor(orgId) };
  }
  const [iconName, color] = iconField.split(":");
  return {
    iconName: iconName || DEFAULT_ICON,
    // If color is missing, use black; if icon field is empty, handled above
    color: color ? color : DEFAULT_COLOR,
  };
}

// Helper to get the icon component
function getOrgIcon(organization: OrganizationModel) {
  switch (organization.name.toLowerCase()) {
    case "aws":
      return <AWSIcon size={40} />;
      break;
    case "azure":
      return <AzureCloudIcon size={40}/>;
      break;
    case "gcp":
      return <GoogleCloudIcon size={40} />;
      break;
    default:
      return null;
  }
}

type Props = {
  organization: OrganizationModel;
};

export default function OrganizationGridItem({ organization }: Props) {
  // const { iconName, color } = parseIconField(organization.icon, organization.id);

  const handleOrganizationClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Store organization data in session storage
    sessionStorage.setItem(ORGANIZATION_ARCHIVE, organization.id);
    sessionStorage.setItem(ORGANIZATION_NAME, organization.name);

    // Navigate with full page reload
    window.location.href = `/organizations/${organization.id}/workspaces`;
  };

  return (
    <Card hoverable style={{ width: "100%" }} onClick={handleOrganizationClick}>
      <Flex gap="small" align="center">
        <div className="org-card-icon">{getOrgIcon(organization)}</div>
        <Flex vertical gap="0">
          <Typography.Text className="org-card-title" ellipsis>
            {organization.name}
          </Typography.Text>
          <Typography.Text type="secondary">
            {organization.description || "No description set for this cloud"}
          </Typography.Text>
        </Flex>
      </Flex>
    </Card>
  );
}
