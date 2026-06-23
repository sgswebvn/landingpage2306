export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-white text-2xl font-bold mb-4">TÊN SHOP</h3>
          <p>Chuyên cung cấp sản phẩm chất lượng với giá tốt nhất.</p>
        </div>
        <div>
          <h4 className="text-white mb-4">Liên kết</h4>
          <ul className="space-y-2">
            <li><a href="/san-pham" className="hover:text-white">Sản phẩm</a></li>
            <li><a href="#" className="hover:text-white">Về chúng tôi</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white mb-4">Liên hệ</h4>
          <p>Hotline: 0123 456 789</p>
          <p>Email: contact@yourshop.com</p>
        </div>
        <div>
          <h4 className="text-white mb-4">Theo dõi</h4>
          <p>Facebook | Instagram | TikTok</p>
        </div>
      </div>
      <div className="text-center mt-16 text-sm">© 2026 TÊN SHOP. All rights reserved.</div>
    </footer>
  );
}