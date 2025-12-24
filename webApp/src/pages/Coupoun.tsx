/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, message } from "antd";
import { GetCoupoun } from "@/hooks/GetHooks";
import { SaveMutation } from "@/hooks/MutationHooks";
import { route } from "@/routes/routes";
import moment from "moment";
import { queryClient } from "@/hooks/Hooks";
import { DeleteOutlined } from "@ant-design/icons";
import { DeleteApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";
import { useCurrentUserData } from "@/utils/state";
import { UserData } from "@/interfaces/interfaces";

export interface Coupoun {
  id: number;
  percentageDiscount: number;
  discount?: number;
  discountValue: string;
  expireDate: Date;
  isClaimed: boolean;
  code: string;
  createdDate: Date;
  name: string;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    userName: string;
  }[];
}
export default function Coupon() {
  const { data: coupounData } = GetCoupoun<Coupoun[]>();
  console.log("cou", coupounData);

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

  const { mutate: saveData } = SaveMutation({
    mutationKey: ["createCoupon"],
    queryKeyToInvalidate: ["coupouns"],
    getSuccessMessage: (variables: any) =>
      `Coupoun ${variables.id ? "updated" : "created"} successfully`,
    getErrorMessage: (error: any) =>
      `Failed to ${error.id ? "update" : "create"} stay: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.createCoupoun,
  });

  const { mutate: saveDataEdit } = SaveMutation({
    mutationKey: ["updateCoupon"],
    queryKeyToInvalidate: ["coupons"],
    getSuccessMessage: (variables: any) =>
      `Coupon ${variables.id ? "updated" : "created"} successfully`,
    getErrorMessage: (error: any) =>
      `Failed to ${error.id ? "update" : "create"} stay: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.updateCoupoun + `/${form.getFieldValue("id")}`,
    isUpdate: true,
  });

  const handleCouponClick = (coupon: Coupoun) => {
    console.log("Coupon clicked:", coupon);
    setIsEditing(true);
    form.setFieldsValue({
      ...coupon,
      discount: coupon.discountValue || coupon.discount || coupon.percentageDiscount,
      ExpiryDate: moment(coupon.expireDate),
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!isEditing) {
      form
        .validateFields()
        .then((values) => {
          const formattedValues = {
            ...values,
            expiryDate: values.ExpiryDate.toISOString(), // Convert to ISO format for the database
            // Map discount to percentageDiscount for backend
            percentageDiscount: Number(values.discount),
          };
          console.log("Create:", values);
          console.log("Create:", formattedValues);

          const data = {
            ...formattedValues,
          };
          saveData(data, {
            onSuccess: async (coupounresposne) => {
              console.log("coupoun created:", coupounresposne);
              form.resetFields();
              setIsModalVisible(false);
              message.success("Coupoun created successfuly");
              await queryClient.invalidateQueries({
                queryKey: ["coupons"],
                exact: false,
              });
            },
            onError: (error) => {
              console.log("Failed:", error);
              message.error("Failed to create Coupoun");
            },
          });
        })
        .catch((errorInfo) => {
          console.log("Failed:", errorInfo);
          message.error("Failed to create Coupoun");
        });
    } else {
      form
        .validateFields()
        .then((values) => {
          console.log("Edit:", values);
          const formattedValues = {
            ...values,
            expiryDate: values.ExpiryDate.toISOString(), // Convert to ISO format for the database
            // Map discount to percentageDiscount for backend
            percentageDiscount: Number(values.discount),
          };
          const data = {
            ...formattedValues,
          };
          saveDataEdit(data, {
            onSuccess: async (coupounresposne) => {
              console.log("coupoun created:", coupounresposne);
              form.resetFields();
              setIsModalVisible(false);
              message.success("Coupoun created successfuly");
              await queryClient.invalidateQueries({
                queryKey: ["coupons"],
                exact: false,
              });
            },
            onError: (error) => {
              console.log("Failed:", error);
              message.error("Failed to create Coupoun");
            },
          });
        })
        .catch((errorInfo) => {
          console.log("Failed:", errorInfo);
        });
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteCoupon = async (id: number) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      const data = await DeleteApiCustomerRoutes(
        route.backend.deleteCoupon + "/" + id + "/" + UserID,
        {
          userId: UserID,
          id: id,
        }
      );
      if (data.statusCode === 200) {
        message.success("coupon deleted successfully");
        const data = await queryClient.invalidateQueries({
          queryKey: ["coupouns"],
        });

        console.log(
          "data",
          queryClient.getQueriesData({
            queryKey: ["coupouns"],
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
    <div>
      <div className="p-5">
        <Button
          type="primary"
          style={{ marginBottom: "20px" }}
          onClick={handleCreateClick}
        >
          Create Coupon
        </Button>
      </div>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupounData?.map((coupon, index) => (
          <div
            key={index}
            onClick={() => handleCouponClick(coupon)}
            className="relative flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-lg cursor-pointer group"
          >
            <Button
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering `handleCouponClick`
                handleDeleteCoupon(coupon.id); // Call delete function
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow transform scale-0 group-hover:scale-100 transition-transform duration-200 hover:bg-red-700 flex items-center justify-center"
            />
            {/* Left cut-out */}
            <div className="absolute left-0 top-1/2 w-4 h-8 bg-white -ml-2 rounded-r-full transform -translate-y-1/2"></div>

            {/* Right cut-out */}
            <div className="absolute right-0 top-1/2 w-4 h-8 bg-white -mr-2 rounded-l-full transform -translate-y-1/2"></div>

            <div className="bg-pink-500 text-yellow-300 p-4 flex items-center justify-center sm:w-1/3 w-full">
              <div className="text-3xl sm:text-3xl font-bold break-all whitespace-normal text-center overflow-hidden max-h-full">
                {coupon.discountValue || coupon.discount || coupon.percentageDiscount || 0}
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-0 w-px bg-white"></div>
              <div className="absolute top-0 bottom-0 left-0 w-px flex flex-col justify-between py-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 h-0.5 bg-white -ml-1"></div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-400 p-4 flex flex-col justify-between sm:w-3/4 w-full">
              <div>
                <h2 className="text-white text-xl sm:text-3xl font-bold break-all whitespace-normal overflow-hidden line-clamp-2">
                  Name - {coupon.name.toUpperCase()}
                </h2>
                <p className="text-white text-sm">
                  Total Claimed: {coupon.user.length}
                </p>
              </div>
              <br />
              <p className="text-white text-sm sm:text-base">
                <span className="font-bold text-xs">VALID UNTIL</span>{" "}
                {formatDate(coupon.expireDate)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={isEditing ? "Edit Coupon" : "Create Coupoun"}
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
            getValueProps={(value) => ({ value: value?.toUpperCase() })}
            normalize={(value) => value?.toUpperCase()}
          >
            <Input placeholder="Enter coupon name" style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Discount"
            rules={[
              {
                required: true,
                message: "Please enter a discount",
              },
              {
                validator: (_, value) => {
                  const numberValue = Number(value);
                  if (
                    !isNaN(numberValue) &&
                    Number.isInteger(numberValue) &&
                    numberValue >= 1
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Discount must be a whole number greater than 0"
                  );
                },
              },
            ]}
          >
            <Input
              type="number"
              step="1"
              placeholder="Enter discount"
              onChange={(e) => {
                const value = e.target.value;
                form.setFieldsValue({ discount: value });
              }}
            />
          </Form.Item>
          <Form.Item
            name="ExpiryDate"
            label="Expiry Date"
            rules={[
              { required: true, message: "Please select the expiry date" },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              disabledDate={(current) => {
                return current && current < moment().startOf('day');
              }}
            />
          </Form.Item>

          {/* Modern information display with truncation for long user lists */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #f0f0f0",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <strong>Total Claimed:</strong>
              <span>
                {form.getFieldValue("user")
                  ? form.getFieldValue("user").length
                  : 0}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <strong>Claimed By:</strong>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {(() => {
                  const users = form.getFieldValue("user");
                  if (users && users.length > 0) {
                    const maxDisplay = 3;
                    if (users.length > maxDisplay) {
                      const displayNames = users
                        .slice(0, maxDisplay)
                        .map((u: { userName: string }) => u.userName);
                      return (
                        displayNames.join(", ") +
                        `, and ${users.length - maxDisplay} more`
                      );
                    } else {
                      return users
                        .map((u: { userName: string }) => u.userName)
                        .join(", ");
                    }
                  }
                  return "N/A";
                })()}
              </span>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
