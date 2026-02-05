import { Link } from 'react-router-dom';

const Product = ({ image, name, offer, tag }) => {
    return (
        <Link to="/products" className="flex flex-col items-center gap-2 p-4 cursor-pointer group hover:bg-gray-50 rounded-lg transition-all duration-200">
            <div className="w-32 h-32 flex items-center justify-center bg-white rounded-lg border border-gray-100 group-hover:border-gray-200 transition-colors duration-200">
                <img 
                    draggable="false" 
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200" 
                    src={image} 
                    alt={name} 
                />
            </div>
            <div className="text-center space-y-1">
                <h2 className="font-medium text-sm text-gray-800 leading-tight overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>{name}</h2>
                <span className="text-green-600 text-sm font-semibold">{offer}</span>
                
                <span className="text-gray-500 text-xs">{tag}</span>
            </div>
        </Link>
    );
};

export default Product;
