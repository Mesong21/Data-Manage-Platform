import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

import 'moment/locale/zh-cn';
import formDate, { formDateWithoutTime } from '../utils/formDate.ts';
import LabelDropdown, { OptionType } from './LabelDropdown.tsx';
import axios from 'axios';
import SearchLabels from './SearchLabels.tsx';
import { LanguageContext } from '../components/Settings/LanguageContext.tsx';


moment.locale('zh-cn');
interface EditProps {
  id: string;
  name: string;
  description: string;
  labelData: OptionType[];
  addTime: string;
  onEdit: (id: string, name: string, description: string, labelData: OptionType[], addTime: string) => void;
}

const EditData: React.FC<EditProps> = ({ id, name, description, addTime, onEdit }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [labelData, setLabelData] = useState([]);
  const [allLabelData, setAllLabels] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({ id, name, description, addTime });
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
        // console.log("values" + values);
        // 比较 originalValues 和 values
        // if (JSON.stringify(values) !== JSON.stringify(originalValues)) {
        console.log("可以编辑");
        onEdit(id, values.name, values.description, selectedOptions, values.addTime);
        // }
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
    handleEdit();
    handleSearchLabel();
  };


  const handleSelectedOptionsChange = (newSelectedOptions: OptionType[]) => {
    setSelectedOptions(newSelectedOptions);
  };

  const { language } = React.useContext(LanguageContext);
  return (
    <div className='edit-data'>
      {/* <SearchLabels /> */}
      <button onClick={handleButtonClick}>{language === 'zh' ? '编辑' : 'Edit'}</button>
      <Modal
        title="Edit Data"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={language === 'zh' ? '确定' : 'OK'}
        cancelText={language === 'zh' ? '取消' : 'Cancel'}
      >
        <Form form={form} layout="vertical">
          {/* <Form.Item name="id" label="ID">
            <Input />
          </Form.Item> */}
          <Form.Item name="name" label={language === 'zh' ? '名称' : 'Name'}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={language === 'zh' ? '描述' : 'Description'}>
            <Input />
          </Form.Item>
          <Form.Item name="label" label={language === 'zh' ? '标签' : 'Label'}>
            <LabelDropdown
              allLabelData={allLabelData}
              reset={false}
              onSelectedOptionsChange={handleSelectedOptionsChange}
            />
          </Form.Item>
          <Form.Item name="addTime" label="Add Time" initialValue={formDateWithoutTime(addTime)}>
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export type { EditProps };
export default EditData;