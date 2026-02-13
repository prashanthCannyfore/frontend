import { useEffect } from 'react';
import Categories from '../Layouts/Categories';
import Banner from './Banner/Banner';
import DealSlider from './DealSlider/DealSlider';
import ProductSlider from './ProductSlider/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getSliderProducts } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';

const Home = () => {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!" />
      
      {/* Categories Navigation */}
      {/* <Categories /> */}
      
      <main className="bg-gray-100 min-h-screen">
        {/* Main Banner Section */}
        <div className="px-2 sm:px-4 pt-2">
          {/* <Banner /> */}
        </div>

        {/* Deal Sections */}
        <div className="flex flex-col gap-4 px-2 sm:px-4 py-4">
          
          {/* Best of Electronics */}
          <DealSlider title={"Best of Electronics"} />
          
          {/* Beauty, Food, Toys & more */}
          {!loading && <ProductSlider title={"Beauty, Food, Toys & more"} tagline={"Top Deals"} />}
          
          {/* Sports, Healthcare & more */}
          <DealSlider title={"Sports, Healthcare & more"} />
          
          {/* Home & Kitchen Essentials */}
          {!loading && <ProductSlider title={"Home & Kitchen Essentials"} tagline={"From ₹99"} />}
          
          {/* Fashion Top Deals */}
          <DealSlider title={"Fashion Top Deals"} />
          
          {/* Mobiles & Accessories */}
          {!loading && <ProductSlider title={"Mobiles & Accessories"} tagline={"In Focus Now"} />}
          
          {/* Appliances */}
          <DealSlider title={"TVs & Appliances"} />
          
          {/* Furniture */}
          {!loading && <ProductSlider title={"Furniture"} tagline={"From Top Brands"} />}
          
          {/* Books */}
          <DealSlider title={"Books"} />
          
          {/* Grocery */}
          {!loading && <ProductSlider title={"Grocery"} tagline={"Now Available"} />}

        </div>

        {/* Footer Spacer */}
        <div className="h-8"></div>
      </main>
    </>
  );
};

export default Home;
