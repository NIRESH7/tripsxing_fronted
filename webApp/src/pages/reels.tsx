/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Upload, message, Tooltip, Switch } from 'antd';
import { useState } from 'react';
import { SaveMutation, DeleteMutation } from '@/hooks/MutationHooks';
import { route } from '@/routes/routes';
import { GetReel } from '@/hooks/GetHooks';
import { queryClient } from '@/hooks/Hooks';
import { DeleteApiCustomerRoutes } from '@/hooks/ApiCustomerHooks';
import { useCurrentUserData } from '@/utils/state';
import { UserData } from '@/interfaces/interfaces';

export interface IReel {
  id: number;
  description: string;
  link: string;
  deletedFlag: boolean;
  status: string;
}

const Reel = () => {

  const [isAddOpen, setAddOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState<IReel | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const { data: reelData } = GetReel<IReel[]>();


  const [form] = Form.useForm();
  const [AddForm] = Form.useForm();

  const handleCancel = () => {
    setAddOpen(false);
    setEditOpen(false);
    setSelectedReel(null);
    setIsUploadDisabled(false);
    form.resetFields();
  }


  const UserID = useCurrentUserData((state) => (state as {
    CurrentUserData: UserData;
  }).CurrentUserData.id);



  const handleUploadChange = (info: any) => {
    // If a file is uploaded, disable the upload button
    console.log('info', info);

    if (info.fileList.length > 0) {
      console.log('info.fileList', info.fileList);

      setIsUploadDisabled(true);
      setFileList(info.fileList);
    }
  };

  const handleRemove = () => {
    // Enable the upload button when a file is removed
    setIsUploadDisabled(false);
    setFileList([]);
  };

  const handleEditReel = (reel: IReel) => {
    setSelectedReel(reel);
    if (reel.link) {
      setIsUploadDisabled(true);
    }
    console.log('reel', reel);
    form.setFieldsValue({
      ...reel, // Spread the plan object to fill other fields
      active: reel.status === 'active', // Convert status to boolean for the toggle
    });

    setEditOpen(true);
  };


  const {
    mutate: saveData,
  } = SaveMutation({
    mutationKey: ['uploadReel'],
    queryKeyToInvalidate: ['Reels'],
    getSuccessMessage: (variables: any) => `Reel ${variables.id ? 'updated' : 'created'} successfully`,
    getErrorMessage: (error: any) => `Failed to ${error.id ? 'update' : 'create'} stay: ${error}`,
    onMutateCallback: (variables: any) => console.log('onMutateCallback', variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) => console.log('onSettledCallback', data, error, variables, context),
    routes: route.backend.uploadReel,
  })

  const {
    mutate: saveDataUpload,
  } = SaveMutation({
    mutationKey: ['uploadFileReel'],
    queryKeyToInvalidate: ['GetCountry'],
    getSuccessMessage: () => `File uploaded successfully`,
    getErrorMessage: (error: any) => `Failed to Upload file: ${error}`,
    onMutateCallback: (variables: any) => console.log('onMutateCallback', variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) => console.log('onSettledCallback', data, error, variables, context),
    routes: route.backend.uploadfile,
  })


  const {
    mutate: saveDataEdit,
  } = SaveMutation({
    mutationKey: ['updateStay'],
    queryKeyToInvalidate: ['Reels'],
    getSuccessMessage: (variables: any) => `Stay ${variables.id ? 'updated' : 'created'} successfully`,
    getErrorMessage: (error: any) => `Failed to ${error.id ? 'update' : 'create'} stay: ${error}`,
    onMutateCallback: (variables: any) => console.log('onMutateCallback', variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) => console.log('onSettledCallback', data, error, variables, context),
    routes: route.backend.updateReel,
    isUpdate: true
  })


  const {
    mutate: deleteFile,
  } = DeleteMutation({
    mutationKey: ['deleteFile'],
    queryKeyToInvalidate: ['Stays'],
    getSuccessMessage: () => `File deleted successfully`,
    getErrorMessage: (error: any) => `Failed to delete file: ${error}`,
    onMutateCallback: (variables: any) => console.log('onMutateCallback', variables),
    onSettledCallback: (data: any, error: any, variables: any, context: any) => console.log('onSettledCallback', data, error, variables, context),
    routes: route.backend.deleteFile,

  })

  const handleOk = async () => {
    try {
      const values = await AddForm.validateFields();
      console.log('Create:', values);

      const data = {
        description: values.description,
      };
      messageApi.open({
        content: 'Creating reel...',
        key: 'reel-creation',
        type: 'loading',
        duration: 0,
      });
      saveData(data, {
        onSuccess: async (reelResponse) => {
          console.log('Reel created:', reelResponse);

          // Prepare FormData for file upload
          const formData = new FormData();
          if (values.videos?.fileList) {
            values.videos.fileList.forEach((file: { originFileObj: File }) => {
              formData.append('files', file.originFileObj);
            });
          }

          formData.append('reelId', reelResponse.data.id); // Assuming you get the reel ID from the response

          // Upload files after reel creation
          saveDataUpload(formData, {
            onSuccess: async () => {
              console.log('Files uploaded successfully');
              AddForm.resetFields(); // Reset the form after success
              await queryClient.invalidateQueries({
                queryKey: ['Reels'], // Ensure the query key is correct
              });

              // message.success('Reel created successfully!');
              messageApi.success({
                content: 'Reel created successfully!',
                key: 'reel-creation',
              });
            },
            onError: (uploadError) => {
              console.error('File upload failed:', uploadError);
              // message.error('File upload failed. Please try again.');
              messageApi.error({
                content: 'File upload failed. Please try again.',
                key: 'reel-creation',
              })
            },
          });
        },
        onError: (saveError) => {
          console.error('Failed to save reel data:', saveError);
          // message.error(`Failed to save reel data: ${saveError.message || saveError}`);
          messageApi.error({
            content: `Failed to save reel data: ${saveError.message || saveError}`,
            key: 'reel-creation',
          });
        },
      });

      setAddOpen(false); // Close the modal
      AddForm.resetFields(); // Reset the form
    } catch (validationError) {
      console.error('Validation Failed:', validationError);
      // message.error('Please fix the form errors before submitting.');
      messageApi.error({
        content: 'Please fix the form errors before submitting.',
        key: 'reel-creation',
      });
    }
  };



  const handleOkEdit = () => {
    let data: any;
    form.validateFields()
      .then(values => {
        console.log('Create:', values);
        if (selectedReel) {
          console.log('selectedReel', selectedReel);

          data = {
            description: values.description,
            status: values.active ? 'active' : 'inactive',
            id: selectedReel.id
          }
        }

        saveDataEdit(data, {
          onSuccess: (reelResponse) => {
            console.log('Reel created:', reelResponse);
            if (values.videos) {
              // Prepare FormData for file upload
              const formData = new FormData();
              // values.images.fileList.forEach((file: {
              //     originFileObj: File;
              // }) => {
              //     formData.append('files', file.originFileObj);
              // });
              values.videos.fileList.forEach((file: {
                originFileObj: File;
              }) => {
                formData.append('files', file.originFileObj);
              });

              formData.append('reelId', reelResponse.data.id); // Assuming you get the country ID from response

              // Upload files after country creation
              saveDataUpload(formData, {
                onSuccess: () => {
                  //console.log('Image upload response:', uploadResponse);
                  form.resetFields();
                  //setIsModalVisible(false);
                },
                onError: (error) => {
                  console.error('Image upload failed:', error);
                  message.error('Image upload failed');
                },
              });
              message.success('Reel added successfuly');
            }
          },
          onError: (error) => {
            console.error('Failed to save reel data:', error);
            message.error(`Failed to save reel data ${(error)}`);
          },
        }
        );


        // setModalState(prev => ({ ...prev, isCreateVisible: false }));
        setEditOpen(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };


  const extractFileName = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };


  const handleDeleteReel = (reelId: number) => {
    const fileName = extractFileName(selectedReel!.link);
    //setuid(fileName);
    const data = {
      key: fileName,
      reelId: reelId,
      url: selectedReel!.link
    }
    console.log('data', data);
    deleteFile(data
      , {
        onSuccess: () => {


          message.success('File deleted successfully');
        },
        onError: (error: any) => {
          message.error(`Failed to delete file: ${error}`);
        },
      }
    );
  }


  const handleDeleteReelMain = async (reelId: number) => {
    if (confirm('Are you sure you want to delete this reel?')) {
      const data = await DeleteApiCustomerRoutes(route.backend.deleteReel, {
        userId: UserID,
        id: reelId,
      })
      if (data.statusCode === 200) {
        message.success('Reel deleted successfully');
        const data = await queryClient.invalidateQueries({
          queryKey: ['Reels'],
        });

        console.log('data', queryClient.getQueriesData({
          queryKey: ['Reels'],
        }));


        console.log('data', data);


      } else {
        message.error({
          content: data.message,
          key: 'updatable',
          duration: 2,
        });
      }
    }
  }



  return (
    <div className="min-h-screen bg-gray-100">
      {contextHolder}
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <Button type="primary" onClick={() => setAddOpen(true)}>
          Add Reel
        </Button>
      </div>

      {/* Reels display grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {reelData && reelData.length > 0 ? (
          reelData.map((reel) => (
            <div
              key={reel.id}
              className="relative rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition duration-300"
            >
              <div
                className="relative cursor-pointer"
                onClick={() => handleEditReel(reel)}
              >
                <div className="w-full aspect-[4/5]">
                  <video
                    src={reel.link}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Delete Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteReelMain(reel.id);
                }}
                className="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                  alt="Delete"
                  className="w-4 h-4"
                />
              </button>

              <p className="mt-2 text-xs text-gray-700 text-center p-2">
                {reel.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No reels available</p>
        )}
      </div>

      {/* Add Reel Modal */}
      <Modal title="Add Reel" open={isAddOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={AddForm} layout="vertical">
          <Form.Item
            name="description"
            label="Description *"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="videos" label="Upload Reel">
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={handleRemove}
            >
              <Button icon={<UploadOutlined />} disabled={isUploadDisabled}>
                Upload Reel
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Reel Modal */}
      <Modal title="Edit Reel" open={isEditOpen} onOk={handleOkEdit} onCancel={handleCancel}>
        {selectedReel && (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ description: selectedReel.description }}
          >
            {/* Description Input */}
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <Input placeholder="Enter reel description" />
            </Form.Item>

            {/* Upload Field */}
            <Form.Item name="videos" label="Upload Reel">
              <Upload
                listType="picture"
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleUploadChange}
                onRemove={handleRemove}
              >
                <Button icon={<UploadOutlined />} disabled={isUploadDisabled}>
                  Upload Reel
                </Button>
              </Upload>
            </Form.Item>

            {/* Small Video Preview with Delete Icon */}
            <div className="relative w-1/2 mb-4">
              {selectedReel.link && (
                <div id="video" className="relative">
                  <video
                    src={selectedReel.link}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Tooltip title="Delete Reel">
                    <DeleteOutlined
                      className="absolute top-2 right-2 text-red-500 text-xl cursor-pointer bg-white bg-opacity-70 p-1 rounded-full"
                      onClick={() => handleDeleteReel(selectedReel.id)}
                    />
                  </Tooltip>
                </div>
              )}
            </div>

            <Form.Item name="active" label="Active" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Reel;