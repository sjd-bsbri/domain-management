import { useEffect } from 'react';
import { Form, Input, Switch, Select, Button, message, Divider, Alert, Space, Typography } from 'antd';
import { SaveOutlined, LinkOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAddDomainMutation, useUpdateDomainMutation } from '../services/api';
import { Domain, DomainRequest } from '../types';

const { Text } = Typography;

interface DomainFormProps {
  initialValues?: Domain;
  onSuccess: () => void;
}

const DomainForm: React.FC<DomainFormProps> = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [addDomain, { isLoading: isAdding }] = useAddDomainMutation();
  const [updateDomain, { isLoading: isUpdating }] = useUpdateDomainMutation();

  const isLoading = isAdding || isUpdating;
  const isEditing = !!initialValues;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: DomainRequest) => {
    try {
      if (isEditing && initialValues) {
        await updateDomain({
          id: initialValues.id,
          domain: values
        }).unwrap();
        message.success({
          content: 'Domain updated successfully',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
      } else {
        await addDomain(values).unwrap();
        message.success({
          content: 'Domain added successfully',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
      }
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(`Failed to ${isEditing ? 'update' : 'add'} domain`);
      console.error('Error submitting form:', error);
    }
  };

  const options = [
    { value: 'pending', label: 'Pending', icon: '🕒' },
    { value: 'verified', label: 'Verified', icon: '✅' },
    { value: 'rejected', label: 'Rejected', icon: '❌' },
  ];

  return (
    <div className="fade-in">
      {isEditing ? (
        <Alert
          message="Editing Domain"
          description={`You are currently editing ${initialValues?.domain}`}
          type="info"
          showIcon
          className="mb-6"
        />
      ) : (
        <Alert
          message="Add New Domain"
          description="Enter the details below to add a new domain"
          type="info"
          showIcon
          className="mb-6"
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true, status: 'pending' }}
        className="domain-form"
      >
        <Form.Item
          name="domain"
          label="Domain URL"
          rules={[
            { required: true, message: 'Please enter a domain' },
            { type: 'url', message: 'Please enter a valid URL' }
          ]}
        >
          <Input 
            prefix={<LinkOutlined className="text-gray-400" />} 
            placeholder="https://example.com" 
            size="large"
          />
        </Form.Item>

        <Divider className="my-4" />

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select
            options={options.map(option => ({
              value: option.value,
              label: (
                <Space>
                  <Text>{option.icon}</Text>
                  <Text>{option.label}</Text>
                </Space>
              )
            }))}
            size="large"
            placeholder="Select domain status"
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Active Status"
          valuePropName="checked"
          extra="Toggle to set the domain as active or inactive"
        >
          <Switch 
            checkedChildren="Active" 
            unCheckedChildren="Inactive" 
          />
        </Form.Item>

        <Divider className="my-4" />

        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading} 
            block
            size="large"
            icon={<SaveOutlined />}
            className="mt-4"
          >
            {isEditing ? 'Update Domain' : 'Add Domain'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DomainForm; 