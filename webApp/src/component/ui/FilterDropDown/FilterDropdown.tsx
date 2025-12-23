import React from 'react';
import { Input, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

interface FilterDropdownProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters: () => void;
  placeholder: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  placeholder,
}) => (
  <div style={{ padding: 8 }}>
    <Input
      placeholder={placeholder}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => confirm()}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
    <Space>
      <Button
        type="primary"
        onClick={confirm}
        icon={<EyeOutlined />}
        size="small"
        style={{ width: 90 }}
      >
        Search
      </Button>
      <Button
        onClick={() => {
          clearFilters();
          setSelectedKeys([]);
          confirm();
        }}
        size="small"
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </Space>
  </div>
);

export default FilterDropdown;