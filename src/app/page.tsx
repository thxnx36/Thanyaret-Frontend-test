'use client';

import Link from 'next/link';
import { FaClipboardList, FaUsers, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Define the particle size
const particleCount = 20;

// Create interface for particles
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// Create particles for background
const Particles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
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
          className="absolute rounded-full bg-blue-300"
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

// Create hover effects for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  hover: { 
    y: -8,
    boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    }
  }
};

// Decorative line component
const DecorativeLine = ({ color }: { color: string }) => (
  <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
    <motion.div
      className={`h-full ${color}`}
      initial={{ x: "-100%" }}
      whileHover={{ x: "0%" }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

// Clean and beautiful card component
const Card = ({ 
  href, 
  icon: Icon, 
  title, 
  subtitle,
  color,
  hoverColor
}: { 
  href: string; 
  icon: React.ElementType; 
  title: string; 
  subtitle: string;
  color: string;
  hoverColor: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="w-full relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link 
        href={href}
        className="block h-full relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
      >
        <DecorativeLine color={color} />
        <div className="p-6 sm:p-8 h-full flex flex-col">
          <div className="flex justify-between mb-6">
            <motion.div 
              className={`flex items-center justify-center w-16 h-16 ${color} rounded-xl shadow-md overflow-hidden`}
              animate={{ 
                scale: isHovered ? 1.05 : 1,
                rotate: isHovered ? [0, -3, 3, -3, 0] : 0
              }}
              transition={{
                rotate: { duration: 0.5 },
                scale: { duration: 0.2 }
              }}
            >
              <Icon className="text-white text-3xl" />
            </motion.div>
            
            <motion.div 
              className="relative w-10 h-10"
              animate={{
                rotate: isHovered ? 180 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill={isHovered ? hoverColor : "#f8f9fa"} />
                <motion.path 
                  d="M16 14L24 20L16 26" 
                  stroke={isHovered ? "#fff" : "#1E40AF"} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </svg>
            </motion.div>
          </div>
          
          <div className="flex-grow">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
              {title}
            </h2>
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          </div>
          
          <motion.div 
            className="mt-6 overflow-hidden rounded-md"
            animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`flex items-center justify-between py-3 px-4 ${hoverColor} bg-opacity-10 rounded-md`}>
              <div className="flex items-center">
                <motion.div
                  className={`w-2 h-2 rounded-full ${color.replace('bg-', 'bg-')}`}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className={`ml-2 h-1 w-10 overflow-hidden rounded-full ${hoverColor} bg-opacity-20`}>
                  <motion.div 
                    className={`h-full ${color}`}
                    animate={{ x: ["0%", "100%", "0%"] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
              <motion.div 
                className="relative"
                animate={{ x: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3.75V14.25M9 3.75L4.5 8.25M9 3.75L13.5 8.25" stroke={color.includes('blue') ? "#1E40AF" : "#B91C1C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-1 ${color}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-blue-50 relative overflow-hidden">
      <Particles />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-16 relative z-10 w-full max-w-3xl mx-auto px-4"
      >
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 relative inline-block"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-blue-600">
            Frontend Developer Test
          </span>
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 100 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-red-600 mx-auto mb-6 rounded-full"
        />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm text-gray-800 mb-10"
        >
          <span className="font-medium text-blue-700 text-lg">7-solutions</span>
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10 px-4">
        <Card 
          href="/todo" 
          icon={FaClipboardList} 
          title="Auto Delete Todo List" 
          subtitle="" 
          color="bg-blue-600"
          hoverColor="bg-blue-100"
        />
        
        <Card 
          href="/user-group" 
          icon={FaUsers} 
          title="User Group by Department" 
          subtitle="" 
          color="bg-red-600"
          hoverColor="bg-red-100"
        />
      </div>
      
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 sm:mt-20 text-gray-500 text-xs sm:text-sm text-center relative z-10 w-full max-w-4xl px-4"
      >
        <div className="flex flex-col items-center">
          <p className="mb-4 text-blue-600">By Thanyaret Seangsrichan</p>
          
          <div className="flex items-center space-x-4 mb-6">
            {['Next.js', 'React', 'TypeScript', 'Tailwind CSS'].map((tech, index) => (
              <motion.span 
                key={tech}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -2 }}
                className="text-xs px-3 py-1 bg-white text-blue-600 rounded-full shadow-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>
          
          <motion.a 
            href="https://github.com/thxnx36/Thanyaret-Frontend-test" 
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FaGithub size={16} />
            <span>GitHub</span>
          </motion.a>
        </div>
      </motion.footer>
    </main>
  );
}
