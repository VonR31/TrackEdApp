import React from 'react';
import { Menu } from 'antd';
import { 
    HomeOutlined, 
    CalendarOutlined 
} from '@ant-design/icons';

const MenuList = ({ lightTheme }) => {
  return (
    <Menu theme={lightTheme ? 'light' : 'dark'} 
    mode="inline" 
    className="menu-bar">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        Home
      </Menu.Item>
      <Menu.Item key="schedule" icon={<CalendarOutlined />}>
        Calendar
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;