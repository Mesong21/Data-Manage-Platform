import React from 'react';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <>
      <button onClick={onEdit}>编辑</button>
      <button onClick={onDelete}>删除</button>
    </>
  );
};

export default ActionButtons;