export default function Hero() {
  return (
    <section className="hero-bg h-[90vh] flex items-center text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Sản phẩm chất lượng cao</h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Khám phá bộ sưu tập sản phẩm tuyệt vời của chúng tôi với thiết kế hiện đại và chất lượng vượt trội.
        </p>
        <a href="/san-pham" className="inline-block bg-white text-black px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition">
          Xem sản phẩm
        </a>
      </div>
    </section>
  );
}