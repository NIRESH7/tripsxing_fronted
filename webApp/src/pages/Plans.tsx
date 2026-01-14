/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  message,
  Switch,
  InputNumber,
  Select,
} from "antd";
import { GetPlan } from "@/hooks/GetHooks";
import { SaveMutation } from "@/hooks/MutationHooks";
import { route } from "@/routes/routes";
import { DeleteOutlined } from "@ant-design/icons";
import { DeleteApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";
import { queryClient } from "@/hooks/Hooks";
import { useCurrentUserData } from "@/utils/state";
import { UserData } from "@/interfaces/interfaces";
const { Title, Text } = Typography;

export interface Plan {
  id?: number;
  name: string;
  description: string;
  benefits: string[];
  color: string;
  validity: string;
  price: string;
  titleDescription: string;
  renewal: string;
  status?: string;
}

const Plans: React.FC = () => {
  const { data: plans } = GetPlan<Plan[]>();
  const [id, setId] = useState(0);

  const planValidityOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "biMonthly", label: "Bi-Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "halfYearly", label: "Half-Yearly" },
    { value: "yearly", label: "Yearly" },
    { value: "biYearly", label: "Bi-Yearly" },
    { value: "triYearly", label: "Tri-Yearly" },
    { value: "lifeTime", label: "Life Time" },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const UserID = useCurrentUserData(
    (state) =>
      (
        state as {
          CurrentUserData: UserData;
        }
      ).CurrentUserData.id
  );

  const handleCreateClick = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCardClick = (plan: Plan) => {
    console.log("plan", plan);
    setId(plan.id || 0);

    setIsEditing(true);
    // setCurrentPlan(plan);
    form.setFieldsValue({
      ...plan, // Spread the plan object to fill other fields
      active: plan.status === "active", // Convert status to boolean for the toggle
    });
    setIsModalVisible(true);
  };

  const routeTemp = () => {
    if (isEditing) {
      // console.log('routeKeyEdit', route.backend[routeKeyEdit] + `/${id}`);

      return route.backend.updatePlan + `/${id}`;
    } else {
      return route.backend.createPlan;
    }
  };

  const { mutate: saveDataEdit } = SaveMutation({
    mutationKey: ["createPlan"],
    queryKeyToInvalidate: ["Plans"],
    getSuccessMessage: (variables: any) =>
      `Plan ${variables.id ? "updated" : "created"} successfully`,
    getErrorMessage: (error: any) =>
      `Failed to ${error.id ? "update" : "create"} stay: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: routeTemp(),
    isUpdate: isEditing,
  });

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditing) {
          // setPlans(plans.map(plan => (plan.name === currentPlan.name ? values : plan)));
          console.log("Edit", values);
          const editData = {
            name: values.name,
            description: values.description,
            benefits: values.benefits,
            validity: values.validity,
            titleDescription: values.titleDescription,
            renewal: values.renewal,
            price: values.price,
            planDate: new Date().toISOString(),
            status: values.active ? "active" : "inactive",
            userId: UserID,
          };
          saveDataEdit(editData, {
            onSuccess: (response) => {
              console.log("response", response);

              if (response.statusCode === 200) {
                message.success("Plan updated successfully!");
                form.resetFields();
                setIsModalVisible(false);
              } else {
                message.error("Failed to save Plan");
                setIsModalVisible(false);
              }
            },
          });
        } else {
          // setPlans([...plans, values]);
          console.log(values);
          const data = {
            name: values.name,
            description: values.description,
            benefits: values.benefits,
            validity: values.validity,
            titleDescription: values.titleDescription,
            renewal: values.renewal,
            planDate: new Date().toISOString(),
            price: values.price,
            userId: UserID,
          };
          saveDataEdit(data, {
            onSuccess: (response) => {
              console.log("response", response);

              if (response.statusCode === 200) {
                message.success("Plan saved successfully!");
                form.resetFields();
                setIsModalVisible(false);
              } else {
                message.error("Failed to save Plan");
                setIsModalVisible(false);
              }
            },
          });
        }
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
        message.error(
          "Validation failed. Please check the form fields and try again."
        );
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  console.log("plans", plans);

  const handleDeletePlan = async (id: number) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const data = await DeleteApiCustomerRoutes(route.backend.deletePlan, {
        userId: UserID,
        id: id,
      });
      if (data.statusCode === 200) {
        message.success("plan deleted successfully");
        const data = await queryClient.invalidateQueries({
          queryKey: ["Plans"],
        });

        console.log(
          "data",
          queryClient.getQueriesData({
            queryKey: ["Plans"],
          })
        );

        console.log("data", data);
      } else {
        message.error({
          content: data.message,
          key: "updatable",
          duration: 2,
        });
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="primary"
        style={{ marginBottom: "20px" }}
        onClick={handleCreateClick}
      >
        Create Plan
      </Button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          cursor: "pointer",
        }}
      >
        {plans?.map((plan, index) => (
          <div
            key={index}
            style={{ position: "relative", width: "350px" }}
            className="group"
          >
            {/* Delete Icon */}
            <Button
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering card click
                if (plan.id !== undefined) {
                  handleDeletePlan(plan.id); // Call delete function
                } // Call delete function
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow transform scale-0 group-hover:scale-100 transition-transform duration-200 hover:bg-red-700 flex items-center justify-center"
              style={{ zIndex: 10 }}
            />

            <Card
              style={{
                width: "100%",
                border: `2px solid #FF5733`, // Outline color
                borderRadius: "15px",
                boxShadow: "0 6px 12px rgba(255, 87, 51, 0.3)",
                padding: "20px",
                background: "#fff", // White background
              }}
              bodyStyle={{ padding: 0 }}
              onClick={() => handleCardClick(plan)}
            >
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <Title level={4} style={{ margin: 0, color: "#333" }}>
                  {plan.name}
                </Title>
              </div>
              {plan.titleDescription && (
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    color: "#555",
                  }}
                >
                  {plan.titleDescription}
                </Text>
              )}
              <Text
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                {plan.description}
              </Text>
              <Text
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                <strong>Benefit:</strong> {plan.benefits}
              </Text>
              <Text
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                <strong>Renewal:</strong> {plan.renewal}
              </Text>
              <Text
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                <strong>Validity:</strong> {plan.validity}
              </Text>
              <Text
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                <strong>Price:</strong> {plan.price}
              </Text>
              <Text
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                <strong>Status:</strong> {plan.status}
              </Text>
            </Card>
          </div>
        ))}
      </div>

      <Modal
        title={isEditing ? "Edit Plan" : "Create Plan"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEditing ? "Save" : "Create"}
        cancelText="Close"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="titleDescription"
            label="Title Description"
          // rules={[{ required: true, message: 'Please input the renewal period!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="benefits"
            label="Benefits"
            rules={[{ required: true, message: "Please input the Benefits!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="renewal"
            label="Renewal"
            rules={[
              { required: true, message: "Please input the renewal period!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="validity"
            label="Validity"
            rules={[{ required: true, message: "Please input the Validty" }]}
          >
            <Select options={planValidityOptions} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the Price" }]}
          >
            <InputNumber />
          </Form.Item>
          {isEditing && (
            <Form.Item name="active" label="Active" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Plans;
