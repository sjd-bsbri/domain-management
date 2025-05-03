import { useEffect } from 'react';
import { Form, Input, Switch, Select, Button, message } from 'antd';
import { useAddDomainMutation, useUpdateDomainMutation } from '../services/api';
import { Domain, DomainRequest } from '../types';

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
        message.success('Domain updated successfully');
      } else {
        await addDomain(values).unwrap();
        message.success('Domain added successfully');
      }
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(`Failed to ${isEditing ? 'update' : 'add'} domain`);
      console.error('Error submitting form:', error);
    }
  };

  const options = [
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ isActive: true, status: 'pending' }}
    >
      <Form.Item
        name="domain"
        label="Domain"
        rules={[
          { required: true, message: 'Please enter a domain' },
          { type: 'url', message: 'Please enter a valid URL' }
        ]}
      >
        <Input placeholder="https://example.com" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <Select options={options} />
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Active"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          {isEditing ? 'Update Domain' : 'Add Domain'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DomainForm; 