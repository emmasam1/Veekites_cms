import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Card, Image, Button, Row, Col, Skeleton, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import axios from "axios";

const ProjectDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { BASE_URL } = useApp();
  const [project, setProject] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !BASE_URL) {
        console.warn("Missing project ID or BASE_URL");
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/projects/${id}`);
        setProject(res.data.project);
      } catch (error) {
        console.error(error);
        messageApi.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    // Fetch only if not passed via state (i.e., direct reload)
    if (!state) {
      fetchProject();
    }
  }, [id, state, BASE_URL]);

  return (
    <div className="p-6">
      {contextHolder}

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Back
      </Button>

      {loading ? (
        // 🔹 Skeleton Loader
        <Card className="rounded-lg shadow-md">
          <div className="w-full h-64 mb-4 overflow-hidden rounded-md">
            <Skeleton.Image active className="!w-full !h-full" />
          </div>
          <Skeleton active paragraph={{ rows: 6 }} className="mt-6" />
        </Card>
      ) : !project ? (
        // 🔹 No project found
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">No project details available.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      ) : (
        // 🔹 Actual Project Details
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            title={<h2 className="text-2xl font-semibold">{project.title}</h2>}
            cover={
              <img
                alt={project.title}
                src={
                  project.mainImage?.url ||
                  project.banner ||
                  "https://via.placeholder.com/800x400?text=No+Image"
                }
                className="w-full h-64 object-cover rounded-t-lg"
              />
            }
            className="rounded-lg shadow-md"
          >
            {/* 🔹 Description */}
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {project.description || project.content}
            </p>

            {/* 🔹 Gallery */}
            {project.gallery?.filter(Boolean)?.length > 0 && (
              <>
                <h3 className="mt-6 mb-3 text-xl font-semibold">Gallery</h3>
                <Row gutter={[16, 16]}>
                  {project.gallery
                    .filter(Boolean)
                    .map((img, index) => (
                      <Col key={index} xs={12} sm={8} md={6}>
                        <div className="w-full h-48 rounded-md overflow-hidden">
                          <Image
                            src={img.url || img}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                            preview={{
                              maskClassName: "rounded-md",
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                </Row>
              </>
            )}

            {/* 🔹 Extra Info */}
            <div className="mt-6 text-gray-600 space-y-1">
              {project.client && (
                <p>
                  <strong>Client:</strong> {project.client}
                </p>
              )}
              {project.location && (
                <p>
                  <strong>Location:</strong> {project.location}
                </p>
              )}
              {project.year && (
                <p>
                  <strong>Year:</strong> {project.year}
                </p>
              )}
              {project.sector && (
                <p>
                  <strong>Sector:</strong> {project.sector}
                </p>
              )}
              {project.area && (
                <p>
                  <strong>Area:</strong> {project.area}
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectDetails;
