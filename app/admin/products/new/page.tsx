"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, Eye, FileText, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function NewProduct() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [descTab, setDescTab] = useState<"edit" | "preview">("edit");

  // Primary Image States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Sub-Images Gallery States
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);
  const [subImageFiles, setSubImageFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "", // HTML content will be stored here
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

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files);
    
    setSubImageFiles(prev => [...prev, ...filesArray]);
    
    const newPreviews = filesArray.map(file => URL.createObjectURL(file));
    setSubImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSubImage = (index: number) => {
    setSubImageFiles(prev => prev.filter((_, i) => i !== index));
    setSubImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) {
      alert("Tải ảnh lên thất bại: " + error.message);
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
    setUploading(true);

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    let subImageUrls: string[] = [];
    if (subImageFiles.length > 0) {
      const uploadPromises = subImageFiles.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      subImageUrls = uploadedUrls.filter((url): url is string => !!url);
    }

    // Save description as JSON containing html content, list of sub image urls and original price
    const serializedDescription = JSON.stringify({
      content: form.description,
      subImages: subImageUrls,
      originalPrice: form.originalPrice ? parseInt(form.originalPrice) : null
    });

    const { error } = await supabase.from("products").insert({
      name: form.name,
      price: parseInt(form.price),
      image: imageUrl,
      category: form.category,
      description: serializedDescription,
    });

    setUploading(false);
    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("✅ Đăng sản phẩm mới thành công!");
      router.push("/admin/products");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-semibold transition"
      >
        <ArrowLeft size={20} /> Quay lại danh sách
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 p-8 lg:p-10">
        <h1 className="text-3xl font-extrabold mb-10">Thêm Sản Phẩm Mới</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Upload Images */}
          <div className="grid md:grid-cols-2 gap-8 border-b pb-10">
            {/* Ảnh chính */}
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-400">Hình ảnh đại diện chính *</label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-6 text-center h-56 flex flex-col items-center justify-center relative">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image src={imagePreview} alt="preview" fill className="rounded-2xl object-cover" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload size={36} className="text-gray-300 mb-3" />
                    <p className="text-sm font-semibold">Tải lên ảnh chính</p>
                    <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                  </label>
                )}
              </div>
            </div>

            {/* Ảnh phụ */}
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-400">Album ảnh phụ sản phẩm (Gallery)</label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-6 h-56 overflow-y-auto">
                <div className="grid grid-cols-3 gap-3">
                  
                  {subImagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border">
                      <Image src={preview} alt={`sub ${index}`} fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeSubImage(index)} 
                        className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  <label className="aspect-square border border-dashed border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white rounded-xl flex flex-col items-center justify-center cursor-pointer transition">
                    <Plus size={20} className="text-gray-400" />
                    <span className="text-[10px] font-bold mt-1 text-gray-400">Thêm ảnh</span>
                    <input type="file" accept="image/*" multiple onChange={handleSubImagesChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: General details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tên sản phẩm *</label>
              <input 
                type="text" 
                required 
                placeholder="Ví dụ: Áo thun Polo nam"
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Giá bán thực tế *</label>
              <input 
                type="number" 
                required 
                placeholder="Giá khách thanh toán"
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value })} 
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Giá gốc (Chưa giảm)</label>
              <input 
                type="number" 
                placeholder="Để gạch ngang"
                value={form.originalPrice} 
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} 
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Danh mục</label>
              <input 
                type="text" 
                placeholder="Ví dụ: Thời trang nam, Điện thoại..."
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition" 
              />
            </div>
          </div>

          {/* Section 3: Rich HTML Description Editor (PRO) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Giới thiệu sản phẩm (Hỗ trợ định dạng HTML)</label>
              
              {/* Tab Selector */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDescTab("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${descTab === "edit" ? "bg-white dark:bg-gray-900 shadow-sm text-black dark:text-white" : "text-gray-500"}`}
                >
                  <FileText size={12} /> Soạn thảo/Dán HTML
                </button>
                <button
                  type="button"
                  onClick={() => setDescTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${descTab === "preview" ? "bg-white dark:bg-gray-900 shadow-sm text-black dark:text-white" : "text-gray-500"}`}
                >
                  <Eye size={12} /> Live Preview
                </button>
              </div>
            </div>

            {descTab === "edit" ? (
              <div className="space-y-2">
                <textarea 
                  rows={8} 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  placeholder="Nhập hoặc copy mã HTML mô tả chi tiết sản phẩm từ Shopee/Lazada hoặc bài viết định dạng phong phú của bạn vào đây..." 
                  className="w-full px-5 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-black dark:focus:border-white transition font-mono text-sm" 
                />
                <p className="text-xs text-gray-400">{"Mẹo: Bạn có thể sử dụng các thẻ <h3>, <p>, <ul>, <li>, <img> để tạo bài giới thiệu sản phẩm thật thu hút."}</p>
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 min-h-[200px] max-h-[400px] overflow-y-auto bg-gray-50 dark:bg-gray-950 prose max-w-none whitespace-pre-wrap">
                {form.description ? (
                  <div dangerouslySetInnerHTML={{ __html: form.description }} />
                ) : (
                  <p className="text-gray-400 text-center py-10">Chưa có nội dung xem trước. Hãy soạn thảo ở Tab bên cạnh.</p>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading || uploading} 
            className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-150 text-white py-4 rounded-2xl text-lg font-bold shadow-md hover:scale-[1.01] transition disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {uploading ? "Đang tải ảnh và xử lý dữ liệu..." : loading ? "Đang lưu..." : "Lưu sản phẩm mới"}
          </button>
        </form>
      </div>
    </div>
  );
}