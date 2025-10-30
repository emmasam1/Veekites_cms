import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  message,
  Row,
  Col,
  Skeleton,
  Empty,
  Form,
  Input,
  Upload,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import axios from "axios";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { BASE_URL, token } = useApp();

  // ✅ Fetch projects
  const getAllProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/projects`);
      setProjects(res?.data?.projects || []);
    } catch (error) {
      console.error(error);
      messageApi.error(
        error.response?.data?.message || "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  // ✅ Create or Update project
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (key === "mainImage" && values.mainImage?.length > 0) {
          const file = values.mainImage[0];
          if (file.originFileObj) {
            formData.append("mainImage", file.originFileObj);
          }
        } else if (key === "gallery" && values.gallery?.length > 0) {
          values.gallery.forEach((file) => {
            if (file.originFileObj) formData.append("gallery", file.originFileObj);
          });
        } else {
          formData.append(key, values[key]);
        }
      }

      if (editingProject) {
        // Update
        await axios.put(
          `${BASE_URL}/api/projects/${editingProject._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Project updated successfully");
      } else {
        // Create new
        await axios.post(`${BASE_URL}/api/projects`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Project created successfully");
      }

      form.resetFields();
      setOpen(false);
      setEditingProject(null);
      getAllProjects();
    } catch (error) {
      message.error("Failed to save project");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle edit — populate fields
  const handleEdit = (project) => {
    setEditingProject(project);
    setOpen(true);

    const mainImage = project.mainImage
      ? [
          {
            uid: "-1",
            name: "main.jpg",
            status: "done",
            url: project.mainImage.url || project.mainImage,
          },
        ]
      : [];

    const gallery = project.gallery
      ? project.gallery.map((img, i) => ({
          uid: `${i}`,
          name: `gallery-${i + 1}.jpg`,
          status: "done",
          url: img.url || img,
        }))
      : [];

    form.setFieldsValue({
      title: project.title,
      client: project.client,
      location: project.location,
      area: project.area,
      year: project.year,
      sector: project.sector,
      description: project.description,
      mainImage,
      gallery,
      isLatest: project.isLatest,
    });
  };

  // ✅ Handle view
  const handleView = (project) => {
    navigate(`/admin/dashboard/projects/${project._id}`, { state: project });
  };

  // ✅ Handle delete
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this project?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`${BASE_URL}/api/projects/${id}`);
          setProjects((prev) => prev.filter((p) => p._id !== id));
          message.success("Project deleted successfully");
        } catch (error) {
          message.error("Failed to delete project");
        }
      },
    });
  };

  return (
    <div>
      {contextHolder}

      {/* Header */}
      <div className="flex justify-end mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProject(null);
            form.resetFields();
            setOpen(true);
          }}
          className="!bg-[#8B1E3F]"
        >
          Create Project
        </Button>
      </div>

      {/* Project Grid */}
      {loading ? (
        <Row gutter={[16, 16]}>
          {[...Array(4)].map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </Col>
          ))}
        </Row>
      ) : projects.length === 0 ? (
        <Empty description="No projects found" />
      ) : (
        <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col key={project._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={project.title}
                    src={
                      project.mainImage?.url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    className="h-40 w-full object-cover"
                  />
                }
                className="!rounded-none shadow-sm"
                actions={[
                  <EyeOutlined
                    key="view"
                    onClick={() => handleView(project)}
                    className="text-green-500"
                  />,
                  <EditOutlined
                    key="edit"
                    onClick={() => handleEdit(project)}
                    className="text-blue-500"
                  />,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500"
                  />,
                ]}
              >
                <Card.Meta
                  className="!p-0"
                  title={<span className="font-semibold">{project.title}</span>}
                  description={
                    <p className="text-gray-600 text-sm">
                      {project.description?.length > 80
                        ? project.description.slice(0, 80) + "..."
                        : project.description || "No description available."}
                    </p>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ✅ Create/Edit Project Modal */}
      <Modal
        title={editingProject ? "Edit Project" : "Create New Project"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingProject(null);
        }}
        okText={editingProject ? "Update" : "Create"}
        cancelText="Cancel"
        okButtonProps={{
          className: "!bg-[#8B1E3F] hover:!bg-[#a22b50] text-white",
        }}
        onOk={() => form.submit()}
        width={650}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Project Title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="Enter project title" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="client"
                label="Client"
                rules={[{ required: true, message: "Please enter client name" }]}
              >
                <Input placeholder="Enter client name" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="area" label="Area">
                <Input placeholder="Enter area (optional)" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="year" label="Year">
                <Input placeholder="Enter project year" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="sector" label="Sector">
                <Input placeholder="Enter sector" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} placeholder="Enter project description" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="mainImage"
                label="Main Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload Main Image</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="gallery"
                label="Gallery (Max 5 images)"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload
                  listType="picture-card"
                  multiple
                  maxCount={5}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="isLatest"
                label="Is Latest Project?"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Project;
