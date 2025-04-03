import { FC, useState } from 'react';
import { User } from '@/types';
import UserCard from './UserCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaBuilding, FaUserFriends, FaThList, FaThLarge, FaMale, FaFemale, FaChartBar } from 'react-icons/fa';

interface DepartmentGroupProps {
  name: string;
  users: User[];
}

const DepartmentGroup: FC<DepartmentGroupProps> = ({ name, users }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [showStats, setShowStats] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'compact' : 'grid');
  };
  
  const toggleStats = () => {
    setShowStats(!showStats);
  };
  
  const companies = [...new Set(users.map(user => user.company.name))];
  
  const positions = [...new Set(users.map(user => user.company.title))];
  
  // คำนวณข้อมูลสถิติของแผนก
  const calculateDepartmentStats = () => {
    if (!users || users.length === 0) return { males: 0, females: 0, ageRange: { min: 0, max: 0, avg: 0 } };
    
    // นับจำนวนเพศชายและหญิง (เดาจากข้อมูลที่มี)
    let males = 0;
    let females = 0;
    
    // คำนวณอายุ
    const ages: number[] = [];
    const currentYear = new Date().getFullYear();
    
    // อายุกลุ่มต่างๆ
    const ageGroups = {
      '20-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51+': 0
    };
    
    users.forEach(user => {
      // ตรวจสอบเพศจากข้อมูล gender ถ้ามีใน API ข้อมูล
      if (user['gender'] === 'male') {
        males++;
      } else if (user['gender'] === 'female') {
        females++;
      } else {
        // เดาเพศจากชื่อ (แบบง่ายๆ สำหรับตัวอย่าง)
        // สมมติว่าชื่อที่ลงท้ายด้วย a, e มักเป็นผู้หญิง (ไม่แม่นยำ 100%)
        if (user.firstName.endsWith('a') || 
            user.firstName.endsWith('e') || 
            user.firstName.endsWith('i') ||
            user.firstName.endsWith('y')) {
          females++;
        } else {
          males++;
        }
      }
      
      // คำนวณอายุจากวันเกิด (ถ้ามี)
      if (user.birthDate) {
        const birthYear = new Date(user.birthDate).getFullYear();
        const age = currentYear - birthYear;
        if (age > 0 && age < 100) { // ตรวจสอบความถูกต้องของอายุ
          ages.push(age);
          
          // เพิ่มข้อมูลในกลุ่มอายุ
          if (age <= 30) ageGroups['20-30']++;
          else if (age <= 40) ageGroups['31-40']++;
          else if (age <= 50) ageGroups['41-50']++;
          else ageGroups['51+']++;
        }
      }
    });
    
    // คำนวณช่วงอายุ
    const minAge = ages.length > 0 ? Math.min(...ages) : 0;
    const maxAge = ages.length > 0 ? Math.max(...ages) : 0;
    const avgAge = ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;
    
    // คำนวณเปอร์เซ็นของสัดส่วนชาย/หญิง
    const total = males + females;
    const malePercent = total > 0 ? Math.round((males / total) * 100) : 0;
    const femalePercent = total > 0 ? Math.round((females / total) * 100) : 0;
    
    return {
      males,
      females,
      malePercent,
      femalePercent,
      ageRange: {
        min: minAge,
        max: maxAge,
        avg: avgAge
      },
      ageGroups
    };
  };
  
  const departmentStats = calculateDepartmentStats();

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
                className="flex items-center mt-1 text-gray-500 text-xs flex-wrap gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  <FaBuilding className="mr-1" />
                  <span>{companies.length} companies</span>
                </div>
                <span className="mx-2 hidden sm:inline">|</span>
                <span>{positions.length} positions</span>
                
                {/* แสดงข้อมูลสรุป */}
                <span className="mx-2 hidden sm:inline">|</span>
                <div className="flex items-center gap-1">
                  <FaMale className="text-blue-500" /> {departmentStats.males}
                  <span className="mx-1">|</span>
                  <FaFemale className="text-pink-500" /> {departmentStats.females}
                </div>
                {departmentStats.ageRange.min > 0 && (
                  <>
                    <span className="mx-2 hidden sm:inline">|</span>
                    <span>อายุ {departmentStats.ageRange.min}-{departmentStats.ageRange.max} ปี (เฉลี่ย {departmentStats.ageRange.avg})</span>
                  </>
                )}
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
              {/* ปุ่มแสดงสรุปข้อมูลแผนก */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                layout
              >
                <motion.button
                  className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 transition-colors px-4 py-2 rounded-full text-sm font-medium text-blue-600 shadow-sm"
                  onClick={toggleStats}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <FaChartBar />
                  <span>{showStats ? 'ซ่อนสรุปข้อมูลแผนก' : 'แสดงสรุปข้อมูลแผนก'}</span>
                  <motion.div
                    animate={{ rotate: showStats ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown />
                  </motion.div>
                </motion.button>
              </motion.div>
              
              {/* สรุปข้อมูลแผนก - ใช้ layout animation */}
              <motion.div
                layout
                className="w-full overflow-hidden"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <AnimatePresence mode="popLayout">
                  {showStats && (
                    <motion.div 
                      className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl mb-5 shadow-inner"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3 }}
                      layout
                      layoutId={`stats-${name}`}
                    >
                      <h3 className="text-base font-semibold text-blue-800 mb-3 border-b border-blue-200 pb-2">
                        สรุปข้อมูลแผนก {name}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ข้อมูลสัดส่วนชาย-หญิง */}
                        <motion.div 
                          className="bg-white p-3 rounded-lg shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h4 className="text-sm font-medium text-gray-700 mb-2">สัดส่วนชาย-หญิง</h4>
                          
                          <div className="flex items-center mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-400 h-4 rounded-l-full" 
                                style={{ width: `${departmentStats.malePercent}%` }}
                              ></div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-gradient-to-r from-pink-400 to-pink-500 h-4 rounded-r-full" 
                                style={{ width: `${departmentStats.femalePercent}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-600">
                            <div className="flex items-center">
                              <FaMale className="text-blue-500 mr-1" /> 
                              <span>{departmentStats.males} คน ({departmentStats.malePercent}%)</span>
                            </div>
                            <div className="flex items-center">
                              <FaFemale className="text-pink-500 mr-1" /> 
                              <span>{departmentStats.females} คน ({departmentStats.femalePercent}%)</span>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* ข้อมูลอายุ */}
                        <motion.div 
                          className="bg-white p-3 rounded-lg shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="text-sm font-medium text-gray-700 mb-2">ข้อมูลอายุ</h4>
                          
                          {departmentStats.ageRange.min > 0 ? (
                            <>
                              <div className="flex justify-between mb-1">
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium text-blue-600">ช่วงอายุ:</span> {departmentStats.ageRange.min}-{departmentStats.ageRange.max} ปี
                                </div>
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium text-blue-600">อายุเฉลี่ย:</span> {departmentStats.ageRange.avg} ปี
                                </div>
                              </div>
                              
                              {/* กราฟแสดงกลุ่มอายุ */}
                              <div className="grid grid-cols-4 gap-1 mt-2">
                                {Object.entries(departmentStats.ageGroups || {}).map(([range, count]) => (
                                  <div key={range} className="flex flex-col items-center">
                                    <div className="w-full bg-blue-100 rounded-t-sm relative">
                                      <motion.div 
                                        className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min((count / users.length) * 100, 100)}%` }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                      ></motion.div>
                                      <div className="h-16 w-full relative"></div>
                                    </div>
                                    <span className="text-xs mt-1">{range}</span>
                                    <span className="text-xs text-gray-500">{count}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-gray-500 flex items-center justify-center h-20">
                              ไม่มีข้อมูลวันเกิด
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* รายชื่อพนักงาน */}
              <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
                {viewMode === 'grid' ? (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                    {users.map(user => (
                      <motion.div key={user.id} variants={itemVariants} layout>
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
              </motion.div>
              
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