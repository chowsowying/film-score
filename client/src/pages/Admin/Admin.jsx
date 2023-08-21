import { Tabs } from "antd";
import React from "react";
import Movies from "./Movies/Movies";
import Artists from "./Artists/Artists";
import Users from "./Users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  // States
  const [activeTab, setActiveTab] = React.useState("1");

  // Variables
  const navigate = useNavigate();
  // Get user from redux store
  const { user } = useSelector((state) => state.user);
  return (
    <div>
      {user?.isAdmin ? (
        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            navigate(`/admin?tab=${key}`);
          }}
        >
          <Tabs.TabPane tab="Movies" key="1">
            <Movies />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Artists" key="2">
            <Artists />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Users" key="3">
            <Users />
          </Tabs.TabPane>
        </Tabs>
      ) : (
        <div>
          <div className="text-gray-600 text-md text-center mt-20">
            You are not authorised to view this page
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
