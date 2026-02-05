import mobiles from '../../assets/images/Categories/phone.png';
import fashion from '../../assets/images/Categories/fashion.png';
import electronics from '../../assets/images/Categories/electronics.png';
import home from '../../assets/images/Categories/home.png';
import travel from '../../assets/images/Categories/travel.png';
import appliances from '../../assets/images/Categories/appliances.png';
import furniture from '../../assets/images/Categories/furniture.png';
import beauty from '../../assets/images/Categories/beauty.png';
import grocery from '../../assets/images/Categories/grocery.png';
import { Link } from 'react-router-dom';

const catNav = [
    {
        name: "Mobiles",
        icon: mobiles,
    },
    {
        name: "Fashion",
        icon: fashion,
    },
    {
        name: "Electronics",
        icon: electronics,
    },
    {
        name: "Home",
        icon: home,
    },
    {
        name: "Travel",
        icon: travel,
    },
    {
        name: "Appliances",
        icon: appliances,
    },
    {
        name: "Furniture",
        icon: furniture,
    },
    {
        name: "Beauty,Toys & more",
        icon: beauty,
    },
    {
        name: "Grocery",
        icon: grocery,
    },
]

const Categories = () => {
    return (
        <section className="hidden sm:block bg-white shadow-sm border-b border-gray-200 sticky top-14 z-10">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex items-center justify-between py-3">
                    {catNav.map((item, i) => (
                        <Link 
                            to={`/products?category=${item.name}`} 
                            className="flex flex-col gap-2 items-center p-3 group hover:bg-blue-50 rounded-lg transition-all duration-200" 
                            key={i}
                        >
                            <div className="h-16 w-16 flex items-center justify-center">
                                <img 
                                    draggable="false" 
                                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-200" 
                                    src={item.icon} 
                                    alt={item.name} 
                                />
                            </div>
                            <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 text-center leading-tight">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
