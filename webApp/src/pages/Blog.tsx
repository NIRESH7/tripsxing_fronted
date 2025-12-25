import React, {
  lazy,
  Suspense,
  useState,
  useCallback,
  useMemo,
  Key,
  useRef,
} from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Space,
  Select,
  message,
  Tooltip,
  Tag,
  TableColumnType,
  InputRef,
  DatePicker,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Getblog } from "@/hooks/GetHooks";
// import { SaveMutation } from '@/hooks/MutationHooks';
import { route } from "@/routes/routes";
import { useCurrentUserData } from "@/utils/state";
import { UserData } from "@/interfaces/interfaces";
import { ColumnProps } from "antd/es/table";
import { DeleteApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";
import { queryClient } from "@/hooks/Hooks";
import axios from "axios";
// import pako from 'pako';

const BlogEditor = lazy(() => import("@/component/ui/Blog/BlogComponent"));

type Blog = {
  id: number;
  title: string;
  description: string | null;
  content: string;
  datePosted: string;
  category: string;
  status: string;
  views: number;
  authorId: number;
  deletedFlag: boolean;
  Media: [];
  images: [];
  videos: [];
};

const initialBlog: Blog = {
  id: 0,
  title: "",
  description: "",
  content: "",
  datePosted: "",
  category: "",
  status: "",
  views: 0,
  authorId: 0,
  deletedFlag: false,
  Media: [],
  images: [],
  videos: [],
};

const Blog: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const { data: blogsData, isLoading: blogsLoading } = Getblog<Blog[]>();

  const { CurrentUserData } = useCurrentUserData() as {
    CurrentUserData: UserData;
  };
  const searchInput = useRef<InputRef>(null);
  const { RangePicker } = DatePicker;
  const UserID = useCurrentUserData(
    (state) =>
      (
        state as {
          CurrentUserData: UserData;
        }
      ).CurrentUserData.id
  );

  // Define the save function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveBlog = async (data: Blog) => {
    try {
      messageApi.loading({
        content: "Saving blog...",
        key: "updatable",
      });

      const response = await axios({
        method: isEditing ? "put" : "post",
        url: isEditing ? route.backend.updateBlog : route.backend.createBlog,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("TripxingToken")}`,
        },
      });

      if (response.status === 200) {
        messageApi.success({
          content: response.data.message,
          key: "updatable",
          duration: 2,
        });
        await queryClient.invalidateQueries({
          queryKey: ["Blogs"],
        });
        setIsModalVisible(false);
      } else {
        messageApi.error({
          content: response.data.message,
          key: "updatable",
          duration: 2,
        });
      }
    } catch (error) {
      messageApi.error({
        content: "Failed to save blog",
        key: "updatable",
        duration: 2,
      });
    }
  };

  // const { mutate } = SaveMutation({
  //     mutationKey: isEditing ? ['UpdateBlog', currentBlog?.id] : ['SaveBlog', currentBlog?.id],
  //     queryKeyToInvalidate: ['Blogs'],
  //     getSuccessMessage: () => isEditing ? 'Blog updated successfully!' : 'Blog saved successfully!',
  //     getErrorMessage: () => 'Failed to save blog',
  //     onMutateCallback: () => messageApi.loading({
  //         content: 'Saving blog...',
  //         key: 'updatable',
  //     }),

  //     onSettledCallback: (data: ApiResponse<Blog>) => {
  //         if (data.statusCode === 200) {

  //             console.log(data);
  //             messageApi.success({
  //                 content: data.message,
  //                 key: 'updatable',
  //                 duration: 2,
  //             });
  //             setIsModalVisible(false);
  //             (null);
  //         } else {
  //             messageApi.error({
  //                 content: data.message,
  //                 key: 'updatable',
  //                 duration: 2,
  //             });
  //         }
  //     },
  //     routes: isEditing ? route.backend.updateBlog : route.backend.createBlog,
  //     isUpdate: isEditing,
  // });

  const showModal = useCallback(
    (blog: Blog, isEdit: boolean, isView: boolean) => {
      setIsEditing(isEdit);
      setIsViewing(isView);
      setCurrentBlog(blog);
      form.setFieldsValue(blog);
      setIsModalVisible(true);
    },
    [form]
  );

  const handleCreateClick = useCallback(
    () => showModal(initialBlog, false, false),
    [showModal]
  );
  const handleEditClick = useCallback(
    (blog: Blog) => showModal(blog, true, false),
    [showModal]
  );
  const handleViewClick = useCallback(
    (blog: Blog) => showModal(blog, false, true),
    [showModal]
  );

  const handleDeleteClick = async () => {
    if (selectedRowKeys.length === 0) {
      message.error("Please select a blog to delete");
    } else {
      if (confirm("Are you sure you want to delete this blog?")) {
        const data = await DeleteApiCustomerRoutes(route.backend.deleteBlog, {
          userId: UserID,
          id: selectedRowKeys,
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

  const handleOk = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        if (isEditing) {
          const variables = {
            ...values,
            id: currentBlog?.id,
            userId: CurrentUserData.id,
            content: values.content,
            media: [],
          };

          if (typeof values.Media?.[0] !== "object") {
            variables.media = currentBlog?.Media;
            console.log("variables", variables);
            // mutate(variables);
            saveBlog(variables);
            return;
          }

          const formData = new FormData();

          values.Media.forEach((file: { originFileObj: File }) => {
            formData.append("files", file.originFileObj);
          });

          formData.append("type", "blog");

          axios
            .post(route.backend.uploadfile, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("TripxingToken")}`,
              },
            })
            .then((response) => {
              console.log("Image upload response:", response);
              form.resetFields();
              setIsModalVisible(false);
              // mutate(
              //     {
              //         ...variables,
              //         media: currentBlog?.Media.concat(
              //             response.data.data.map((file: { url: string }) => file.url)
              //         )
              //     },
              // );
              saveBlog({
                ...variables,
                media: currentBlog?.Media.concat(
                  response.data.data.map((file: { url: string }) => file.url)
                ),
              });
            })
            .catch((error) => {
              console.error("Image upload failed:", error);
              message.error("Image upload failed");
            });

          // mutate(variables);
        } else {
          const variables = {
            ...values,
            content: values.content,
            userId: CurrentUserData.id,
            media: [],
          };

          const formData = new FormData();

          values.Media.forEach((file: { originFileObj: File }) => {
            formData.append("files", file.originFileObj);
          });
          formData.append("type", "blog");
          console.log("formData", formData);
          axios
            .post(route.backend.uploadfile, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("TripxingToken")}`,
              },
            })
            .then((response) => {
              console.log("Image upload response:", response);
              form.resetFields();
              setIsModalVisible(false);
              // mutate(
              //     {
              //         ...variables,
              //         media: response.data.data.map((file: { url: string }) => file.url),
              //     },
              // );
              saveBlog({
                ...variables,
                media: response.data.data.map(
                  (file: { url: string }) => file.url
                ),
              });
            })
            .catch((error) => {
              console.error("Image upload failed:", error);
              message.error("Image upload failed");
            });
          console.log("variables", variables);
        }
      })
      .catch(console.error);
  }, [form, isEditing, currentBlog, CurrentUserData.id, saveBlog]);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setCurrentBlog(null);
  }, []);

  type DataIndex = keyof Blog;

  const getColumnSearchProps = useCallback(
    (dataIndex: DataIndex): TableColumnType<Blog> => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters!()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: Key | boolean, record) => {
        return (
          record[dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase()) || false
        );
      },
      onFilterDropdownOpenChange(visible) {
        if (visible) {
          setTimeout(() => searchInput.current?.focus(), 100);
        }
      },
      render: (text: string) => text,
    }),
    [searchInput]
  );

  const columns: ColumnProps<Blog>[] = useMemo(
    () => [
      { title: "SI.No", dataIndex: "sno", key: "sno", width: "5%" },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        width: "20%",
        render: (title: string) =>
          title.trim().length > 50 ? (
            <Tooltip title={title}>{title.slice(0, 50) + "..."}</Tooltip>
          ) : (
            title
          ),
        sorter: (a: Blog, b: Blog) => a.title.localeCompare(b.title),
        filterSearch: true,
        ...getColumnSearchProps("title"),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "40%",
        render: (description: string) =>
          description.trim().length > 90 ? (
            <Tooltip title={description}>
              {description.slice(0, 90) + "..."}
            </Tooltip>
          ) : (
            description
          ),
      },
      {
        title: "Date Posted",
        dataIndex: "datePosted",
        key: "datePosted",
        render: (date: string) => new Date(date).toDateString(),
        width: "10%",
        sorter: (a: Blog, b: Blog) =>
          new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime(),
        filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
          <div
            className="
                    flex
                    justify-between
                    items-center
                    space-x-2
                    w-full
                    p-2
                    bg-white
                    border
                    border-gray-200
                    rounded-md
                    shadow-md
                    "
          >
            <RangePicker
              renderExtraFooter={() => ""}
              onChange={(_dates, dateStrings) => {
                setSelectedKeys(dateStrings);
              }}
            />
            <Select
              className="w-full"
              placeholder="Select Date"
              onChange={(value) => {
                setSelectedKeys([value]);
              }}
            >
              <Select.Option value="today">Today</Select.Option>
              <Select.Option value="yesterday">Yesterday</Select.Option>
              <Select.Option value="last7days">Last 7 Days</Select.Option>
              <Select.Option value="last30days">Last 30 Days</Select.Option>
            </Select>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
            >
              OK
            </Button>
            <Button onClick={() => clearFilters!()}> Reset </Button>
          </div>
        ),
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        width: "10%",
        sorter: (a: Blog, b: Blog) => a.category.localeCompare(b.category),
        filterSearch: true,
        ...getColumnSearchProps("category"),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "10%",
        filters: [
          { text: "Draft", value: "draft" },
          { text: "Published", value: "published" },
          { text: "Archived", value: "archived" },
        ],
        render: (status: string) => {
          let color = "geekblue";
          if (status === "published") {
            color = "green";
          } else if (status === "archived") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={status}>
              {status.toUpperCase()}
            </Tag>
          );
        },
        onFilter: (value: boolean | Key, record: Blog) =>
          record.status === value,
      },
      {
        title: "Views",
        dataIndex: "views",
        key: "views",
        width: "5%",
        sorter: (a: Blog, b: Blog) => a.views - b.views,
      },
      {
        title: "Action",
        key: "action",
        width: "10%",
        render: (record: Blog) => (
          <Space size="middle">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewClick(record)}
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                console.log("Edit", record);
                handleEditClick(record);
              }}
            />
          </Space>
        ),
      },
    ],
    [getColumnSearchProps, RangePicker, handleViewClick, handleEditClick]
  );

  const FormModal = () => (
    <Modal
      title={isEditing ? "Edit Blog" : isViewing ? "View Blog" : "Create Blog"}
      open={isModalVisible}
      onOk={isViewing ? handleCancel : handleOk}
      onCancel={handleCancel}
      okText={isEditing ? "Save" : isViewing ? "Close" : "Create"}
      cancelText="Close"
      footer={
        isViewing ? (
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>
        ) : (
          <>
            <Button key="cancel" onClick={handleCancel}>
              Close
            </Button>
            <Button key="submit" type="primary" onClick={handleOk}>
              {isEditing ? "Save" : "Create"}
            </Button>
          </>
        )
      }
      width="80%"
      // don't close modal on outside click and esc key press
      maskClosable={false}
      keyboard={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input disabled={isViewing} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea disabled={isViewing} />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select the category!" }]}
        >
          <Select
            disabled={isViewing}
            options={[
              { label: "Pilgrimage", value: "pilgrimage" },
              { label: "Tourist Spots", value: "touristSpots" },
              { label: "Travel", value: "travel" },
              { label: "Food", value: "food" },
              { label: "Lifestyle", value: "lifestyle" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select the status!" }]}
        >
          <Select
            disabled={isViewing}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
              { label: "Archived", value: "archived" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="Media"
          label="Media Files"
          rules={[
            { required: true, message: "Please upload the media files!" },
          ]}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            accept="image/png, image/jpeg, image/jpg"
            onChange={(info) => {
              console.log("info", info);
              form.setFieldsValue({ Media: info.fileList });
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>
        {
          <Space
            size="middle"
            className="cursor-pointer
                        "
          >
            {currentBlog?.Media?.map((url, index) => (
              <div>
                <DeleteOutlined
                  className="absolute  text-red-500"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this image?")
                    ) {
                      const media = currentBlog?.Media;
                      media?.splice(index, 1);
                      setCurrentBlog({ ...currentBlog, Media: media });
                    }
                  }}
                />
                <img
                  key={index}
                  src={url}
                  alt="stay"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                  onClick={() => {
                    // Open modal to show image
                    // You can implement your own modal component or use a library like antd Modal
                    // Here's an example using antd Modal
                    Modal.info({
                      title: `Image ${index + 1}`,
                      content: (
                        <img
                          src={url}
                          alt="stay"
                          style={{ width: "100%", height: "100%" }}
                        />
                      ),
                      width: 700,
                    });
                  }}
                />
              </div>
            ))}
          </Space>
        }
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please input the content!" }]}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <BlogEditor
              value={currentBlog?.content || ""}
              onChange={(value: string) =>
                form.setFieldsValue({ content: value })
              }
              disabled={isViewing}
            />
          </Suspense>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <div
        className="
                flex gap-4
            "
      >
        <Button
          type="primary"
          style={{ marginBottom: "20px" }}
          onClick={handleCreateClick}
          icon={<PlusOutlined />}
        >
          Create Blog
        </Button>
        {/* delete Button */}
        <Button
          type="text"
          className="bg-red-500 text-white border-none rounded-md px-4 py-2 hover:bg-red-600"
          onClick={() => handleDeleteClick()}
          icon={<DeleteOutlined />}
        >
          Delete Blog
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={blogsData?.map((blog, index) => ({
          ...blog,
          sno: index + 1,
        }))}
        rowKey="id"
        loading={blogsLoading}
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          onShowSizeChange: (_, size) => {
            setPageSize(size);
            console.log("Page size changed to:", size);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        size="small"
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            console.log("selectedRowKeys", selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);
            // handleDeleteClick();
            console.log("selectedRows", selectedRows);
          },
        }}
      />
      <FormModal />
    </div>
  );
};

export default Blog;
