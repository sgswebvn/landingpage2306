"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductGalleryProps = {
  primaryImage: string | null;
  subImages: string[];
  productName: string;
};

export default function ProductGallery({ primaryImage, subImages, productName }: ProductGalleryProps) {
  const allImages = [primaryImage].concat(subImages).filter((img): img is string => !!img);
  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="bg-gray-100 aspect-[4/3] rounded-[32px] flex flex-col items-center justify-center border border-gray-200">
        <span className="text-6xl mb-2">📷</span>
        <span className="text-gray-400 text-sm font-medium">Không có hình ảnh</span>
      </div>
    );
  }

  const activeImage = allImages[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-6 md:sticky md:top-28">
      {/* Main Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] shadow-lg bg-gray-50 border border-gray-100/60 group">
        
        {/* Main image displaying with zoom-on-hover effect */}
        <Image
          src={activeImage}
          alt={productName}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight size={20} className="stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Floating Indicator */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          {activeIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails list */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                activeIndex === idx 
                  ? "border-black scale-95 shadow-md ring-2 ring-black/10" 
                  : "border-transparent opacity-60 hover:opacity-100 hover:scale-95"
              }`}
            >
              <Image src={img} alt={`${productName} thumbnail ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
