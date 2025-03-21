import { motion } from 'framer-motion';
import { FC } from 'react';
import { TodoItem as TodoItemType } from '@/types';
import { FaAppleAlt, FaCarrot, FaListUl } from 'react-icons/fa';

interface TodoItemProps {
  item: TodoItemType;
  onClick: () => void;
  className?: string;
}

const TodoItem: FC<TodoItemProps> = ({ item, onClick, className = '' }) => {
  // Select icon based on item type
  const getIcon = () => {
    if (item.type === 'Fruit') {
      return <FaAppleAlt className="text-blue-500" />;
    } else if (item.type === 'Vegetable') {
      return <FaCarrot className="text-red-500" />;
    }
    return <FaListUl className="text-gray-500" />;
  };

  // Select colors based on item type
  const getColors = () => {
    if (item.type === 'Fruit') {
      return {
        border: 'border-blue-200',
        hoverBg: 'hover:bg-blue-50',
        bg: 'bg-white',
        icon: 'text-blue-500',
        iconHover: 'group-hover:text-blue-600',
        dot: 'bg-blue-400'
      };
    } else if (item.type === 'Vegetable') {
      return {
        border: 'border-red-200',
        hoverBg: 'hover:bg-red-50',
        bg: 'bg-white',
        icon: 'text-red-500',
        iconHover: 'group-hover:text-red-600',
        dot: 'bg-red-400'
      };
    }
    return {
      border: 'border-gray-200',
      hoverBg: 'hover:bg-gray-50',
      bg: 'bg-white',
      icon: 'text-gray-500',
      iconHover: 'group-hover:text-gray-600',
      dot: 'bg-gray-400'
    };
  };

  const colors = getColors();

  // Add framer-motion effects
  const itemVariants = {
    initial: { 
      opacity: 0, 
      y: 10
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    tap: { 
      scale: 0.98 
    }
  };

  return (
    <motion.button
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileTap="tap"
      onClick={onClick}
      className={`group w-full px-3 py-2.5 rounded-lg 
        transition-all duration-200
        flex items-center space-x-2 relative
        border ${colors.border} ${colors.bg} ${colors.hoverBg} ${className}`}
      layout
    >
      <span className={`flex-shrink-0 w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center transition-colors duration-200`}>
        <motion.span 
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className={`${colors.icon} ${colors.iconHover} transition-colors duration-200`}
        >
          {getIcon()}
        </motion.span>
      </span>
      
      <span className="font-medium text-sm sm:text-base text-gray-700 group-hover:text-gray-900 flex-grow transition-colors duration-200">
        {item.name}
      </span>
      
      <motion.div 
        className={`flex items-center space-x-1.5 opacity-70`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
        <div className={`h-1 w-1 rounded-full ${colors.dot}`} />
      </motion.div>
    </motion.button>
  );
};

export default TodoItem; 