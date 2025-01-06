import React, { useState } from "react";
import { Button, Layout, theme, Card, List, Tag, Row, Col, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { BookOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

function Home() {
  const navigate = useNavigate();
  const [lightTheme, setLightTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    {
      name: "Technopreneurship",
      code: "TechnoPre",
      schedule: "MWF 9:00-10:30 AM",
      sections: ["Section A", "Section B", "Section C"],
    },
    {
      name: "Ethics",
      code: "GE108",
      schedule: "TTH 1:00-2:30 PM",
      sections: ["Section D", "Section E"],
    },
    {
      name: "Project Management",
      code: "ITElectv3",
      schedule: "MWF 2:00-3:30 PM",
      sections: ["Section F", "Section G"],
    },
    {
      name: "Advance Software Development",
      code: "ITProfEl1",
      schedule: "TTH 10:00-11:30 AM",
      sections: ["Section H", "Section I"],
    },
  ];

  const toggleTheme = () => {
    setLightTheme(!lightTheme);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleSectionClick = (section) => {
    // Redirect to StudentManagement with the selected section name as a URL parameter
    navigate("/StudentManagement");
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        // Add any cleanup logic here (e.g., clearing localStorage, cookies, etc.)
        navigate("/");
      }
    });
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={lightTheme ? "light" : "dark"}
        className="sidebar"
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        <Logo />
        <MenuList lightTheme={lightTheme} />
        <div style={{ 
          marginTop: 'auto',
          padding: '16px'
        }}>
          <ToggleThemeButton lightTheme={lightTheme} toggleTheme={toggleTheme} />
        </div>
      </Sider>
      <Layout>
        <Header 
          style={{ 
            padding: '0 16px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
              marginLeft: 'auto'
            }}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "24px", minHeight: "280px" }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={8}>
              <Card
                title={
                  <span>
                    <BookOutlined style={{ marginRight: 8 }} />
                    Subjects
                  </span>
                }
                className="dashboard-card"
                bordered={false}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={subjects}
                  renderItem={(subject) => (
                    <List.Item onClick={() => handleSubjectClick(subject)}>
                      <List.Item.Meta
                        title={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {subject.name}
                            <Tag color="blue">{subject.code}</Tag>
                          </div>
                        }
                        description={subject.schedule}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} sm={24} md={16}>
              {selectedSubject ? (
                <Card
                  title={`${selectedSubject.name} Sections`}
                  className="dashboard-card"
                  bordered={false}
                >
                  <List
                    dataSource={selectedSubject.sections}
                    renderItem={(section) => (
                      <List.Item onClick={() => handleSectionClick(section)}>
                        {section}
                      </List.Item>
                    )}
                  />
                  <Button onClick={() => setSelectedSubject(null)}>
                    Back to Dashboard
                  </Button>
                </Card>
              ) : (
                <>
                  <Card
                    title="Schedule"
                    className="dashboard-card"
                    bordered={false}
                    style={{
                      transition: "opacity 0.3s",
                      opacity: selectedSubject ? 0 : 1,
                      padding: "20px",
                      marginBottom: "24px"
                    }}
                  >
                    {/* Schedule content */}
                  </Card>
                  <Card
                    title="Announcements"
                    className="dashboard-card"
                    bordered={false}
                    style={{
                      transition: "opacity 0.3s",
                      opacity: selectedSubject ? 0 : 1,
                      padding: "20px"
                    }}
                  >
                    {/* Announcements content */}
                  </Card>
                </>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
