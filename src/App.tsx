import { useState } from 'react';
import { Button, Drawer, Layout, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DomainTable from './components/DomainTable';
import DomainForm from './components/DomainForm';
import { Domain } from './services/api';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | undefined>(undefined);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingDomain(undefined);
  };

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain);
    openDrawer();
  };

  const handleFormSuccess = () => {
    closeDrawer();
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Header className="flex items-center bg-white shadow-sm px-4">
        <div className="container flex justify-between items-center">
          <Title level={3} className="text-gray-800 m-0">Domain Management</Title>
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={openDrawer}
          >
            Add Domain
          </Button>
        </div>
      </Header>
      <Content className="py-8">
        <div className="container">
          <DomainTable onEdit={handleEdit} />
        </div>
      </Content>

      <Drawer
        title={editingDomain ? "Edit Domain" : "Add New Domain"}
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={400}
      >
        <DomainForm 
          initialValues={editingDomain} 
          onSuccess={handleFormSuccess} 
        />
      </Drawer>
    </Layout>
  );
}

export default App; 