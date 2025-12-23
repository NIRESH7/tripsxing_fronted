

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Typography, Spin, Avatar, List, Tag, Progress } from 'antd';
import { UserOutlined, ShopOutlined, GlobalOutlined, FormOutlined, SnippetsOutlined, EyeOutlined } from '@ant-design/icons';
import { Bath, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Import the hooks for fetching data
import { GetStay, GetCountry, GetState, GetCity, Getblog, GetAmenity, GetPlan, GetReel, GetCoupoun, GetAuditLogs, GetUsers, GetSubscriptionCount, AuditLog } from '../hooks/GetHooks';
import { Amenity, City, Country, State, Stay, User } from '@/interfaces/interfaces';
import Blog from './Blog';
import { Plan } from './Plans';
import { IReel } from './reels';
import { Coupoun } from './Coupoun';

const { Title, Text } = Typography;

// Add interfaces for type safety
// Update StatsData interface to include separate location counts
interface StatsData {
    totalStays: number;
    totalCountries: number;  // Add this
    totalStates: number;     // Add this
    totalCities: number;     // Add this
    totalBlogs: number;
    totalUsers: number;
    totalAmenities: number;
    totalPlans: number;
    totalReels: number;
    totalCoupons: number;
    totalSubscriptions: number;
}



interface Activity {
    id: number;
    action: string;
    user: string;
    time: string;
    type: string;
}

interface PopularStay {
    id: number;
    name: string;
    // views: number;
    // bookings: number;
    rating: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // Update initial state
    const [statsData, setStatsData] = useState<StatsData>({
        totalStays: 0,
        totalCountries: 0,    // Add this
        totalStates: 0,       // Add this
        totalCities: 0,       // Add this
        totalBlogs: 0,
        totalUsers: 0,
        totalAmenities: 0,
        totalPlans: 0,
        totalReels: 0,
        totalCoupons: 0,
        totalSubscriptions: 0
    });

    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [popularStays, setPopularStays] = useState<PopularStay[]>([]);

    // Remove unused state
    // const [footerMenu, setFooterMenu] = useState([...]);

    // Fetch data with error handling
    const { data: stayData, isLoading: stayLoading } = GetStay<Stay[]>();
    const { data: countryData, isLoading: countryLoading } = GetCountry<Country[]>();
    const { data: stateData, isLoading: stateLoading } = GetState<State[]>();
    const { data: cityData, isLoading: cityLoading } = GetCity<City[]>();
    const { data: blogData, isLoading: blogLoading } = Getblog<Blog[]>();
    const { data: amenityData, isLoading: amenityLoading } = GetAmenity<Amenity[]>();
    const { data: planData, isLoading: planLoading } = GetPlan<Plan[]>();
    const { data: reelData, isLoading: reelLoading } = GetReel<IReel[]>();
    const { data: coupounData, isLoading: coupounLoading } = GetCoupoun<Coupoun[]>();
    const { data: userData, isLoading: userLoading } = GetUsers<User[]>();
    const { data: auditLogData, isLoading: auditLogLoading } = GetAuditLogs<AuditLog[]>();
    const { data: subscriptionCount, isLoading: subscriptionLoading } = GetSubscriptionCount<number>();

    // Update stats data when API data is loaded
    useEffect(() => {
        const isDataLoading =
            stayLoading ||
            countryLoading ||
            stateLoading ||
            cityLoading ||
            blogLoading ||
            amenityLoading ||
            planLoading ||
            reelLoading ||
            coupounLoading ||
            userLoading ||
            auditLogLoading ||
            subscriptionLoading;

        setLoading(isDataLoading);

        if (!isDataLoading) {
            try {
                // Update stats with actual data
                setStatsData({
                    totalStays: stayData?.length ?? 0,
                    totalCountries: countryData?.length ?? 0,
                    totalStates: stateData?.length ?? 0,
                    totalCities: cityData?.length ?? 0,
                    totalBlogs: blogData?.length ?? 0,
                    totalUsers: userData?.length ?? 0,
                    totalAmenities: amenityData?.length ?? 0,
                    totalPlans: planData?.length ?? 0,
                    totalReels: reelData?.length ?? 0,
                    totalCoupons: coupounData?.length ?? 0,
                    totalSubscriptions: subscriptionCount ?? 0
                });

                // Set popular stays with proper error handling
                if (stayData?.length) {
                    const sortedStays = [...stayData]
                        .slice(0, 5)
                        .map(stay => ({
                            id: stay.id ?? 0,
                            name: stay.name,
                            // views: Math.floor(Math.random() * 1000),
                            // bookings: Math.floor(Math.random() * 100),
                            rating: stay.rating?.toString() ?? (Math.random() * (5 - 4) + 4).toFixed(1)
                        }));
                    setPopularStays(sortedStays);
                }

                // Process audit logs with proper type checking
                if (auditLogData) {
                    console.log('auditLogData:', auditLogData);
                    const recentLogs = auditLogData
                        .slice(0, 5)
                        .map(log => ({
                            id: log.id,
                            action: `${log.action} ${log.model}`,
                            user: log.userId ?? 'System',
                            time: getTimeAgo(new Date(log.timestamp)),
                            type: getActivityType(log.model)
                        }));
                    setRecentActivities(recentLogs.map(log => ({
                        ...log,
                        user: String(log.user) // Convert user to string to match Activity interface
                    })));
                }
            } catch (error) {
                console.error('Error processing dashboard data:', error);
                // You might want to show an error message to the user here
            }
        }
    }, [
        stayData, countryData, stateData, cityData, blogData, amenityData,
        planData, reelData, coupounData, userData, auditLogData
    ]); // Removed loading states from dependencies

    // Helper function to get activity type
    const getActivityType = (entityName?: string): string => {
        if (!entityName) return 'other';
        const name = entityName.toLowerCase();
        if (name.includes('stay')) return 'stay';
        if (name.includes('blog')) return 'blog';
        if (name.includes('user')) return 'user';
        if (name.includes('location') ||
            name.includes('country') ||
            name.includes('state') ||
            name.includes('city')) return 'location';
        if (name.includes('coupon')) return 'coupon';
        return 'other';
    };

    // Helper function to format time ago with proper type safety
    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    const getIconForActivityType = (type: string) => {
        switch (type) {
            case 'stay':
                return <ShopOutlined style={{ color: '#1890ff' }} />;
            case 'blog':
                return <FormOutlined style={{ color: '#52c41a' }} />;
            case 'user':
                return <UserOutlined style={{ color: '#722ed1' }} />;
            case 'location':
                return <GlobalOutlined style={{ color: '#fa8c16' }} />;
            case 'coupon':
                return <SnippetsOutlined style={{ color: '#eb2f96' }} />;
            default:
                return <EyeOutlined style={{ color: '#1890ff' }} />;
        }
    };

    const popularStaysColumns = [
        {
            title: 'Stay Name',
            dataIndex: 'name',
            key: 'name',
        },
        // {
        //     title: 'Views',
        //     dataIndex: 'views',
        //     key: 'views',
        //     sorter: (a: any, b: any) => a.views - b.views,
        // },
        // {
        //     title: 'Bookings',
        //     dataIndex: 'bookings',
        //     key: 'bookings',
        //     sorter: (a: any, b: any) => a.bookings - b.bookings,
        // },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => (
                <span>
                    {rating} <Progress percent={rating * 20} size="small" showInfo={false} strokeColor="#1890ff" />
                </span>
            ),
            sorter: (a: any, b: any) => a.rating - b.rating,
        },
    ];

    const navigateToSection = (path: string) => {
        navigate(`/${path}`);
    };

    return (
        <div style={{ color: 'black', width: '100%', padding: '20px', marginBottom: '60px' }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Title level={2} style={{ marginBottom: '24px', color: '#243271' }}>Dashboard</Title>

                    {/* Stats Cards */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('stay')}>
                                <Statistic
                                    title="Total Stays"
                                    value={statsData.totalStays}
                                    prefix={<ShopOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                                {/* <Text type="secondary">+12% from last month</Text> */}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('location')}>
                                <Statistic
                                    title="Locations"
                                    value={statsData.totalCountries + statsData.totalStates + statsData.totalCities}
                                    prefix={<GlobalOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                                <div style={{ marginTop: '8px' }}>
                                    <Text type="secondary">
                                        Countries: {statsData.totalCountries} |
                                        States: {statsData.totalStates} |
                                        Cities: {statsData.totalCities}
                                    </Text>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('blogs')}>
                                <Statistic
                                    title="Total Blogs"
                                    value={statsData.totalBlogs}
                                    prefix={<FormOutlined />}
                                    valueStyle={{ color: '#fa8c16' }}
                                />
                                {/* <Text type="secondary">+8% from last month</Text> */}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('user-management')}>
                                <Statistic
                                    title="Total Users"
                                    value={statsData.totalUsers}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                                {/* <Text type="secondary">+15% from last month</Text> */}
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('amenities')}>
                                <Statistic
                                    title="Total Amenities"
                                    value={statsData.totalAmenities}
                                    prefix={<Bath className="w-4 h-4" />}
                                    valueStyle={{ color: '#eb2f96' }}
                                />
                                {/* <Text type="secondary">+3% from last month</Text> */}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('plans')}>
                                <Statistic
                                    title="Total Plans"
                                    value={statsData.totalPlans}
                                    prefix={<SnippetsOutlined />}
                                    valueStyle={{ color: '#13c2c2' }}
                                />
                                {/* <Text type="secondary">+7% from last month</Text> */}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('reels')}>
                                <Statistic
                                    title="Total Reels"
                                    value={statsData.totalReels}
                                    prefix={<Film className="w-4 h-4" />}
                                    valueStyle={{ color: '#f5222d' }}
                                />
                                {/* <Text type="secondary">+20% from last month</Text> */}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable onClick={() => navigateToSection('coupoun')}>
                                <Statistic
                                    title="Total Coupons"
                                    value={statsData.totalCoupons}
                                    prefix={<SnippetsOutlined />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                                {/* <Text type="secondary">+4% from last month</Text> */}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card hoverable>
                                <Statistic
                                    title="Total Subscriptions"
                                    value={statsData.totalSubscriptions}
                                    prefix={<SnippetsOutlined />}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                                {/* <Text type="secondary">Active user subscriptions</Text> */}
                            </Card>
                        </Col>
                    </Row>

                    {/* Popular Stays and Recent Activities */}
                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                        <Col xs={24} lg={14}>
                            <Card
                                title={<Title level={4}>Popular Stays</Title>}
                                extra={<Button type="link" onClick={() => navigateToSection('stay')}>View All</Button>}
                            >
                                <Table
                                    dataSource={popularStays}
                                    columns={popularStaysColumns}
                                    pagination={false}
                                    rowKey="id"
                                    size="small"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={10}>
                            <Card
                                title={<Title level={4}>Recent Activities</Title>}
                                extra={<Button type="link" onClick={() => navigateToSection('audit-log')}>View All</Button>}
                            >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={recentActivities}
                                    renderItem={(item: any) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar icon={getIconForActivityType(item.type)} />}
                                                title={item.action}
                                                description={
                                                    <div>
                                                        <Tag color="blue">{item.user}</Tag>
                                                        <Text type="secondary" style={{ marginLeft: '8px' }}>{item.time}</Text>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default Dashboard;
