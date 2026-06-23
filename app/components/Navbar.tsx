"use client";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">TÊN SHOP</Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
          <Link href="/san-pham" className="hover:text-blue-600 transition">Sản phẩm</Link>
          <Link href="/#lien-he" className="hover:text-blue-600 transition">Liên hệ</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/mua-hang" className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition">
            <ShoppingCart size={18} />
            Mua ngay
          </Link>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}