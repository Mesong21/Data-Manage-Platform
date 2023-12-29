import React from 'react';
import { Modal } from 'antd';
import { LanguageContext } from '../components/Settings/LanguageContext.tsx';

interface DeleteConfirmProps {
  id: string;
  onDelete: (id: string) => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ id, onDelete }) => {
  const { language } = React.useContext(LanguageContext);
  const confirmTitle = language === 'zh' ? '确定要删除吗？' : 'Are you sure you want to delete?';
  const handleDelete = () => {
    Modal.confirm({
      title: confirmTitle,
      onOk: () => onDelete(id),
      okText: language === 'zh' ? '确定' : 'OK',
      cancelText: language === 'zh' ? '取消' : 'Cancel'
    });
  };


  return (
    <div className='delete-data'>
      <button
        onClick={handleDelete}>{language === 'zh' ? '删除' : 'Delete'}
      </button>
    </div>
  );

};

export default DeleteConfirm;