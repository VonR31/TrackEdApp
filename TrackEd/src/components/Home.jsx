import React from "react";
import { useState } from "react";
import { Button, Layout, theme, Card, List, Tag, Row, Col } from "antd";
import Logo from "./Logo";
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { BookOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
function Home() {
    const[darkTheme, setDarkTheme] = useState(true);
    const[collapsed, setCollapsed] = useState(false);

    const subjects = [
        { name: "Technopreneurship", code: "TechnoPre", schedule: "MWF 9:00-10:30 AM" },
        { name: "Ethics", code: "GE108", schedule: "TTH 1:00-2:30 PM" },
        { name: "Project Management", code: "ITElectv3", schedule: "MWF 2:00-3:30 PM" },
        { name: "Advance Software Development", code: "ITProfEl1", schedule: "TTH 10:00-11:30 AM" }
    ];

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    }

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Sider 
            collapsed={collapsed}
            collapsible 
            trigger={null}
            theme={darkTheme ? 'dark' : 'light'}
            className="sidebar">
                <Logo />
                <MenuList darkTheme={darkTheme} />
                <ToggleThemeButton darkTheme={darkTheme} 
                toggleTheme={toggleTheme} />
            </Sider>
            <Layout>
                <Header style={{padding: 0, background:colorBgContainer }}>
                    <Button type='text' 
                    className="toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    icon={collapsed ?
                    <MenuUnfoldOutlined /> : 
                    <MenuFoldOutlined /> } />
                </Header>
                <Content style={{ margin: '24px', minHeight: '280px' }}>
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
                                        <List.Item>
                                            <List.Item.Meta
                                                title={
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                        <Col xs={24} sm={24} md={8}>
                            <Card 
                                title="Schedule"
                                className="dashboard-card"
                                bordered={false}
                            >
                                {/* Schedule content */}
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={8}>
                            <Card 
                                title="Announcements"
                                className="dashboard-card"
                                bordered={false}
                            >
                                {/* Announcements content */}
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
        
    );
}
export default Home;