import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TablePaginationConfig } from 'antd';
import { Checkbox, Form, Input, Select, Table, message } from 'antd';
import Buttons from '../../../component/ui/Button/Button';
import upArrowIcon from '../../../assets/icons/upArrowIcon.svg';
import { DeleteMutation } from '../../../hooks/MutationHooks';
import DeleteModal from '../../../component/ui/Modal/DeleteModal'
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';

// ? This Interface is used to define the props of the Form component
type FormInstance<T> = GetRef<typeof Form<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
    key: string;
    parameterListName: string;  //! parameterListId is mention in API clarify with @Amrut
    autoAssignRule: string;
    // workAreaDeptId: number; //! workAreaDeptId is mention in API clarify with @Amrut
    workAreaDeptName: string; //! workAreaDeptId is mention in API clarify with @Amrut
    autoAssignAnalyst: number; // ? User with Role as Analyst need to be mentioned here
    repeatCount: number;
    forceNew: string;
    mandatory: boolean;
    toBeInvoiced: boolean;
    rule: string
}

interface EditableRowProps {
    index: number;
}

// ? This Interface is used to define the props of the EditableCell component
type PropsData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};
interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    inputType: string;
    propsData?: PropsData;
    // {
    //     [key: string]: K[];
    //     // ParameterListData: ParameterList[],
    //     // DepartmentListData: DepartmentList[],
    //     // UserListData: User[],
    //     // AutoAssignRule: ReferenceValues[],
    //     // forceNewData: ReferenceValues[],
    //     // setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    // }
    record: Item;
    handleSave: (record: Item) => void;
    propsDataName?: {
        keyName: string,
        valueName: string
        labelName: string
    };
    defaultValue?: string[];
}

// ? This Interface is used to define the props of the EditableTable component

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    key: React.Key;
    parameterListName: string;  //! parameterListId is mention in API clarify with @Amrut
    autoAssignRule: string;
    // workAreaDeptId: number; //! workAreaDeptId is mention in API clarify with @Amrut
    workAreaDeptName: string; //! workAreaDeptId is mention in API clarify with @Amrut
    autoAssignAnalyst: number; // ? User with Role as Analyst need to be mentioned here
    repeatCount: number;
    forceNew: string;
    mandatory: boolean;
    toBeInvoiced: boolean;
    rule: string
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;



const EditableRow: React.FC<EditableRowProps> = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index,
    ...props }) => {
    const [form] = Form.useForm();
    // console.log('index', index);
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    inputType,
    propsData,
    propsDataName,
    defaultValue,
    // {
    //     ...ColumnRequiredData
    //     // ParameterListData,
    //     // DepartmentListData,
    //     // UserListData,
    //     // AutoAssignRule,
    //     // forceNewData,
    //     // setIsModalOpen
    // } = {
    //     ...ColumnRequiredData
    //     // ParameterListData: [],
    //     // DepartmentListData: [],
    //     // UserListData: [],
    //     // AutoAssignRule: [],
    //     // forceNewData: [],
    //     // setIsModalOpen: () => { }
    // },
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    // const [ruleModal] = Form.useForm();
    const form = useContext(EditableContext)!;
    // const form1 = ruleModal
    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    const getOptions = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _dataIndex: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _inputType: string
    ) => {
        // console.log('inputType', inputType);
        // console.log('dataIndex', dataIndex);
        // console.log('propsData', propsData);
        // console.log('propsDataName', propsDataName);
        // console.log('propsData![propsDataName!.keyName]', propsData![propsDataName!.keyName]);
        // console.log("defaultValue", defaultValue);

        if (propsDataName) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return propsData![propsDataName.keyName]?.map(({ [propsDataName.valueName]: value, [propsDataName.labelName]: label }: any, index: any) => ({
                key: index,
                value,
                label
            }));
        } else {
            return [];
        }

    };



    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {inputType === 'text' ? (
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                ) : inputType === 'select' ? (
                    <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                            const label = option?.label;
                            if (typeof label === 'string') {
                                return label.toLowerCase().includes(input.toLowerCase());
                            }
                            return false;
                        }}
                        filterSort={(optionA, optionB) => {
                            const labelA = optionA?.label;
                            const labelB = optionB?.label;
                            if (typeof labelA === 'string' && typeof labelB === 'string') {
                                return labelA.toLowerCase().localeCompare(labelB.toLowerCase());
                            }
                            return 0;
                        }}
                        options={getOptions(dataIndex, inputType)}
                        popupMatchSelectWidth={false}
                        onBlur={save}
                        // mode={inputType === 'select' ? 'multiple' : undefined}
                        allowClear
                        defaultValue={defaultValue}
                    />
                ) : inputType === 'number' ? (
                    <Input type="number" ref={inputRef} onPressEnter={save} onBlur={save} />
                ) : inputType === 'input' ? (
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                ) : inputType === 'CustomRender' ? (
                    <>

                    </>
                ) : inputType === 'checkbox' ?
                    <Checkbox
                        style={{ display: 'flex', justifyContent: 'center' }}
                        ref={inputRef}
                        onClick={save}
                        defaultChecked={Boolean(record[dataIndex])}
                    /> :
                    inputType === 'textarea' ? (
                        <Input.TextArea ref={inputRef} onPressEnter={save} onBlur={save} />
                    ) : inputType === 'date' ? (
                        <Input type="date" ref={inputRef} onPressEnter={save} onBlur={save} />
                    ) : inputType === 'basedOnSelect' ? (
                        <>
                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                propsData![propsDataName!.keyName].map((value: any, index: number) => (
                                    <div key={index} onClick={save}>
                                        {value[propsDataName!.valueName]}
                                    </div>
                                ))
                            }
                        </>

                    ) : (
                        // Display the value of the cell
                        <div>
                            {
                                record[dataIndex]
                            }
                        </div>
                    )

                }
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};


interface DeleteMutationProps<T> {
    mutationKey: string[],
    queryKeyToInvalidate: string[] | string | number | (string | number)[] | undefined,
    getSuccessMessage: () => string,
    getErrorMessage: () => string,
    onMutateCallback: (variables: T) => void,
    onSettledCallback: () => void,
    routes: string,
    DeleteItemIdVariableName: string,
    DeleteItemNameVariableName: string,
}

type EditableTableProp<T, K> = {
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    setCount: React.Dispatch<React.SetStateAction<number>>;
    count: number;
    columns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string,
        inputType: string,
        propsDataName?: {
            keyName: string,
            valueName: string
            labelName: string
        },
        defaultValue?: string[],
    })[],
    MainDataLoading: boolean,
    isEdit: boolean,
    // interfaces?: { "selectedRows": T[] }
    selectedRows: T[],
    DeleteMutationProps: DeleteMutationProps<T>
    ColumnRequiredData: { [key: string]: K[] },
    addNewItems: T,
    scroll?: {
        x: number | true | undefined,
        y?: number | undefined
    },
    onChange?: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<T> | SorterResult<T>[], extra: TableCurrentDataSource<T>) => void
}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditableTable: React.FC<EditableTableProp<any, any>> = ({
    data: dataSource,
    setData: setDataSource,
    count,
    setCount,
    columns: defaultColumns,
    MainDataLoading,
    isEdit,
    // interfaces,
    DeleteMutationProps,
    ColumnRequiredData,
    addNewItems,
    scroll,
    onChange: onValueChanges
}) => {

    const [selectedCheckbox, setCheckBox] = useState<React.Key[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    // const { UserID } = useCurrentUserData() as { UserID: number };


    const {
        // mutate: SubmitDeleteMutation,
        isPending: isDeletePending,
    } = DeleteMutation({
        mutationKey: DeleteMutationProps.mutationKey,
        queryKeyToInvalidate: DeleteMutationProps.queryKeyToInvalidate,
        getSuccessMessage: DeleteMutationProps.getSuccessMessage,
        getErrorMessage: DeleteMutationProps.getErrorMessage,
        onMutateCallback: DeleteMutationProps.onMutateCallback,
        onSettledCallback: DeleteMutationProps.onSettledCallback,
        routes: DeleteMutationProps.routes,
    })

    // console.log('dataSource', dataSource);


    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        // console.log('col', col);
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                inputType: col.inputType,
                propsData: {
                    // 'ParameterListData': ParameterListData,
                    // 'DepartmentListData': DepartmentListData,
                    // 'UserListData': UserListData,
                    // 'AutoAssignRule': AutoAssignRule,
                    // 'forceNewData': forceNewData,
                    // 'setIsModalOpen': setIsModalOpen
                    ...ColumnRequiredData,
                },
                propsDataName: col.propsDataName,
                defaultValue: col.defaultValue,

                handleSave,
            }),
        };
    });




    const handleAdd = () => {
        // const newData: testMethodDetailsInterface = {
        //     key: count.toString(),
        //     parameterListName: 'Temp Parameter List Name',
        //     autoAssignRule: 'Temp Auto Assign Rule',
        //     // workAreaDeptId: 1,
        //     workAreaDeptName: 'Temp Work Area Dept Name',
        //     autoAssignAnalyst: 1,
        //     repeatCount: 1,
        //     forceNew: 'Yes',
        //     mandatory: true,
        //     toBeInvoiced: 'true',
        //     rule: 'Temp Rule'
        // };
        const newData = addNewItems;
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        console.log('row', row);
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            toBeInvoiced: row.toBeInvoiced ? 'true' : 'false', // Convert boolean to string
        });
        setDataSource(newData);
    };


    const ondelete = async () => {
        if (!selectedRows.length) {
            message.error('Please select a row to delete');
            return;
        }
        if (selectedRows) {
            // find if the selected row is new or existing
            // if new, delete it from the table by using filter method
            // if existing, delete it from the database by using mutation  
            // if i select 4 rows, 2 are new and 2 is existing then i pass the existing rows to the mutation by already having the id of the existing rows
            // and delete the new rows from the table
            console.log('selectedRows', selectedRows);
            const newRows = selectedRows.filter(row => {
                console.log('row', row);
                console.log('DeleteItemIdVariableName', row[`${DeleteMutationProps.DeleteItemIdVariableName}`]);
                row[`${DeleteMutationProps.DeleteItemIdVariableName}`] === undefined
            });
            console.log('newRows', newRows);

            const existingRows = selectedRows.filter(row => row[`${DeleteMutationProps.DeleteItemIdVariableName}`] !== undefined);
            console.log('existingRows', existingRows);
            // Delete new rows from the table
            setDataSource(dataSource.filter(row => !newRows.includes(row)));

            // Delete existing rows from the database
            if (existingRows.length > 0) {
                setSelectedRows(existingRows); // Set selected rows to existing ones
                // SubmitDeleteMutation(); // Trigger the mutation
            }
        }

        setOpenDeleteModal(false);

    }


    const moveItem = (fromIndex: number, toIndex: number) => {
        if (selectedCheckbox.length === 0) {
            message.error('Please select a row to move');
        } else if (selectedCheckbox.length > 1) {
            message.error('Please select only one row to move');
        } else {
            const newItems = [...dataSource]; // Copy the array to avoid mutating the original
            const movedItem = newItems.splice(fromIndex, 1)[0]; // Remove item from its current position
            newItems.splice(toIndex, 0, movedItem); // Insert item at new position
            setDataSource(newItems); // Update state
        }
    };
    // console.log('onValueChanges', onValueChanges);
    return (
        <div>
            <DeleteModal
                openDeleteModal={openDeleteModal}
                ondelete={ondelete}
                setOpenDeleteModal={setOpenDeleteModal}
                items={
                    selectedRows.map((item) => item[`${DeleteMutationProps.DeleteItemNameVariableName}`])
                }
                confirmLoading={isDeletePending}
            />
            <Table
                size='small'
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource.map((value, index) => ({ ...value, key: index }))}
                columns={columns as ColumnTypes}
                rowSelection={
                    {
                        type: "checkbox",
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log(selectedRowKeys, selectedRows);
                            setCheckBox(selectedRowKeys);
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setSelectedRows(selectedRows as any[]);
                        },
                    }
                }
                onChange={
                    // (pagination, filters, sorter, extra) => {
                    //     console.log('pagination', pagination);
                    //     console.log('filters', filters);
                    //     console.log('sorter', sorter);
                    //     console.log('extra', extra);
                    // }
                    onValueChanges
                }
                loading={isEdit && MainDataLoading}
                scroll={scroll}
                pagination={
                    {
                        defaultPageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30', '50', '100', '200', '500', '1000'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        showQuickJumper: true,
                    }
                }
            />
            <div style={{
                display: 'flex',
                // justifyContent: 'space-between',
                gap: '6px',
                marginBottom: '10px',
            }}>

                <Buttons
                    onClick={handleAdd}
                    text="Add"
                    size="small"
                    backgroundColor="#243271"
                    variant="table"
                />
                {/* Delete Button */}
                <Buttons
                    onClick={
                        () => {
                            if (selectedCheckbox.length === 0) {
                                message.error('Please select a row to delete');
                            } else {
                                setOpenDeleteModal(true);
                            }
                        }
                    }
                    text="Remove"
                    size="small"
                    backgroundColor="#243271"
                    variant="table"
                />
                <img src={upArrowIcon} alt="upArrow"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        const index = dataSource.findIndex((value) => value.key !== undefined && !selectedCheckbox.includes(value.key));
                        if (index > 0) {
                            moveItem(index, index - 1);
                        } else {
                            message.error('Cannot move up');
                        }
                    }}
                />
                {/* Move item down ward Button */}
                <img src={upArrowIcon} alt="upArrow"
                    style={{ cursor: 'pointer', transform: 'rotate(180deg)' }}
                    onClick={() => {
                        const index = dataSource.findIndex((value) => value.key !== undefined && !selectedCheckbox.includes(value.key));
                        if (index < dataSource.length - 1) {
                            moveItem(index, index + 1);
                        } else {
                            message.error('Cannot move down');
                        }
                    }}
                />

            </div>
        </div>
    );
};

export default EditableTable;