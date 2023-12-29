import { message } from 'antd';

interface NotificationModalProps {
  content: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ content }) => {
  message.info(content);
  return null;
};

export default NotificationModal;