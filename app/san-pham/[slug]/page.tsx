import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductGallery from "@/app/components/ProductGallery";
import ProductDetailsTabs from "@/app/components/ProductDetailsTabs";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white p-10 rounded-[32px] shadow-sm max-w-md border">
            <span className="text-5xl block mb-4">🔍</span>
            <h2 className="text-2xl font-black mb-3 text-gray-800">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-500 mb-6 text-sm">Sản phẩm này không tồn tại hoặc đã được gỡ bỏ khỏi cửa hàng.</p>
            <Link href="/san-pham" className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition">
              Quay lại cửa hàng
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Parse description JSON
  let descriptionHtml = product.description || "";
  let subImages: string[] = [];
  let originalPrice: number | null = null;
  if (product.description && product.description.startsWith("{") && product.description.endsWith("}")) {
    try {
      const parsed = JSON.parse(product.description);
      descriptionHtml = parsed.content || "";
      subImages = Array.isArray(parsed.subImages) ? parsed.subImages : [];
      originalPrice = parsed.originalPrice ? Number(parsed.originalPrice) : null;
    } catch (e) {
      // Fallback
    }
  }

  const discountPercent = originalPrice && originalPrice > product.price 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100) 
    : 0;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50/50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Breadcrumbs */}
          <div className="flex gap-2 text-xs font-semibold text-gray-400 mb-8 items-center">
            <Link href="/" className="hover:text-black transition">Trang chủ</Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:text-black transition">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{product.name}</span>
          </div>

          <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-start bg-white p-8 lg:p-12 rounded-[40px] shadow-sm border border-gray-100/60">
            {/* Left: Product gallery slider */}
            <div className="md:col-span-6 lg:col-span-7">
              <ProductGallery 
                primaryImage={product.image} 
                subImages={subImages} 
                productName={product.name} 
              />
            </div>

            {/* Right: Checkout panel details */}
            <div className="md:col-span-6 lg:col-span-5 space-y-6">
              
              <div className="space-y-3">
                {/* Premium tag */}
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                    New Arrival
                  </span>
                  {product.category && (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {product.category}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price display with premium styling */}
              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Giá bán</span>
                  <div className="flex items-baseline gap-2">
                    {originalPrice && originalPrice > product.price && (
                      <span className="text-sm font-semibold text-gray-400 line-through">
                        {originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                    <span className="text-3xl font-black text-blue-600">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-end">
                    <span className="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-100">
                      Tiết kiệm {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Add To Cart Buttons, Size & Color selections */}
              <AddToCartButton product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
              }} />

            </div>
          </div>

          {/* Accordion Tabs for descriptions and policies */}
          <div className="max-w-4xl">
            <ProductDetailsTabs descriptionHtml={descriptionHtml} />
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}