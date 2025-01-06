import React, { useState } from "react";
import { Button, Layout, theme, Card, List, Table, Select, Modal, Form, Input, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

function StudentManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { section } = location.state || {};

  const [lightTheme, setLightTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [students, setStudents] = useState([
    { name: 'John Doe', id: 1, grade: '' },
    { name: 'Jane Smith', id: 2, grade: '' },
    // More students...
  ]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('January');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const toggleTheme = () => {
    setLightTheme(!lightTheme);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        navigate("/");
      }
    });
  };

  const fetchAttendance = () => {
    const daysInMonth = new Date(2025, months.indexOf(selectedMonth) + 1, 0).getDate();
    const data = students.map(student => {
      let attendance = [];
      for (let i = 1; i <= daysInMonth; i++) {
        attendance.push(Math.random() > 0.5 ? 'Present' : 'Absent');
      }
      return {
        key: student.id,
        name: student.name,
        attendance,
      };
    });

    setAttendanceData(data);
    setShowAttendance(true);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    fetchAttendance();
  };

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
    form.setFieldsValue({ grade: student.grade || '' });
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      const updatedStudents = students.map(student => 
        student.id === selectedStudent.id 
          ? { ...student, grade: values.grade }
          : student
      );
      setStudents(updatedStudents);
      message.success(`Grade for ${selectedStudent.name} updated to ${values.grade}`);
      handleCloseModal();
    }).catch(info => {
      console.error('Validation failed:', info);
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
          {!showAttendance ? (
            <Card title={`Student List for ${section}`} bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={students}
                renderItem={(student) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => handleOpenModal(student)} type="link">
                        Upload/Edit Grade
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={student.name}
                      description={`Grade: ${student.grade}`}
                    />
                  </List.Item>
                )}
              />
              <Button
                type="primary"
                onClick={fetchAttendance}
                style={{ marginTop: '16px' }}
              >
                View Attendance Records
              </Button>
            </Card>
          ) : (
            <Card
              title={`Attendance for ${selectedMonth}`}
              bordered={false}
              extra={
                <Button onClick={() => setShowAttendance(false)}>Back</Button>
              }
            >
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                style={{ marginBottom: '16px', width: '100%' }}
              >
                {months.map(month => (
                  <Option key={month} value={month}>
                    {month}
                  </Option>
                ))}
              </Select>

              <Table
                dataSource={attendanceData}
                columns={[
                  { title: 'Student Name', dataIndex: 'name', key: 'name' },
                  ...Array.from({ length: attendanceData && attendanceData[0]?.attendance.length || 0 }, (_, index) => {
                    const date = new Date(2025, months.indexOf(selectedMonth), index + 1);
                    const formattedDate = `${date.getDate()}`.padStart(2, '0');
                    return {
                      title: formattedDate,
                      dataIndex: `attendance[${index}]`,
                      key: `attendance[${index}]`,
                      render: (attendance) => attendance || 'Absent',
                    };
                  }),
                ]}
                rowKey="key"
                pagination={false}
              />
            </Card>
          )}
        </Content>
      </Layout>

      <Modal
        title={`Upload/Edit Grade for ${selectedStudent?.name}`}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={handleFormSubmit}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="grade"
            label="Grade"
            rules={[{ required: true, message: 'Please input the grade!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default StudentManagement;
