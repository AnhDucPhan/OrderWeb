'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import AttendanceWidget from '@/components/componentsAdmin/componentsBody/DashboardAdmin';

const AdminDashboard = () => {
  return (
    <div>
      <AttendanceWidget />
    </div>
  );
};

export default AdminDashboard;