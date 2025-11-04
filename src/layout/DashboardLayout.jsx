// src/layouts/admin/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import {
  DashboardOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Grid, Dropdown, Avatar } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";

const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const menu_items = [{ key: "logout", label: "Logout", icon: <LogoutOutlined /> }];

function getItem(label, key, icon) {
  return { key, icon, label };
}

const items = [
  getItem("Dashboard", "/admin/dashboard", <DashboardOutlined />),
  getItem("Services", "/admin/dashboard/services", <AppstoreOutlined />),
  getItem("Projects", "/admin/dashboard/projects", <FolderOpenOutlined />),
  getItem("Team", "/admin/dashboard/team", <TeamOutlined />),
  getItem("Site Management", "/admin/dashboard/site-management", <SettingOutlined />),
];

// ✅ Route titles (including dynamic handling)
const routeTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/dashboard/services": "Services",
  "/admin/dashboard/team": "Team",
  "/admin/dashboard/site-management": "Site Management",
};

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/admin/dashboard/projects")) return "Projects";
  return routeTitles[pathname] || "Dashboard";
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setCollapsed(!screens.lg);
  }, [screens]);

  const pageTitle = getPageTitle(location.pathname);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#F4F5F7" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={200}
        style={{
          backgroundColor: "#8B1E3F",
          color: "#fff",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Avatar / Logo */}
        <div
          style={{
            height: 64,
            margin: "16px",
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          CMS
        </div>

        {/* Sidebar Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={items}
          style={{
            background: "transparent",
            color: "#fff",
          }}
          theme="dark"
          className="custom-sidebar-menu"
          rootClassName="cms-menu"
        />
      </Sider>

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.2s ease",
          backgroundColor: "#F4F5F7",
        }}
      >
        {/* Header */}
        <Header
          style={{
            backgroundColor: "#FFFFFF",
            color: "#1E1E1E",
            padding: "0 24px",
            position: "fixed",
            top: 0,
            left: collapsed ? 80 : 200,
            right: 0,
            height: 64,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
        >
          <h1 className="text-lg font-semibold m-0 text-[#8B1E3F]">
            {pageTitle}
          </h1>

          <Dropdown menu={{ items: menu_items, onClick: handleMenuClick }}>
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer transition"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar
                size="large"
                style={{
                  backgroundColor: "#B23A48",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                A
              </Avatar>
            </div>
          </Dropdown>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            marginTop: 70,
            padding: 10,
            minHeight: "calc(100vh - 80px)",
            backgroundColor: "#F4F5F7",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: borderRadiusLG,
              minHeight: "calc(100vh - 120px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>

      {/* Custom Menu Style */}
      <style>{`
        .cms-menu .ant-menu-item-selected {
          background-color: #B23A48 !important;
          color: #fff !important;
          border-radius: 8px;
        }
        .cms-menu .ant-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
          color: #fff !important;
          border-radius: 8px;
        }
      `}</style>
    </Layout>
  );
};

export default DashboardLayout;
