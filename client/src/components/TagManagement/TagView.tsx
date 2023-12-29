import React, { useContext } from 'react';
import DeleteConfirm from '../../utils/DeleteConfirm.tsx';

import axios from 'axios';
import EditTag from '../../utils/EditTag.tsx';
import AddTag from '../../utils/AddTag.tsx';
import { LanguageContext } from '../Settings/LanguageContext.tsx';

type LabelItem = {
  labelid: string;
  labelname: string;
  usersid: string[];

};

type TagViewProps = {
  labels: LabelItem[];
  handleSearch: () => void;
};

const TagView: React.FC<TagViewProps> = ({ labels, handleSearch }) => {
  const handleEdit = (labelid: string, labelname: string) => {
    let url = 'http://localhost:3001/api/label/edit';
    const data = {
      labelid: labelid,
      labelname: labelname
    };
    console.log(url);
    axios.put(url, data).then(() => {
      handleSearch();
    });
  };

  const handleDelete = (labelid: string) => {
    let url = 'http://localhost:3001/api/label/delete';
    url += '?' + "labelid=" + labelid.toString();
    axios.delete(url).then((response) => {
      handleSearch();
    })
      .catch(error => {
        if (error.response) {
          alert(error.response.data);
        }
      });
  };

  const handleAdd = (labelname: string) => {
    let url = 'http://localhost:3001/api/label/add';
    const data = {
      labelname: labelname
    };
    console.log(url);
    axios.post(url, data).then(() => {
      handleSearch();
    });
  }
  const { language } = useContext(LanguageContext);

  return (
    <>
      <AddTag
        onAdd={handleAdd} />
      <table className='tag-view-table'>
        <thead>
          <tr>
            <th>{language === 'zh' ? '标签名称' : 'Label Name'}</th>
            <th>{language === 'zh' ? '操作' : 'Action'}</th>
          </tr>
        </thead>
        <tbody>
          {
            labels.map((item, index) => (
              <tr key={index}>
                <td>{item.labelname}</td>
                <td className='action-tag'>
                  <EditTag
                    labelid={item.labelid} labelname={item.labelname} onEdit={handleEdit} />
                  <DeleteConfirm
                    id={item.labelid} onDelete={handleDelete} />
                </td>
              </tr>
            ))
          }

        </tbody>
      </table>
    </>
  )
};
export default TagView;