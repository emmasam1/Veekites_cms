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
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useApp } from "../../context/AppContext";
import axios from "axios";

const { TextArea } = Input;

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { BASE_URL, token } = useApp();

  // ✅ Fetch all services
  const getAllServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/services`);
      setServices(res.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  // ✅ Create / Update
  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);

      // ✅ handle image upload
      if (values.image && values.image.length > 0) {
        const fileObj = values.image[0].originFileObj;
        if (fileObj) formData.append("image", fileObj);
      } else if (!editingService) {
        messageApi.error("Please upload an image");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (editingService) {
        await axios.put(`${BASE_URL}/api/services/${editingService._id}`, formData, { headers });
        messageApi.success("Service updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/services`, formData, { headers });
        messageApi.success("Service created successfully");
      }

      setIsModalOpen(false);
      setEditingService(null);
      form.resetFields();
      getAllServices();
    } catch (error) {
      console.error(error);
      messageApi.error(error.response?.data?.message || "Failed to save service");
    }finally{
      setLoading(false)
    }
  };

  // ✅ Delete service
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this service?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await axios.delete(`${BASE_URL}/api/services/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          messageApi.success("Service deleted!");
          setServices((prev) => prev.filter((s) => s._id !== id));
        } catch {
          messageApi.error("Failed to delete service");
        }
      },
    });
  };

  // ✅ Edit service (populate form + preview)
  const handleEdit = (service) => {
    setEditingService(service);

    form.setFieldsValue({
      title: service.title,
      description: service.description,
      image: service.image
        ? [
            {
              uid: "-1",
              name: "existing-image.jpg",
              status: "done",
              url: service.image.url,
            },
          ]
        : [],
    });

    setIsModalOpen(true);
  };

  // ✅ View details
  const handleView = (service) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  // ✅ Cancel modal (reset form + preview)
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingService(null);
    form.resetFields();
  };

  return (
    <div className="">
      {contextHolder}
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

      {/* Grid */}
      <Row gutter={[16, 16]}>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <Skeleton active />
            </Col>
          ))
        ) : (
          services.map((service) => (
            <Col key={service._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={service.title}
                    src={service.image?.url || "https://via.placeholder.com/300x200"}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                }
                className="rounded-lg shadow-md"
                actions={[
                  <EyeOutlined
                    key="view"
                    onClick={() => handleView(service)}
                    className="text-gray-500 hover:text-blue-500"
                  />,
                  <EditOutlined
                    key="edit"
                    onClick={() => handleEdit(service)}
                    className="text-blue-500"
                  />,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDelete(service._id)}
                    className="text-red-500"
                  />,
                ]}
              >
                <Card.Meta
                  title={<span className="font-semibold">{service.title}</span>}
                  description={
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {service.description || "No description provided."}
                    </p>
                  }
                />
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Create/Edit Modal */}
      <Modal
        title={editingService ? "Edit Project" : "Create Project"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingService ? "Update" : "Create"}
        okButtonProps={{ className: "!bg-[#8B1E3F]", loading }}
        width={600}
      >
        <Form layout="vertical" form={form}>
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter project title" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} placeholder="Describe the project" />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item
            label="Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: !editingService, message: "Please upload an image" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              defaultFileList={
                editingService?.image
                  ? [
                      {
                        uid: "-1",
                        name: "existing-image.jpg",
                        status: "done",
                        url: editingService.image.url,
                      },
                    ]
                  : []
              }
            >
              <div>
                <UploadOutlined />
                <p>Upload</p>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={selectedService?.title}
        open={isViewModalOpen}
        footer={null}
        onCancel={() => setIsViewModalOpen(false)}
        width={700}
      >
        <div>
          <img
            src={selectedService?.image?.url}
            alt="main"
            className="w-full h-60 object-cover rounded-md mb-4"
          />
          <p className="text-gray-700 mb-2">{selectedService?.description}</p>
        </div>
      </Modal>
    </div>
  );
};

export default Services;
