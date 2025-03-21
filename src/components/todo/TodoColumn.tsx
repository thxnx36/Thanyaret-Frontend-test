import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoItem as TodoItemType } from '@/types';
import TodoItem from './TodoItem';

interface TodoColumnProps {
  title: string;
  items: TodoItemType[];
  onItemClick: (item: TodoItemType) => void;
  className?: string;
}

const TodoColumn: FC<TodoColumnProps> = ({ 
  items, 
  onItemClick,
  className = ''
}) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="space-y-2 flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={`${item.type}-${item.name}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              layout
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1
              }}
            >
              <TodoItem 
                item={item} 
                onClick={() => onItemClick(item)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-6 h-28 rounded-xl border border-dashed border-gray-200 bg-gray-50"
          >
            <div className="text-sm text-gray-400">No items yet</div>
            
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TodoColumn; 