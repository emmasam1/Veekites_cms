import React from "react";
import { Card, Row, Col, Statistic, Button } from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
  MessageOutlined,
  SettingOutlined,
  BarChartOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#8B1E3F]">
          Welcome Back 👋, Admin
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#8B1E3F] hover:bg-[#B23A48]"
        >
          Add New Content
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-md rounded-xl border-0 bg-gradient-to-br from-[#8B1E3F] to-[#B23A48] text-white"
          >
            <Statistic
              title={<span className="text-white">Total Posts</span>}
              value={128}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#fff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl border-0 bg-white">
            <Statistic
              title="Registered Users"
              value={542}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#8B1E3F" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl border-0 bg-white">
            <Statistic
              title="Messages"
              value={76}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#1677FF" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-md rounded-xl border-0 bg-white">
            <Statistic
              title="Active Categories"
              value={12}
              prefix={<SettingOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Analytics Section */}
      <div className="mt-10">
        <Card
          title={
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#8B1E3F]">Site Overview</span>
              <BarChartOutlined style={{ fontSize: 20, color: "#8B1E3F" }} />
            </div>
          }
          className="shadow-md border-0 rounded-xl"
        >
          <p className="text-gray-600">
            Here you can view analytics such as post engagement, user growth,
            and content performance. (Chart section placeholder)
          </p>
          <div className="mt-6 flex justify-center items-center text-gray-400 italic">
            📊 Chart component coming soon...
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
