import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Input,
  Form,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  // ✅ Dummy data (replace with API call)
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        title: "Corporate Website",
        content:
          "We develop modern, SEO-friendly corporate websites that align with your brand identity and goals.",
        banner:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        gallery: [
          "https://images.unsplash.com/photo-1518770660439-4636190af475",
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        ],
      },
      {
        id: 2,
        title: "Mobile App Development",
        content:
          "We build mobile apps that drive engagement and offer exceptional performance across devices.",
        banner:
          "https://images.unsplash.com/photo-1507209696998-3c532be9b2b4",
        gallery: [
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        ],
      },
    ];
    setProjects(dummyData);
  }, []);

  // ✅ Create / Update handler
  const handleOk = () => {
    form.validateFields().then((values) => {
      const newProject = {
        ...values,
        id: editingProject ? editingProject.id : Date.now(),
        banner:
          values.banner?.file?.thumbUrl ||
          editingProject?.banner ||
          "https://via.placeholder.com/300x200?text=Project+Banner",
        gallery:
          values.gallery?.fileList?.map((file) => file.thumbUrl) ||
          editingProject?.gallery ||
          [],
      };

      if (editingProject) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? newProject : p))
        );
        message.success("Project updated successfully!");
      } else {
        setProjects((prev) => [...prev, newProject]);
        message.success("Project created successfully!");
      }

      setIsModalOpen(false);
      setEditingProject(null);
      form.resetFields();
    });
  };

  // ✅ Delete project
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this project?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        message.success("Project deleted!");
      },
    });
  };

  // ✅ Edit project
  const handleEdit = (project) => {
    setEditingProject(project);
    form.setFieldsValue({
      title: project.title,
      content: project.content,
      banner: project.banner
        ? [
            {
              uid: "-1",
              name: "banner.png",
              status: "done",
              url: project.banner,
            },
          ]
        : [],
      gallery: project.gallery
        ? project.gallery.map((url, i) => ({
            uid: `${i}`,
            name: `gallery-${i}.png`,
            status: "done",
            url,
          }))
        : [],
    });
    setIsModalOpen(true);
  };

  // ✅ Cancel modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    form.resetFields();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-end mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="!bg-[#8B1E3F]"
        >
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      <Row gutter={[16, 16]}>
        {projects.map((project) => (
          <Col key={project.id} xs={24} sm={12} md={12} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt={project.title}
                  src={project.banner}
                  className="h-40 w-full object-cover"
                />
              }
              className="rounded-lg shadow-sm"
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => handleEdit(project)}
                  className="text-blue-500"
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500"
                />,
              ]}
            >
              <Card.Meta
                title={<span className="font-semibold">{project.title}</span>}
                description={
                  <p className="text-gray-600 text-sm">
                    {project.content.length > 80
                      ? project.content.slice(0, 80) + "..."
                      : project.content}
                  </p>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Create/Edit */}
      <Modal
        title={editingProject ? "Edit Project" : "Create Project"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingProject ? "Update" : "Create"}
        okButtonProps={{ className: "!bg-[#8B1E3F]" }}
        width={700}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a project title" }]}
          >
            <Input placeholder="Project title" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter project content" }]}
          >
            <TextArea rows={4} placeholder="Describe the project" />
          </Form.Item>

          {/* Banner Image */}
          <Form.Item label="Project Banner" name="banner">
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Banner</Button>
            </Upload>
          </Form.Item>

          {/* Gallery Images */}
          <Form.Item label="Project Gallery" name="gallery">
            <Upload
              listType="picture-card"
              multiple
              maxCount={5}
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload (max 5)</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Project;
