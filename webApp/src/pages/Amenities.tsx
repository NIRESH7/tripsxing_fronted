/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { DeleteMutation } from "@/hooks/MutationHooks";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Space,
  message,
  Upload,
  Image,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { GetAmenity } from "@/hooks/GetHooks";
import { SaveMutation } from "@/hooks/MutationHooks";
import { ApiResponse, UserData } from "@/interfaces/interfaces";
import { route } from "@/routes/routes";
import { useCurrentUserData } from "@/utils/state";
import { ColumnType } from "antd/es/table";
import FilterDropdown from "@/component/ui/FilterDropDown/FilterDropdown";
import { queryClient } from "@/hooks/Hooks";
import { DeleteApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";

interface imageMetaData {
  uid: string;
  name: string;
  url: string;
}

interface Amenity {
  id?: number;
  name: string;
  description: string;
  userId?: string;
  ImageUrl?: string;
}

// interface imageMetaData {
//     uid: string;
//     name: string;
//     status: string;
//     url: string;
// }

const Amenities: React.FC = () => {
  const { data: amenities } = GetAmenity<Amenity[]>();
  const [messageApi, contextHolder] = message.useMessage();
  const [modalState, setModalState] = useState({
    visible: false,
    mode: "create",
  });
  const [currentAmenity, setCurrentAmenity] = useState<Amenity>({
    name: "",
    description: "",
    userId: "",
    ImageUrl: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const { CurrentUserData } = useCurrentUserData() as {
    CurrentUserData: UserData;
  };

  const openModal = (mode: "create" | "edit" | "view", amenity?: Amenity) => {
    setModalState({ visible: true, mode });
    if (amenity) {
      setCurrentAmenity(amenity);
      form.setFieldsValue({
        ...amenity,
        images: amenity.ImageUrl,
      });
    } else {
      form.resetFields();
    }
  };

  const closeModal = useCallback(
    () => setModalState({ ...modalState, visible: false }),
    [modalState]
  );

  const { mutate } = SaveMutation({
    mutationKey:
      modalState.mode === "edit"
        ? ["Amenity", currentAmenity?.id]
        : ["Amenities", currentAmenity?.id],
    queryKeyToInvalidate: ["Amenity"],
    getSuccessMessage: () =>
      modalState.mode === "edit"
        ? "Amenity updated successfully!"
        : "Amenity saved successfully!",
    getErrorMessage: () => "Failed to save Amenity",
    onMutateCallback: () =>
      messageApi.loading({
        content:
          modalState.mode === "edit"
            ? "Updating Amenity..."
            : "Creating Amenity...",
        key: "updatable",
      }),
    onSettledCallback: (data: ApiResponse<Amenity>) => {
      if (data.statusCode === 200) {
        messageApi.success({
          content: data.message,
          key: "updatable",
          duration: 2,
        });

        // closeModal();
      } else {
        messageApi.error({
          content: data.message,
          key: "updatable",
          duration: 2,
        });
      }
    },
    routes:
      modalState.mode === "edit"
        ? `${route.backend.updateAmenity}/${currentAmenity.id}`
        : route.backend.createAmenity,
    isUpdate: modalState.mode === "edit",
  });

  const { mutate: saveDataUpload } = SaveMutation({
    mutationKey: ["uploadFileCountry"],
    queryKeyToInvalidate: ["Amenity"],
    getSuccessMessage: () => `File uploaded successfully`,
    getErrorMessage: (error: any) => `Failed to Upload file: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.uploadfile,
  });

  const handleOk = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const amenityData = {
          ...values,
          userId: CurrentUserData.id,
          status: values.status ? "active" : "inactive",
        };

        if (modalState.mode === "edit") {
          mutate(
            { id: currentAmenity.id, ...amenityData },
            {
              onSuccess: async (stayResponse) => {
                console.log("Stay created:", stayResponse);

                const formData = new FormData();
                values.images.fileList.forEach(
                  (file: { originFileObj: File }) => {
                    formData.append("files", file.originFileObj);
                  }
                );
                formData.append("aminitesId", stayResponse.data.id); // Assuming you get the country ID from response

                // Upload files after country creation
                saveDataUpload(formData, {
                  onSuccess: async () => {
                    //console.log('Image upload response:', uploadResponse);
                    form.resetFields();
                    await queryClient.invalidateQueries({
                      queryKey: ["Amenity"], // Ensure the query key is correct
                    });
                    //setIsModalVisible(false);
                  },
                  onError: (error) => {
                    console.error("Image upload failed:", error);
                    message.error("Image upload failed");
                  },
                });
                message.success("Amenity created successfuly");
              },
            }
          );
        } else {
          mutate(amenityData, {
            onSuccess: async (stayResponse) => {
              console.log("Stay created:", stayResponse);

              const formData = new FormData();
              values.images.fileList.forEach(
                (file: { originFileObj: File }) => {
                  formData.append("files", file.originFileObj);
                }
              );
              formData.append("aminitesId", stayResponse.data.id); // Assuming you get the country ID from response

              // Upload files after country creation
              saveDataUpload(formData, {
                onSuccess: async () => {
                  //console.log('Image upload response:', uploadResponse);
                  form.resetFields();
                  await queryClient.invalidateQueries({
                    queryKey: ["Amenity"], // Ensure the query key is correct
                  });
                  //setIsModalVisible(false);
                },
                onError: (error) => {
                  console.error("Image upload failed:", error);
                  message.error("Image upload failed");
                },
              });
              message.success("Amenity created successfuly");
            },
          });
        }

        closeModal();
      })
      .catch((error) => console.log("Validation failed:", error));
  }, [
    form,
    CurrentUserData.id,
    modalState.mode,
    closeModal,
    mutate,
    currentAmenity.id,
    saveDataUpload,
  ]);

  const columns: ColumnType<Amenity>[] = [
    {
      title: "SI.No",
      dataIndex: "id",
      key: "id",
      render: (__, _, index) => index + 1,
      sorter: (a: Amenity, b: Amenity) => (a.id ?? 0) - (b.id ?? 0),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Amenity Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Amenity, b: Amenity) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      filterDropdown: (props: any) => (
        <FilterDropdown {...props} placeholder={`Search by Name`} />
      ),
      onFilter: (value: any, record: any) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a: Amenity, b: Amenity) =>
        a.description.localeCompare(b.description),
      sortDirections: ["descend", "ascend"],
      filterDropdown: (props: any) => (
        <FilterDropdown {...props} placeholder={`Search by Description`} />
      ),
      onFilter: (value: any, record: any) =>
        record.description.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Images",
      dataIndex: "imageUrl",
      key: "imageUrl",

      render: (images: string) => {
        console.log("imagescadscascas", images);

        return (
          <Space size="middle" className="cursor-pointer">
            {images && images.length > 0 && (
              <Image
                src={images} // Access the first and only URL in the array
                alt="amenity"
                style={{ width: 50, height: 50, objectFit: "cover" }}
                preview={{ mask: <EyeOutlined /> }}
              />
            )}
          </Space>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: Amenity) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal("edit", record)}
          />
        </Space>
      ),
    },
  ];

  // Add DeleteMutation import if not already present

  // Update the Form.Item for images in the modal to include delete button

  // Add this mutation
  const { mutate: deleteFile } = DeleteMutation({
    mutationKey: ["deleteFile"],
    queryKeyToInvalidate: ["Amenity"],
    getSuccessMessage: () => `File deleted successfully`,
    getErrorMessage: (error: any) => `Failed to delete file: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.deleteFile,
  });

  const extractFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleDelete = (url: string) => {
    const fileName = extractFileName(url);
    const data = {
      key: fileName,
      aminitesId: currentAmenity.id,
      url: url,
    };

    console.log("data", data);

    deleteFile(data, {
      onSuccess: () => {
        const updatedImages = (form.getFieldValue("images") || []).filter(
          (image: imageMetaData) => extractFileName(image.url) !== fileName
        );
        console.log("updatedImages", updatedImages);

        form.setFieldsValue({
          images: updatedImages,
        });
        message.success("File deleted successfully");
      },
      onError: (error: any) => {
        message.error(`Failed to delete file: ${error}`);
      },
    });
  };

  //! Amenitiy List Delete

  const handleDeleteClick = async () => {
    if (selectedRowKeys.length === 0) {
      message.error("Please select a amenity to delete");
    } else {
      if (confirm("Are you sure you want to delete this amenity?")) {
        const data = await DeleteApiCustomerRoutes(
          route.backend.deleteMultipleAmenities,
          {
            userId: CurrentUserData.id,
            amenityIds: selectedRowKeys,
          }
        );
        if (data.statusCode === 200) {
          message.success("Amenity deleted successfully");
          const data = await queryClient.invalidateQueries({
            queryKey: ["Amenity"],
          });

          console.log(
            "data",
            queryClient.getQueriesData({
              queryKey: ["Amenity"],
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
          onClick={() => openModal("create")}
          icon={<PlusOutlined />}
        >
          Create Amenity
        </Button>
        <Button
          type="text"
          className="bg-red-500 text-white border-none rounded-md px-4 py-2 hover:bg-red-600"
          onClick={() => handleDeleteClick()}
          icon={<DeleteOutlined />}
        >
          Delete Amenity
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={amenities}
        rowKey="id"
        scroll={{ x: 1300 }}
        size="small"
        pagination={{
          pageSize: pageSize,
          onShowSizeChange: (_, size) => {
            setPageSize(size);
            console.log("Page size changed to:", size);
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
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

      <Modal
        title={
          modalState.mode === "edit"
            ? "Edit Amenity"
            : modalState.mode === "view"
              ? "View Amenity"
              : "Create Amenity"
        }
        open={modalState.visible}
        onOk={modalState.mode === "view" ? closeModal : handleOk}
        onCancel={closeModal}
        okText={
          modalState.mode === "edit"
            ? "Save"
            : modalState.mode === "view"
              ? "Close"
              : "Create"
        }
        footer={
          modalState.mode === "view"
            ? [
              <Button key="close" onClick={closeModal}>
                Close
              </Button>,
            ]
            : [
              <Button key="cancel" onClick={closeModal}>
                Close
              </Button>,
              <Button key="submit" type="primary" onClick={handleOk}>
                {modalState.mode === "edit" ? "Save" : "Create"}
              </Button>,
            ]
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Amenity Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input disabled={modalState.mode === "view"} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea disabled={modalState.mode === "view"} />
          </Form.Item>
          {/* // Add this mutation for deleting files */}
          {/* Show existing image only in edit or view mode */}
          {(modalState.mode === "edit" || modalState.mode === "view") &&
            form.getFieldValue("imageUrl") && (
              <Form.Item label="Current Image">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={form.getFieldValue("imageUrl")}
                    alt="amenity"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  {modalState.mode === "edit" && (
                    <DeleteOutlined
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                        cursor: "pointer",
                        backgroundColor: "white",
                        padding: "4px",
                        borderRadius: "50%",
                      }}
                      onClick={() =>
                        handleDelete(form.getFieldValue("imageUrl"))
                      }
                    />
                  )}
                </div>
              </Form.Item>
            )}
          {/* Show upload option only in create or edit mode */}
          {modalState.mode !== "view" && (
            <Form.Item name="images" label="Images">
              <Upload multiple listType="picture" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload Images</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;
