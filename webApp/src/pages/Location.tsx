/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Tabs,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Image,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ApiResponse, City, Country, State } from "@/interfaces/interfaces";
import { GetCity, GetCountry, GetState } from "@/hooks/GetHooks";
import { DeleteMutation, SaveMutation } from "@/hooks/MutationHooks";
import { route } from "@/routes/routes";
import FilterDropdown from "@/component/ui/FilterDropDown/FilterDropdown";
import { DeleteApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";
import { useCurrentUserData } from "@/utils/state";
import { UserData } from "@/interfaces/interfaces";
import { queryClient } from "@/hooks/Hooks";

const { TabPane } = Tabs;

const Location: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState("country");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "edit"
  >("create");
  const [id, setId] = useState<number>(0);
  const [form] = Form.useForm();

  const { data: CountryData, isLoading: CountryDataLoading } =
    GetCountry<Country[]>();
  const { data: StateData, isLoading: StateDataLoading } = GetState<State[]>();
  const { data: CityData, isLoading: CityDataLoading } = GetCity<City[]>();
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [stateId, setStateId] = useState<number | undefined>(undefined);
  const [cityId, setCityId] = useState<number | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const UserID = useCurrentUserData(
    (state) =>
      (
        state as {
          CurrentUserData: UserData;
        }
      ).CurrentUserData.id,
  );

  const showModal = (
    type: "create" | "edit",
    record: Country | State | City | undefined,
  ) => {
    setModalType(type);
    setIsModalVisible(true);
    if (type === "edit") {
      setId(record?.id || 0);
    }
  };

  const getMutationKey = () => {
    if (modalType === "create") {
      return `Create${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
    } else {
      return `Update${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
    }
  };

  const routeKey =
    `create${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof typeof route.backend;
  const routeKeyEdit =
    `Update${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof typeof route.backend;
  //console.log('routeKey',routeKeyEdit);

  const routeTemp = () => {
    if (modalType === "edit") {
      console.log("routeKeyEdit", route.backend[routeKeyEdit] + `/${id}`);

      return route.backend[routeKeyEdit] + `/${id}`;
    } else {
      return route.backend[routeKey];
    }
  };

  const { mutate: saveData } = SaveMutation({
    mutationKey: getMutationKey(),
    queryKeyToInvalidate:
      activeTab === "country"
        ? ["Countries"]
        : activeTab === "state"
          ? ["States"]
          : ["Cities"],
    getSuccessMessage: (variables: any) =>
      `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ${variables.id ? "updated" : "created"} successfully`,
    getErrorMessage: (error: any, variables: any) => {
      message.error(
        `Failed to ${variables.id ? "update" : "create"} ${activeTab}: ${error}`,
      );
      // return `Failed to ${variables.id ? 'update' : 'create'} ${activeTab}: ${error}`
    },
    onMutateCallback: (variables: any) => {
      console.log("onMutateCallback", variables);
      messageApi.open({
        key: "SaveLocationData",
        type: "loading",
        content: `Saving ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}...`,
      });
    },
    onSettledCallback: (
      data: ApiResponse<Country>,
      error: any,
      variables: any,
      context: any,
    ) => {
      console.log("onSettledCallback", data, error, variables, context);
      if (data.statusCode === 200) {
        messageApi.open({
          key: "SaveLocationData",
          type: "success",
          content: `Successfully ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ${variables.id ? "updated" : "created"}`,
        });
      } else {
        messageApi.open({
          key: "SaveLocationData",
          type: "error",
          content: `Failed to ${variables.id ? "update" : "create"} ${activeTab}`,
        });
      }
    },
    routes: routeTemp(),
    isUpdate: modalType === "edit",
  });
  //console.log('Get${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}', `Get${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`);

  const { mutate: saveDataUpload } = SaveMutation({
    mutationKey: ["uploadFileCountry"],
    queryKeyToInvalidate:
      activeTab === "country"
        ? ["Countries"]
        : activeTab === "state"
          ? ["States"]
          : ["Cities"],
    getSuccessMessage: () => `File uploaded successfully`,
    getErrorMessage: (error: any) => `Failed to Upload file: ${error}`,
    onMutateCallback: (variables: any) => {
      console.log("onMutateCallback", variables);
      messageApi.open({
        key: "UploadFile",
        type: "loading",
        content: `Uploading file...`,
      });
    },
    onSettledCallback: (
      data: ApiResponse<Country>,
      error: any,
      variables: any,
      context: any,
    ) => {
      console.log("onSettledCallback", data, error, variables, context);
      if (data.statusCode === 200) {
        messageApi.open({
          key: "UploadFile",
          type: "success",
          content: "File uploaded successfully",
        });
      } else {
        messageApi.open({
          key: "UploadFile",
          type: "error",
          content: "Failed to Upload file",
        });
      }
    },
    routes: route.backend.uploadfile,
  });

  interface FileObject {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    originFileObj: File;
    percent: number;
    size: number;
    thumbUrl: string;
    type: string;
    uid: string;
  }
  type CountryFormData = {
    countryName: string;
    images: FileObject[];
  };

  type StateFormData = {
    countryId: number;
    stateName: string;
    images: FileObject[];
  };

  type CityFormData = {
    countryId: number;
    stateId: number;
    cityName: string;
    images: FileObject[];
  };

  const handleOk = () => {
    const handleValidationSuccess = (
      values: any,
      type: string,
      idKey: string,
    ) => {
      console.log("idKey", idKey);
      const dataToSave = {
        name: values[`${type}Name`],
        // imageUrl: [],
        userId: UserID,
        ...(type === "country" && { countryId: values.countryId }),
        ...(type === "state" && {
          stateId: values.stateId,
          countryId: values.countryId,
        }),
        ...(type === "city" && {
          stateId: values.stateId,
          countryId: values.countryId,
          cityId: values.cityId,
        }),
      };
      console.log("dataToSave", dataToSave);

      if (
        modalType === "edit"
      ) {
        saveData(dataToSave, {
          onSuccess: async (response) => {
            console.log(
              `${type.charAt(0).toUpperCase() + type.slice(1)} created:`,
              response,
            );
            const formData = new FormData();

            if (values.images === undefined || values.images.length === 0) {
              form.resetFields();
              setIsModalVisible(false);
              await queryClient.invalidateQueries({
                queryKey:
                  activeTab === "country"
                    ? ["Countries"]
                    : activeTab === "state"
                      ? ["States"]
                      : ["Cities"],
              });
              return;
            }
            values.images.forEach((file: { originFileObj: File }) => {
              formData.append("files", file.originFileObj);
            });
            formData.append(`${type}Id`, response.data.id);
            console.log("formData", formData);
            saveDataUpload(formData, {
              onSuccess: async (uploadResponse) => {
                console.log("Image upload response:", uploadResponse);
                form.resetFields();

                setIsModalVisible(false);
                await queryClient.invalidateQueries({
                  queryKey:
                    activeTab === "country"
                      ? ["Countries"]
                      : activeTab === "state"
                        ? ["States"]
                        : ["Cities"],
                });
              },
              onError: (error) => {
                console.error("Image upload failed:", error);
                message.error("Image upload failed");
              },
            });
          },
          onError: (error) => {
            console.error(`Failed to save ${type} data:`, error);
            message.error(`Failed to save ${type} data: ${error}`);
          },
        });
      } else {
        saveData({
          ...dataToSave,
          imageUrl: []
          ,
        }, {
          onSuccess: async (response) => {
            console.log(
              `${type.charAt(0).toUpperCase() + type.slice(1)} created:`,
              response,
            );
            const formData = new FormData();
            values.images.forEach((file: { originFileObj: File }) => {
              formData.append("files", file.originFileObj);
            });
            formData.append(`${type}Id`, response.data.id);
            console.log("formData", formData);
            saveDataUpload(formData, {
              onSuccess: async (uploadResponse) => {
                console.log("Image upload response:", uploadResponse);
                form.resetFields();
                setIsModalVisible(false);

                await queryClient.invalidateQueries({
                  queryKey:
                    activeTab === "country"
                      ? ["Countries"]
                      : activeTab === "state"
                        ? ["States"]
                        : ["Cities"],
                });
              },
              onError: (error) => {
                console.error("Image upload failed:", error);
                message.error("Image upload failed");
              },
            });
          },
          onError: (error) => {
            console.error(`Failed to save ${type} data:`, error);
            message.error(`Failed to save ${type} data: ${error}`);
          },
        });
      }


    };

    const handleValidationError = (info: any) => {
      messageApi.error("Validation failed", info);
    };

    const validateAndSave = (type: string) => {
      form
        .validateFields()
        .then((values: CountryFormData | StateFormData | CityFormData) =>
          handleValidationSuccess(values, type, `${type}Id`),
        )
        .catch(handleValidationError);
    };

    if (modalType === "create") {
      if (activeTab === "country") validateAndSave("country");
      else if (activeTab === "state") validateAndSave("state");
      else validateAndSave("city");
    } else if (modalType === "edit") {
      form
        .validateFields()
        .then((values: any) => {
          // Fix: Use activeTab instead of hardcoding "country"
          handleValidationSuccess(values, activeTab, `${activeTab}Id`);
        })
        .catch(handleValidationError);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns: { [key: string]: any } = {
    country: [
      { title: "SI.no", dataIndex: "siNo", key: "siNo" },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        filterDropdown: (props: any) => (
          <FilterDropdown {...props} placeholder={`Search by Name`} />
        ),
        onFilter: (value: any, record: any) =>
          record.name.toLowerCase().includes(value.toLowerCase()),
      },
      {
        title: "Images",
        dataIndex: "imageUrl",
        key: "imageUrl",

        render: (images: string[]) => {
          console.log("imagescadscascas", images);

          return (
            // <Tooltip title="Click to view images">
            <Space
              size="middle"
              className="cursor-pointer
                            "
            >
              {images?.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt="stay"
                  style={{ width: 50, height: 50, objectFit: "cover" }}

                />
              ))}
            </Space>
            // </Tooltip>
          );
        },
      },
      {
        title: "Action",
        key: "action",
        render: (record: Country) => (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                console.log("Edit record:", record);
                setCountryId(record.id);
                form.setFieldsValue({
                  countryName: record.name,
                  images: record.imageUrl.map((url, index) => ({
                    uid: index,
                    name: url,
                    status: "done",
                    url,
                  })),
                });
                showModal("edit", record);
              }}
            />
          </>
        ),
      },
    ],
    state: [
      { title: "SI.no", dataIndex: "siNo", key: "siNo" },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        filterDropdown: (props: any) => (
          <FilterDropdown {...props} placeholder={`Search by Name`} />
        ),
        onFilter: (value: any, record: any) =>
          record.name.toLowerCase().includes(value.toLowerCase()),
      },
      {
        // country
        title: "Country",
        dataIndex: "countryId",
        key: "countryId",
        render: (countryId: number) => {
          const country = CountryData?.find(
            (country) => country.id === countryId,
          );
          return country?.name;
        }
      },
      {
        title: "Images",
        dataIndex: "imageUrl",
        key: "imageUrl",

        render: (images: string[]) => {
          console.log("imagescadscascas", images);

          return (
            // <Tooltip title="Click to view images">
            <Space
              size="middle"
              className="cursor-pointer
                            "
            >
              {images?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="stay"
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                  onClick={() => {
                    // Open modal to show image
                    // You can implement your own modal component or use a library like antd Modal
                    // Here's an example using antd Modal
                    Modal.info({
                      title: `
                                            ${url.split("/").pop()}
                                            `,
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
              ))}
            </Space>
            // </Tooltip>
          );
        },
      },
      {
        title: "Action",
        key: "action",
        render: (record: State) => (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setStateId(record.id);
                form.setFieldsValue({
                  stateName: record.name,
                  images: record.imageUrl.map((url, index) => ({
                    uid: index,
                    name: url,
                    status: "done",
                    url,
                  })),
                  countryId: record.countryId,
                });
                showModal("edit", record);
              }}
            />
          </>
        ),
      },
    ],
    city: [
      { title: "SI.no", dataIndex: "siNo", key: "siNo" },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        filterDropdown: (props: any) => (
          <FilterDropdown {...props} placeholder={`Search by Name`} />
        ),
        onFilter: (value: any, record: any) =>
          record.name.toLowerCase().includes(value.toLowerCase()),
      },
      {
        // country
        title: "Country",
        dataIndex: "countryId",
        key: "countryId",
        render: (countryId: number) => {
          const country = CountryData?.find(
            (country) => country.id === countryId,
          );
          return country?.name;
        }
      },
      {
        // state
        title: "State",
        dataIndex: "stateId",
        key: "stateId",
        render: (stateId: number) => {
          const state = StateData?.find((state) => state.id === stateId);
          return state?.name;
        }
      },
      {
        title: "Images",
        dataIndex: "imageUrl",
        key: "imageUrl",

        render: (images: string[]) => {
          console.log("imagescadscascas", images);

          return (
            // <Tooltip title="Click to view images">
            <Space
              size="middle"
              className="cursor-pointer
                            "
            >
              {images?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="stay"
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                  onClick={() => {
                    // Open modal to show image
                    // You can implement your own modal component or use a library like antd Modal
                    // Here's an example using antd Modal
                    Modal.info({
                      title: `
                                            ${url.split("/").pop()}
                                            `,
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
              ))}
            </Space>
            // </Tooltip>
          );
        },
      },
      {
        title: "Action",
        key: "action",
        render: (record: City) => (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setCityId(record.id);
                form.setFieldsValue({
                  cityName: record.name,
                  images: record.imageUrl.map((url, index) => ({
                    uid: index,
                    name: url,
                    status: "done",
                    url,
                  })),
                  stateId: record.stateId,
                  countryId: record.countryId,
                });
                showModal("edit", record);
              }}
            />
          </>
        ),
      },
    ],
  };

  interface imageMetaData {
    uid: string;
    name: string;
    status: string;
    url: string;
  }

  const renderUploadSection = (
    form: any,
    modalType: string,
  ) => (
    <>
      {
        ((!form.getFieldValue("images") && modalType === "create") || (modalType === "edit" && form.getFieldValue("images")?.length === 0)) &&
        (
          <Form.Item
            name="images"
            label="Images"
            rules={[
              { required: true, message: "Please upload images", type: "array" },
            ]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              accept="image/png, image/jpeg, image/jpg"
              onChange={(info) => {
                console.log("info", info);
                form.setFieldsValue({ images: info.fileList });
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>
        )}
      {modalType !== "create" && form.getFieldValue("images")?.map((file: imageMetaData) => (
        <div
          style={{ position: "relative", display: "inline-block", margin: 5 }}
        >
          <img
            key={file.uid}
            src={file.url}
            alt={file.name}
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
          <DeleteOutlined
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => {
              handleDelete(file.url);
            }}
          />
        </div>
      ))}
    </>
  );

  const renderFormFields: () => JSX.Element | null = () => {
    const commonFields = {
      country: (
        <>
          <Form.Item
            name="countryName"
            label="Country Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {renderUploadSection(form, modalType)}
          {/* {modalType === "edit" && renderActiveSwitch(readOnly)} */}
        </>
      ),
      state: (
        <>
          <Form.Item
            name="stateName"
            label="State Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="countryId"
            label="Country Name"
            rules={[{ required: true }]}
          >
            <Select
              options={CountryData?.map((country) => ({
                label: country.name,
                value: country.id,
              }))}
              showSearch
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
            />
          </Form.Item>
          {renderUploadSection(form, modalType)}
        </>
      ),
      city: (
        <>
          <Form.Item
            name="cityName"
            label="City Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stateId"
            label="State Name"
            rules={[{ required: true }]}
          >
            <Select
              options={StateData?.map((state) => ({
                label: state.name,
                value: state.id,
              }))}
              showSearch
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="countryId"
            label="Country Name"
            rules={[{ required: true }]}
          >
            <Select
              options={CountryData?.map((country) => ({
                label: country.name,
                value: country.id,
              }))}
              showSearch
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
            />
          </Form.Item>
          {renderUploadSection(form, modalType)}
        </>
      ),
    };

    return commonFields[activeTab as "country" | "state" | "city"];
  };

  const mapData = (
    dataLoading: boolean,
    data: Country[] | State[] | City[] | undefined,
  ) => {
    if (dataLoading) return [];
    return data?.map((item, index) => ({
      key: index,
      siNo: index + 1,
      ...item,
    }));
  };

  const dataSource = () => {
    switch (activeTab) {
      case "country":
        return mapData(CountryDataLoading, CountryData || []);
      case "state":
        return mapData(StateDataLoading, StateData || []);
      case "city":
        return mapData(CityDataLoading, CityData || []);
      default:
        return [];
    }
  };

  const handleDeleteClick = async () => {
    console.log("selectedRowKeys", selectedRowKeys);

    if (selectedRowKeys.length === 0) {
      message.error(`Please select a ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} to delete`);
    } else {
      if (confirm(`Are you sure you want to delete ${activeTab} ?`)) {
        const data = await DeleteApiCustomerRoutes(
          activeTab === "country"
            ? route.backend.deleteCountry
            : activeTab === "state"
              ? route.backend.deleteState
              : route.backend.deleteCity,
          {
            userId: UserID,
            id: selectedRows.map((row) => row.id),
          },
        );
        if (data.statusCode === 200) {
          message.success(`${activeTab} deleted successfully`);
          const data = await queryClient.invalidateQueries({
            queryKey:
              activeTab === "country"
                ? ["Countries"]
                : activeTab === "state"
                  ? ["States"]
                  : ["Cities"],
          });

          console.log(
            "data",
            queryClient.getQueriesData({
              queryKey: ["Stays"],
            }),
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

  const { mutate: deleteFile } = DeleteMutation({
    mutationKey: ["deleteFile"],
    queryKeyToInvalidate: ["Stays"],
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
    let data;
    //setuid(fileName);
    if (activeTab === "country") {
      data = {
        key: fileName,
        countryId: countryId,
        url: url,
      };
    }
    if (activeTab === "state") {
      data = {
        key: fileName,
        stateId: stateId,
        url: url,
      };
    }
    if (activeTab === "city") {
      data = {
        key: fileName,
        cityId: cityId,
        url: url,
      };
    }
    console.log("data", data);

    deleteFile(data, {
      onSuccess: () => {
        const updatedImages = (form.getFieldValue("images") || []).filter(
          (image: imageMetaData) => extractFileName(image.url) !== fileName,
        );

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
  return (
    <div className="p-5">
      {contextHolder}
      <Tabs
        defaultActiveKey="country"
        onChange={(key) => {
          setActiveTab(key);
          setSelectedRowKeys([]);
        }}
      >
        <TabPane tab="Country" key="country" />
        <TabPane tab="State" key="state" />
        <TabPane tab="City" key="city" />
      </Tabs>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" onClick={() => {
            showModal("create", undefined)
            form.resetFields()
          }}>
            {`Create ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </Button>
          <Button
            type="text"
            className="bg-red-500 text-white border-none rounded-md px-4 py-2 hover:bg-red-600"
            onClick={() => handleDeleteClick()}
            icon={<DeleteOutlined />}
          >
            {`Delete ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </Button>
        </div>
      </div>

      <Table
        columns={columns && columns[activeTab]}
        dataSource={dataSource()}
        loading={CountryDataLoading || StateDataLoading || CityDataLoading}
        scroll={{ x: "auto" }}
        size="small"
        pagination={{
          pageSize: 10,
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
            setSelectedRows(selectedRows);
            // handleDeleteClick();
            console.log("selectedRows", selectedRows);
          },
        }}
      />
      <Modal
        title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"Save"}
        cancelButtonProps={{
          style: { display: "inline-block" },
        }}
      >
        <Form form={form} layout="vertical">
          {renderFormFields()}
        </Form>
      </Modal>
    </div>
  );
};

export default Location;
