/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Tooltip,
  Tag,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  GetAmenity,
  GetCity,
  GetCountry,
  GetState,
  GetStay,
} from "@/hooks/GetHooks";
import { Amenity, City, Country, State, Stay } from "@/interfaces/interfaces";
import { SaveMutation, DeleteMutation } from "@/hooks/MutationHooks";
import { route } from "@/routes/routes";
import FilterDropdown from "@/component/ui/FilterDropDown/FilterDropdown";
import { ColumnType } from "antd/es/table";
import { DeleteApiCustomerRoutes } from "@/hooks/ApiCustomerHooks";
import { useCurrentUserData } from "@/utils/state";
import { UserData } from "@/interfaces/interfaces";
import { queryClient } from "@/hooks/Hooks";
interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userName: string;
}
export interface StayFormField {
  id?: number;
  name: string;
  description: string;
  address: string;
  email: string;
  contact: string;
  price: number;
  country: Country;
  state: State;
  city: City;
  images: string[];
  videos: string[];
  specialFacilities: Amenity[];
  Users: User[];
}

import OSMAutocomplete from "@/components/OSMAutocomplete";

// Wrapper for Google Maps Place Picker Web Component
const PlacePicker = ({ onPlaceSelect, type = "", placeholder = "" }: any) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      const listener = async (e: any) => {
        const place = e.detail.place;
        if (place) {
          await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
          const value = type.includes('cities') ? place.displayName : place.formattedAddress;
          onPlaceSelect(value);
        }
      };
      ref.current.addEventListener("gmp-places-place-select", listener);
      return () => {
        if (ref.current) ref.current.removeEventListener("gmp-places-place-select", listener);
      }
    }
  }, [ref, type]);

  return (
    // @ts-ignore
    <gmp-place-picker ref={ref} type={type} placeholder={placeholder} style={{ width: '100%' }}></gmp-place-picker>
  );
};

const StayPage: React.FC = () => {
  const [modalState, setModalState] = useState({
    isCreateVisible: false,
    isEditVisible: false,
    isViewVisible: false,
    isFilterVisible: false,
    editingRecord: {} as Stay | null,
  });
  const [stayid, setStayId] = useState("");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: stayData, isLoading: stayDataLoading } = GetStay<Stay[]>();
  const { data: CountryData } = GetCountry<Country[]>();
  const { data: StateData } = GetState<State[]>();
  const { data: CityData } = GetCity<City[]>();
  const { data: AmenityData } = GetAmenity<Amenity[]>();
  const [pageSize, setPageSize] = useState(10);

  const [countryOptions, setCountryOptions] = useState<Map<string, string>>(
    new Map()
  );
  const [stateOptions, setStateOptions] = useState<Map<string, string>>(
    new Map()
  );
  const [cityOptions, setCityOptions] = useState<Map<string, string>>(
    new Map()
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const UserID = useCurrentUserData(
    (state) =>
      (
        state as {
          CurrentUserData: UserData;
        }
      ).CurrentUserData.id
  );

  useEffect(() => {
    if (CountryData) {
      const countryMap = new Map(CountryData.map((c) => [c.name, c.id]));
      setCountryOptions(countryMap as any);
    }
  }, [CountryData]);

  useEffect(() => {
    if (StateData) {
      const stateMap = new Map(StateData.map((s) => [s.name, s.id]));
      setStateOptions(stateMap as any);
    }
  }, [StateData]);

  useEffect(() => {
    if (CityData) {
      const cityMap = new Map(CityData.map((c) => [c.name, c.id]));
      setCityOptions(cityMap as any);
    }
  }, [CityData]);

  const columns = [
    {
      title: "SI.no",
      dataIndex: "siNo",
      key: "siNo",
    },
    {
      title: "Stay Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Amenity, b: Amenity) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      filterDropdown: (props: any) => (
        <FilterDropdown {...props} placeholder="Search Stay Name" />
      ),
      onFilter: (value: any, record: any) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    //   filterDropdown: (props: any) => (
    //     <FilterDropdown {...props} placeholder="Search Email" />
    //   ),
    //   onFilter: (value: any, record: any) =>
    //     record.email.toLowerCase().includes(value.toLowerCase()),
    // },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props} placeholder="Search City" />
      ),
      onFilter: (value: any, record: any) =>
        record.city.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props} placeholder="Search State" />
      ),
      onFilter: (value: any, record: any) =>
        record.state.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props} placeholder="Search Country" />
      ),
      onFilter: (value: any, record: any) =>
        record.country.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props} placeholder="Search Address" />
      ),
      onFilter: (value: any, record: any) =>
        record.address.toLowerCase().includes(value.toLowerCase()),
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-center">{`${text.slice(0, 50)}...`}</span>
        </Tooltip>
      ),
      width: "20%",
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",

      render: (images: string[]) => {
        return (
          // <Tooltip title="Click to view images">
          <Space size="middle" className="cursor-pointer">
            {images.length > 0 && (
              <>
                <img
                  src={images[0]}
                  alt="stay"
                  style={{ width: 100, height: 50, objectFit: "cover" }}
                  onClick={() => {
                    Modal.info({
                      title: "All Images",
                      content: (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          {images.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`stay-${idx}`}
                              style={{
                                width: "200px",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                          ))}
                        </div>
                      ),
                      width: 800,
                    });
                  }}
                />
                {images.length > 1 && (
                  <Tag
                    color="blue"
                    className="cursor-pointer"
                    onClick={() => {
                      Modal.info({
                        title: "All Images",
                        content: (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "10px",
                            }}
                          >
                            {images.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`stay-${idx}`}
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                            ))}
                          </div>
                        ),
                        width: 800,
                      });
                    }}
                  >
                    +{images.length - 1} more
                  </Tag>
                )}
              </>
            )}
          </Space>
          // </Tooltip>
        );
      },
    },
    {
      title: "Videos",
      dataIndex: "videos",
      key: "videos",
      render: (videos: string[]) => {
        return (
          <Space size="middle" className="cursor-pointer">
            {videos.length > 0 && (
              <span
                onClick={() => {
                  // Open modal to show videos
                  // You can implement your own modal component or use a library like antd Modal
                  // Here's an example using antd Modal
                  Modal.info({
                    title: `Videos (${videos.length})`,
                    content: (
                      <Space size="middle">
                        {videos.map((url, index) => (
                          <div
                            key={index}
                            style={{ display: "inline-block", margin: 5 }}
                          >
                            <iframe
                              width="250"
                              height="200"
                              // "https://youtu.be/6EEW-9NDM5k?si=iQRk2kYf56oI9uYB"
                              // get the video id from the url which is from /6 to k before ?
                              src={`https://www.youtube.com/embed/${url.split("/")[url.split("/").length - 1].split("?")[0]}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ))}
                      </Space>
                    ),
                    width: 800,
                  });
                }}
              >
                <Tooltip title="Click to view videos">
                  {videos.length} videos
                </Tooltip>
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Special Facilities",
      dataIndex: "specialFacilities",
      key: "specialFacilities",
      render: (specialFacilities: Amenity[]) => (
        <>
          {specialFacilities && specialFacilities.length > 0
            ? specialFacilities?.map((facility, index) => (
              <Tag key={index} color="blue">
                {facility.name}
              </Tag>
            ))
            : "No special facilities"}
        </>
      ),
      filters: AmenityData?.map((amenity) => ({
        text: amenity.name,
        value: amenity.id,
      })),
      onFilter: (value: any, record: any) =>
        record.specialFacilities
          .map((amenity: Amenity) => amenity.id)
          .includes(value),
    },
    {
      title: "Action",
      key: "action",
      render: (record: Stay) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              // console.log(
              //   "View:",
              //   Array.isArray(record.Users)
              //     ? record.Users[0]?.userName
              //     : (record.Users as { user: User }).user.userName
              // );
              handleView(record);
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record as any)}
          />
        </Space>
      ),
    },
  ];

  const { mutate: saveData } = SaveMutation({
    mutationKey: ["CreateStay"],
    queryKeyToInvalidate: ["Stays"],
    getSuccessMessage: (variables: any) =>
      `Stay ${variables.id ? "updated" : "created"} successfully`,
    getErrorMessage: (error: any) =>
      `Failed to ${error.id ? "update" : "create"} stay: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.createStay,
  });

  const { mutate: saveDataUpload } = SaveMutation({
    mutationKey: ["uploadFileCountry"],
    queryKeyToInvalidate: ["GetCountry"],
    getSuccessMessage: () => `File uploaded successfully`,
    getErrorMessage: (error: any) => `Failed to Upload file: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.uploadfile,
  });

  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  const handleCreate = async () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Create:", values);
        const data = {
          name: values.stayName,
          address: values.address,
          description: values.description,
          contact: values.contact,
          price: values.price,
          countryId: values.country,
          stateId: values.state,
          cityId: values.city,
          email: values.email,
          specialFacilities: values.specialFacilities,
          videos: values.videos,
          rating: 1,
          latitude: coordinates?.lat || 0,
          longitude: coordinates?.lon || 0,
        };
        console.log("Submitting Data:", data);
        console.log("Form Values (Raw):", values);
        saveData(data, {
          onSuccess: async (stayResponse) => {
            console.log("Stay created:", stayResponse);

            // Prepare FormData for file upload
            const formData = new FormData();
            if (values.images && values.images.fileList) {
              values.images.fileList.forEach((file: { originFileObj: File }) => {
                formData.append("files", file.originFileObj);
              });
            }
            //     if(values.videos!=undefined){
            //     values.videos.fileList.forEach((file: {
            //         originFileObj: File;
            //     }) => {
            //         formData.append('files', file.originFileObj);
            //     });
            // }
            formData.append("stayId", stayResponse.data.id); // Assuming you get the country ID from response

            // Upload files after country creation
            saveDataUpload(formData, {
              onSuccess: async () => {
                //console.log('Image upload response:', uploadResponse);
                form.resetFields();
                await queryClient.invalidateQueries({
                  queryKey: ["Stays"], // Ensure the query key is correct
                });
                //setIsModalVisible(false);
              },
              onError: (error) => {
                console.error("Image upload failed:", error);
                message.error("Image upload failed");
              },
            });
            message.success("Stay created successfuly");
          },
          onError: (error) => {
            console.error("Failed to save country data:", error);
            message.error(`Failed to save country data ${error}`);
          },
        });

        setModalState((prev) => ({ ...prev, isCreateVisible: false }));
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEdit = (record: StayFormField) => {
    setModalState(
      (prev) => ({ ...prev, isEditVisible: true, editingRecord: record }) as any
    );
    console.log("Edit:", record);
    setStayId(record.id ? record.id.toString() : "");
    //editForm.setFieldsValue(record);
    editForm.setFieldsValue({
      stayName: record.name,
      address: record.address,
      email: record.email,
      description: record.description,
      contact: record.contact,
      price: record.price,
      country: record.country,
      state: record.state,
      city: record.city,

      specialFacilities: record.specialFacilities.map((amenity) => amenity.id),
      images: record.images.map((url, index) => ({
        uid: index,
        name: url,
        status: "done",
        url,
      })),
      videos: record.videos,
    });
  };

  const { mutate: saveDataEdit } = SaveMutation({
    mutationKey: ["updateStay"],
    queryKeyToInvalidate: ["Stays"],
    getSuccessMessage: (variables: any) =>
      `Stay ${variables.id ? "updated" : "created"} successfully`,
    getErrorMessage: (error: any) =>
      `Failed to ${error.id ? "update" : "create"} stay: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.updateStay,
    isUpdate: true,
  });

  const handleEditSave = () => {
    editForm
      .validateFields()
      .then((values) => {
        console.log("Edit:", values);

        const countryId = countryOptions.get(values.country);
        const stateId = stateOptions.get(values.state);
        let cityId;
        if (typeof values.city === "string") {
          cityId = cityOptions.get(values.city);
        } else {
          cityId = values.city;
        }
        // const cityId = cityOptions.get(values.city)
        console.log(
          "Country ID:",
          countryId,
          "State ID:",
          stateId,
          "City ID:",
          cityId
        );

        const data = {
          id: stayid,
          name: values.stayName,
          address: values.address,
          description: values.description,
          contact: values.contact,
          price: values.price,
          email: values.email,
          countryId: countryId,
          stateId: stateId,
          cityId: cityId,
          adminId: UserID,
          rating: 1,
          latitude: values.latitude,
          longitude: values.longitude,
          videos: values.videos,
          specialFacilities: values.specialFacilities,
          userId: localStorage.getItem("TripxingUserData")
            ? JSON.parse(localStorage.getItem("TripxingUserData") as string).id
            : undefined,
        };
        saveDataEdit(data, {
          onSuccess: (stayResponse) => {
            console.log("Stay created:", stayResponse);
            if (values.images.fileList || values.videos.fileList) {
              // Prepare FormData for file upload
              const formData = new FormData();

              values.images.fileList.forEach(
                (file: { originFileObj: File }) => {
                  formData.append("files", file.originFileObj);
                }
              );

              formData.append("stayId", stayResponse.data.id); // Assuming you get the country ID from response

              // Upload files after country creation
              saveDataUpload(formData, {
                onSuccess: () => {
                  //console.log('Image upload response:', uploadResponse);
                  editForm.resetFields();
                  //setIsModalVisible(false);
                },
                onError: (error) => {
                  console.error("Image upload failed:", error);
                  message.error("Image upload failed");
                },
              });
            }
            message.success("Saved successfully");
          },

          onError: (error) => {
            console.error("Failed to stay data:", error);
            message.error(`Failed to stay data ${error}`);
          },
        });

        setModalState((prev) => ({
          ...prev,
          isEditVisible: false,
          editingRecord: null,
        }));
        editForm.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        message.error("Failed to save stay");
      });
  };

  const handleView = (record: any) => {
    setModalState((prev) => ({
      ...prev,
      isViewVisible: true,
      editingRecord: record,
    }));
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

  const { mutate: deleteVideos } = DeleteMutation({
    mutationKey: ["deleteVideos"],
    queryKeyToInvalidate: ["Stays"],
    getSuccessMessage: () => `File deleted successfully`,
    getErrorMessage: (error: any) => `Failed to delete file: ${error}`,
    onMutateCallback: (variables: any) =>
      console.log("onMutateCallback", variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) =>
      console.log("onSettledCallback", data, error, variables, context),
    routes: route.backend.deleteVideos,
  });

  const extractFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleDelete = (url: string) => {
    const fileName = extractFileName(url);
    //setuid(fileName);
    const data = {
      key: fileName,
      stayId: stayid,
      url: url,
    };
    console.log("data", data);

    deleteFile(data, {
      onSuccess: () => {
        const updatedImages = (editForm.getFieldValue("images") || []).filter(
          (image: imageMetaData) => extractFileName(image.url) !== fileName
        );

        editForm.setFieldsValue({
          images: updatedImages,
        });
        message.success("File deleted successfully");
      },
      onError: (error: any) => {
        message.error(`Failed to delete file: ${error}`);
      },
    });
  };

  const handleDeleteVideos = (url: string) => {
    console.log("url", url);

    // const fileName = extractFileName(url);
    //setuid(fileName);
    const data = {
      // key:fileName,
      stayId: stayid,
      url: url,
    };
    console.log("data", data);

    deleteVideos(data, {
      onSuccess: () => {
        const updatedVideos = (editForm.getFieldValue("videos") || []).filter(
          (videoUrl: string) => videoUrl !== url
        );

        editForm.setFieldsValue({
          videos: updatedVideos,
        });
        message.success("File deleted successfully");
      },
      onError: (error: any) => {
        message.error(`Failed to delete file: ${error}`);
      },
    });
  };

  const handleAutopopulate = (value: any) => {
    const selectedCity = CityData?.find((city) => city.id === value);
    if (selectedCity) {
      const selectedState = StateData?.find(
        (state) => state.id === selectedCity.stateId
      );
      if (selectedState) {
        const selectedCountry = CountryData?.find(
          (country) => country.id === selectedState.countryId
        );
        form.setFieldsValue({
          state: selectedState.id,
          country: selectedCountry?.id,
        });
        // setTempState(selectedState.id);
        // setTempCountry(selectedCountry?.id || null);
      }
    }
  };

  interface imageMetaData {
    uid: string;
    name: string;
    status: string;
    url: string;
  }

  const renderModal = (
    title: string,
    visible: boolean,
    onCancel: () => void,
    onOk: () => void,
    formInstance: any
  ) => (
    <Modal
      title={<span>{title}</span>}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          Save
        </Button>,
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="horizontal"
        name="basic"
        initialValues={{ remember: true }}
        colon={false}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="Stay Name"
          name="stayName"
          rules={[{ required: true, message: "Please input stay name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        {/* Lat/Lon Hidden Fields */}
        <Form.Item name="latitude" hidden><Input /></Form.Item>
        <Form.Item name="longitude" hidden><Input /></Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Contact Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber defaultValue={0} />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input address!" }]}
        >
          <OSMAutocomplete
            placeholder="Search for an address"
            onChange={(val) => form.setFieldValue('address', val)}
            onSelect={(val, option) => {
              console.log("Selected Address:", val, option);
              form.setFieldValue('address', val);
              if (option.lat && option.lon) {
                setCoordinates({ lat: parseFloat(option.lat), lon: parseFloat(option.lon) });
                console.log("Coordinates Set:", option.lat, option.lon);
              }
            }}
          />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select a city"
            optionFilterProp="label"
            onChange={handleAutopopulate}
            options={CityData?.map((city) => ({
              value: city.id,
              label: city.name,
            }))}
          />
        </Form.Item>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Select
            showSearch
            allowClear
            disabled={true}
            options={//StateData?.filter(state => state.name === form.getFieldValue('state')).map(state => ({ value: state.id, label: state.name }))
              StateData?.map((state) => ({ value: state.id, label: state.name }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Select
            showSearch
            allowClear
            disabled={true}
            options={//CountryData?.filter(item => item.stateId === form.getFieldValue('state')).map(country => ({ value: country.id, label: country.name }))
              CountryData?.map((country) => ({
                value: country.id,
                label: country.name,
              }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          name="specialFacilities"
          label="Special Facilities"
          rules={[{ required: false }]}
        >
          <Select
            mode="multiple"
            showSearch
            allowClear
            options={AmenityData?.map((amenity) => ({
              value: amenity.id,
              label: amenity.name,
            }))}
            defaultValue={formInstance.getFieldValue("specialFacilities") || []}
          />
        </Form.Item>
        <Form.Item name="images" label="Images">
          <Upload multiple listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>
        {title === "Edit Stay" &&
          editForm &&
          editForm.getFieldValue("images")?.map((file: imageMetaData) => {
            console.log("file", file);
            return (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: 5,
                }}
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
                    //setuid(file.uid);
                    handleDelete(file.url);
                    // form.setFieldsValue({
                    //     images: form.getFieldValue('images').filter((image: imageMetaData) => image.uid !== file.uid),
                    // });
                  }}
                />
              </div>
            );
          })}

        {/* <Form.Item name="videos" label="Videos">
                    <Upload multiple listType="picture" beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload Videos</Button>
                    </Upload>
                </Form.Item> */}
        <Form.Item label="Videos">
          <Form.List name="videos">
            {(fields, { add, remove }) => (
              <>
                {fields.map(
                  ({ key, name, ...restField }) => (
                    console.log("fields", fields),
                    (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name]}
                          // fieldKey={[fieldKey]}
                          rules={[
                            { required: true, message: "Missing benefit" },
                          ]}
                        >
                          <Input placeholder="Videos" />
                        </Form.Item>
                        <Button
                          type="link"
                          onClick={() => {
                            remove(name);
                            handleDeleteVideos(
                              editForm.getFieldValue(["videos", name])
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </Space>
                    )
                  )
                )}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Videos
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
        {title === "Edit Stay" &&
          editForm.getFieldValue("videos")?.map((url: string) => {
            console.log("url", url);

            const videoId = url.split("/")[
              // eslint-disable-next-line no-unexpected-multiline
              url.split("/").length - 1
            ].split("?")[0];
            console.log("videoId", videoId);

            const embedUrl = `https://www.youtube.com/embed/${videoId}`;

            return (
              console.log("url", url),
              (
                <div
                  key={url}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    margin: 5,
                  }}
                >
                  <iframe
                    width="200"
                    height="150"
                    src={embedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <DeleteOutlined
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleDeleteVideos(url);
                      // editForm.setFieldsValue({
                      //     videos: editForm.getFieldValue('videos').filter((videoUrl: string) => videoUrl !== url),
                      // });
                    }}
                  />
                </div>
              )
            );
          })}
      </Form>
    </Modal>
  );

  // Add this function after renderModal
  const renderViewModal = (
    visible: boolean,
    onCancel: () => void,
    record: Stay | null
  ) => (
    <Modal
      title={<span>View Stay</span>}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={800}
    >
      <Form
        layout="horizontal"
        colon={false}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        initialValues={
          record
            ? {
              stayName: record.name,
              description: record.description,
              email: record.email,
              contact: record.contact,
              price: record.price,
              address: record.address,
              city: record.city,
              state: record.state,
              country: record.country,
              specialFacilities: record.specialFacilities,
              images: record.images,
              videos: record.videos,
            }
            : {}
        }
      >
        <Form.Item name="stayName" label="Stay Name">
          <Input disabled />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea disabled />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>
        <Form.Item name="contact" label="Contact Number">
          <Input disabled />
        </Form.Item>
        <Form.Item name="price" label="Price">
          <Input disabled />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input disabled />
        </Form.Item>
        <Form.Item name="city" label="City">
          <Input disabled />
        </Form.Item>
        <Form.Item name="state" label="State">
          <Input disabled />
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Input disabled />
        </Form.Item>
        <Form.Item name="specialFacilities" label="Special Facilities">
          <div style={{ minHeight: "32px" }}>
            {record?.specialFacilities?.map((facility, index) => (
              <Tag key={index} color="blue">
                {facility.name}
              </Tag>
            ))}
          </div>
        </Form.Item>
        {record?.images && record.images.length > 0 && (
          <Form.Item label="Images">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {record.images.map((url, index) => (
                <div
                  key={index}
                  style={{ position: "relative", display: "inline-block" }}
                >
                  <img
                    src={url}
                    alt={`stay-${index}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      Modal.info({
                        title: url.split("/").pop(),
                        content: (
                          <img
                            src={url}
                            alt="stay"
                            style={{
                              width: "100%",
                              maxHeight: "80vh",
                              objectFit: "contain",
                            }}
                          />
                        ),
                        width: 800,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </Form.Item>
        )}
        {record?.videos && record.videos.length > 0 && (
          <Form.Item label="Videos">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {record.videos.map((url, index) => {
                const videoId = url.split("/")[
                  // eslint-disable-next-line no-unexpected-multiline
                  url.split("/").length - 1
                ].split("?")[0];
                return (
                  <div
                    key={index}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <iframe
                      width="200"
                      height="150"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              })}
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );

  // Replace the existing view modal call with this

  const handleDeleteClick = async () => {
    if (selectedRowKeys.length === 0) {
      message.error("Please select a blog to delete");
    } else {
      if (confirm("Are you sure you want to delete this blog?")) {
        const data = await DeleteApiCustomerRoutes(route.backend.deleteStay, {
          userId: UserID,
          id: selectedRows.map((row) => row.id),
        });
        if (data.statusCode === 200) {
          message.success("Stay deleted successfully");
          const data = await queryClient.invalidateQueries({
            queryKey: ["Stays"],
          });

          console.log(
            "data",
            queryClient.getQueriesData({
              queryKey: ["Stays"],
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {/* Left-aligned buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            onClick={() =>
              setModalState((prev) => ({ ...prev, isCreateVisible: true }))
            }
          >
            Create Stay
          </Button>
          <Button
            type="text"
            className="bg-red-500 text-white border-none rounded-md px-4 py-2 hover:bg-red-600"
            onClick={() => handleDeleteClick()}
            icon={<DeleteOutlined />}
          >
            Delete Stay
          </Button>
        </div>
      </div>

      <Table
        columns={columns as ColumnType<any>[]}
        dataSource={
          stayDataLoading
            ? []
            : stayData?.map((item, index) => ({
              key: index,
              id: item.id,
              siNo: index + 1,
              name: item.name,
              email:
                ((item.Users as any[])?.[0]?.user?.email as string) || "",
              contact: item.contact,
              price: item.price,
              country: item.country?.name,
              state: item.state?.name,
              city: item.city?.name,
              address: item.address,
              description: item.description,
              images: item.images,
              videos: item.videos,
              specialFacilities: item.specialFacilities,
              User: item.Users,
            }))
        }
        loading={stayDataLoading}
        scroll={{ x: 1300 }}
        size="small"
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

      {renderModal(
        "Create Stay",
        modalState.isCreateVisible,
        () => {
          setModalState((prev) => ({ ...prev, isCreateVisible: false }));
          form.resetFields();
        },
        handleCreate,
        form
      )}
      {renderModal(
        "Edit Stay",
        modalState.isEditVisible,
        () => {
          setModalState((prev) => ({
            ...prev,
            isEditVisible: false,
            editingRecord: null,
          }));
          editForm.resetFields();
        },
        handleEditSave,
        editForm
      )}

      {/* View Modal */}
      {renderViewModal(
        modalState.isViewVisible,
        () => {
          setModalState((prev) => ({ ...prev, isViewVisible: false }));
        },
        modalState.editingRecord
      )}
    </div>
  );
};

export default StayPage;
