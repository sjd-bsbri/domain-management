import React, { useCallback, useMemo } from 'react';
import { Table, Tag, Button, Input, Select, Space, Popconfirm, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetDomainsQuery, useDeleteDomainMutation } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setStatusFilter, clearFilters, selectSearchTerm, selectStatusFilter } from '../store/domainsSlice';
import { Domain } from '../types';

interface DomainTableProps {
  onEdit: (domain: Domain) => void;
}

const statusColors = {
  pending: 'blue',
  verified: 'green',
  rejected: 'red'
};

const DomainTable: React.FC<DomainTableProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);
  const statusFilter = useSelector(selectStatusFilter);
  
  const { data: domains, isLoading, error } = useGetDomainsQuery();
  const [deleteDomain] = useDeleteDomainMutation();

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteDomain(id).unwrap();
      message.success('Domain deleted successfully');
    } catch (error) {
      message.error('Failed to delete domain');
      console.error('Error deleting domain:', error);
    }
  }, [deleteDomain]);

  const handleSearch = useCallback((value: string) => {
    dispatch(setSearchTerm(value));
  }, [dispatch]);

  const handleStatusFilter = useCallback((value: string | null) => {
    dispatch(setStatusFilter(value));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const filteredDomains = useMemo(() => {
    return domains?.filter((domain) => {
      const matchesSearch = domain.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? domain.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [domains, searchTerm, statusFilter]);

  const renderStatusTag = useCallback((status: string) => {
    const color = statusColors[status as keyof typeof statusColors] || 'blue';
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  }, []);

  const renderActiveTag = useCallback((isActive: boolean) => (
    <Tag color={isActive ? 'green' : 'red'}>
      {isActive ? 'ACTIVE' : 'INACTIVE'}
    </Tag>
  ), []);

  const renderDate = useCallback((timestamp: number) => (
    new Date(timestamp * 1000).toLocaleDateString()
  ), []);

  const renderActions = useCallback((record: Domain) => (
    <Space size="middle">
      <Button 
        type="primary" 
        icon={<EditOutlined />} 
        onClick={() => onEdit(record)}
      />
      <Popconfirm
        title="Delete domain"
        description="Are you sure you want to delete this domain?"
        onConfirm={() => handleDelete(record.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </Space>
  ), [onEdit, handleDelete]);

  const columns = useMemo(() => [
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      sorter: (a: Domain, b: Domain) => a.domain.localeCompare(b.domain),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: renderActiveTag,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: renderDate,
      sorter: (a: Domain, b: Domain) => a.createdDate - b.createdDate,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Domain) => renderActions(record),
    },
  ], [renderStatusTag, renderActiveTag, renderDate, renderActions]);

  if (error) {
    return <div>Error loading domains. Please try again later.</div>;
  }
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Input 
          placeholder="Search domains" 
          prefix={<SearchOutlined />} 
          onChange={(e) => handleSearch(e.target.value)}
          value={searchTerm}
          className="w-full md:w-72"
        />
        <Space>
          <Select
            placeholder="Filter by status"
            onChange={handleStatusFilter}
            value={statusFilter}
            style={{ width: 150 }}
            options={statusOptions}
          />
          <Button onClick={resetFilters}>Reset Filters</Button>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredDomains} 
        loading={isLoading} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default DomainTable; 