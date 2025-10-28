import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = () => {
    navigate("/admin/dashboard");
  };


  return (
    <div className="h-screen w-full bg-no-repeat bg-cover bg-center bg-[url(/src/assets/background.jpg)]">
      <div className="h-screen w-full bg-[#00000078] flex items-center justify-center">
        <Card className="w-[80%] sm:w-[350px] shadow-2xl rounded-2xl">
          <h1 className="font-bold text-3xl text-center">Welcome Back!</h1>
          <p className="text-center text-lg py-4">
            Veekites Global Services Limited
          </p>

          <Form layout="vertical">
            {/* Email */}
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                // prefix={<MailOutlined className="text-gray-500" />}
                placeholder="Enter your email"
                size="large"
              />
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
                  className="!rounded-mg !px-6 !bg-[#51102F]"
                  size="medium"
                  onClick={onFinish}
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
