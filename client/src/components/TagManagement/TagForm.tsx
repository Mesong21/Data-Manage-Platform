import { Form, Input, Button } from 'antd';
import React, {useEffect} from 'react';
import TagView from './TagView.tsx';
import axios from 'axios';

interface TagFormProps {
  onSearch: (query: { labelname: string; }) => void;
  handleSearch: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ onSearch}) => {
  const [labelName, setLabelName] = React.useState('');
  const [labels, setLabels] = React.useState([]);

  const handleSearch = () => {
    let url = 'http://localhost:3001/api/label';
    const params = new URLSearchParams();
    if (labelName) {
      params.append('labelname', labelName);
    }
    if (params.toString()) {
      url += '?' + params.toString();
    }
    console.log("request url: " + url);
    axios.post(url)
      .then(response => {
        const labels = response.data;
        setLabels(labels);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    handleSearch();
  }, []);
  
  return (
    <div className='tag-form'>
      <TagView 
        labels = {labels}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default TagForm;