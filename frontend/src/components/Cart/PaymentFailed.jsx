import { useSearchParams } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import MetaData from '../Layouts/MetaData';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const error = searchParams.get('error');
    const status = searchParams.get('status');

    const getErrorMessage = () => {
        if (error === 'checksum_mismatch') return 'Payment verification failed';
        if (error === 'missing_checksum') return 'Payment verification error';
        if (error === 'processing_failed') return 'Payment processing failed';
        if (error === 'invalid_response') return 'Invalid payment response';
        return error || 'Payment failed';
    };

    return (
        <>
            <MetaData title="Payment Failed | Flipkart" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <ErrorIcon sx={{ fontSize: 80, color: 'red', mb: 2 }} />
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
                    <p className="text-gray-600 mb-4">
                        {getErrorMessage()}
                    </p>
                    {orderId && (
                        <p className="text-sm text-gray-500 mb-2">
                            Order ID: {orderId}
                        </p>
                    )}
                    {status && (
                        <p className="text-sm text-gray-500 mb-6">
                            Status: {status}
                        </p>
                    )}
                    <div className="space-y-3">
                        <button 
                            onClick={() => window.location.href = '/cart/payment'}
                            className="w-full bg-primary-orange text-white py-2 px-4 rounded hover:bg-orange-600"
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => window.location.href = '/cart'}
                            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
                        >
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentFailed;