"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Image from "next/image";

export default function NewProduct() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",   // ← Đổi thành description
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      alert("Upload ảnh thất bại: " + error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (imageFile) {
      setUploading(true);
      imageUrl = await uploadImage(imageFile);
      setUploading(false);
    }

    const { error } = await supabase.from("products").insert({
      name: form.name,
      price: parseInt(form.price),
      image: imageUrl,
      category: form.category,
      description: form.description,   // ← Đổi thành description
    });

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("✅ Thêm sản phẩm thành công!");
      router.push("/admin/products");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8">
        <ArrowLeft size={20} /> Quay lại
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-10">
        <h1 className="text-3xl font-semibold mb-10">Thêm Sản Phẩm Mới</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Phần upload ảnh giữ nguyên */}
          <div>
            <label className="block text-sm font-medium mb-3">Hình ảnh sản phẩm</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-8 text-center">
              {imagePreview ? (
                <div className="relative inline-block">
                  <Image src={imagePreview} alt="preview" width={320} height={240} className="rounded-2xl object-cover" />
                  <button type="button" onClick={removeImage} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-lg font-medium">Click để tải ảnh lên</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-2">Tên sản phẩm *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Giá (VND) *</label>
              <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Danh mục</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea 
              rows={6} 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              className="w-full px-5 py-4 border rounded-2xl" 
            />
          </div>

          <button type="submit" disabled={loading || uploading} className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium">
            {uploading ? "Đang upload ảnh..." : loading ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </form>
      </div>
    </div>
  );
}