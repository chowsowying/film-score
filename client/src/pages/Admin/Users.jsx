import React, { useState, useEffect } from "react";
import { Button, Switch, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { GetAllUsers, UpdateUser } from "../../api/user";
import { getDateFormat, getDateTimeFormat } from "../../helpers/helper";

const Users = () => {
  // States
  const [users, setUsers] = useState([]);
  // Variables
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handlers
  const getUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllUsers();
      setUsers(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const updateUser = async (user) => {
    try {
      dispatch(setLoading(true));
      const response = await UpdateUser(user);
      message.success(response.message);
      getUsers(); // Fetch the updated list of users
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  // Effects
  useEffect(() => {
    getUsers();
  }, []);

  // Table Columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateTimeFormat(text),
    },
    {
      title: "is Admin",
      dataIndex: "isAdmin",
      render: (text, user) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...user, isAdmin: checked })}
        />
      ),
    },
    {
      title: "is Active",
      dataIndex: "isActive",
      render: (text, user) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...user, isActive: checked })}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="table-responsive">
        <Table dataSource={users} columns={columns} />
      </div>
    </div>
  );
};

export default Users;
