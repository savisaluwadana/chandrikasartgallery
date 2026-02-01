'use client';

import { useState, useRef } from 'react';

interface ImageZoomProps {
    src: string;
    alt: string;
}

export function ImageZoom({ src, alt }: ImageZoomProps) {
    const [zoom, setZoom] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();

        // Calculate position percentage (0-1)
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        setPosition({ x, y });
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden cursor-zoom-in rounded-2xl border border-black/[0.05]"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-transform duration-300 ${zoom ? 'scale-105' : 'scale-100'}`}
            />

            {/* Magnifier Lens */}
            {zoom && (
                <div
                    className="absolute inset-0 pointer-events-none z-50 mix-blend-multiply"
                    style={{
                        background: `url(${src})`,
                        backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
                        backgroundSize: '250%',
                        opacity: 0.1 // Subtle overlay usage or full replace logic? 
                        // Actually, for a "lens" we usually overlay a div. 
                        // But for a simple premium feel, a scale + pan is often cleaner. 
                        // Let's stick to the scale effect in the main image + a high-res pan.
                    }}
                />
            )}

            {/* Alternate "Lens" implementation - High res pan */}
            {zoom && (
                <div
                    className="absolute w-full h-full inset-0 pointer-events-none"
                >
                    <div
                        className="absolute w-full h-full object-cover origin-top-left"
                        style={{
                            backgroundImage: `url(${src})`,
                            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
                            backgroundSize: '200%',
                            opacity: 1, // Full visibility for the zoomed version
                            clipPath: `circle(150px at ${position.x * 100}% ${position.y * 100}%)`,
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)' // Shadow doesn't work on clip-path
                        }}
                    />
                    {/* Shadow ring helper */}
                    <div
                        className="absolute rounded-full border border-white/20 shadow-xl"
                        style={{
                            width: '300px',
                            height: '300px',
                            left: `calc(${position.x * 100}% - 150px)`,
                            top: `calc(${position.y * 100}% - 150px)`,
                            pointerEvents: 'none',
                        }}
                    />
                </div>
            )}
        </div>
    );
}
