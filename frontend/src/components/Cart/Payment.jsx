import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
// import {
//     CardNumberElement,
//     CardCvcElement,
//     CardExpiryElement,
//     useStripe,
//     useElements,
// } from '@stripe/react-stripe-js';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import { post } from '../../utils/paytmForm';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';

const Payment = () => {

    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    // const stripe = useStripe();
    // const elements = useElements();
    // const paymentBtn = useRef(null);

    const [payDisable, setPayDisable] = useState(false);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const paymentData = {
        amount: Math.round(totalPrice),
        email: user.email,
        phoneNo: shippingInfo.phoneNo,
    };

    // const order = {
    //     shippingInfo,
    //     orderItems: cartItems,
    //     totalPrice,
    // }

    const submitHandler = async (e) => {
        e.preventDefault();

        setPayDisable(true);

        try {
            // Validate payment data
            if (!paymentData.amount || !paymentData.email || !paymentData.phoneNo) {
                throw new Error('Missing payment information');
            }

            console.log('Processing payment with data:', paymentData);

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                '/api/v1/payment/process',
                paymentData,
                config,
            );

            if (!data.success || !data.paytmParams) {
                throw new Error('Invalid payment response from server');
            }

            console.log('Payment initialized successfully, redirecting to Paytm...');

            const paytmUrl = process.env.NODE_ENV === 'production' 
                ? "https://securegw.paytm.in/order/process"
                : "https://securegw-stage.paytm.in/order/process";

            let info = {
                action: paytmUrl,
                params: data.paytmParams
            };

            post(info);

        } catch (error) {
            setPayDisable(false);
            console.error('Payment processing error:', error);
            
            let errorMessage = 'Payment processing failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);


    // Validate required data before rendering
    if (!user || !shippingInfo || !cartItems.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading payment information...</p>
            </div>
        );
    }

    return (
        <>
            <MetaData title="Flipkart: Secure Payment | Paytm" />

            <main className="w-full mt-20">

                {/* <!-- row --> */}
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">

                    {/* <!-- cart column --> */}
                    <div className="flex-1">

                        <Stepper activeStep={3}>
                            <div className="w-full bg-white">

                                <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            defaultValue="paytm"
                                            name="payment-radio-button"
                                        >
                                            <FormControlLabel
                                                value="paytm"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://rukminim1.flixcart.com/www/96/96/promos/01/09/2020/a07396d4-0543-4b19-8406-b9fcbf5fd735.png" alt="Paytm Logo" />
                                                        <span>Paytm</span>
                                                    </div>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    <input type="submit" value={`Pay ₹${totalPrice.toLocaleString()}`} disabled={payDisable ? true : false} className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`} />

                                </form>

                                {/* stripe form */}
                                {/* <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-8 my-4">
                                <div>
                                    <CardNumberElement />
                                </div>
                                <div>
                                    <CardExpiryElement />
                                </div>
                                <div>
                                    <CardCvcElement />
                                </div>
                                <input ref={paymentBtn} type="submit" value="Pay" className="bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none cursor-pointer" />
                            </form> */}
                                {/* stripe form */}

                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;