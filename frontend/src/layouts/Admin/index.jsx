import {
  BellFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./admin-layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faBarsProgress,
  faArrowsRotate,
  faChartSimple,
  faShield,
  faPersonWalkingArrowLoopLeft,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" style={{ background: '#001529' }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ background: '#001529', borderRight: 0 }}
          items={[
            {
              key: "1",
              icon: <FontAwesomeIcon icon={faHotel} style={{ color: '#fff' }} />,
              label: "Trang chủ",
              children: [
                { key: '17', label: 'Quản lý bán hàng', onClick: () => navigate('/admin/pos') },
                { key: '18', label: 'Quản lý đơn hàng', onClick: () => navigate('/admin/pos/orderManagement') },
              ],
            },
            {
              key: "2",
              icon: <FontAwesomeIcon icon={faBarsProgress} style={{ color: '#fff' }} />,
              label: "Quản lý",
              children: [
                { key: "3", label: "Quản lý Sản Phẩm", onClick: () => navigate("/admin/productsList") },
                { key: "4", label: "Quản lý Thuộc tính", onClick: () => navigate("/admin/attributes") },
                { key: "5", label: "Quản lý màu sắc", onClick: () => navigate("/admin/productColorList") },
                { key: "6", label: "Quản lý Vật liệu", onClick: () => navigate("/admin/mmaterialList") },
                { key: "7", label: "Quản lý nhân viên", onClick: () => navigate("/admin/employeeList") },
                { key: "8", label: "Quản lý khách hàng", onClick: () => navigate("/admin/customersList") },
                { key: "9", label: "Hóa đơn", onClick: () => navigate("") },
              ],
            },
            {
              key: "10",
              icon: <FontAwesomeIcon icon={faArrowsRotate} style={{ color: '#fff' }} />,
              label: "Giao ca",
              children: [
                { key: "11", label: "Giao ca", onClick: () => navigate("") },
                { key: "12", label: "Lịch sử giao ca", onClick: () => navigate("") },
              ],
            },
            {
              key: "13",
              icon: <FontAwesomeIcon icon={faChartSimple} style={{ color: '#fff' }} />,
              label: "Thống kê",
              onClick: () => navigate("/admin/stats"),
            },
            {
              key: "14",
              icon: <FontAwesomeIcon icon={faShield} style={{ color: '#fff' }} />,
              label: "Phân quyền",
              onClick: () => navigate(""),
            },
            {
              key: "15",
              icon: <FontAwesomeIcon icon={faPersonWalkingArrowLoopLeft} style={{ color: '#fff' }} />,
              label: "Lịch sử truy cập",
              onClick: () => navigate(""),
            },
            {
              key: "16",
              icon: <FontAwesomeIcon icon={faRightFromBracket} style={{ color: '#fff' }} />,
              label: "Đăng xuất",
              onClick: () => navigate(""),
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '18px', color: '#1890ff' },
            })}
          </div>
          <div className="header-right">
            <span className="text-gray-700 font-semibold mr-4">Xin chào !</span>
            <BellFilled
              className="trigger"
              style={{ fontSize: '18px', color: '#1890ff', cursor: 'pointer' }}
            />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "16px",
            padding: 24,
            minHeight: 280,
            maxHeight: "calc(100vh - 112px)",
            overflowY: "auto",
            background: "#f0f2f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;