import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button, message } from "antd";
import {
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useApp } from "../../context/AppContext";

const Dashboard = () => {
  const { BASE_URL, token } = useApp();
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    team: 0,
    project: 0,
    service: 0,
  });

  const [messageApi, contextHolder] = message.useMessage();

  // ✅ Fetch all data using the API format you provided
  const getAllServices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/services`);
      return res?.data?.length || 0;
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to fetch services");
      return 0;
    }
  };

  const getAllProjects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects`);
      return res?.data?.projects?.length || 0;
    } catch (error) {
      console.error(error);
      messageApi.error(
        error.response?.data?.message || "Failed to load projects"
      );
      return 0;
    }
  };

  const getTeam = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res?.data?.data?.length || 0;
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to load team members");
      return 0;
    }
  };

  // ✅ Dashboard loader
  const getDashboardData = async () => {
    setLoading(true);
    try {
      const [serviceCount, projectCount, teamCount] = await Promise.all([
        getAllServices(),
        getAllProjects(),
        getTeam(),
      ]);

      setCounts({
        service: serviceCount,
        project: projectCount,
        team: teamCount,
      });

      messageApi.success("Dashboard data loaded successfully");
    } catch (error) {
      console.error(error);
      messageApi.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="p-6">
      {contextHolder}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#8B1E3F]">
          Welcome Back 👋, Admin
        </h2>
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          className="!bg-[#8B1E3F] hover:!bg-[#B23A48]"
        >
          Add New Content
        </Button> */}
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {/* Projects */}
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md rounded-xl border-0 bg-gradient-to-br from-[#8B1E3F] to-[#B23A48] text-white">
            <Statistic
              title={<span className="">Total Projects</span>}
              value={counts.project}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#8B1E3F" }}
              loading={loading}
            />
          </Card>
        </Col>

        {/* Team */}
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md rounded-xl border-0 bg-white">
            <Statistic
              title="Total Team Members"
              value={counts.team}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#8B1E3F" }}
              loading={loading}
            />
          </Card>
        </Col>

        {/* Services */}
        <Col xs={24} sm={12} md={8}>
          <Card className="shadow-md rounded-xl border-0 bg-white">
            <Statistic
              title="Total Services"
              value={counts.service}
              prefix={<SettingOutlined />}
              valueStyle={{ color: "#52c41a" }}
              loading={loading}
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
            Here you can view analytics such as project performance, team growth,
            and service engagement. (Chart section placeholder)
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
