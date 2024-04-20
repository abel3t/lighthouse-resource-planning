import axios from 'axios';
import { toast } from 'sonner';

export const client = axios.create({
  baseURL: '/api'
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const defaultMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau!';
    toast.error(error.response?.data || defaultMessage);

    return {};
  }
);
