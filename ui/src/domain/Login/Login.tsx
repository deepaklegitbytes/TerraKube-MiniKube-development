import { Button, Card, Space,ConfigProvider, Divider } from "antd";
import { mgr } from "../../config/authConfig";
import "./Login.css";
import logo from "./earthling-logo.png";

const Login = () => {
  console.log("Login component rendered");
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card type="inner" className="card my-custom-card"  size="small" title={<>
          <div style={{ display: "flex", alignItems: "center", gap: "0px" }}> 
        <img alt="logo" className="loginLogo" src={"https://earthlingsecurity.com/wp-content/uploads/2025/03/logo-web-light-01.svg"} style={{ height: "50px" }} /> 
    </div> 
        </>}>
        
        <ConfigProvider theme={{
      token: {
        // Seed Token
        colorPrimary: '#00b96b',
        borderRadius: 4,

        // Alias Token
        colorBgContainer: '#f6ffed',
      },
    }}
  >
          <Space direction="vertical">
            Sign in to EarthLing
            <Button type="primary" onClick={() => App()}>
              Login
            </Button>
          </Space>
          </ConfigProvider>
        </Card>
      </div>{" "}
    </div>
  );
};

function App() {
  mgr.signinRedirect();
}

export default Login;
