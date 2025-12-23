import React, { Key, useState } from "react";
import { Modal, Table, Tag, Spin, Alert, DatePicker } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { GetAuditLogs } from "@/hooks/GetHooks";
import { ColumnProps } from "antd/es/table";
import FilterDropdown from "@/component/ui/FilterDropDown/FilterDropdown";

export interface AuditLog {
  id: number;
  action: string;
  userId: number;
  model: string;
  changedItemId: number;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  User: {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
  };
}

const getActionTagColor = (action: string) => {
  switch (action) {
    case "Update":
    case "Edit":
    case "Modify":
    case "update":
      return "blue";
    case "Create":
    case "Add":
    case "New":
    case "create":
      return "green";
    case "Delete":
    case "Remove":
    case "Destroy":
    case "delete":
      return "red";
    default:
      return "default";
  }
};

const AuditLog: React.FC = () => {
  const { data, error, isLoading } = GetAuditLogs<AuditLog[]>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<AuditLog | null>(null);

  const columns: ColumnProps<AuditLog>[] = [
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      align: "center",
      render: (userName: string) => userName,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
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
      onFilter: (value: boolean | Key, record: AuditLog) =>
        record.User.userName
          .toLowerCase()
          .includes((value as string).toLowerCase()),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => (
        <Tag color={getActionTagColor(action)}>{action}</Tag>
      ),
      align: "center",
      filters: [
        { text: "Create", value: "Create" },
        { text: "Update", value: "Update" },
        { text: "Delete", value: "Delete" },
      ],
      onFilter: (value: boolean | Key, record: AuditLog) =>
        record.action === value.toString(),
    },
    { title: "Model", dataIndex: "model", key: "model", align: "center" },
    {
      title: "Changed Item ID",
      dataIndex: "changedItemId",
      key: "changedItemId",
      render: (changedItemId: number) => {
        return (
          <span
            // center the text
            className="flex justify-center"
          >
            {changedItemId}
          </span>
        );
      },
      align: "center",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
      align: "center",
      filterDropdown: ({ setSelectedKeys, confirm }) => (
        <>
          {/* Need to Set Date Range */}
          <div>
            {/* DatePicker*/}
            <DatePicker.RangePicker
              onChange={(_date, dateString) => {
                console.log(dateString);

                setSelectedKeys(dateString);
                confirm();
              }}
              style={{ width: "100%" }}
            />
          </div>
        </>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Details",
      key: "details",
      render: (record: AuditLog) => (
        <span className="flex space-x-2 justify-center">
          <EyeOutlined
            className="cursor-pointer text-blue-500"
            onClick={() => {
              setIsModalVisible(true);
              setCurrentLog(record);
            }}
          />
        </span>
      ),
      align: "center",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert message="Error loading data" type="error" />
      </div>
    );
  }

  return (
    <div className="p-4 text-wrap">
      <Modal
        title="Audit Log Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
      // style={{ minWidth: '80%' }}
      >
        {currentLog && (
          <>
            <p>
              <strong>Action:</strong> {currentLog.action}
            </p>
            <p>
              <strong>User ID:</strong> {currentLog.User.userName}
            </p>
            <p>
              <strong>Model:</strong> {currentLog.model}
            </p>
            <p>
              <strong>Changed Item ID:</strong> {currentLog.changedItemId}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(currentLog.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Old Value:</strong>{" "}
              {currentLog.oldValue ? (
                <pre className="text-wrap">
                  {JSON.stringify(JSON.parse(currentLog.oldValue), null, 2)}
                </pre>
              ) : (
                "No old value"
              )}
            </p>
            <p>
              <strong>New Value:</strong>{" "}
              {currentLog.newValue ? (
                <pre>
                  {JSON.stringify(JSON.parse(currentLog.newValue), null, 2)}
                </pre>
              ) : (
                "No new value"
              )}
            </p>
            <p>
              <strong>Description:</strong> {currentLog.description}
            </p>
          </>
        )}
      </Modal>
      <Table
        dataSource={
          data?.map((log) => ({
            ...log,
            userName: `${log.User.userName}`,
          })) || []
        }
        columns={columns}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
        }}
        size="small"
        className="shadow-sm rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default AuditLog;
