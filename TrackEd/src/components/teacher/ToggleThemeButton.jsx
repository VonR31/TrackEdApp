import React from 'react';
import { Button } from 'antd';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const ToggleThemeButton = ({ lightTheme,
    toggleTheme }) => {
    return (
    <div className="toggle-theme-btn">
        <Button onClick={toggleTheme}>
        {lightTheme ? <HiOutlineMoon /> :
        <HiOutlineSun />}
        </Button>
    </div>
    );
};




export default ToggleThemeButton;