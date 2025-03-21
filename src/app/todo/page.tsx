'use client';

import { useState, useEffect, useRef } from 'react';
import { initialTodoData } from '@/lib/todoData';
import { TodoItem } from '@/types';
import TodoColumn from '@/components/todo/TodoColumn';
import { motion } from 'framer-motion';
import { FaGift, FaLeaf, FaList, FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function TodoPage() {
  const [mainList, setMainList] = useState<TodoItem[]>(initialTodoData);
  const [fruitItems, setFruitItems] = useState<TodoItem[]>([]);
  const [vegetableItems, setVegetableItems] = useState<TodoItem[]>([]);
  
  const timeoutIdsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const itemStatesRef = useRef<Record<string, 'main' | 'fruit' | 'vegetable'>>({});
  
  useEffect(() => {
    initialTodoData.forEach(item => {
      if (item.id) {
        itemStatesRef.current[item.id] = 'main';
      }
    });
  }, []);

  const handleMainItemClick = (item: TodoItem) => {
    const itemId = item.id;
    if (!itemId) return;
    
    if (itemStatesRef.current[itemId] !== 'main') {
      console.log(`Item ${itemId} is not in main list, state: ${itemStatesRef.current[itemId]}`);
      return;
    }
    
    setMainList(prev => prev.filter(i => i.id !== itemId));
    
    if (item.type === 'Fruit') {
      itemStatesRef.current[itemId] = 'fruit';
      
      setFruitItems(prev => [...prev, item]);
      
      if (timeoutIdsRef.current[itemId]) {
        clearTimeout(timeoutIdsRef.current[itemId]);
      }
      
      const timeoutId = setTimeout(() => {
        if (itemStatesRef.current[itemId] === 'fruit') {
          setFruitItems(prev => prev.filter(i => i.id !== itemId));
          setMainList(prev => [...prev, item]);
          
          itemStatesRef.current[itemId] = 'main';
          
          delete timeoutIdsRef.current[itemId];
        }
      }, 5000);
      
      timeoutIdsRef.current[itemId] = timeoutId;
    } else if (item.type === 'Vegetable') {
      itemStatesRef.current[itemId] = 'vegetable';
      
      setVegetableItems(prev => [...prev, item]);
      
      if (timeoutIdsRef.current[itemId]) {
        clearTimeout(timeoutIdsRef.current[itemId]);
      }
      
      const timeoutId = setTimeout(() => {
        if (itemStatesRef.current[itemId] === 'vegetable') {
          setVegetableItems(prev => prev.filter(i => i.id !== itemId));
          setMainList(prev => [...prev, item]);
          
          itemStatesRef.current[itemId] = 'main';
          
          delete timeoutIdsRef.current[itemId];
        }
      }, 5000);
      
      timeoutIdsRef.current[itemId] = timeoutId;
    }
  };
  
  const handleFruitItemClick = (item: TodoItem) => {
    const itemId = item.id;
    if (!itemId) return;
    
    if (itemStatesRef.current[itemId] !== 'fruit') {
      console.log(`Item ${itemId} is not in fruit list, state: ${itemStatesRef.current[itemId]}`);
      return;
    }
    
    if (timeoutIdsRef.current[itemId]) {
      clearTimeout(timeoutIdsRef.current[itemId]);
      delete timeoutIdsRef.current[itemId];
    }
    
    itemStatesRef.current[itemId] = 'main';
    
    setFruitItems(prev => prev.filter(i => i.id !== itemId));
    
    setMainList(prev => [...prev, item]);
  };
  
  const handleVegetableItemClick = (item: TodoItem) => {
    const itemId = item.id;
    if (!itemId) return;
    
    if (itemStatesRef.current[itemId] !== 'vegetable') {
      console.log(`Item ${itemId} is not in vegetable list, state: ${itemStatesRef.current[itemId]}`);
      return;
    }
    
    if (timeoutIdsRef.current[itemId]) {
      clearTimeout(timeoutIdsRef.current[itemId]);
      delete timeoutIdsRef.current[itemId];
    }
    
    itemStatesRef.current[itemId] = 'main';
    
    setVegetableItems(prev => prev.filter(i => i.id !== itemId));
    
    setMainList(prev => [...prev, item]);
  };

  useEffect(() => {
    return () => {
      Object.values(timeoutIdsRef.current).forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-6 sm:pt-12 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
            Auto Delete Todo List
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-400 to-red-500 mx-auto mb-4 rounded-full shadow-sm"></div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto text-sm sm:text-base">
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="col-span-1 sm:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-blue-400">
              <div className="flex items-center mb-4">
                <FaList className="text-blue-500 mr-2 text-xl" />
                <h2 className="text-lg font-bold text-blue-700">All Items</h2>
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  {mainList.length} items
                </span>
              </div>
              <TodoColumn 
                title="All Items" 
                items={mainList} 
                onItemClick={handleMainItemClick}
                className="bg-white"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-blue-400">
              <div className="flex items-center mb-4">
                <FaGift className="text-blue-500 mr-2 text-xl" />
                <h2 className="text-lg font-bold text-blue-700">Fruits</h2>
                <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  {fruitItems.length} items
                </span>
              </div>
              <TodoColumn 
                title="Fruit" 
                items={fruitItems} 
                onItemClick={handleFruitItemClick}
                className="bg-white"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-red-400">
              <div className="flex items-center mb-4">
                <FaLeaf className="text-red-500 mr-2 text-xl" />
                <h2 className="text-lg font-bold text-red-700">Vegetables</h2>
                <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                  {vegetableItems.length} items
                </span>
              </div>
              <TodoColumn 
                title="Vegetable" 
                items={vegetableItems} 
                onItemClick={handleVegetableItemClick}
                className="bg-white"
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="text-center text-sm text-gray-500 mb-8 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
           </motion.div>
      </div>
    </motion.main>
  );
} 