'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Total Sales"
              value={112893}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Total Orders"
              value={93}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Active Users"
              value={15}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <div className="mt-8 bg-white p-4 rounded">
        <p>Biểu đồ hoặc danh sách đơn hàng mới sẽ đặt ở đây...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;