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

export default async function Products() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">Sản phẩm nổi bật</h2>
        <p className="text-center text-gray-600 mb-12">Những sản phẩm mới nhất</p>

        <div className="grid md:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            products.map((product: Product) => {
              let originalPrice: number | null = null;
              if (product.description && product.description.startsWith("{") && product.description.endsWith("}")) {
                try {
                  const parsed = JSON.parse(product.description);
                  originalPrice = parsed.originalPrice ? Number(parsed.originalPrice) : null;
                } catch (e) {
                  // Fallback
                }
              }
              const discountPercent = originalPrice && originalPrice > product.price 
                ? Math.round(((originalPrice - product.price) / originalPrice) * 100) 
                : 0;

              return (
                <Link key={product.id} href={`/san-pham/${product.id}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition">
                    <div className="relative h-64 w-full">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                      {discountPercent > 0 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">{product.price.toLocaleString('vi-VN')}đ</span>
                        {originalPrice && originalPrice > product.price && (
                          <span className="text-sm font-medium text-gray-400 line-through">
                            {originalPrice.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Chưa có sản phẩm nào nổi bật.
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/san-pham" className="text-blue-600 font-medium hover:underline">Xem tất cả sản phẩm →</Link>
        </div>
      </div>
    </section>
  );
}