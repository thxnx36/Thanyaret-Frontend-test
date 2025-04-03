import { User } from '@/types';
import { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaBuilding, FaBriefcase, FaInfoCircle, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaMale, FaFemale } from 'react-icons/fa';

interface UserCardProps {
  user: User;
}

const UserCard: FC<UserCardProps> = ({ user }) => {
  const [showDetail, setShowDetail] = useState(false);
  
  // คำนวณเพศจากข้อมูลที่มี (อาจเป็นข้อมูลจาก API หรือเดาจากชื่อ)
  const gender = useMemo(() => {
    if (user['gender'] === 'male') return 'male';
    if (user['gender'] === 'female') return 'female';
    
    // เดาเพศจากชื่อ (แบบง่ายๆ)
    if (user.firstName.endsWith('a') || 
        user.firstName.endsWith('e') || 
        user.firstName.endsWith('i') ||
        user.firstName.endsWith('y')) {
      return 'female';
    }
    return 'male';
  }, [user]);

  // คำนวณอายุจากวันเกิด
  const age = useMemo(() => {
    if (!user.birthDate) return null;
    
    const birthDate = new Date(user.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // ปรับอายุหากยังไม่ถึงวันเกิดในปีนี้
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age > 0 && age < 100 ? age : null;
  }, [user.birthDate]);

  // แสดงไอคอนตามเพศ
  const GenderIcon = gender === 'female' ? FaFemale : FaMale;
  const genderColor = gender === 'female' ? 'text-pink-500' : 'text-blue-500';
  const genderText = gender === 'female' ? 'หญิง' : 'ชาย';
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 border-t-4 border-t-blue-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ backgroundColor: "#F0F7FF", boxShadow: '0 4px 15px -2px rgba(0, 0, 0, 0.1)' }}
      layout
    >
      <div className="relative z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-90"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 opacity-70"
          animate={{ 
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="px-4 pt-4 pb-10 relative z-10">
          <div className="flex items-center mb-3">
            <motion.div 
              className={`w-12 h-12 rounded-full ${gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'} overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white`}
              whileHover={{ rotate: 5 }}
            >
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </motion.div>
            <div className="ml-3 text-gray-800">
              <h3 className="font-bold text-lg leading-tight flex items-center">
                {user.firstName} {user.lastName}
                <span className={`ml-2 ${genderColor}`}>
                  <GenderIcon size={14} />
                </span>
                {age && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 rounded-full">
                    {age} ปี
                  </span>
                )}
              </h3>
              <p className="text-xs text-blue-500 flex items-center mt-1">
                <FaBriefcase className="mr-1" />
                {user.company.title}
              </p>
            </div>
          </div>
        </div>
        
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-blue-200 opacity-30 -top-20 -right-20"
          animate={{ 
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="px-4 py-3 bg-white relative rounded-t-3xl -mt-6 border-t border-gray-100">
        <div className="text-sm space-y-3 mb-3">
          <motion.div 
            className="flex items-center text-gray-700"
            whileHover={{ color: "#3B82F6", transition: { duration: 0.2 } }}
          >
            <div className="w-6 text-blue-500">
              <FaEnvelope size={14} />
            </div>
            <span className="font-medium truncate">{user.email}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center text-gray-700"
            whileHover={{ color: "#3B82F6", transition: { duration: 0.2 } }}
          >
            <div className="w-6 text-blue-500">
              <FaBuilding size={14} />
            </div>
            <span className="font-medium truncate">{user.company.name}</span>
          </motion.div>
        </div>
      </div>
      
      {/* Show additional information button */}
      <motion.div 
        className="bg-blue-50 p-3 flex justify-between items-center cursor-pointer transition-colors"
        onClick={() => setShowDetail(!showDetail)}
        whileHover={{ backgroundColor: "#EBF5FF" }}
        whileTap={{ backgroundColor: "#DBEAFE" }}
      >
        <motion.span 
          className="text-xs text-blue-600 font-medium flex items-center"
          initial={false}
          animate={{ x: showDetail ? 3 : 0 }}
        >
          <FaInfoCircle className="mr-1.5" />
          {showDetail ? 'Hide Details' : 'Show Details'}
        </motion.span>
        <motion.span 
          className="text-xs text-blue-500 bg-white px-2 py-1 rounded-full shadow-sm"
          whileHover={{ backgroundColor: "#F0F7FF" }}
        >
          ID: {user.id}
        </motion.span>
      </motion.div>
      
      {/* Additional details */}
      <AnimatePresence>
        {showDetail && (
          <motion.div 
            className="overflow-hidden bg-blue-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 space-y-3 text-sm divide-y divide-blue-100">
              {/* ข้อมูลเพศ */}
              <motion.div 
                className="flex items-center pt-2 first:pt-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.7)" }}
              >
                <div className={`w-6 ${genderColor}`}>
                  <GenderIcon size={14} />
                </div>
                <div className="ml-2">
                  <div className="text-xs text-blue-500 mb-0.5">เพศ</div>
                  <div className="text-gray-700">{genderText}</div>
                </div>
              </motion.div>
              
              {user.phone && (
                <motion.div 
                  className="flex items-center pt-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.7)" }}
                >
                  <div className="w-6 text-blue-500">
                    <FaPhone size={14} />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-blue-500 mb-0.5">Phone</div>
                    <div className="text-gray-700">{user.phone}</div>
                  </div>
                </motion.div>
              )}
              
              {user.address && (user.address.city || user.address.state || user.address.country) && (
                <motion.div 
                  className="flex items-center pt-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.7)" }}
                >
                  <div className="w-6 text-blue-500">
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-blue-500 mb-0.5">Location</div>
                    <div className="text-gray-700">
                      {[
                        user.address.city,
                        user.address.state,
                        user.address.country
                      ].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {user.birthDate && (
                <motion.div 
                  className="flex items-center pt-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.7)" }}
                >
                  <div className="w-6 text-blue-500">
                    <FaBirthdayCake size={14} />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-blue-500 mb-0.5">Birth Date {age && `(อายุ ${age} ปี)`}</div>
                    <div className="text-gray-700">{user.birthDate}</div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserCard; 