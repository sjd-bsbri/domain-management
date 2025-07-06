// import React, { useCallback, useMemo, useState } from 'react';
// import { Table, Tag, Button, Input, Select, Space, Popconfirm, message, Card, Tooltip, Empty } from 'antd';
// import { SearchOutlined, EditOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
// import { useGetDomainsQuery, useDeleteDomainMutation } from '../services/api';
// import { useDispatch, useSelector } from 'react-redux';
// import { setSearchTerm, setStatusFilter, clearFilters, selectSearchTerm, selectStatusFilter } from '../store/domainsSlice';
// import { Domain } from '../types';

// interface DomainTableProps {
//   onEdit: (domain: Domain) => void;
// }

// const statusColors = {
//   pending: 'blue',
//   verified: 'green',
//   rejected: 'red'
// };

// const DomainTable: React.FC<DomainTableProps> = ({ onEdit }) => {
//   const dispatch = useDispatch();
//   const searchTerm = useSelector(selectSearchTerm);
//   const statusFilter = useSelector(selectStatusFilter);
//   const [showFilters, setShowFilters] = useState(false);
  
//   const { data: domains, isLoading, error, refetch } = useGetDomainsQuery();
//   const [deleteDomain, { isLoading: isDeleting }] = useDeleteDomainMutation();

//   const handleDelete = useCallback(async (id: string) => {
//     try {
//       await deleteDomain(id).unwrap();
//       message.success('Domain deleted successfully');
//     } catch (error) {
//       message.error('Failed to delete domain');
//       console.error('Error deleting domain:', error);
//     }
//   }, [deleteDomain]);

//   const handleSearch = useCallback((value: string) => {
//     dispatch(setSearchTerm(value));
//   }, [dispatch]);

//   const handleStatusFilter = useCallback((value: string | null) => {
//     dispatch(setStatusFilter(value));
//   }, [dispatch]);

//   const resetFilters = useCallback(() => {
//     dispatch(clearFilters());
//   }, [dispatch]);

//   const toggleFilters = useCallback(() => {
//     setShowFilters(prev => !prev);
//   }, []);

//   const handleRefresh = useCallback(() => {
//     refetch();
//     message.success('Data refreshed');
//   }, [refetch]);

//   const filteredDomains = useMemo(() => {
//     return domains?.filter((domain) => {
//       const matchesSearch = domain.domain.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = statusFilter ? domain.status === statusFilter : true;
//       return matchesSearch && matchesStatus;
//     });
//   }, [domains, searchTerm, statusFilter]);

//   const renderStatusTag = useCallback((status: string) => {
//     const color = statusColors[status as keyof typeof statusColors] || 'blue';
//     return <Tag color={color}>{status.toUpperCase()}</Tag>;
//   }, []);

//   const renderActiveTag = useCallback((isActive: boolean) => (
//     <Tag color={isActive ? 'green' : 'red'}>
//       {isActive ? 'ACTIVE' : 'INACTIVE'}
//     </Tag>
//   ), []);

//   const renderDate = useCallback((timestamp: number) => (
//     new Date(timestamp * 1000).toLocaleDateString()
//   ), []);

//   const renderActions = useCallback((record: Domain) => (
//     <Space size="middle">
//       <Tooltip title="Edit Domain">
//         <Button 
//           type="primary" 
//           icon={<EditOutlined />} 
//           onClick={() => onEdit(record)}
//           className="bg-blue-500 hover:bg-blue-600"
//         />
//       </Tooltip>
//       <Tooltip title="Delete Domain">
//         <Popconfirm
//           title="Delete domain"
//           description="Are you sure you want to delete this domain?"
//           onConfirm={() => handleDelete(record.id)}
//           okText="Yes"
//           cancelText="No"
//           okButtonProps={{ danger: true }}
//         >
//           <Button type="primary" danger icon={<DeleteOutlined />} loading={isDeleting && record.id === deletingId} />
//         </Popconfirm>
//       </Tooltip>
//     </Space>
//   ), [onEdit, handleDelete, isDeleting]);

//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const columns = useMemo(() => [
//     {
//       title: 'Domain',
//       dataIndex: 'domain',
//       key: 'domain',
//       sorter: (a: Domain, b: Domain) => a.domain.localeCompare(b.domain),
//       render: (text: string) => (
//         <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
//           {text}
//         </a>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: renderStatusTag,
//     },
//     {
//       title: 'Active',
//       dataIndex: 'isActive',
//       key: 'isActive',
//       render: renderActiveTag,
//     },
//     {
//       title: 'Created Date',
//       dataIndex: 'createdDate',
//       key: 'createdDate',
//       render: renderDate,
//       sorter: (a: Domain, b: Domain) => a.createdDate - b.createdDate,
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_: unknown, record: Domain) => renderActions(record),
//     },
//   ], [renderStatusTag, renderActiveTag, renderDate, renderActions, isDeleting, deletingId]);

//   if (error) {
//     return (
//       <Card className="text-center p-8 shadow-md rounded-lg">
//         <h3 className="text-lg text-red-600 mb-2">Error loading domains</h3>
//         <p className="mb-4">Please try again later or contact support.</p>
//         <Button type="primary" onClick={handleRefresh}>Retry</Button>
//       </Card>
//     );
//   }
  
//   const statusOptions = [
//     { value: 'pending', label: 'Pending' },
//     { value: 'verified', label: 'Verified' },
//     { value: 'rejected', label: 'Rejected' },
//   ];

//   return (
//     <div className="space-y-4 fade-in">
//       <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
//         <div className="flex gap-2 w-full md:w-auto">
//           <Input 
//             placeholder="Search domains" 
//             prefix={<SearchOutlined className="text-gray-400" />} 
//             onChange={(e) => handleSearch(e.target.value)}
//             value={searchTerm}
//             className="w-full md:w-72"
//             allowClear
//           />
//           <Tooltip title="Toggle Filters">
//             <Button 
//               icon={<FilterOutlined />} 
//               onClick={toggleFilters}
//               type={showFilters ? "primary" : "default"}
//             />
//           </Tooltip>
//           <Tooltip title="Refresh Data">
//             <Button 
//               icon={<ReloadOutlined />} 
//               onClick={handleRefresh}
//             />
//           </Tooltip>
//         </div>
        
//         {showFilters && (
//           <Space className="w-full md:w-auto">
//             <Select
//               placeholder="Filter by status"
//               onChange={handleStatusFilter}
//               value={statusFilter}
//               style={{ width: 150 }}
//               options={statusOptions}
//               allowClear
//             />
//             <Button onClick={resetFilters}>Reset</Button>
//           </Space>
//         )}
//       </div>
      
//       <Table 
//         columns={columns} 
//         dataSource={filteredDomains} 
//         loading={isLoading} 
//         rowKey="id"
//         pagination={{ 
//           pageSize: 5,
//           showSizeChanger: true,
//           pageSizeOptions: ['5', '10', '20'],
//           showTotal: (total) => `Total ${total} domains`
//         }}
//         className="shadow-sm"
//         locale={{
//           emptyText: <Empty description="No domains found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
//         }}
//       />
//     </div>
//   );
// };

// export default DomainTable; 


import React, { useCallback, useMemo, useState } from 'react';
import { Table, Tag, Button, Input, Select, Space, Popconfirm, message, Card, Tooltip, Empty } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
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
  const [showFilters, setShowFilters] = useState(false);
  // اضافه کردن state برای نگهداری id دامنه در حال حذف
  const [deletingId, setDeletingId] = useState<string | null>(null); // این خط قبلا بود، فقط کاربرد آن را اضافه می‌کنیم
  
  const { data: domains, isLoading, error, refetch } = useGetDomainsQuery();
  const [deleteDomain] = useDeleteDomainMutation();

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id); // تنظیم deletingId هنگام شروع حذف
    try {
      await deleteDomain(id).unwrap();
      message.success('Domain deleted successfully');
    } catch (error) {
      message.error('Failed to delete domain');
      console.error('Error deleting domain:', error);
    } finally {
      setDeletingId(null); // پاک کردن deletingId پس از اتمام (موفق یا ناموفق)
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

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
    message.success('Data refreshed');
  }, [refetch]);

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
      <Tooltip title="Edit Domain">
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(record)}
          className="bg-blue-500 hover:bg-blue-600"
        />
      </Tooltip>
      <Tooltip title="Delete Domain">
        <Popconfirm
          title="Delete domain"
          description="Are you sure you want to delete this domain?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          {/* استفاده از isDeleting و deletingId برای نمایش وضعیت loading دکمه */}
          <Button type="primary" danger icon={<DeleteOutlined />} loading={deletingId === record.id} />
        </Popconfirm>
      </Tooltip>
    </Space>
  ), [onEdit, handleDelete, deletingId]); // اضافه کردن deletingId به dependencies

  const columns = useMemo(() => [
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      sorter: (a: Domain, b: Domain) => a.domain.localeCompare(b.domain),
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
          {text}
        </a>
      ),
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
  ], [renderStatusTag, renderActiveTag, renderDate, renderActions]); // isDeleting و deletingId را از اینجا حذف می‌کنیم چون renderActions به خودی خود آن‌ها را به عنوان dependencies دارد

  if (error) {
    return (
      <Card className="text-center p-8 shadow-md rounded-lg">
        <h3 className="text-lg text-red-600 mb-2">Error loading domains</h3>
        <p className="mb-4">Please try again later or contact support.</p>
        <Button type="primary" onClick={handleRefresh}>Retry</Button>
      </Card>
    );
  }
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-4 fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search domains" 
            prefix={<SearchOutlined className="text-gray-400" />} 
            onChange={(e) => handleSearch(e.target.value)}
            value={searchTerm}
            className="w-full md:w-72"
            allowClear
          />
          <Tooltip title="Toggle Filters">
            <Button 
              icon={<FilterOutlined />} 
              onClick={toggleFilters}
              type={showFilters ? "primary" : "default"}
            />
          </Tooltip>
          <Tooltip title="Refresh Data">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
            />
          </Tooltip>
        </div>
        
        {showFilters && (
          <Space className="w-full md:w-auto">
            <Select
              placeholder="Filter by status"
              onChange={handleStatusFilter}
              value={statusFilter}
              style={{ width: 150 }}
              options={statusOptions}
              allowClear
            />
            <Button onClick={resetFilters}>Reset</Button>
          </Space>
        )}
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredDomains} 
        loading={isLoading} 
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total) => `Total ${total} domains`
        }}
        className="shadow-sm"
        locale={{
          emptyText: <Empty description="No domains found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
      />
    </div>
  );
};

export default DomainTable;