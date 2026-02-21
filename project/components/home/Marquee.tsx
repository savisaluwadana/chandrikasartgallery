'use client';

import { motion } from 'framer-motion';

export function Marquee() {
    const marqueeText = "ORIGINAL PAINTINGS • LIMITED EDITIONS • WORLDWIDE SHIPPING • AUTHENTICITY GUARANTEED • ";

    return (
        <div className="py-8 bg-white border-y border-black/[0.05] overflow-hidden flex relative z-20">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear"
                }}
            >
                {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-xl md:text-2xl font-light tracking-[0.2em] text-black/30 mx-4">
                        {marqueeText}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
