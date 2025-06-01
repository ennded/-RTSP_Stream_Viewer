import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

interface HeaderProps {
  onAddStream: () => void;
}

export default function Header({ onAddStream }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          RTSP Stream Viewer
        </motion.h1>

        <motion.button
          onClick={onAddStream}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus />
          Add Stream
        </motion.button>
      </div>
    </header>
  );
}
