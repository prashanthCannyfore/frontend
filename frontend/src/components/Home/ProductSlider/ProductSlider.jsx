import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getRandomProducts } from '../../../utils/functions';
import { settings } from '../DealSlider/DealSlider';
import Product from './Product';

const ProductSlider = ({ title, tagline }) => {

    const { loading, products } = useSelector((state) => state.products);

    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex px-6 py-4 justify-between items-center border-b border-gray-100">
                <div className="title flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                    <p className="text-sm text-gray-500 font-medium">{tagline}</p>
                </div>
                <Link 
                    to="/products" 
                    className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white px-6 py-2.5 rounded-md shadow-sm transition-colors duration-200 uppercase tracking-wide"
                >
                    View All
                </Link>
            </div>
            
            {/* Products Slider */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="p-4">
                    <Slider {...settings} className="flex items-center justify-between">
                        {products && getRandomProducts(products, 12).map((product) => (
                            <Product {...product} key={product._id} />
                        ))}
                    </Slider>
                </div>
            )}
        </section>
    );
};

export default ProductSlider;
