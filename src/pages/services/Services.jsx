import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Input, Form, Upload, message, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  // ✅ Simulate data fetch (you can replace this with your API call)
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        title: "Web Development",
        content:
          "We build scalable and user-friendly websites using the latest web technologies.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      },
      {
        id: 2,
        title: "Mobile App Development",
        content:
          "We craft mobile experiences that delight users and deliver business value.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      },
      {
        id: 3,
        title: "Cloud Solutions",
        content:
          "Leverage cloud computing to scale your operations with reliability and efficiency.",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      },
      {
        id: 4,
        title: "UI/UX Design",
        content:
          "Our creative designers ensure your brand stands out with intuitive and elegant designs.",
        image: "https://images.unsplash.com/photo-1507209696998-3c532be9b2b4",
      },
    ];
    setServices(dummyData);
  }, []);

  // ✅ Handle create or update
  const handleOk = () => {
    form.validateFields().then((values) => {
      const newService = {
        ...values,
        id: editingService ? editingService.id : Date.now(),
        image:
          values.image?.file?.thumbUrl ||
          editingService?.image ||
          "https://via.placeholder.com/300x200?text=Service+Image",
      };

      if (editingService) {
        // Update service
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? newService : s))
        );
        message.success("Service updated successfully!");
      } else {
        // Add new service
        setServices((prev) => [...prev, newService]);
        message.success("Service created successfully!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingService(null);
    });
  };

  // ✅ Delete a service
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this service?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setServices((prev) => prev.filter((s) => s.id !== id));
        message.success("Service deleted!");
      },
    });
  };

  // ✅ Edit service
  const handleEdit = (service) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setIsModalOpen(true);
  };

  // ✅ Modal close
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-end items-center mb-6">
        {/* <h1 className="text-xl font-semibold text-[#8B1E3F]">Services</h1> */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="!bg-[#8B1E3F]"
        >
          Create Service
        </Button>
      </div>

      {/* Services Grid */}
      <Row gutter={[16, 16]}>
        {services.map((service) => (
          <Col key={service.id} xs={24} sm={12} md={12} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt={service.title}
                  src={service.image}
                  className="h-40 w-full object-cover"
                />
              }
              className="rounded-lg shadow-sm"
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => handleEdit(service)}
                  className="text-blue-500"
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDelete(service.id)}
                  className="text-red-500"
                />,
              ]}
            >
              <Card.Meta
                title={<span className="font-semibold">{service.title}</span>}
                description={
                  <p className="text-gray-600 text-sm">
                    {service.content.length > 80
                      ? service.content.slice(0, 80) + "..."
                      : service.content}
                  </p>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Create/Edit */}
      <Modal
        title={editingService ? "Edit Service" : "Create Service"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingService ? "Update" : "Create"}
        okButtonProps={{ className: "!bg-[#8B1E3F]" }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Service title" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <TextArea rows={4} placeholder="Describe the service" />
          </Form.Item>

          <Form.Item label="Image" name="image">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
