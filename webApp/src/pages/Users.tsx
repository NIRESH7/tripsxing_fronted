/* eslint-disable @typescript-eslint/no-explicit-any */
import FilterDropdown from "@/component/ui/FilterDropDown/FilterDropdown";
import { DeleteApiCustomerRoutes, PostApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";
import { GetUsers, GetPlan } from "@/hooks/GetHooks";
import { queryClient } from "@/hooks/Hooks";
import { SaveMutation } from "@/hooks/MutationHooks";
import { User, ApiResponse, UserData } from "@/interfaces/interfaces";
import { route } from "@/routes/routes";
import { useCurrentUserData } from "@/utils/state";
import {
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Space,
  Table,
  Form,
  Input,
  Tag,
  Select,
  message,
  Switch,
} from "antd";
import React, { useState } from "react";

interface Plan {
  id: number;
  name: string;
  validity: string;
  description?: string;
  price?: number;
}

const Users: React.FC = () => {
  const { data: users, isLoading } = GetUsers<User[]>();
  const { data: plans } = GetPlan<Plan[]>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">(
    "view"
  );
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [planForm] = Form.useForm();
  const UserID = useCurrentUserData(
    (state: any) =>
      (
        state as {
          CurrentUserData: UserData;
        }
      ).CurrentUserData.id
  );
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const filteredUsers = users?.filter((user) => {
    const value = searchText.toLowerCase();
    return (
      user.id?.toString().toLowerCase().includes(value) ||
      user.userName?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value) ||
      user.status?.toLowerCase().includes(value)
    );
  }) || [];

  const openModal = (mode: "view" | "edit" | "create", user?: User) => {
    setModalMode(mode);
    setIsModalVisible(true);
    if (user) {
      setSelectedUser(user);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const openPlanModal = (user: User) => {
    setSelectedUser(user);
    setIsPlanModalVisible(true);
    setSelectedPlanId(null);
  };

  const closePlanModal = () => {
    setIsPlanModalVisible(false);
    setSelectedUser(null);
    setSelectedPlanId(null);
    planForm.resetFields();
  };

  const handleChangePlan = async () => {
    if (!selectedUser || !selectedPlanId) {
      messageApi.error({
        content: "Please select a plan",
        key: "updatable",
        duration: 2,
      });
      return;
    }

    messageApi.loading({
      content: "Changing user plan...",
      key: "updatable",
    });

    try {
      const response = await PostApiCustomerRoutes(
        route.backend.changeUserPlan,
        {
          userId: selectedUser.id,
          newPlanId: selectedPlanId,
        }
      );

      if (response.statusCode === 200) {
        messageApi.success({
          content: "User plan changed successfully!",
          key: "updatable",
          duration: 2,
        });
        closePlanModal();
        await queryClient.invalidateQueries({
          queryKey: ["Users"],
        });
      } else {
        messageApi.error({
          content: response.message || "Failed to change user plan",
          key: "updatable",
          duration: 2,
        });
      }
    } catch (error: any) {
      messageApi.error({
        content: error.message || "Failed to change user plan",
        key: "updatable",
        duration: 2,
      });
    }
  };

  const { mutate } = SaveMutation({
    mutationKey:
      modalMode === "edit"
        ? ["User", selectedUser?.id]
        : ["Users", selectedUser?.id],
    queryKeyToInvalidate: ["Users"],
    getSuccessMessage: () =>
      modalMode === "edit"
        ? "User updated successfully!"
        : "User saved successfully!",
    getErrorMessage: () => "Failed to save User",
    onMutateCallback: () =>
      messageApi.loading({
        content: modalMode === "edit" ? "Updating User..." : "Creating User...",
        key: "updatable",
      }),
    onSettledCallback: (data: ApiResponse<User>) => {
      if (data.statusCode === 200) {
        messageApi.success({
          content: data.message,
          key: "updatable",
          duration: 2,
        });
        closeModal();
      } else {
        messageApi.error({
          content: data.message,
          key: "updatable",
          duration: 2,
        });
      }
    },
    routes:
      modalMode === "edit"
        ? `${route.backend.updateUser}/${selectedUser?.id}`
        : route.backend.createUser,
    isUpdate: modalMode === "edit",
  });

  const handleMutate = (values: User, modalMode: "edit" | "create") => {
    form
      .validateFields()
      .then(() => {
        mutate(
          modalMode === "edit"
            ? { ...selectedUser, ...values }
            : {
              ...values,
            }
        );
      })
      .catch(() => {
        messageApi.error({
          content: "Please fill in all required fields",
          key: "updatable",
          duration: 2,
        });
      });
  };

  const handleDeleteClick = async () => {
    if (selectedRowKeys.length === 0) {
      message.error("Please select a blog to delete");
    } else {
      if (confirm("Are you sure you want to delete this blog?")) {
        const data = await DeleteApiCustomerRoutes(route.backend.deleteUser, {
          userId: UserID,
          ids: selectedRowKeys,
        });
        if (data.statusCode === 200) {
          message.success("Blog deleted successfully");
          const data = await queryClient.invalidateQueries({
            queryKey: ["Blogs"],
          });

          console.log(
            "data",
            queryClient.getQueriesData({
              queryKey: ["Blogs"],
            })
          );

          console.log("data", data);

          setSelectedRowKeys([]);
        } else {
          message.error({
            content: data.message,
            key: "updatable",
            duration: 2,
          });
        }
      }
    }
  };

  const CreateForm = () => {
    return (
      <Form
        layout="vertical"
        initialValues={selectedUser || {}}
        onFinish={(values: any) => {
          handleMutate(values, "create");
        }}
      >
        <Form.Item label="Username" name="userName">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Select
            options={[
              { label: "Super Admin", value: "superAdmin" },
              { label: "Hotel Admin", value: "hotelAdmin" },
              { label: "Customer", value: "customer" },
            ]}
          />
        </Form.Item>
        {/* Password */}
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          valuePropName="checked"
          getValueFromEvent={(checked) => checked ? 'active' : 'inactive'}
          initialValue="active"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
        </Form.Item>
        {modalMode !== "view" && (
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  };

  const EditForm = () => {
    return (
      <Form
        layout="vertical"
        initialValues={selectedUser || {}}
        onFinish={(values: any) => {
          mutate(values);
        }}
      >
        <Form.Item label="Username" name="userName">
          <Input disabled={modalMode === "view"} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled={modalMode === "view"} />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Select
            disabled={modalMode === "view"}
            options={[
              { label: "Super Admin", value: "superAdmin" },
              { label: "Hotel Admin", value: "hotelAdmin" },
              { label: "Customer", value: "customer" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          valuePropName="checked"
          getValueFromEvent={(checked) => checked ? 'active' : 'inactive'}
          getValueProps={(value) => ({ checked: value === 'active' })}
        >
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            disabled={modalMode === "view"}
          />
        </Form.Item>
        {modalMode === "edit" && (
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  };

  const ChangePlanForm = () => {
    return (
      <Form
        layout="vertical"
        form={planForm}
        onFinish={handleChangePlan}
      >
        <Form.Item label="User" name="userName">
          <Input disabled value={selectedUser?.userName} />
        </Form.Item>
        <Form.Item label="Select Plan" name="planId" rules={[{ required: true, message: "Please select a plan" }]}>
          <Select
            placeholder="Select a plan"
            onChange={(value: any) => setSelectedPlanId(value)}
            options={
              plans?.map((plan: Plan) => ({
                label: `${plan.name} (${plan.validity})`,
                value: plan.id,
              })) || []
            }
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Space>
            <Button onClick={closePlanModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Change Plan
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div>
      <Modal
        title={modalMode === "view" ? "User Details" : "Edit User"}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {modalMode === "create" ? <CreateForm /> : <EditForm />}
      </Modal>
      <Modal
        title="Change User Plan"
        open={isPlanModalVisible}
        onCancel={closePlanModal}
        footer={null}
      >
        <ChangePlanForm />
      </Modal>
      <div style={{ padding: "20px" }}>
        {contextHolder}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <Button
              type="primary"
              onClick={() => openModal("create")}
              icon={<PlusOutlined />}
            >
              Create User
            </Button>
            <Button
              type="text"
              className="bg-red-500 text-white border-none rounded-md px-4 py-2 hover:bg-red-600"
              onClick={() => handleDeleteClick()}
              icon={<DeleteOutlined />}
            >
              Delete User
            </Button>
          </div>
          <div>
            <Input.Search
              placeholder="Search by ID, Username, Email, Role, or Status"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        </div>
        <Table
          columns={[
            {
              title: "S/N",
              dataIndex: "sno",
              key: "sno",
              render: (_text: string, _record: User, index: number) =>
                index + 1,
            },
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
            },
            {
              title: "UserName",
              dataIndex: "userName",
              key: "userName",
              sorter: (a: User, b: User) =>
                a.userName.localeCompare(b.userName),
              sortDirections: ["descend", "ascend"],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filterDropdown: (props: any) => (
                <FilterDropdown {...props} placeholder={`Search by Name`} />
              ),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onFilter: (value: any, record: any) =>
                record.userName.toLowerCase().includes(value.toLowerCase()),
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filterDropdown: (props: any) => (
                <FilterDropdown {...props} placeholder={`Search by Email`} />
              ),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onFilter: (value: any, record: any) =>
                record.email.toLowerCase().includes(value.toLowerCase()),
            },
            {
              title: "Role",
              dataIndex: "role",
              key: "role",
              render: (role: string) => (
                <Tag
                  color={
                    role === "superAdmin"
                      ? "green"
                      : role === "hotelAdmin"
                        ? "blue"
                        : "red"
                  }
                  key={role}
                  style={{ textTransform: "capitalize", fontSize: "12px" }}
                >
                  {role === "superAdmin"
                    ? "Super Admin"
                    : role === "hotelAdmin"
                      ? "Hotel Admin"
                      : "Customer"}
                </Tag>
              ),
              filters: [
                { text: "Super Admin", value: "superAdmin" },
                { text: "Hotel Admin", value: "hotelAdmin" },
                { text: "Customer", value: "customer" },
              ],
              onFilter: (value: any, record: any) =>
                record.role.indexOf(value) === 0,
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status: string) => (
                <Tag
                  color={status === "active" ? "green" : "red"}
                  key={status}
                  style={{ textTransform: "capitalize", fontSize: "12px" }}
                >
                  {status === "active" ? "Active" : "Inactive"}
                </Tag>
              ),
              filters: [
                { text: "Active", value: "active" },
                { text: "Inactive", value: "inactive" },
              ],
              onFilter: (value: any, record: any) =>
                record.status.indexOf(value) === 0,
            },
            {
              title: "Action",
              key: "action",
              render: (_: any, record: User) => (
                <Space size="middle">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => openModal("view", record)}
                    title="View"
                  />
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => openModal("edit", record)}
                    title="Edit"
                  />
                  <Button
                    icon={<TeamOutlined />}
                    onClick={() => openPlanModal(record)}
                    title="Change Plan"
                  />
                </Space>
              ),
            },
          ]}
          dataSource={filteredUsers}
          loading={isLoading}
          scroll={{ x: 1300 }}
          rowKey="id"
          size="small"
          pagination={{
            pageSize: pageSize,
            onShowSizeChange: (_: any, size: any) => {
              setPageSize(size);
              console.log("Page size changed to:", size);
            },
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total: any, range: any) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys: any, selectedRows: any) => {
              console.log("selectedRowKeys", selectedRowKeys);
              setSelectedRowKeys(selectedRowKeys);
              // handleDeleteClick();
              console.log("selectedRows", selectedRows);
            },
          }}
        />
      </div>
    </div>
  );
};

export default Users;
