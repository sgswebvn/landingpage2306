import Link from "next/link";
import Image from "next/image";

const sampleProducts = [
  { id: 1, name: "Sản phẩm 1", price: "450000", slug: "san-pham-1", image: "https://picsum.photos/id/20/400/300" },
  { id: 2, name: "Sản phẩm 2", price: "650000", slug: "san-pham-2", image: "https://picsum.photos/id/201/400/300" },
  { id: 3, name: "Sản phẩm 3", price: "320000", slug: "san-pham-3", image: "https://picsum.photos/id/237/400/300" },
];

export default function Products() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">Sản phẩm nổi bật</h2>
        <p className="text-center text-gray-600 mb-12">Những sản phẩm bán chạy nhất</p>

        <div className="grid md:grid-cols-3 gap-8">
          {sampleProducts.map((product) => (
            <Link key={product.id} href={`/san-pham/${product.slug}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition">
                <Image src={product.image} alt={product.name} width={400} height={300} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">{Number(product.price).toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/san-pham" className="text-blue-600 font-medium hover:underline">Xem tất cả sản phẩm →</Link>
        </div>
      </div>
    </section>
  );
}