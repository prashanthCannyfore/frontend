import { getDiscount } from '../../../utils/functions';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../actions/wishlistAction';
import { useSnackbar } from 'notistack';

const Product = (props) => {

    const { _id, name, images, ratings, numOfReviews, price, cuttedPrice } = props;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);

    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }

    return (
        <div className="flex flex-col items-center gap-3 p-4 relative group hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200">
            {/* Wishlist badge */}
            <span 
                onClick={addToWishlistHandler} 
                className={`${itemInWishlist ? "text-red-500" : "hover:text-red-500 text-gray-300"} absolute top-3 right-3 cursor-pointer z-10 p-1 rounded-full hover:bg-white hover:shadow-md transition-all duration-200`}
            >
                <FavoriteIcon sx={{ fontSize: "18px" }} />
            </span>

            {/* Image & Product Title */}
            <Link to={`/product/${_id}`} className="flex flex-col items-center text-center w-full">
                <div className="w-32 h-32 flex items-center justify-center bg-white rounded-lg border border-gray-100 group-hover:border-gray-200 transition-colors duration-200 mb-3">
                    <img 
                        draggable="false" 
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200" 
                        src={images[0].url} 
                        alt={name} 
                    />
                </div>
                <h2 className="text-sm text-gray-800 group-hover:text-blue-600 leading-tight font-medium overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {name.length > 45 ? `${name.substring(0, 45)}...` : name}
                </h2>
            </Link>

            {/* Product Description */}
            <div className="flex flex-col gap-2 items-center w-full">
                {/* Rating Badge */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-xs px-2 py-1 bg-green-600 rounded text-white flex items-center gap-1 font-semibold">
                        {ratings.toFixed(1)} 
                        <StarIcon sx={{ fontSize: "12px" }} />
                    </span>
                    <span className="text-gray-500 text-xs">({numOfReviews.toLocaleString()})</span>
                </div>

                {/* Price Container */}
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
                        <span className="text-gray-500 line-through text-sm">₹{cuttedPrice.toLocaleString()}</span>
                    </div>
                    <span className="text-sm text-green-600 font-semibold">
                        {getDiscount(price, cuttedPrice)}% off
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Product;
