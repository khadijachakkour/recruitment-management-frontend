"use client";

import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="flex justify-center items-center space-x-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-blue-600"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      <motion.div
        className="w-6 h-6 rounded-full bg-blue-600"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.3,
        }}
      />
      <motion.div
        className="w-6 h-6 rounded-full bg-blue-600"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.6,
        }}
      />
    </motion.div>
  );
};

export default Loader;
