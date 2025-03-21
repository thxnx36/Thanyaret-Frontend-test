import axios from 'axios';
import { User, UsersByDepartment } from '@/types';

/**
 * ดึงข้อมูลผู้ใช้จาก API
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get('https://dummyjson.com/users?limit=100');
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * จัดกลุ่มข้อมูลผู้ใช้ตามแผนก
 */
export const groupUsersByDepartment = (users: User[]): UsersByDepartment => {
  const result: UsersByDepartment = {};

  return users.reduce((acc, user) => {
    const department = user.company.department;
    
    if (!acc[department]) {
      acc[department] = [];
    }
    
    acc[department].push(user);
    return acc;
  }, result);
}; 