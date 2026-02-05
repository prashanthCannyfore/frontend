import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Banner.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import gadgetSale from '../../../assets/images/Banners/gadget-sale.jpg';
import kitchenSale from '../../../assets/images/Banners/kitchen-sale.jpg';
import poco from '../../../assets/images/Banners/poco-m4-pro.webp';
import realme from '../../../assets/images/Banners/realme-9-pro.webp';
import fashionSale from '../../../assets/images/Banners/fashionsale.jpg';
import oppo from '../../../assets/images/Banners/oppo-reno7.webp';

export const PreviousBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowBackIosIcon />
    </div>
  )
}

export const NextBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowForwardIosIcon />
    </div>
  )
}

const Banner = () => {

  const settings = {
    autoplay: true,
    autoplaySpeed: 4000,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    dotsClass: "slick-dots custom-dots",
  };

  const banners = [gadgetSale, kitchenSale, poco, fashionSale, realme, oppo];

  return (
    <>
      <section className="h-48 sm:h-80 w-full rounded-lg shadow-sm border border-gray-200 relative overflow-hidden bg-white">
        <Slider {...settings}>
          {banners.map((el, i) => (
            <div key={i} className="relative">
              <img 
                draggable="false" 
                className="h-48 sm:h-80 w-full object-cover" 
                src={el} 
                alt={`banner-${i}`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ))}
        </Slider>
      </section>
    </>
  );
};

export default Banner;
