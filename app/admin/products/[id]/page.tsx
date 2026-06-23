// app/admin/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) {
      setForm({
        name: data.name,
        price: data.price.toString(),
        image: data.image || "",
        category: data.category || "",
        description: data.description || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        price: parseInt(form.price),
        image: form.image || null,
        category: form.category,
        description: form.description,
      })
      .eq("id", params.id);

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("✅ Cập nhật thành công!");
      router.push("/admin/products");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
      >
        <ArrowLeft size={20} /> Quay lại
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-10">
        <h1 className="text-3xl font-semibold mb-8">Chỉnh sửa Sản Phẩm</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Giống form thêm sản phẩm, chỉ khác nút "Cập nhật" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-2">Tên sản phẩm *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-5 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giá (VND) *</label>
              <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-5 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hình ảnh (URL)</label>
            <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-5 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Danh mục</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-5 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả chi tiết</label>
            <textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-5 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl resize-y" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-black dark:bg-white dark:text-black text-white py-4 rounded-2xl text-lg font-medium hover:scale-[1.02] transition"
          >
            <Save size={22} />
            {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
          </button>
        </form>
      </div>
    </div>
  );
}