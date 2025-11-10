import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Skeleton,
  Popconfirm
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  // Popconfirm
} from "@ant-design/icons";
import { useApp } from "../../context/AppContext";
import axios from "axios";

const Team = () => {
  const [loading, setLoading] = useState(false);
  const { BASE_URL, token } = useApp();
  const [team, setTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // ✅ Fetch all team members
  const getTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(res?.data?.data || []);
      messageApi.success("Team loaded successfully!");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  // ✅ Add or Update Team Member
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("role", values.role);
      formData.append("email", values.email);

      const file = values.image?.[0];
      if (file && file.originFileObj) {
        formData.append("image", file.originFileObj);
      }

      if (editingMember) {
        // Update existing member
        const res = await axios.patch(
          `${BASE_URL}/api/team/${editingMember.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setTeam((prev) =>
          prev.map((m) => (m.id === editingMember.id ? res.data.data : m))
        );
        messageApi.success("Team member updated successfully!");
      } else {
        // Create new member
        const res = await axios.post(`${BASE_URL}/api/team`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setTeam((prev) => [res.data.data, ...prev]);
        messageApi.success("Team member added successfully!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingMember(null);
    } catch (error) {
      console.error(error);
      messageApi.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Member
  const handleEdit = (member) => {
    setEditingMember(member);
    form.setFieldsValue({
      name: member.name,
      role: member.role,
      email: member.email,
      image: member.image
        ? [
            {
              uid: "-1",
              name: "current-image.jpg",
              status: "done",
              url: member.image?.url || member.image,
            },
          ]
        : [],
    });
    setIsModalOpen(true);
  };

  // ✅ Delete Member
   const handleDelete = async (id) => {
      setLoading(true);
     try {
          setLoading(true);
          await axios.delete(`${BASE_URL}/api/team/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTeam((prev) => prev.filter((m) => m.id !== id));
          messageApi.success("Member deleted successfully!");
          getTeam()
        } catch (error) {
          console.error(error);
          messageApi.error(
            error.response?.data?.message || "Failed to delete member"
          );
        } finally {
          setLoading(false);
        }
    };

  // ✅ View Member
  const handleView = (member) => setViewingMember(member);

  // ✅ Cancel Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    form.resetFields();
  };

  return (
    <div>
      {contextHolder}

      {/* Add Team Button */}
      <div className="flex justify-end mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="!bg-[#8B1E3F]"
        >
          Add Team
        </Button>
      </div>

      {/* Team Cards */}
      <Row gutter={[24, 24]} justify="start">
        {loading ? (
          <Skeleton active />
        ) : team.length === 0 ? (
          <p className="text-gray-500">No team members found</p>
        ) : (
          team.map((member) => (
            <Col key={member.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                bordered={false}
                className="text-center rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg"
                actions={[
                  <EyeOutlined
                    key="view"
                    onClick={() => handleView(member)}
                    className="text-gray-500 hover:text-blue-500"
                  />,
                  <EditOutlined
                    key="edit"
                    onClick={() => handleEdit(member)}
                    className="text-blue-500"
                  />,
                   <Popconfirm
                    title="Delete this project?"
                    description="This action cannot be undone."
                    okText="Yes, delete"
                    okType="danger"
                    cancelText="Cancel"
                    okButtonProps={{
                      danger: true,
                      loading: loading, // ✅ show spinner when deleting
                    }}
                    onConfirm={() => handleDelete(member._id)}
                  >
                    <DeleteOutlined />
                  </Popconfirm>,,
                ]}
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full border-[5px] border-[#8B1E3F] overflow-hidden mb-4">
                    <img
                      src={
                        member.image?.url
                          ? member.image.url
                          : member.image || "https://via.placeholder.com/150"
                      }
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-[#8B1E3F] font-medium">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
        okText={editingMember ? "Update" : "Create"}
        okButtonProps={{ className: "!bg-[#8B1E3F]" }}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter member name" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please enter role" }]}
          >
            <Input placeholder="Enter member role" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[
              { required: !editingMember, message: "Please upload an image" },
            ]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
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
        title={viewingMember?.name}
        open={!!viewingMember}
        footer={null}
        onCancel={() => setViewingMember(null)}
        width={500}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-36 h-36 rounded-full border-[5px] border-[#8B1E3F] overflow-hidden mb-4">
            <img
              src={
                viewingMember?.image?.url
                  ? viewingMember.image.url
                  : viewingMember?.image || "https://via.placeholder.com/150"
              }
              alt={viewingMember?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            {viewingMember?.name}
          </h3>
          <p className="text-[#8B1E3F] font-medium">{viewingMember?.role}</p>
          <p className="text-gray-500">{viewingMember?.email}</p>
        </div>
      </Modal>
    </div>
  );
};

export default Team;
