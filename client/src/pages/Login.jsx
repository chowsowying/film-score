import React, { useEffect } from "react";
import { Button, Form, message } from "antd";
import { Link } from "react-router-dom";
import { LoginUser } from "../api/user";
import { useNavigate } from "react-router-dom";
import { antDValidationError } from "../helpers/helper";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/loaderSlice";

const Login = () => {
  // Variables
  const naviagte = useNavigate();
  const dispatch = useDispatch();

  // Handlers
  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      const response = await LoginUser(values);
      dispatch(setLoading(false));
      // Save token to local storage
      localStorage.setItem("token", response.data);
      message.success(response.message);
      naviagte("/");
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Effects
  useEffect(() => {
    if (localStorage.getItem("token")) {
      naviagte("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 md:h-[600px] bg-white rounded-lg shadow-lg m-5">
        {/* Left Div */}
        <div className="bg-primary flex flex-col items-center justify-center p-5 m-5 rounded-lg">
          <h1 className="text-7xl text-white font-semibold">FILM SCORE</h1>
          <span className="text-xl text-gray-300 mt-2">
            Unlock the Power of Movie Ratings and Reviews!
          </span>
        </div>
        {/* Right Div */}
        <div className="flex items-center justify-center p-5">
          <div className="w-[500px]">
            <h1 className="text-2xl mb-2">Login To your Account</h1>
            <hr />
            <Form
              layout="vertical"
              className="flex flex-col gap-5 mt-3"
              onFinish={onFinish}
            >
              <Form.Item label="Email" name="email" rules={antDValidationError}>
                <input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={antDValidationError}
              >
                <input type="password" />
              </Form.Item>
              <div className="flex flex-col gap-5">
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
                <span>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-bold">
                    Register
                  </Link>
                </span>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
