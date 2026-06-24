import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductGallery from "@/app/components/ProductGallery";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
};

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", slug)
    .single();

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
            <Link href="/san-pham" className="text-blue-600 hover:underline">
              ← Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Phân tách JSON mô tả để lấy nội dung HTML và danh sách ảnh phụ
  let descriptionHtml = product.description || "";
  let subImages: string[] = [];
  if (product.description && product.description.startsWith("{") && product.description.endsWith("}")) {
    try {
      const parsed = JSON.parse(product.description);
      descriptionHtml = parsed.content || "";
      subImages = Array.isArray(parsed.subImages) ? parsed.subImages : [];
    } catch (e) {
      // Fallback nếu không phải JSON
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Bộ sưu tập hình ảnh */}
          <ProductGallery 
            primaryImage={product.image} 
            subImages={subImages} 
            productName={product.name} 
          />

          {/* Thông tin sản phẩm */}
          <div className="pt-4 space-y-6">
            <div>
              {product.category && (
                <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-2">{product.category}</p>
              )}
              
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-4xl font-black text-blue-600">
              {product.price.toLocaleString('vi-VN')}đ
            </p>

            <AddToCartButton product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image
            }} />

            <div className="border-t pt-6 text-sm text-gray-500 space-y-2">
              <p className="flex items-center gap-2">🛡️ Hàng chính hãng 100%</p>
              <p className="flex items-center gap-2">🚚 Giao hàng nhanh chóng toàn quốc</p>
            </div>
          </div>
        </div>

        {/* Giới thiệu chi tiết kiểu các sàn lớn */}
        {descriptionHtml && (
          <div className="mt-16 border-t pt-12 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-black pl-4">Giới thiệu sản phẩm</h2>
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed font-sans prose-img:rounded-3xl prose-headings:font-bold whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}