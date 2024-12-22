import React, { useState } from 'react';
import { Layout } from 'antd';
import Logo from './Logo'

const { Header, Sider } = Layout;

function Home() {
    return (
        <Layout>
            <Sider className="sidebar">
                <Logo />
            </Sider>
        </Layout>
    );
}

export default Home;