import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Space } from "antd";
import { DashboardFormsProps, FormField } from "../../../interfaces/interfaces";
import dayjs from 'dayjs';
import 'dayjs/locale/en' // import locale
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);

const FormComponent: React.FC<DashboardFormsProps> = ({
  formData,
  formStyle = {},
  onFinish,
  form,
  onValuesChange,
  RenderState
}
) => {
  const getFields = () => {

    const valueSetter = (field: string) => {
      switch (field) {
        case "input":
          return "value";
        case "select":
          return "value";
        // return "defaultValue";
        case "textarea":
          return "value";
        // "defaultValue";
        case "checkbox":
          return "checked";
        case "text":
          return "value";
        // case "radio":
        //   return "value";
        case "password":
          return "value";
        case "email":
          return "value";
        case "date":
          return "value";
        default:
          return "value";
      }
    }

    const setDefaultValues = (
      field: FormField
    ) => {
      if (field.data.length > 0) {
        if (field.isInput === "select") {
          return field.isInputProps?.defaultValue;
        } else if (field.isInput === "radio") {
          return field.isInputProps?.defaultValue;
        } else if (field.isInput === "checkbox") {
          return field.isInputProps?.defaultChecked;
        } else if (
          field.isInput === "text" ||
          field.isInput === "textarea" ||
          field.isInput === "input" ||
          field.isInput === "email" ||
          field.isInput === "password"
        ) {
          return field.data[0].value;
        }
      }
      return undefined;
    }


    return formData.map((field, index) => {
      // console.log('RenderState', RenderState)
      return (
        (
          field.renderFieldName === undefined || (field.renderFieldName && RenderState[field.renderFieldName] === true)
        ) &&
        <Col
          sm={{ span: 24 }}
          md={{ span: 12 }}
          key={index}>
          <Form.Item
            name={field.name}
            label={field.label}
            rules={field.rules}
            labelAlign="left"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            validateFirst={field.isInput === "password"}
            hasFeedback={field.isInput === "password"}
            // validateTrigger={field.isInputProps?.validateTrigger || "onChange"}
            dependencies={field.dependencies || []}
            valuePropName={valueSetter(field.isInput)}
            style={{
              ...field.style,
              // i want to put style for every odd row
              // backgroundColor: index % 2 === 0 ? "white" : "#E8ECFF",
            }}
            initialValue={setDefaultValues(field)}
          >
            {(() => {
              switch (field.isInput) {
                // case "input":
                case "textarea":
                  return <Input.TextArea
                    // placeholder={field.placeholder}
                    {...field.isInputProps}
                    defaultValue={
                      field.data?.length > 0 ? field.data[0].value : ""
                    }
                  />;
                case "input":
                  return (
                    <Input
                      {...field.isInputProps}
                      defaultValue={field.data?.length > 0 ? field.data[0].value : ""}
                    // value={field.data?.length > 0 ? field.data[0].value : ""}
                    />
                  );
                case "number":
                  return (
                    <Input
                      type="number"
                      {...field.isInputProps}
                      defaultValue={field.data?.length > 0 ? field.data[0].value : ""}
                      // value={field.data?.length > 0 ? field.data[0].value : ""}
                      // maxLength={field.isInputProps?.maxLength ?? 10}
                      max={field.isInputProps?.maxLength}
                      min={field.isInputProps?.minLength}
                    />
                  );
                case "select":
                  return (
                    <Select
                      {...field.isInputProps}
                      dropdownStyle={{ backgroundColor: "white" }}
                      defaultValue={field.isInputProps?.defaultValue}
                      disabled={field.isInputProps?.disabled}
                      loading={field.isInputProps?.loading}
                      mode={field.isInputProps?.mode as "multiple" | "tags" | undefined}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        console.log('input', input)
                        console.log('option', option)
                        if (typeof option?.value === 'number') {
                          // return (option?.value as number).toFixed(0).includes(input)
                          return (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                        } else {

                          return (option?.value as string ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      }}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    >
                      {field.data?.map((item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  );
                case "checkbox":
                  return (
                    <Space>
                      <Checkbox
                        style={{ paddingLeft: "10px", scale: "1.5" }}
                        onChange={(e) => form.setFieldsValue({ [field.name]: e.target.checked })}
                        defaultChecked={
                          field.isInputProps?.defaultChecked ?? false
                        }
                      />
                    </Space>
                  );
                case "text":
                  return (
                    <div style={{ paddingLeft: "2rem" }}>
                      {field.data?.map((item) => {
                        form.setFieldsValue({
                          [field.name]: item.value,
                        });
                        return <div key={item.value}>{item.value}</div>;
                      })}
                    </div>
                  );
                case "radio":
                  return (
                    <Radio.Group {...field.isInputProps}
                    // value={field.isInputProps?.defaultValue ?? ""}
                    // defaultValue={field.isInputProps?.defaultValue ?? ""}
                    >
                      {field.data?.map((item) => (
                        <Radio key={item.value} value={item.value}>
                          {item.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  );
                case "password":
                  return <Input.Password {...field.isInputProps} defaultValue={field.isInputProps?.defaultValue ?? ""} />;
                case "email":
                  return <Input type="email" {...field.isInputProps} defaultValue={field.isInputProps?.defaultValue ?? ""} />;
                case 'date':
                  console.log(dayjs(field.isInputProps?.defaultValue).isValid())
                  return <DatePicker
                    defaultValue={dayjs(field.isInputProps?.defaultValue).isValid() ? dayjs(field.isInputProps?.defaultValue) : undefined}
                    style={{ width: "100%" }}
                  />;
                default:
                  return null;
              }
            })()}
          </Form.Item>
        </Col>
      )
    }
    );
  };
  return (
    <Form
      form={form}
      name="advanced_search"
      style={{ ...formStyle }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      labelWrap
      wrapperCol={{ flex: 1 }}
      colon={false}
    >
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32
        }}

      >{getFields()}</Row>
    </Form>
  );
};

export default FormComponent;
