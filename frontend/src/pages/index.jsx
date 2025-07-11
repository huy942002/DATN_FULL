import React, { useState } from 'react';

function Index() {
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [discountValue, setDiscountValue] = useState(10); // State for range input

  const handleDiscountChange = (e) => {
    setDiscountValue(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121417]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1e2128]">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-md bg-[#1e2128] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#3b82f6]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 17L15 12m0 0l-5.25-5M15 12H3" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <h1 className="text-white font-semibold text-sm select-none">Chỉnh sửa sản phẩm</h1>
          <nav className="text-xs text-[#6b7280] flex space-x-1 select-none">
            <span>Trang chủ</span><span>-</span><span>Ứng dụng</span><span>-</span><span>Thương mại điện tử</span><span>-</span><span>Danh mục</span>
          </nav>
        </div>
        <div className="flex items-center space-x-8 text-xs select-none">
          <div className="text-right">
            <div className="text-white font-semibold">23.000 đô la</div>
            <div className="text-[#6b7280]">Doanh số trung bình</div>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">1.748,03 đô la</div>
            <div className="text-[#6b7280]">Chi tiêu hôm nay</div>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">3,8%</div>
            <div className="text-[#6b7280]">Chia sẻ chung</div>
          </div>
          <div className="text-right">
            <div className="text-[#ef4444] font-semibold">-7,4%</div>
            <div className="text-[#6b7280]">7 Ngày</div>
          </div>
          <button className="bg-[#374151] text-[#9ca3af] text-xs rounded px-3 py-1 hover:bg-[#4b5563] transition">Sự suy sụp</button>
          <button className="bg-[#374151] text-[#d1d5db] text-xs rounded px-3 py-1 hover:bg-[#4b5563] transition">Hoàn thành</button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 px-6 py-6 space-x-6">
        {/* Sidebar */}
        <aside className="flex flex-col space-y-6 w-64 flex-shrink-0">
          <section className="bg-[#1e2128] rounded-lg p-4 flex flex-col items-center text-center text-xs text-[#6b7280]">
            <h2 className="text-white font-semibold mb-3 self-start">Hình thu nhỏ</h2>
            <div className="relative w-24 h-24 mb-3">
              <img alt="Blue high-top sneakers on a transparent background" className="rounded-md" src="https://storage.googleapis.com/a1aa/image/2afc25d8-d935-429f-5709-5c8a4d32d125.jpg" width="96" height="96" />
              <button aria-label="Edit thumbnail" className="absolute top-1 right-1 w-4 h-4 bg-[#374151] rounded text-[#9ca3af] hover:text-white flex items-center justify-center">
                <i className="fas fa-pencil-alt text-[10px]"></i>
              </button>
            </div>
            <p className="leading-tight">Đặt hình ảnh thu nhỏ của sản phẩm. Chỉ chấp nhận các tệp hình ảnh *.png, *.jpg và *.jpeg</p>
          </section>
          <section className="bg-[#1e2128] rounded-lg p-4 text-xs text-[#6b7280]">
            <h2 className="text-white font-semibold mb-3">
              Trạng thái <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] ml-2"></span>
            </h2>
            <select aria-label="Trạng thái sản phẩm" className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 text-[#9ca3af] text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]">
              <option>Đã xuất bản</option>
              <option>Chưa xuất bản</option>
            </select>
            <p className="mt-2 leading-tight">Đặt trạng thái sản phẩm.</p>
          </section>
          <section className="bg-[#1e2128] rounded-lg p-4 text-xs text-[#6b7280]">
            <h2 className="text-white font-semibold mb-3">Chi tiết sản phẩm</h2>
            <label className="block mb-1 text-[#9ca3af]" htmlFor="category">Thể loại</label>
            <select aria-label="Chọn thể loại" className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 text-[#9ca3af] text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]" id="category">
              <option disabled selected>Chọn một tùy chọn</option>
              <option>Thể loại 1</option>
              <option>Thể loại 2</option>
            </select>
            <p className="mt-2 leading-tight">Thêm sản phẩm vào danh mục.</p>
          </section>
          <section className="bg-[#1e2128] rounded-lg p-4 text-xs text-[#6b7280]">
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-white font-semibold text-lg">$</span>
              <span className="text-white font-extrabold text-2xl">2.420</span>
              <span className="bg-[#2563eb] text-white text-[10px] font-semibold rounded px-1.5 py-0.5 select-none">↑2,6%</span>
            </div>
            <p>Doanh số trung bình hàng ngày</p>
            <div className="flex items-end justify-between mt-3 space-x-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`w-2 rounded-full bg-[#10b981] ${i === 0 ? 'h-2' : 'h-5'}`}></div>
              ))}
            </div>
          </section>
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col space-y-6">
          <nav className="flex space-x-8 text-sm font-medium select-none">
            {['Tổng quan', 'Trình độ cao', 'Đánh giá'].map(tab => (
              <button
                key={tab}
                className={`pb-2 ${activeTab === tab ? 'text-[#10b981] border-b-2 border-[#10b981]' : 'text-[#6b7280] hover:text-[#10b981]'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="bg-[#1e2128] rounded-lg p-6 space-y-6 text-xs text-[#6b7280]">
            <fieldset className="space-y-4">
              <legend className="text-white font-semibold text-sm mb-2">Tổng quan</legend>
              <div>
                <label className="block mb-1 text-[#9ca3af]" htmlFor="product-name">Tên sản phẩm <span className="text-[#ef4444]">*</span></label>
                <input
                  aria-required="true"
                  className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 text-[#9ca3af] text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  id="product-name"
                  type="text"
                  defaultValue="Sample product"
                />
                <p className="mt-1 text-[10px] text-[#374151]">Tên sản phẩm là bắt buộc và nên là duy nhất.</p>
              </div>
              <div>
                <label className="block mb-1 text-[#9ca3af]">Sự miêu tả</label>
                <div className="bg-[#121417] border border-[#374151] rounded text-[#9ca3af] text-xs">
                  <div className="flex items-center border-b border-[#374151] px-2 py-1 space-x-2">
                    <select aria-label="Text style" className="bg-[#121417] text-[#9ca3af] text-xs border border-[#374151] rounded px-1 py-0.5 focus:outline-none">
                      <option>Normal</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>
                    {['bold', 'italic', 'underline', 'image', 'code'].map(icon => (
                      <button key={icon} aria-label={icon.charAt(0).toUpperCase() + icon.slice(1)} className="hover:text-white" type="button">
                        <i className={`fas fa-${icon}`}></i>
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full bg-[#121417] text-[#9ca3af] text-xs p-2 resize-none focus:outline-none"
                    placeholder="Type your text here..."
                    rows="6"
                  ></textarea>
                </div>
                <p className="mt-1 text-[10px] text-[#374151]">Đặt mô tả cho sản phẩm để dễ nhìn hơn.</p>
              </div>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="text-white font-semibold text-sm mb-2">Giá cả</legend>
              <div>
                <label className="block mb-1 text-[#9ca3af]" htmlFor="base-price">Giá cơ bản <span className="text-[#ef4444]">*</span></label>
                <input
                  aria-required="true"
                  className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 text-[#9ca3af] text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  id="base-price"
                  type="text"
                  defaultValue="199.99"
                />
                <p className="mt-1 text-[10px] text-[#374151]">Đặt giá sản phẩm.</p>
              </div>
              <div>
                <label className="block mb-2 text-[#9ca3af] flex items-center gap-1">
                  Loại giảm giá <i className="fas fa-question-circle text-[#6b7280]" title="Chọn loại giảm giá áp dụng cho sản phẩm"></i>
                </label>
                <div className="flex space-x-4 text-xs">
                  {[
                    { value: 'none', label: 'Không giảm giá', checked: false },
                    { value: 'percent', label: 'Phần trăm %', checked: true },
                    { value: 'fixed', label: 'Giá cố định', checked: false }
                  ].map(({ value, label, checked }) => (
                    <label key={value} className="flex items-center justify-center flex-1 border border-[#374151] rounded px-4 py-2 cursor-pointer hover:border-[#10b981] transition relative">
                      <input
                        aria-checked={checked}
                        className="hidden peer"
                        name="discount-type"
                        type="radio"
                        value={value}
                        defaultChecked={checked}
                      />
                      <span className="peer-checked:bg-[#121417] peer-checked:border peer-checked:border-[#10b981] peer-checked:text-[#10b981] rounded w-full text-center">{label}</span>
                      <span className="absolute top-1 right-1 w-3 h-3 rounded-full border border-[#374151] bg-[#121417] peer-checked:border-[#10b981] peer-checked:bg-[#10b981]"></span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="text-center text-white font-semibold text-2xl select-none mt-2">
                {discountValue} <span className="text-sm align-top">%</span>
              </div>
              <input
                id="default-range"
                type="range"
                min="0"
                max="100"
                value={discountValue}
                onChange={handleDiscountChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 bg-[#121417]"
              />
              <div className="h-[1px] bg-[#374151] rounded mb-3 mt-2"></div>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <label className="block mb-1 text-[#9ca3af]" htmlFor="tax-class">Lớp thuế <span className="text-[#ef4444]">*</span></label>
                  <select
                    aria-required="true"
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 text-[#9ca3af] text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    id="tax-class"
                  >
                    <option>Hàng hóa chịu thuế</option>
                    <option>Hàng hóa không chịu thuế</option>
                  </select>
                  <p className="mt-1 text-[10px] text-[#374151]">Thiết lập loại thuế cho sản phẩm.</p>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-[#9ca3af]" htmlFor="vat-amount">Số tiền thuế GTGT (%)</label>
                  <input
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 text-[#9ca3af] text-xs focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    id="vat-amount"
                    type="text"
                    defaultValue="35"
                  />
                  <p className="mt-1 text-[10px] text-[#374151]">Đặt thuế VAT cho sản phẩm.</p>
                </div>
              </div>
            </fieldset>
            <div className="flex justify-end space-x-3">
              <button className="bg-[#374151] text-[#9ca3af] text-xs rounded px-4 py-2 hover:bg-[#4b5563] transition" type="button">Hủy bỏ</button>
              <button className="bg-[#10b981] text-white text-xs rounded px-4 py-2 hover:bg-[#0f766e] transition" type="submit">Lưu thay đổi</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center px-6 py-4 text-[10px] text-[#6b7280] select-none border-t border-[#1e2128]">
        <div>
          2025© <a className="text-[#9ca3af] hover:text-[#10b981]" href="#">Keenthemes</a>
        </div>
        <div className="flex space-x-4">
          <a className="hover:text-[#10b981]" href="#">Về</a>
          <a className="hover:text-[#10b981]" href="#">Ủng hộ</a>
          <a className="hover:text-[#10b981]" href="#">Mua</a>
        </div>
      </footer>
    </div>
  );
}

export default Index;