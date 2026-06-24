// app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  created_at: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("Xác nhận xóa sản phẩm?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Sản phẩm</h1>
          <p className="text-gray-500 dark:text-gray-400">Quản lý tất cả sản phẩm ({products.length})</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-3 bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-2xl hover:scale-105 transition"
        >
          <Plus size={20} />
          Thêm sản phẩm mới
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left p-6 font-medium text-gray-500">Sản phẩm</th>
              <th className="text-left p-6 font-medium text-gray-500">Danh mục</th>
              <th className="text-right p-6 font-medium text-gray-500">Giá</th>
              <th className="text-center p-6 font-medium text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <Image src={product.image} alt="" width={48} height={48} className="rounded-xl object-cover" />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                    {product.category || "Chưa phân loại"}
                  </span>
                </td>
                <td className="p-6 text-right font-semibold">
                  {product.price.toLocaleString('vi-VN')}đ
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <Link href={`/admin/products/${product.id}`} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                      <Edit2 size={18} />
                    </Link>
                    <button onClick={() => deleteProduct(product.id)} className="p-3 hover:bg-red-50 text-red-600 rounded-xl">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}