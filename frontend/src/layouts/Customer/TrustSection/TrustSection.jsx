// src/components/TrustSection.jsx
import React from "react";
import { Divider  } from 'antd';

const TrustSection = () => {
  return (
    <section className="trust-section bg-white py-12 px-6 mx-auto max-w-7xl">
      <div className="py-8 px-4 sm:px-8 md:px-16 lg:px-16">
        <Divider className="section-divider" />
        <div className="text-heading text-center">Tại sao nên sử dụng dịch vụ của chúng tôi?</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {[
            {
              img: 'https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407536280-ddcb70cab4907fa78468540ba722d25b.png?tr=h-150,q-75,w-150',
              title: 'Phương thức thanh toán an toàn và linh hoạt',
              desc: 'Giao dịch trực tuyến an toàn với nhiều lựa chọn như thanh toán tại cửa hàng tiện lợi, chuyển khoản ngân hàng, thẻ tín dụng đến Internet Banking. Không tính phí giao dịch.',
            },
            {
              img: 'https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407541562-61b4438f5439c253d872e70dd7633791.png?tr=h-150,q-75,w-150',
              title: 'Hỗ trợ khách hàng 24/7',
              desc: 'Đội ngũ nhân viên hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn trong từng bước của quá trình đặt phòng.',
            },
            {
              img: 'https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407562736-ea624be44aec195feffac615d37ab492.png?tr=h-150,q-75,w-150',
              title: 'Khách hàng, đánh giá thực',
              desc: 'Hơn 10.000.000 đánh giá, bình chọn đã được xác thực từ khách hàng sẽ giúp bạn đưa ra lựa chọn đúng đắn.',
            },
            {
              img: 'https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407528373-a0e2c450b5cfac244d687d6fa8f5dd98.png?tr=h-150,q-75,w-150',
              title: 'Giá rẻ mỗi ngày với ưu đãi đặc biệt dành riêng cho ứng dụng',
              desc: 'Đặt sản phẩm qua ứng dụng để nhận giá tốt nhất với các khuyến mãi tuyệt vời!',
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center">
                <img className="h-20 w-20" src={item.img} alt={item.title} />
              </div>
              <div className="text-subheading mt-2">{item.title}</div>
              <div className="text-base font-medium mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-8 px-4 sm:px-8 md:px-16 lg:px-16">
        <Divider className="section-divider" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 flex items-center">
            <div>
              <div className="text-subheading">Đối tác thanh toán</div>
              <div className="text-base font-medium">
                Những đối tác thanh toán đáng tin cậy của chúng tôi sẽ giúp cho bạn luôn an tâm thực hiện mọi giao dịch một cách thuận lợi nhất!
              </div>
            </div>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              'https://ik.imagekit.io/tvlk/image/imageResource/2021/04/07/1617778862778-43a622292ba164040d7264969df8725d.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214182554-3d9057e89f3e8013c6b5623a0b3fd72d.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214295854-530deeeeef4c927cf42574a9c4f18f26.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214297342-0f18b61b9af8466c550a64863c2f7fc9.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214302804-b2cfe4878f3d09ee6b42932a00fac1be.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214099540-8d8fe069f3c5f30b42c6067bb66bf7b5.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214097094-68a8e4013fffaf9e3eb509ab01c443cd.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214118270-af8e9adc7a6c728d0df9c6590279dd48.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214169837-2e167f93c28a31c50929ff25141af9c7.png?tr=q-75,w-88',
              'https://ik.imagekit.io/tvlk/image/imageResource/2019/09/11/1568214177572-608f357f64d150269e946dd01dc35f6c.png?tr=q-75,w-88',
            ].map((src, index) => (
              <img key={index} className="h-10 w-20 object-contain rounded-lg" src={src} alt={`Partner-${index}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-8 md:px-16 lg:px-16 text-center">
        <Divider className="section-divider" />
        <div className="text-subheading">
          Đặt phòng tại GTVTTel ngay để có thể trải nghiệm vô vàn những ưu đãi!
        </div>
      </div>
    </section>
  );
};

export default TrustSection;