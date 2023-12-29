import React, { useContext, useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import LabelDropdown, { OptionType } from './LabelDropdown.tsx';
import axios from 'axios';
import { LanguageContext } from '../components/Settings/LanguageContext.tsx';

moment.locale('zh-cn');
interface AddProps {
  name: string;
  description: string;
  labelData: OptionType[];
  addTime: string;
  onAdd: (name: string, description: string, labelData: OptionType[], addTime: string) => void;
}

const AddData: React.FC<AddProps> = ({ name, description, addTime, onAdd }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allLabelData, setAllLabels] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.setFieldsValue({ name, description, addTime });
    setIsModalVisible(true);
  };


  const [originalValues, setOriginalValues] = useState(null);

  useEffect(() => {
    // 当表单打开时，设置 originalValues
    setOriginalValues(form.getFieldsValue());
  }, [form]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log("可以修改");
        onAdd(values.name, values.description, selectedOptions, values.addTime);
        console.log("selected labels: " + selectedOptions);
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const handleSearchLabel = () => {
    let url = 'http://localhost:3001/api/label';
    console.log("request url: " + url);
    axios.post(url)
      .then(response => {
        const allLabelData = response.data;

        setAllLabels(allLabelData);
      })
      .catch(error => console.error(error));
  };
  const handleButtonClick = () => {
    handleAdd();
    handleSearchLabel();
  };


  const handleSelectedOptionsChange = (newSelectedOptions: OptionType[]) => {
    setSelectedOptions(newSelectedOptions);
  };

  const { language } = useContext(LanguageContext);
  return (
    <div className='add-data'>
      <button
        onClick={handleButtonClick}
      >{language === 'zh' ? '添加数据' : 'Add Data'}</button>
      <Modal
        title={language === 'zh' ? '添加数据' : 'Add Data'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={language === 'zh' ? '确定' : 'OK'}
        cancelText={language === 'zh' ? '取消' : 'Cancel'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={language === 'zh' ? '名称' : 'Name'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={language === 'zh' ? '描述' : 'Description'} rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="label" label={language === 'zh' ? '标签' : 'Label'} rules={[{ required: false }]}>
            <LabelDropdown
              allLabelData={allLabelData}
              // labelData={selectedOptions}
              reset={false}
              onSelectedOptionsChange={handleSelectedOptionsChange}
            />
          </Form.Item>
          <Form.Item name="addTime" label={language === 'zh' ? '添加时间' : 'Add Time'} rules={[{ required: true }]} initialValue={moment()}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddData;