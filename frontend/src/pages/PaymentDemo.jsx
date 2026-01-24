import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { FaLock, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_sample'); 

const CheckoutForm = ({ amount, appointmentId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // 1. Create Payment Intent
      const { data: { clientSecret } } = await axios.post('/payment/create-intent', {
        amount: amount,
        currency: 'usd',
        description: `Payment for Appointment #${appointmentId}`
      });

      // 2. Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. Record Success in Backend and update Appointment
          await axios.post('/payment/record-success', {
            paymentIntentId: result.paymentIntent.id,
            amount: amount,
            appointmentId: appointmentId,
            provider: 'stripe'
          });
          onSuccess(result.paymentIntent.id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment Failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
        <CardElement options={{
            style: {
                base: { color: "#32325d", fontSize: "16px", "::placeholder": { color: "#aab7c4" } },
                invalid: { color: "#fa755a" }
            }
        }} />
      </div>
      
      {error && <div className="text-red-500 text-sm flex items-center gap-2"><FaExclamationTriangle /> {error}</div>}

      <button 
        type="submit" 
        disabled={!stripe || processing}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
          processing ? 'bg-gray-400' : 'bg-gold-600 hover:bg-gold-700'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${amount?.toFixed(2)} Now`}
      </button>
      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
        <FaLock className="text-green-500" /> Secure Encryption
      </p>
    </form>
  );
};

const PaymentDemo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  
  // Get data from location state (passed from Dashboard)
  const { appointmentId, amount } = location.state || { amount: 50 }; // Fallback for testing

  const handleSuccess = (transactionId) => {
    setSuccess(true);
    setTxnId(transactionId);
    toast.success("Payment Received!");
  };

  const isStripeConfigured = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_sample';

  if (success) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-dark-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
                <p className="text-gray-500 mb-8">Payment confirmed for Appointment #{appointmentId}</p>
                <button onClick={() => navigate('/dashboard')} className="w-full btn-gold py-4 font-bold">Return to Dashboard</button>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 hover:text-gold-600 mb-8 transition-colors">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/5">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Details</h3>
              <div className="space-y-4">
                  <div className="flex justify-between"><span>Service Fee</span><span className="font-bold">${amount}</span></div>
                  <div className="border-t pt-4 flex justify-between text-xl font-bold"><span>Total</span><span className="text-gold-600">${amount}</span></div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/5">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Secure Checkout</h2>
                {isStripeConfigured ? (
                    <Elements stripe={stripePromise}>
                        <CheckoutForm amount={amount} appointmentId={appointmentId} onSuccess={handleSuccess} />
                    </Elements>
                ) : (
                    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">Stripe Configuration Missing</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDemo;