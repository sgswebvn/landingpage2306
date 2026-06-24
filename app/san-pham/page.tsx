import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
};


export default async function SanPhamPage() {
  const supabase = createClient();
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Tất cả Sản phẩm</h1>
            <p className="text-gray-600 text-lg">Khám phá bộ sưu tập sản phẩm chất lượng</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products && products.length > 0 ? (
              products.map((product: Product) => (
                <Link 
                  key={product.id} 
                  href={`/san-pham/${product.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-64">
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    {product.category && (
                      <p className="text-blue-600 text-sm font-medium mb-2">{product.category}</p>
                    )}
                    <h3 className="font-semibold text-xl mb-3 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {product.price.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Chưa có sản phẩm nào. Hãy thêm sản phẩm trong trang Admin.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}