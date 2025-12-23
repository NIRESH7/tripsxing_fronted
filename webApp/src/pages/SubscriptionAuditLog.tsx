/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Modal, Table, Tag, Spin, Alert, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { GetApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";
import { route } from "@/routes/routes";
import { ColumnProps } from "antd/es/table";
import FilterDropdown from "@/component/ui/FilterDropDown/FilterDropdown";

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  startDate: string;
  expirationDate: string;
  orderId?: string;
  transactionId?: string;
  status: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
  };
  plan: {
    id: number;
    name: string;
    validity: string;
    price: number;
  };
}

const getStatusTagColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "green";
    case "expired":
      return "red";
    case "cancelled":
      return "orange";
    default:
      return "default";
  }
};

const SubscriptionAuditLog: React.FC = () => {
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [pageSize, setPageSize] = useState(10);

  const fetchSubscriptions = async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("TripxingToken") ?? "";
      const url = userId
        ? `${route.backend.getSubscriptions}?userId=${userId}`
        : route.backend.getSubscriptions;
      const response = await GetApiCustomerRoutes(url, token);

      if (response.statusCode === 200) {
        setData(response.data || []);
      } else {
        setError(response.message || "Failed to fetch subscriptions");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching subscriptions");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleViewDetails = (record: Subscription) => {
    setCurrentSubscription(record);
    setIsModalVisible(true);
  };

  const columns: ColumnProps<Subscription>[] = [
    {
      title: "S/N",
      key: "sno",
      render: (_: any, __: any, index: number) => index + 1,
      width: 50,
      align: "center",
    },
    {
      title: "User",
      dataIndex: ["user", "userName"],
      key: "userName",
      align: "center",
      render: (userName: string, record: Subscription) => (
        <div>
          <div>{userName}</div>
          <span style={{ fontSize: "12px", color: "#999" }}>
            {record.user.email}
          </span>
        </div>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: any) => (
        <FilterDropdown
          {...{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters: () => {
              clearFilters!();
            },
          }}
          placeholder="Search user"
        />
      ),
      onFilter: (value: any, record: Subscription) =>
        record.user.userName
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: "Plan",
      dataIndex: ["plan", "name"],
      key: "planName",
      align: "center",
      render: (planName: string, record: Subscription) => (
        <div>
          <div>{planName}</div>
          <span style={{ fontSize: "12px", color: "#999" }}>
            ₹{record.plan.price} - {record.plan.validity}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusTagColor(status)}>{status.toUpperCase()}</Tag>
      ),
      align: "center",
      filters: [
        { text: "Active", value: "active" },
        { text: "Expired", value: "expired" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value: any, record: Subscription) =>
        record.status === value.toString(),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate: string) => new Date(startDate).toLocaleDateString(),
      align: "center",
    },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (expirationDate: string) => new Date(expirationDate).toLocaleDateString(),
      align: "center",
      sorter: (a: Subscription, b: Subscription) =>
        new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime(),
    },
    {
      title: "Details",
      key: "details",
      render: (record: Subscription) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2>All Subscriptions</h2>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: "20px" }}
        />
      )}

      <Modal
        title="Subscription Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {currentSubscription && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h4>User Information</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <strong>User:</strong> {currentSubscription.user.userName}
                </div>
                <div>
                  <strong>Email:</strong> {currentSubscription.user.email}
                </div>
                <div>
                  <strong>Full Name:</strong> {currentSubscription.user.firstName} {currentSubscription.user.lastName}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4>Plan Details</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <strong>Plan Name:</strong> {currentSubscription.plan.name}
                </div>
                <div>
                  <strong>Validity:</strong> {currentSubscription.plan.validity}
                </div>
                <div>
                  <strong>Price:</strong> ₹{currentSubscription.plan.price}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Tag color={getStatusTagColor(currentSubscription.status)}>
                    {currentSubscription.status.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </div>

            <div>
              <h4>Subscription Details</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <strong>Start Date:</strong>{" "}
                  {new Date(currentSubscription.startDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Expiration Date:</strong>{" "}
                  {new Date(currentSubscription.expirationDate).toLocaleDateString()}
                </div>
                {currentSubscription.orderId && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <strong>Order ID:</strong> {currentSubscription.orderId}
                  </div>
                )}
                {currentSubscription.transactionId && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <strong>Transaction ID:</strong> {currentSubscription.transactionId}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          size="small"
          pagination={{
            pageSize: pageSize,
            onShowSizeChange: (_: any, size: any) => {
              setPageSize(size);
            },
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total: any, range: any) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Spin>
    </div>
  );
};

export default SubscriptionAuditLog;
