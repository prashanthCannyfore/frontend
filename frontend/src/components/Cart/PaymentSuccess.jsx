import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MetaData from '../Layouts/MetaData';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Clear cart after successful payment
        localStorage.removeItem('cartItems');
    }, []);

    return (
        <>
            <MetaData title="Payment Successful | Flipkart" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />
                    <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                    <p className="text-gray-600 mb-4">
                        Your payment has been processed successfully.
                    </p>
                    {orderId && (
                        <p className="text-sm text-gray-500 mb-6">
                            Order ID: {orderId}
                        </p>
                    )}
                    <div className="space-y-3">
                        <button 
                            onClick={() => window.location.href = '/orders'}
                            className="w-full bg-primary-orange text-white py-2 px-4 rounded hover:bg-orange-600"
                        >
                            View Orders
                        </button>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;