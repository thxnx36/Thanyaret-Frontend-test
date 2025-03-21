import { TodoItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const initialTodoData: TodoItem[] = [
  {
    type: 'Fruit',
    name: 'Apple',
    id: uuidv4(),
  },
  {
    type: 'Vegetable',
    name: 'Broccoli',
    id: uuidv4(),
  },
  {
    type: 'Vegetable',
    name: 'Mushroom',
    id: uuidv4(),
  },
  {
    type: 'Fruit',
    name: 'Banana',
    id: uuidv4(),
  },
  {
    type: 'Vegetable',
    name: 'Tomato',
    id: uuidv4(),
  },
  {
    type: 'Fruit',
    name: 'Orange',
    id: uuidv4(),
  },
  {
    type: 'Fruit',
    name: 'Mango',
    id: uuidv4(),
  },
  {
    type: 'Fruit',
    name: 'Pineapple',
    id: uuidv4(),
  },
  {
    type: 'Vegetable',
    name: 'Cucumber',
    id: uuidv4(),
  },
  {
    type: 'Fruit',
    name: 'Watermelon',
    id: uuidv4(),
  },
  {
    type: 'Vegetable',
    name: 'Carrot',
    id: uuidv4(),
  },
]; 