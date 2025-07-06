import { useState } from 'react';
import { Button, Drawer, Layout, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DomainTable from './components/DomainTable';
import DomainForm from './components/DomainForm';
import { Domain } from './services/api';

const { Header, Content, Footer } = Layout;
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
    <Layout className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header className="flex items-center bg-white shadow-md px-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <Title level={3} className="text-gray-800 m-0 hidden sm:block">Domain Management</Title>
          </div>
          <Button 
            type="primary"
            icon={<PlusOutlined />} 
            onClick={openDrawer}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 border-none shadow-md hover:shadow-lg transition-all duration-300"
          >
            Add Domain
          </Button>
        </div>
      </Header>
      
      <Content className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <DomainTable onEdit={handleEdit} />
          </div>
        </div>
      </Content>

      <Footer className="text-center text-gray-500 bg-white border-t border-gray-200">
        Domain Management System ©{new Date().getFullYear()}
      </Footer>

      <Drawer
        title={editingDomain ? "Edit Domain" : "Add New Domain"}
        placement="right"
        onClose={closeDrawer}
        open={isDrawerOpen}
        width={400}
        className="domain-drawer"
        headerStyle={{ borderBottom: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '24px' }}
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