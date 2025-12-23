import { Table, TablePaginationConfig } from "antd";
import { useDynamicTableStore, useStateUserMaster } from "../../../utils/state";
import { UserMasterTablePagination } from "../../../interfaces/interfaces";
interface TableComponentProps {
    data: object[];
    columns: object[];
    isLoading?: boolean;
    type?: string;
    scroll?: object;
    Title?: string;
    tableInteface?: object;
    component?: object;
    rowClassName?: string;
    pagination?: TablePaginationConfig | false | undefined; // Fix: Change the type of pagination prop
    setSelectedRowKeys?: React.Dispatch<React.SetStateAction<React.Key[]>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedRows?: React.Dispatch<React.SetStateAction<any[]>>;
    totalCount?: number;
}



// const {
//     UserMasterTablePagination
// } = useStateUserMaster.getState() as {
//     UserMasterTablePagination: {
//         current: number;
//         pageSize: number;
//         // position: TablePaginationConfig[]
//         showQuickJumper: boolean;
//         showSizeChanger: boolean;
//         style: object;
//     }
// }


const TableComponent = ({ data, columns, isLoading, type, scroll, Title, component, rowClassName, pagination, setSelectedRowKeys, setSelectedRows, totalCount }: TableComponentProps) => {
    const { UserMasterTablePagination } = useStateUserMaster() as { setUserMasterTablePagination: (value: UserMasterTablePagination) => void, UserMasterTablePagination: UserMasterTablePagination }
    console.log('UserMasterTablePagination', UserMasterTablePagination)

    const { tableData } = useDynamicTableStore() as {
        tableData: {
            [key: string]: TablePaginationConfig
        }
    }
    console.log('tableData', tableData)
    console.log("totalCount", totalCount);

    return (
        <>
            {/* <Pagination
                total={data.length || 85}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} items`}
                style={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    background: "#FFF",
                }}
                itemRender={(page, type, originalElement) => {
                    switch (type) {
                        case 'prev':
                            return <>
                                <a style={{
                                    color: "#243271",
                                    textAlign: "center",
                                    fontFamily: "Verdana",
                                    fontSize: "0.875rem",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    lineHeight: "normal",
                                }}>Prev <CaretLeftOutlined /></a>
                            </>
                        case 'next':
                            return <a style={{
                                color: "#243271",
                                textAlign: "center",
                                fontFamily: "Verdana",
                                fontSize: "0.875rem",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                            }}><CaretRightOutlined /> Next</a>;
                        case 'page':
                            return <a style={{
                            }}>{page}</a>;
                        default:
                            return originalElement;
                    }
                }}
            /> */}
            <div style={{ padding: "1.3rem 1rem 1.3rem 1rem", }}>
                <div style={{
                    borderRadius: "1rem",
                    background: "#FFF",
                }}>
                    <div style={{
                        display: "flex",
                        width: "100%",
                        height: "3.32406rem",
                        padding: "0.625rem 1.5rem",
                        alignItems: "center",
                        gap: "0.625rem",
                        flexShrink: 0,

                        borderRadius: "1rem 1rem 0rem 0rem",
                        borderBottom: "1px solid #243271",
                        background: "#FFF",
                    }}>
                        <div
                            style={{
                                color: "#243271",
                                textAlign: "center",
                                // fontFamily: "Verdana",
                                fontSize: "1.25rem",
                                // fontStyle: "bold",
                                fontWeight: 600,
                                lineHeight: "normal",
                            }}
                        >
                            {Title}
                            {/* User Lists */}
                        </div>
                    </div>
                    <Table

                        components={component}
                        style={{
                            padding: "1.3rem 1rem 1.3rem",
                        }}
                        bordered
                        columns={columns}
                        dataSource={data}
                        rowClassName={rowClassName ? rowClassName : (_record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                        scroll={scroll || { x: '300%', y: 500 }}
                        loading={isLoading}
                        pagination={
                            pagination ||
                            (
                                tableData !== undefined && tableData[Title as string] !== undefined
                                    ? tableData[Title as string]
                                    :
                                    {
                                        // hideOnSinglePage: true,
                                        total: totalCount || 0,
                                        defaultPageSize: 10,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['10', '20', '30', '50', '100', '200', '500', '1000'],
                                        showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} of ${total} items`,
                                        // current: UserMasterTablePagination.current,
                                        // pageSize: UserMasterTablePagination.pageSize,
                                        showQuickJumper: true,
                                    } as TablePaginationConfig
                            )
                        }
                        size="small"
                        rowSelection={
                            type === "checkbox" ?
                                {
                                    type: "checkbox",
                                    onChange: (selectedRowKeys, selectedRows) => {
                                        console.log(selectedRowKeys, selectedRows);
                                        if (setSelectedRowKeys) {
                                            setSelectedRowKeys(selectedRowKeys);
                                        }
                                        if (setSelectedRows) {
                                            setSelectedRows(selectedRows);
                                        }
                                    },
                                } :
                                {
                                    type: "radio",
                                    onChange: (selectedRowKeys, selectedRows) => {
                                        console.log(selectedRowKeys, selectedRows);
                                        if (setSelectedRowKeys) {
                                            setSelectedRowKeys(selectedRowKeys);
                                        }
                                        if (setSelectedRows) {
                                            setSelectedRows(selectedRows);
                                        }
                                    },
                                }
                        }
                        onChange={
                            (pagination, filters, sorter, extra) => {
                                console.log('pagination', pagination)
                                useStateUserMaster.setState({
                                    UserMasterTablePagination: pagination
                                })
                                // console.log('UserMasterTablePagination', useStateUserMaster.getState().UserMasterTablePagination as UserMasterTablePagination)
                                console.log('filters', filters)
                                console.log('filters', filters)
                                console.log('sorter', sorter)
                                console.log('extra', extra)

                                console.log('data', data)

                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                useDynamicTableStore.setState((prevState: { tableData: UserMasterTablePagination; }) => ({
                                    ...prevState,
                                    tableData: {
                                        ...prevState.tableData,
                                        [String(Title)]: {
                                            ...pagination,
                                            showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} of ${total} items`,
                                        }
                                    }
                                }));
                            }
                        }

                    >
                    </Table>
                </div>
            </div >
        </>
    );
}

export default TableComponent;