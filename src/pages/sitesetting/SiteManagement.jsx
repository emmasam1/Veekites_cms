import React from "react";
import { Tabs, Form, Input, Upload, Button, message } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  ProjectOutlined,
  InfoCircleOutlined,
  ReadOutlined,
  MessageOutlined,
  SettingOutlined,
  PictureOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const SiteManagement = () => {
  const handleSave = (section) => {
    message.success(`${section} content saved successfully`);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      message.success(`${file.name} selected`);
      return false; // prevent auto upload
    },
  };

  const tabItems = [
    {
      key: "1",
      label: <span><HomeOutlined /> Homepage</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("Homepage")}>
          <Form.Item label="Hero Title" name="heroTitle">
            <Input placeholder="Enter homepage title" />
          </Form.Item>
          <Form.Item label="Hero Description" name="heroDesc">
            <TextArea rows={3} placeholder="Enter short homepage description" />
          </Form.Item>
          <Form.Item label="Hero Image">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Changes</Button>
        </Form>
      ),
    },
    {
      key: "2",
      label: <span><AppstoreOutlined /> Services</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("Services")}>
          <Form.Item label="Service Title" name="serviceTitle">
            <Input placeholder="Enter service title" />
          </Form.Item>
          <Form.Item label="Service Description" name="serviceDesc">
            <TextArea rows={3} placeholder="Enter service description" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Changes</Button>
        </Form>
      ),
    },
    {
      key: "3",
      label: <span><ProjectOutlined /> Projects</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("Projects")}>
          <Form.Item label="Project Name" name="projectName">
            <Input placeholder="Enter project name" />
          </Form.Item>
          <Form.Item label="Project Description" name="projectDesc">
            <TextArea rows={3} placeholder="Enter project details" />
          </Form.Item>
          <Form.Item label="Project Image">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Changes</Button>
        </Form>
      ),
    },
    {
      key: "4",
      label: <span><InfoCircleOutlined /> About</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("About Us")}>
          <Form.Item label="About Title" name="aboutTitle">
            <Input placeholder="Enter about title" />
          </Form.Item>
          <Form.Item label="About Content" name="aboutContent">
            <TextArea rows={4} placeholder="Write about the company" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Changes</Button>
        </Form>
      ),
    },
    {
      key: "5",
      label: <span><ReadOutlined /> News</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("News")}>
          <Form.Item label="News Title" name="newsTitle">
            <Input placeholder="Enter news headline" />
          </Form.Item>
          <Form.Item label="News Content" name="newsContent">
            <TextArea rows={4} placeholder="Enter news content" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Publish</Button>
        </Form>
      ),
    },
    {
      key: "6",
      label: <span><MessageOutlined /> Testimonials</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("Testimonials")}>
          <Form.Item label="Client Name" name="clientName">
            <Input placeholder="Enter client name" />
          </Form.Item>
          <Form.Item label="Feedback" name="feedback">
            <TextArea rows={3} placeholder="Enter testimonial text" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      ),
    },
    {
      key: "7",
      label: <span><SettingOutlined /> Contact Info</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("Contact Info")}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter contact email" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="Enter contact phone" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input placeholder="Enter office address" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Changes</Button>
        </Form>
      ),
    },
    {
      key: "8",
      label: <span><PictureOutlined /> Settings</span>,
      children: (
        <Form layout="vertical" onFinish={() => handleSave("Site Settings")}>
          <Form.Item label="Logo Upload">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Site Title" name="siteTitle">
            <Input placeholder="Enter site title" />
          </Form.Item>
          <Form.Item label="Meta Description" name="metaDesc">
            <TextArea rows={3} placeholder="Enter SEO description" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Settings</Button>
        </Form>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-[#8B1E3F] mb-4">Site Management</h2>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default SiteManagement;
