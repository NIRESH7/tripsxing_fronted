import { useState } from 'react';
import { Table, DatePicker, Select, Space, Card, Button } from 'antd';
import { GetUserStayHistory, GetUsers } from '../hooks/GetHooks';
import dayjs from 'dayjs';
import { User } from '@/interfaces/interfaces';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

const UserStayHistory = () => {
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(
        [dayjs().subtract(1, 'month'), dayjs()]
    );
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [selectedStay] = useState<number | null>(null);

    const { data: stayHistoryData, isLoading: isHistoryLoading } = GetUserStayHistory<any>({
        startDate: dateRange?.[0]?.toISOString(),
        endDate: dateRange?.[1]?.toISOString(),
        userId: selectedUser || undefined,
        stayId: selectedStay || undefined,
    });

    const { data: users } = GetUsers<User[]>(
        undefined,
        "customer"
    );
    // GetStay<Stay[]>();

    const columns = [
        {
            title: 'Sno',
            dataIndex: 'sno',
            key: 'sno',
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'User',
            dataIndex: ['user', 'userName'],
            key: 'userName',
        },
        {
            title: 'Stay Name',
            dataIndex: ['stay', 'name'],
            key: 'stayName',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')
        },
    ];

    const handleExport = (fileType: 'csv' | 'xlsx') => {
        if (!stayHistoryData?.length) return;

        const exportData = stayHistoryData.map((record: any, index: number) => ({
            'Sno': index + 1,
            'User': record.user?.userName || '',
            'UserId': record.user?.id || '',
            'Stay Name': record.stay?.name || '',
            'Date': dayjs(record.date).format('YYYY-MM-DD HH:mm'),
            'StayDetails': JSON.stringify({
                "id": record.stay?.id || '',
                "name": record.stay?.name || '',
                "address": record.stay?.address || '',
                "rating": record.stay?.rating || 0,
                "description": record.stay?.description || '',
                "videos": record.stay?.videos || [],
                "images": record.stay?.images || [],
                "city": {
                    "name": record.stay?.city?.name || ''
                },
                "state": {
                    "name": record.stay?.state?.name || ''
                },
                "country": {
                    "name": record.stay?.country?.name || ''
                }
            }),
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Stay History');

        const fileName = `stay_history_${dayjs().format('YYYY-MM-DD_HH-mm')}`;
        if (fileType === 'csv') {
            XLSX.writeFile(wb, `${fileName}.csv`);
        } else {
            XLSX.writeFile(wb, `${fileName}.xlsx`);
        }
    };

    return (
        <Card title="User Stay History">
            <Space style={{ marginBottom: 16 }}>
                <RangePicker
                    onChange={(dates) => setDateRange(dates)}
                    showTime
                    defaultValue={dateRange as [dayjs.Dayjs, dayjs.Dayjs]}
                />
                <Select
                    allowClear
                    placeholder="Select User"
                    style={{ width: 200 }}
                    onChange={setSelectedUser}
                    options={users?.map((user: any) => ({
                        value: user.id,
                        label: user.userName
                    }))}
                    showSearch
                    filterOption={(input: string, option: any) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                />
                {/* <Select
                    allowClear
                    placeholder="Select Stay"
                    style={{ width: 200 }}
                    onChange={setSelectedStay}
                    options={stays?.map((stay: any) => ({
                        value: stay.id,
                        label: stay.name
                    }))}
                    showSearch
                    filterOption={(input: string, option: any) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                /> */}
                <Button
                    onClick={() => handleExport('csv')}
                    disabled={!stayHistoryData?.length}
                >
                    Export CSV
                </Button>
                <Button
                    onClick={() => handleExport('xlsx')}
                    disabled={!stayHistoryData?.length}
                >
                    Export Excel
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={stayHistoryData}
                loading={isHistoryLoading}
                rowKey={(record: any) => `${record.stay?.id || record.id}-${record.date}`}
                scroll={{ x: 1300 }}
            />
        </Card>
    );
};

export default UserStayHistory;
