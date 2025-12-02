//export default function StreamPanel(){ return <div>StreamPanel</div> }

import React, { useCallback, useEffect, useRef, useState } from "react";
import NewsCard from "./NewsCard";
import { NewsItem } from "../models/domain/NewsItem";
import { motion, AnimatePresence } from "framer-motion";

interface StreamPanelProps {
  streamUrl: string;
}

const sparkleVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, 2, -2, 0],
    boxShadow: "0px 0px 20px rgba(255,215,0,0.6)",
    transition: { duration: 0.4, yoyo: Infinity },
  },
};

const StreamPanel: React.FC<StreamPanelProps> = ({ streamUrl }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(streamUrl);
    esRef.current = es;

    es.onmessage = (ev) => {
      const payload = JSON.parse(ev.data);
      setNewsItems((prev) => [payload, ...prev].slice(0, 200));
    };

    return () => es.close();
  }, [streamUrl]);

  return (
    <div className="stream-panel grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <AnimatePresence>
        {newsItems.map((item) => (
          <motion.div key={item.id} className="cursor-pointer" whileHover="hover" variants={sparkleVariants} layout>
            <NewsCard item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StreamPanel;
