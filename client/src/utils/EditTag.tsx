import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { LanguageContext } from '../components/Settings/LanguageContext.tsx';

interface EditTagProps {
  labelid: string;
  labelname: string;
  onEdit: (labelid: string, labelname: string) => void;

}

const EditTag: React.FC<EditTagProps> = ({ labelid, labelname, onEdit }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({ labelid, labelname });
    setVisible(true);
  };

  const [originalValues, setOriginalValues] = useState(null);

  useEffect(() => {
    setOriginalValues(form.getFieldsValue());
  }, [form]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (JSON.stringify(values) !== JSON.stringify(originalValues)) {
          onEdit(labelid, values.labelname);
        }
        setVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const onCancel = () => {
    setVisible(false);
  };

  const { language } = React.useContext(LanguageContext);
  return (
    <div className='edit-tag'>
      <button onClick={handleEdit}>{language === 'zh' ? '编辑' : 'Edit'}</button>
      <Modal
        title={language === 'zh' ? '编辑标签' : 'Edit Tag'}
        visible={visible}
        onOk={handleOk}
        onCancel={onCancel}
        okText={language === 'zh' ? '确定' : 'OK'}
        cancelText={language === 'zh' ? '取消' : 'Cancel'}>
        <Form form={form} layout="vertical">
          <Form.Item name="labelname" label={language === 'zh' ? '标签名称' : 'Label Name'}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}



export default EditTag;