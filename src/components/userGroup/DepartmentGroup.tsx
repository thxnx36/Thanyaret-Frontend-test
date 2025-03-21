import { FC, useState } from 'react';
import { User } from '@/types';
import UserCard from './UserCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaBuilding, FaUserFriends, FaThList, FaThLarge } from 'react-icons/fa';

interface DepartmentGroupProps {
  name: string;
  users: User[];
}

const DepartmentGroup: FC<DepartmentGroupProps> = ({ name, users }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'compact' : 'grid');
  };
  
  const companies = [...new Set(users.map(user => user.company.name))];
  
  const positions = [...new Set(users.map(user => user.company.title))];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };
  
  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-blue-400">
        <motion.div 
          className="flex justify-between items-center cursor-pointer mb-4"
          onClick={toggleOpen}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          layoutId={`header-${name}`}
        >
          <motion.div className="flex items-center">
            <motion.div 
              className="bg-blue-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0"
              whileHover={{ rotate: 15 }}
            >
              <FaUserFriends className="text-blue-500 text-base sm:text-xl" />
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-blue-700 flex items-center flex-wrap">
                {name} 
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs sm:text-sm"
                >
                  {users.length} people
                </motion.span>
              </h2>
              <motion.div 
                className="flex items-center mt-1 text-gray-500 text-xs"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  <FaBuilding className="mr-1" />
                  <span>{companies.length} companies</span>
                </div>
                <span className="mx-2">|</span>
                <span>{positions.length} positions</span>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="flex items-center">
            <motion.button 
              className="bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium mr-2 sm:mr-3 shadow-sm flex items-center"
              onClick={(e) => { e.stopPropagation(); toggleViewMode(); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {viewMode === 'grid' ? (
                <>
                  <FaThList className="mr-1" /> <span className="hidden sm:inline">Compact</span>
                </>
              ) : (
                <>
                  <FaThLarge className="mr-1" /> <span className="hidden sm:inline">Grid</span>
                </>
              )}
            </motion.button>
            <motion.div 
              className="text-blue-500 w-6 h-6 flex items-center justify-center"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown />
            </motion.div>
          </div>
        </motion.div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {viewMode === 'grid' ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {users.map(user => (
                    <motion.div key={user.id} variants={itemVariants}>
                      <UserCard user={user} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="bg-white rounded-xl overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-blue-50">
                        <tr>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider hidden sm:table-cell">
                            Company
                          </th>
                          <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                            Position
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                          <motion.tr 
                            key={user.id} 
                            className="hover:bg-blue-50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                            whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.7)" }}
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                                <div className="text-xs sm:text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-xs sm:text-sm text-gray-500">{user.company.name}</div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {user.company.title}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
              
              {users.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-6 h-28 rounded-xl border border-dashed border-gray-200 bg-gray-50"
                >
                  <div className="text-sm text-gray-400">No users found</div>
                  <motion.div 
                    className="text-3xl mt-2"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DepartmentGroup; 