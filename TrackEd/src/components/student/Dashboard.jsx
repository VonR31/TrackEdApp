import React, { useState } from "react";
import { Layout, Card, Row, Col, Button, Tag, Modal } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Logo from "../teacher/Logo";
import { useNavigate } from "react-router-dom";
import MenuList from "../teacher/MenuList";
import ToggleThemeButton from "../teacher/ToggleThemeButton";

const { Header, Sider, Content } = Layout;

function Dashboard() {
  const navigate = useNavigate();
  const [lightTheme, setLightTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [subjects, setSubjects] = useState([
    {
      name: "Technopreneurship",
      code: "TechnoPre",
      schedule: "MWF 9:00-10:30 AM",
    },
    {
      name: "Ethics",
      code: "GE108",
      schedule: "TTH 1:00-2:30 PM",
    },
    {
      name: "Project Management",
      code: "ITElectv3",
      schedule: "MWF 2:00-3:30 PM",
    },
    {
      name: "Advance Software Development",
      code: "ITProfEl1",
      schedule: "TTH 10:00-11:30 AM",
    },
  ]);

  const toggleTheme = () => {
    setLightTheme(!lightTheme);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to logout?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        navigate("/");
      },
    });
  };

  const handleSubjectClick = (subject) => {
    console.log("Subject clicked:", subject);
  };

  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={lightTheme ? "light" : "dark"}
        className="sidebar"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Logo />
        <MenuList lightTheme={lightTheme} />
        <div
          style={{
            marginTop: "auto",
            padding: "16px",
          }}
        >
          <ToggleThemeButton lightTheme={lightTheme} toggleTheme={toggleTheme} />
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              marginLeft: "auto",
            }}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "24px", minHeight: "280px" }}>
          <Row gutter={[24, 24]}>
            {subjects.map((subject) => (
              <Col xs={24} sm={12} md={8} lg={6} key={subject.code}>
                <Card
                  title={
                    <span>
                      <BookOutlined style={{ marginRight: 8 }} />
                      {subject.name}
                    </span>
                  }
                  bordered={false}
                  onClick={() => handleSubjectClick(subject)}
                  hoverable
                >
                  <p>
                    <Tag color="blue">{subject.code}</Tag>
                  </p>
                  <p>{subject.schedule}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
