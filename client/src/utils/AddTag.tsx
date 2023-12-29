import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import { LanguageContext } from '../components/Settings/LanguageContext.tsx';

interface AddProps {
  onAdd: (labelname: string) => void;
}

const AddTag: React.FC<AddProps> = ({ onAdd }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields()
      .then(values => {
        onAdd(values.labelname);
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const { language } = React.useContext(LanguageContext);
  return (
    <div className='add-tag'>
      <button onClick={() => setIsModalVisible(true)}>{language === 'zh' ? '添加标签' : 'Add Label'}</button>
      <Modal
        title={language === 'zh' ? '添加标签' : 'Add Label'}
        visible={isModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsModalVisible(false)}
        okText={language === 'zh' ? '确定' : 'OK'}
        cancelText={language === 'zh' ? '取消' : 'Cancel'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="labelname" label={language === 'zh' ? '标签名称' : 'Label Name'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddTag;