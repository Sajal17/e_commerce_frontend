import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Arrow = ({ onClick, direction }) => (
  <div
    onClick={onClick}
    className={`absolute top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center 
                bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors z-20`}
    style={{ [direction === "next" ? "right" : "left"]: "8px" }}
  >
    <span className="text-gray-800 text-lg select-none">
      {direction === "next" ? "❯" : "❮"}
    </span>
  </div>
);

const SlidingBanner = () => {
  const [banners, setBanners] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/public/products/featured`);
        const products = Array.isArray(res.data) ? res.data : [];
        const getBannerImageUrl = (product) => {
          if (product.imageData && product.imageType) {
            return `data:${product.imageType};base64,${product.imageData}`;
          }
          if (product.imageUrl) return product.imageUrl;
          if (product.imageName) return `${baseUrl}/images/${product.imageName}`;
          return "/default_product.png";
        };
        const bannerImages = products.map((p) => ({
  id: p.id || p._id,
  imageUrl: getBannerImageUrl(p),
  title: p.name || "Product",
}));

        setBanners(bannerImages);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };

    fetchBanners();
  }, [baseUrl]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
    adaptiveHeight: true,
  };

  if (!banners.length) return null;

  return (
    <div className="mt-4 mb-8">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full h-64 md:h-96">
            <Link to={`/product/${banner.id}`}>
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SlidingBanner;