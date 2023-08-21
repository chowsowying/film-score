import React, { useEffect } from "react";
import { Button, Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser, UpdateUser } from "../../api/user";
import { antDValidationError } from "../../helpers/helper";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { setUser } from "../../redux/userSlice";

const UserInfo = () => {
  // Variables
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // Handler
  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      const response = await UpdateUser({
        ...values,
        _id: user._id,
      });
      message.success(response.message);
      dispatch(setUser(response.data));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <Form
        layout="vertical"
        className="flex flex-col gap-5 mt-3 md:w-96"
        onFinish={onFinish}
        initialValues={{
          name: user.name,
          email: user.email,
        }}
      >
        <Form.Item label="Name" name="name" rules={antDValidationError}>
          <input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={antDValidationError}>
          <input />
        </Form.Item>
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={antDValidationError}
        >
          <input type="password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={antDValidationError}
        >
          <input type="password" />
        </Form.Item>
        <div className="flex flex-col gap-5">
          <Button type="primary" htmlType="submit" block>
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserInfo;
