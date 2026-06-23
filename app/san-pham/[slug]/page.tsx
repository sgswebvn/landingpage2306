import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  desc?: string;
  category?: string;
};

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.slug)
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

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Hình ảnh */}
          <div className="sticky top-24">
            {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name} 
                width={800} 
                height={600} 
                className="rounded-3xl shadow-xl w-full object-cover" 
                priority
              />
            ) : (
              <div className="bg-gray-200 aspect-square rounded-3xl flex items-center justify-center">
                <span className="text-5xl text-gray-400">📷</span>
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="pt-4">
            {product.category && (
              <p className="text-blue-600 font-medium mb-2">{product.category}</p>
            )}
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-4xl font-bold text-blue-600 mb-10">
              {product.price.toLocaleString('vi-VN')}đ
            </p>

            {product.desc && (
              <div className="prose prose-lg text-gray-600 mb-12">
                <p>{product.desc}</p>
              </div>
            )}

            <Link 
              href={`/mua-hang?product=${encodeURIComponent(product.name)}&price=${product.price}`}
              className="block w-full text-center bg-black hover:bg-gray-900 text-white py-5 rounded-2xl text-xl font-semibold transition"
            >
              Mua ngay
            </Link>

            <p className="text-center text-sm text-gray-500 mt-6">
              Liên hệ ngay nếu bạn có thắc mắc
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}