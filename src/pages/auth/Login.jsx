import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { BASE_URL, saveToken } = useApp(); // ✅ fixed
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, values);

      // ✅ Save token in context (and sessionStorage automatically)
      const token = res?.data?.token || res?.data?.accessToken;
      if (token) {
        saveToken(token);
        messageApi.success(res?.data?.message || "Login successful!");
        navigate("/admin/dashboard");
      } else {
        messageApi.error("No token received. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      messageApi.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-no-repeat bg-cover bg-center bg-[url(/src/assets/background.jpg)]">
      {contextHolder}
      <div className="h-screen w-full bg-[#00000078] flex items-center justify-center">
        <Card className="w-[80%] sm:w-[350px] shadow-2xl rounded-2xl">
          <h1 className="font-bold text-3xl text-center">Welcome Back!</h1>
          <p className="text-center text-lg py-4">
            Veekites Global Services Limited
          </p>

          {/* ✅ Correct event */}
          <Form layout="vertical" onFinish={onFinish}>
            {/* Email */}
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input placeholder="Enter your email" size="large" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" size="large" />
            </Form.Item>

            {/* Login Button */}
            <div className="flex justify-end !mt-4">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="!rounded-md !px-6 !bg-[#51102F]"
                  size="medium"
                  loading={loading}
                >
                  Login
                  <MdOutlineArrowRightAlt className="!w-6 h-3" />
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
