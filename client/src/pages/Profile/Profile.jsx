import React from "react";
import { Tabs } from "antd";
import UserReviews from "./UserReviews";
import UserInfo from "./UserInfo";

const Profile = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Reviews" key="1">
          <UserReviews />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Profile" key="2">
          <UserInfo />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;
