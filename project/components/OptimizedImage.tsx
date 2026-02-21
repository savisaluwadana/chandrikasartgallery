'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    sizes?: string;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    onError?: () => void;
}

// Default blur placeholder (tiny gray gradient)
const defaultBlurDataURL =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBQEBAAAAAAAAAAAAAQIDBAAFESESMUFRYXH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEEA/AJuO6gLdQAE8HnvXf8pSlB//2Q==';

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    fill = false,
    priority = false,
    className = '',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quality = 80,
    placeholder = 'blur',
    blurDataURL = defaultBlurDataURL,
    onError,
}: OptimizedImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    // Fallback for failed images
    if (hasError) {
        return (
            <div
                className={`flex items-center justify-center bg-white/[0.02] border border-white/[0.05] ${className}`}
                style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
            >
                <span className="text-white/20 text-4xl font-light">CM</span>
            </div>
        );
    }

    // Check if it's an external URL or local
    const isExternal = src?.startsWith('http') || src?.startsWith('//');

    // For external images that might not be in allowed domains, use regular img
    if (isExternal && !src.includes('cloudinary.com')) {
        return (
            <div className={`relative ${isLoading ? 'animate-pulse bg-white/[0.02]' : ''}`}>
                <img
                    src={src}
                    alt={alt}
                    className={className}
                    onError={handleError}
                    onLoad={handleLoad}
                    loading={priority ? 'eager' : 'lazy'}
                    style={fill ? { objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 } : undefined}
                />
            </div>
        );
    }

    return (
        <div className={`relative ${isLoading ? 'animate-pulse bg-white/[0.02]' : ''}`}>
            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                className={className}
                sizes={sizes}
                quality={quality}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                onError={handleError}
                onLoad={handleLoad}
            />
        </div>
    );
}

export default OptimizedImage;
