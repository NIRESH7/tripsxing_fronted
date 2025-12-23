import { useState, useEffect } from 'react';
import { Button, Card, Space, Table, Typography, Select, Input, Pagination } from 'antd';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { GetUsersCouponHistory, GetUsers } from '../hooks/GetHooks';
import { User } from '@/interfaces/interfaces';
import useDebounce from '../utils/useDebounce';

const UserCouponHistory = () => {
    const [email, setEmail] = useState<string>('');
    const [couponName, setCouponName] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    // State for input values before debouncing
    const [inputEmail] = useState<string>('');
    const [inputCouponName, setInputCouponName] = useState<string>('');

    // Apply debounce to the input values
    const debouncedEmail = useDebounce<string>(inputEmail, 500);
    const debouncedCouponName = useDebounce<string>(inputCouponName, 500);

    // Update the filter values when debounced values change
    useEffect(() => {
        setEmail(debouncedEmail);
    }, [debouncedEmail]);

    useEffect(() => {
        setCouponName(debouncedCouponName);
    }, [debouncedCouponName]);

    const { data: usersData } = GetUsers<User[]>(
        undefined,
        "customer"
    );

    const { data: userCouponResponse, isLoading } = GetUsersCouponHistory<any>({
        email: email || undefined,
        couponName: couponName || undefined,
        userId: selectedUser?.toString() || undefined,
        page,
        pageSize
    });

    const userCouponData = userCouponResponse?.data || [];
    const pagination = userCouponResponse?.pagination || { total: 0, page: 1, pageSize: 10, totalPages: 0 };

    const columns = [
        {
            title: 'Sno',
            dataIndex: 'sno',
            key: 'sno',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Coupon Count',
            dataIndex: 'CouponHistory',
            key: 'couponCount',
            render: (coupons: any[]) => coupons.length,
        },
    ];

    // Define expandable row configuration
    const expandableConfig = {
        expandedRowRender: (record: any) => {
            const couponColumns = [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Discount',
                    dataIndex: 'percentageDiscount',
                    key: 'percentageDiscount',
                    render: (discount: number) => `${Number(discount).toFixed(2)}%`,
                },
                {
                    title: 'Expiry Date',
                    dataIndex: 'expireDate',
                    key: 'expireDate',
                    render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
                },
                {
                    title: 'Status',
                    dataIndex: 'isClaimed',
                    key: 'isClaimed',
                    render: (claimed: boolean) => (claimed ? 'Claimed' : 'Not Claimed'),
                },
            ];

            return (
                <div style={{ margin: '0 16px' }}>
                    <Typography.Title level={5} style={{ margin: '8px 0' }}>
                        Coupon Details
                    </Typography.Title>
                    <Table
                        columns={couponColumns}
                        dataSource={record.CouponHistory}
                        pagination={false}
                        rowKey={(coupon: any) => `${record.id}-${coupon.name}-${coupon.expireDate}`}
                        size="small"
                    />
                </div>
            );
        },
        rowExpandable: (record: any) =>
            record.CouponHistory && record.CouponHistory.length > 0,
    };

    const handleExport = (fileType: 'csv' | 'xlsx') => {
        if (!userCouponData?.length) return;

        const exportData = userCouponData.map((record: any, index: number) => ({
            Sno: index + 1,
            'User Name': record.userName,
            'UserId': record.id,
            Email: record.email,
            'Coupon Name': record.CouponHistory
                .map((coupon: any) => coupon.name)
                .join(', '),
            Discount: record.CouponHistory
                .map((coupon: any) => `${Number(coupon.percentageDiscount).toFixed(3)}%`)
                .join(', '),
            'Expiry Date': record.CouponHistory
                .map((coupon: any) =>
                    dayjs(coupon.expireDate).format('YYYY-MM-DD HH:mm')
                )
                .join(', '),
            Status: record.CouponHistory
                .map((coupon: any) =>
                    coupon.isClaimed ? 'Claimed' : 'Not Claimed'
                )
                .join(', '),
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Coupon History');

        const fileName = `coupon_history_${dayjs().format('YYYY-MM-DD_HH-mm')}`;
        if (fileType === 'csv') {
            XLSX.writeFile(wb, `${fileName}.csv`);
        } else {
            XLSX.writeFile(wb, `${fileName}.xlsx`);
        }
    };

    return (
        <Card title="User Coupon History">
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                <Space wrap>
                    <Select
                        allowClear
                        placeholder="Select User"
                        style={{ width: 200 }}
                        onChange={setSelectedUser}
                        options={usersData?.map((user: any) => ({
                            value: user.id,
                            label: user.userName
                        }))}
                        showSearch
                        filterOption={(input: string, option: any) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                    {/* <Input
                        placeholder="Filter by email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    /> */}
                    <Input
                        placeholder="Filter by coupon name"
                        value={inputCouponName}
                        onChange={(e) => setInputCouponName(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Button
                        onClick={() => handleExport('csv')}
                        disabled={!userCouponData?.length}
                    >
                        Export CSV
                    </Button>
                    <Button
                        onClick={() => handleExport('xlsx')}
                        disabled={!userCouponData?.length}
                    >
                        Export Excel
                    </Button>
                </Space>
            </Space>
            <Table
                columns={columns}
                dataSource={userCouponData}
                loading={isLoading}
                rowKey="id"
                expandable={expandableConfig}
                pagination={false}
            />
            <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                    current={pagination.page}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Total ${total} items`}
                />
            </div>
        </Card>
    );
};

export default UserCouponHistory;
