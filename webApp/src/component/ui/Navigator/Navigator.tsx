import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';

const treeData: TreeDataNode[] = [
    {
        title: 'Customer',
        key: '0-0',
        children: [
            {
                title: 'Tech',
                key: '0-0-1',
                children: [
                    {
                        title: 'Sample',
                        key: '0-0-1-1',
                        children: [
                            {
                                title: 'Ship',
                                key: '0-0-1-1-1',
                            },
                            {
                                title: 'Type',
                                key: '0-0-1-1-2',
                            },
                        ],
                    },
                    {
                        title: 'Test',
                        key: '0-0-1-2',
                        children: [
                            {
                                title: 'Methods',
                                key: '0-0-1-2-1',
                                children: [
                                    {
                                        title: 'Sample Types',
                                        key: '0-0-1-2-1-1',
                                    },
                                    {
                                        title: 'Test Packages',
                                        key: '0-0-1-2-1-2',
                                        children: [
                                            {
                                                title: 'Specifications',
                                                key: '0-0-1-2-1-2-1',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                title: 'Agency',
                key: '0-0-2',
                // Agency does not have children based on the image
            },
        ],
    },
];

const Navigator: React.FC = () => {
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    return (
        <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={treeData}
        />
    );
};

export default Navigator;