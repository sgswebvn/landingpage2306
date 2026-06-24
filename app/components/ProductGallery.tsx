"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  primaryImage: string | null;
  subImages: string[];
  productName: string;
};

export default function ProductGallery({ primaryImage, subImages, productName }: ProductGalleryProps) {
  const allImages = [primaryImage].concat(subImages).filter((img): img is string => !!img);
  const [activeImage, setActiveImage] = useState(allImages[0] || "");

  if (allImages.length === 0) {
    return (
      <div className="bg-gray-200 aspect-square rounded-3xl flex items-center justify-center">
        <span className="text-5xl text-gray-400 text-6xl">📷</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sticky top-24">
      {/* Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-md bg-gray-50 border border-gray-100">
        <Image
          src={activeImage}
          alt={productName}
          fill
          className="object-cover transition-all duration-300"
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                activeImage === img ? "border-black scale-95" : "border-transparent hover:border-gray-300"
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
