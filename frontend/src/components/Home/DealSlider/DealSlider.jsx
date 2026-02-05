import Product from './Product';
import Slider from 'react-slick';
import { NextBtn, PreviousBtn } from '../Banner/Banner';
import { Link } from 'react-router-dom';
import { offerProducts } from '../../../utils/constants';
import { getRandomProducts } from '../../../utils/functions';

export const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 1,
    swipe: false,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const DealSlider = ({ title }) => {
    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex px-6 py-4 justify-between items-center border-b border-gray-100">
                <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                <Link 
                    to="/products" 
                    className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white px-6 py-2.5 rounded-md shadow-sm transition-colors duration-200 uppercase tracking-wide"
                >
                    View All
                </Link>
            </div>

            {/* Products Slider */}
            <div className="p-4">
                <Slider {...settings}>
                    {getRandomProducts(offerProducts, 12).map((item, i) => (
                        <Product {...item} key={i} />
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default DealSlider;
