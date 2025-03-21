'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchUsers, groupUsersByDepartment } from '@/api/userService';
import { UsersByDepartment, User } from '@/types';
import DepartmentGroup from '@/components/userGroup/DepartmentGroup';
import Link from 'next/link';
import { FaSpinner, FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilter, FaInfoCircle, FaHome, FaChevronDown, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// สร้าง interface สำหรับพาร์ติเคิล
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// สร้างพาร์ติเคิลสำหรับพื้นหลัง
const Particles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleCount = 15;
  
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5
      });
    }
    setParticles(newParticles);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-100"
          initial={{ 
            left: `${particle.x}%`, 
            top: `${particle.y}%`, 
            width: `${particle.size}px`, 
            height: `${particle.size}px`,
            opacity: 0.1
          }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.2, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: particle.duration, 
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default function UserGroupPage() {
  const [usersByDepartment, setUsersByDepartment] = useState<UsersByDepartment>({});
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showUsageInfo, setShowUsageInfo] = useState(false);
  const [showDepartmentSelect, setShowDepartmentSelect] = useState(false);
  const departmentSelectRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await fetchUsers();
        setAllUsers(usersData);
        
        const groupedUsers = groupUsersByDepartment(usersData);
        setUsersByDepartment(groupedUsers);
        
      } catch (err) {
        setError('Error fetching user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUsers();
  }, []);

  const departmentList = useMemo(() => {
    return Object.keys(usersByDepartment).sort();
  }, [usersByDepartment]);
  
  const filteredData = useMemo(() => {
    const result: UsersByDepartment = {};
    
    if (searchTerm === '' && selectedDepartment === 'all') {
      return Object.entries(usersByDepartment)
        .sort(([deptA], [deptB]) => {
          return sortOrder === 'asc' 
            ? deptA.localeCompare(deptB) 
            : deptB.localeCompare(deptA);
        })
        .reduce((acc, [dept, users]) => {
          acc[dept] = users;
          return acc;
        }, {} as UsersByDepartment);
    }
    
    const deptToProcess = selectedDepartment === 'all' 
      ? Object.keys(usersByDepartment) 
      : [selectedDepartment];
    
    deptToProcess.forEach(dept => {
      if (!usersByDepartment[dept]) return;
      
      const filteredUsers = usersByDepartment[dept].filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        const company = user.company.name.toLowerCase();
        const title = user.company.title.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
               email.includes(searchLower) ||
               company.includes(searchLower) ||
               title.includes(searchLower);
      });
      
      if (filteredUsers.length > 0) {
        result[dept] = filteredUsers;
      }
    });
    
    return Object.entries(result)
      .sort(([deptA], [deptB]) => {
        return sortOrder === 'asc' 
          ? deptA.localeCompare(deptB) 
          : deptB.localeCompare(deptA);
      })
      .reduce((acc, [dept, users]) => {
        acc[dept] = users;
        return acc;
      }, {} as UsersByDepartment);
      
  }, [usersByDepartment, searchTerm, selectedDepartment, sortOrder]);
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (departmentSelectRef.current && !departmentSelectRef.current.contains(event.target as Node)) {
        setShowDepartmentSelect(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Custom styled department select dropdown
  const CustomDepartmentSelect = () => {
    return (
      <div className="relative flex-grow min-w-[140px]" ref={departmentSelectRef}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-blue-400">
          <FaFilter />
        </div>
        
        <motion.button
          className="relative w-full text-left pl-10 pr-10 py-3 text-sm sm:text-base rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
          onClick={() => setShowDepartmentSelect(!showDepartmentSelect)}
          whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
          whileTap={{ scale: 0.98 }}
        >
          {selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <motion.div
              animate={{ rotate: showDepartmentSelect ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown className="text-blue-500" />
            </motion.div>
          </div>
        </motion.button>
        
        <AnimatePresence>
          {showDepartmentSelect && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
              style={{ maxHeight: '60vh', overflowY: 'auto' }}
            >
              <div className="py-2">
                <div 
                  className={`relative px-4 py-2.5 cursor-pointer ${selectedDepartment === 'all' ? 'bg-blue-50' : 'hover:bg-blue-50'} transition-colors flex items-center justify-between`}
                  onClick={() => {
                    setSelectedDepartment('all');
                    setShowDepartmentSelect(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs mr-3">
                      <FaFilter />
                    </div>
                    <span className="font-medium">All Departments</span>
                  </div>
                  {selectedDepartment === 'all' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-blue-500"
                    >
                      <FaCheck />
                    </motion.div>
                  )}
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent my-1.5"></div>
                
                {departmentList.map((dept, index) => (
                  <motion.div 
                    key={dept}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`relative px-4 py-2.5 cursor-pointer ${selectedDepartment === dept ? 'bg-blue-50' : 'hover:bg-blue-50'} transition-colors flex items-center justify-between`}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setShowDepartmentSelect(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 flex items-center justify-center text-white text-xs mr-3">
                        {dept.charAt(0)}
                      </div>
                      <span>{dept}</span>
                    </div>
                    {selectedDepartment === dept && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-blue-500"
                      >
                        <FaCheck />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
              
              <motion.div 
                className="bg-blue-50 py-3 px-4 text-xs text-blue-500 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span>Total departments: {departmentList.length}</span>
                <button 
                  onClick={() => setShowDepartmentSelect(false)}
                  className="bg-white px-2 py-1 rounded text-blue-600 hover:text-blue-700 hover:shadow-sm transition-all"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {selectedDepartment !== 'all' && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md"
          >
            1
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-6 sm:pt-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Particles />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20"
        >
          <Link href="/" passHref>
            <motion.div
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-md border border-blue-100 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome className="text-blue-500" />
              <span className="text-blue-700 font-medium text-sm hidden sm:inline">Back to Home</span>
            </motion.div>
          </Link>
        </motion.div>
        
        <motion.div 
          className="mb-8 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-blue-700 pt-8 relative z-10">
            Users Grouped by Department
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-400 to-red-500 mx-auto mb-4 rounded-full shadow-sm"></div>
          
          <div className="flex justify-center items-center mt-4">
            <motion.button 
              onClick={() => setShowUsageInfo(!showUsageInfo)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow transition-all"
              aria-label="Show usage instructions"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInfoCircle className="mr-2" size={16} />
              <span>How it works</span>
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showUsageInfo && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white p-4 rounded-xl text-sm text-gray-700 border border-blue-100 shadow-md max-w-2xl mx-auto"
              >
                <p className="leading-relaxed">
                  User data from API organized by company departments. You can search by name, email, company, or position.
                  Filter by department using the dropdown and sort departments alphabetically.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {isLoading ? (
          <motion.div 
            className="flex flex-col justify-center items-center min-h-[300px] sm:min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { 
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity
                }
              }}
            >
              <FaSpinner className="text-blue-600 text-3xl sm:text-4xl" />
            </motion.div>
            <motion.span 
              className="ml-4 mt-4 text-sm sm:text-base text-gray-600"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                transition: { 
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              }}
            >
              Loading users data...
            </motion.span>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-400 text-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-red-700">Error</h3>
            <p className="mb-4 text-gray-700">{error}</p>
            <motion.button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-blue-400 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col gap-4">
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                    <FaSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, company or position..."
                    className="w-full pl-10 pr-4 py-3 text-sm sm:text-base rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4">
                  <CustomDepartmentSelect />
                  
                  <motion.button
                    onClick={toggleSortOrder}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm min-w-[120px]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {sortOrder === 'asc' ? (
                      <>
                        <FaSortAmountDown /> <span>Sort A-Z</span>
                      </>
                    ) : (
                      <>
                        <FaSortAmountUp /> <span>Sort Z-A</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              <motion.div 
                className="mt-4 sm:mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 p-3 bg-blue-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-blue-600 shadow-sm">
                  Total: {allUsers.length} users
                </div>
                <div className="px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-blue-600 shadow-sm">
                  Showing: {Object.values(filteredData).flat().length} users
                </div>
                <div className="px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-blue-600 shadow-sm">
                  Departments: {Object.keys(filteredData).length}
                </div>
                
                {searchTerm && (
                  <div className="px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-blue-600 flex items-center shadow-sm">
                    <span className="font-medium mr-2">
                      Search: &quot;{searchTerm}&quot;
                    </span>
                    <motion.button
                      onClick={() => setSearchTerm('')}
                      className="text-red-500 hover:text-red-600"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      &times;
                    </motion.button>
                  </div>
                )}
                
                {selectedDepartment !== 'all' && (
                  <div className="px-3 py-1 bg-white rounded-full text-xs sm:text-sm text-blue-600 flex items-center shadow-sm">
                    <span className="font-medium mr-2">
                      Department: &quot;{selectedDepartment}&quot;
                    </span>
                    <motion.button
                      onClick={() => setSelectedDepartment('all')}
                      className="text-red-500 hover:text-red-600"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      &times;
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              {Object.entries(filteredData).length > 0 ? (
                Object.entries(filteredData).map(([department, departmentUsers], index) => (
                  <motion.div
                    key={department}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <DepartmentGroup 
                      name={department} 
                      users={departmentUsers} 
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-gray-300 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </motion.div>
              )}
            </motion.div>
            
            <motion.div 
              className="text-center text-sm text-gray-500 mb-8 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
            </motion.div>
          </>
        )}
      </div>
    </motion.main>
  );
}