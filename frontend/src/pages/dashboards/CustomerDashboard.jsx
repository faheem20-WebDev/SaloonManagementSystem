import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaCalendarPlus, FaHistory, FaClock, FaCheckCircle, FaTimesCircle, 
    FaHourglassHalf, FaCalendarAlt, FaDownload, FaReceipt, FaCreditCard, 
    FaExclamationTriangle, FaStar, FaMoneyBillWave 
} from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import jsPDF from 'jsPDF';
import 'jspdf-autotable';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // States
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('onsite'); // 'online' | 'onsite'
  
  // Modals
  const [receipt, setReceipt] = useState(null); 
  const [cancelModal, setCancelModal] = useState(null); // { appt }
  const [reviewModal, setReviewModal] = useState(null); // { appt }
  
  // Cancellation Form
  const [cancelReason, setCancelReason] = useState('');
  
  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchData = async () => {
    try {
      const [apptRes, servicesRes] = await Promise.all([
         api.get('appointments'),
         api.get('services')
      ]);
      setAppointments(apptRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- BOOKING LOGIC ---
  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        service: Number(selectedService), 
        date: date,
        paymentMethod
      };

      const res = await api.post('appointments', payload);
      
      if (paymentMethod === 'online') {
          navigate('/payment-demo', { state: { appointmentId: res.data.id, amount: res.data.service.price } });
      } else {
          toast.success('Appointment booked successfully!');
          setReceipt(res.data);
          fetchData();
          setSelectedService('');
          setDate('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  // --- CANCELLATION LOGIC ---
  const openCancelModal = (appt) => {
      setCancelModal(appt);
      setCancelReason('');
  };

  const calculateRefund = (apptDate) => {
      const diffMs = new Date(apptDate) - new Date();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours < 2) return { eligible: false, percent: 0, msg: "Too late to cancel (Less than 2 hrs)" };
      if (diffHours < 24) return { eligible: true, percent: 80, msg: "80% Refund" };
      return { eligible: true, percent: 100, msg: "100% Refund" };
  };

  const handleCancelSubmit = async (e) => {
      e.preventDefault();
      if (!cancelModal) return;
      try {
          await api.post(`appointments/${cancelModal.id}/cancel`, { reason: cancelReason });
          toast.success('Appointment cancelled');
          setCancelModal(null);
          fetchData();
      } catch (error) {
          toast.error(error.response?.data?.message || 'Cancellation failed');
      }
  };

  // --- REVIEW LOGIC ---
  const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.post(`appointments/${reviewModal.id}/review`, { rating, comment });
          toast.success('Review submitted');
          setReviewModal(null);
          fetchData(); 
      } catch (error) {
          toast.error('Failed to submit review');
      }
  };

  // --- PDF GENERATION ---
  const downloadReceipt = (appt) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(26, 26, 26); 
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(212, 175, 55); // Gold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LUXE SALON", pageWidth / 2, 20, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Styling & Care", pageWidth / 2, 28, { align: 'center' });

    // Info Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Receipt ID: #${appt.id}`, 15, 55);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, pageWidth - 15, 55, { align: 'right' });

    // Payment Status Box
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.rect(15, 62, pageWidth - 30, 15);
    
    let paymentText = "Payment Status: Unknown";
    if (appt.paymentMethod === 'onsite') {
        paymentText = "PAYMENT METHOD: PAY AT SALON (ON-SITE)";
    } else if (appt.paymentMethod === 'online') {
        paymentText = appt.paymentStatus === 'paid' ? "PAYMENT STATUS: PAID ONLINE (VIA STRIPE)" : "PAYMENT STATUS: PENDING ONLINE";
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(appt.paymentStatus === 'paid' ? [34, 197, 94] : [212, 175, 55]); // Green if paid, Gold if onsite/pending
    doc.text(paymentText, pageWidth / 2, 72, { align: 'center' });

    // Table
    const tableData = [
        ['Service', 'Stylist', 'Appointment Date', 'Price'],
        [
            appt.service?.name, 
            appt.worker?.name || 'Pending', 
            new Date(appt.date).toLocaleString(), 
            `$${appt.service?.price}`
        ]
    ];

    doc.autoTable({
        startY: 85,
        head: [tableData[0]],
        body: [tableData[1]],
        headStyles: { fillColor: [212, 175, 55], textColor: [26, 26, 26] }, 
        theme: 'grid'
    });

    // Final Total
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: $${appt.service?.price}`, pageWidth - 15, finalY, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text("This is a computer-generated receipt for your reservation.", pageWidth / 2, finalY + 15, { align: 'center' });
    doc.text("Thank you for choosing Luxe Salon.", pageWidth / 2, finalY + 22, { align: 'center' });

    doc.save(`LuxeReceipt-${appt.id}.pdf`);
  };

  // Find unpaid online bookings for notification
  const pendingPayment = appointments.find(a => 
      a.status === 'confirmed' && 
      a.paymentMethod === 'online' && 
      a.paymentStatus === 'unpaid'
  );

  const sidebarItems = [
    { id: 'overview', label: 'Book Appointment', icon: FaCalendarPlus },
    { id: 'history', label: 'My History', icon: FaHistory },
  ];

  return (
    <DashboardLayout
      title="My Luxe"
      items={sidebarItems}
      activeItem={activeTab}
      onItemClick={setActiveTab}
    >
       <div className="mb-10">
          <h1 className="text-4xl font-display text-gray-900 dark:text-white mb-2">Welcome, {user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Your personal beauty journey.</p>
       </div>

       {/* NOTIFICATION */}
       <AnimatePresence>
       {pendingPayment && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
           >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Action Required</h3>
                  <p className="opacity-90">Please complete payment for your <strong>{pendingPayment.service?.name}</strong> booking.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/payment-demo', { state: { appointmentId: pendingPayment.id, amount: pendingPayment.service?.price } })}
                className="w-full md:w-auto px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                Pay Now
              </button>
           </motion.div>
       )}
       </AnimatePresence>

       {/* CANCEL MODAL */}
       {cancelModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
               <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cancel Appointment?</h3>
                   {(() => {
                       const { eligible, percent, msg } = calculateRefund(cancelModal.date);
                       return (
                           <div className={`p-4 rounded-xl mb-4 text-sm font-bold ${eligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                               Refund Policy: {msg}
                               {!eligible && <p className="font-normal mt-1">Cancellation window closed.</p>}
                           </div>
                       );
                   })()}
                   <form onSubmit={handleCancelSubmit}>
                       <label className="block text-sm text-gray-500 mb-2">Reason for cancellation</label>
                       <textarea 
                           className="input-field mb-4" 
                           rows="3" 
                           required 
                           value={cancelReason}
                           onChange={e => setCancelReason(e.target.value)}
                           placeholder="Please tell us why..."
                       ></textarea>
                       <div className="flex gap-3">
                           <button type="submit" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">Confirm Cancellation</button>
                           <button type="button" onClick={() => setCancelModal(null)} className="flex-1 border border-gray-300 dark:border-white/10 text-gray-500 py-3 rounded-xl">Keep Booking</button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       {/* REVIEW MODAL */}
       {reviewModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
               <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rate your Experience</h3>
                   <form onSubmit={handleReviewSubmit}>
                       <div className="flex justify-center gap-2 mb-6">
                           {[1,2,3,4,5].map(star => (
                               <button 
                                key={star} 
                                type="button" 
                                onClick={() => setRating(star)}
                                className={`text-3xl transition-colors ${rating >= star ? 'text-gold-500' : 'text-gray-300'}`}
                               >★</button>
                           ))}
                       </div>
                       <textarea 
                           className="input-field mb-4" 
                           rows="3" 
                           value={comment}
                           onChange={e => setComment(e.target.value)}
                           placeholder="How was the service?"
                       ></textarea>
                       <div className="flex gap-3">
                           <button type="submit" className="flex-1 btn-gold py-3">Submit Review</button>
                           <button type="button" onClick={() => setReviewModal(null)} className="flex-1 border border-gray-300 dark:border-white/10 text-gray-500 py-3 rounded-xl">Cancel</button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       {/* RECEIPT SUCCESS MODAL (After Booking) */}
       <AnimatePresence>
         {receipt && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
           >
             <motion.div 
               initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
               className="bg-white dark:bg-dark-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gold-500/30"
             >
               <div className="text-center mb-6">
                 <FaReceipt className="mx-auto text-4xl text-gold-500 mb-2" />
                 <h2 className="text-2xl font-display text-gray-900 dark:text-white">Booking Confirmed</h2>
                 <p className="text-sm text-gray-500 italic">Your spot at Luxe is locked in.</p>
               </div>
               <div className="space-y-4 mb-8 bg-gray-50 dark:bg-black/20 p-4 rounded-xl text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-500">Service</span>
                   <span className="text-gray-900 dark:text-white font-bold">{receipt.service?.name}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">Stylist</span>
                   <span className="text-gold-600 dark:text-gold-400 font-medium">{receipt.worker ? receipt.worker.name : 'Auto-Assigned'}</span>
                 </div>
                 <div className="flex justify-between border-t border-gray-200 dark:border-white/10 pt-2 font-bold text-lg">
                   <span className="text-gray-900 dark:text-white">Total</span>
                   <span className="text-gold-600 dark:text-gold-400">${receipt.service?.price}</span>
                 </div>
               </div>
               <div className="flex gap-4">
                 <button onClick={() => downloadReceipt(receipt)} className="flex-1 btn-gold py-3 flex items-center justify-center gap-2">
                   <FaDownload /> Download
                 </button>
                 <button onClick={() => setReceipt(null)} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-900 dark:text-white font-bold">
                   Close
                 </button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Booking Tab */}
       {activeTab === 'overview' && (
          <div className="max-w-2xl">
             <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-6">New Reservation</h2>
                <form onSubmit={handleBook} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Service</label>
                    <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="input-field bg-white/50 dark:bg-dark-800" required >
                      <option value="">Select a treatment...</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>{service.name} (${service.price} • {service.duration}m)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preferred Time</label>
                     <input type="datetime-local" value={date} min={new Date().toISOString().slice(0, 16)} max={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().slice(0, 16)} onChange={(e) => setDate(e.target.value)} className="input-field bg-white dark:bg-dark-800 text-gray-900 dark:text-white border-gray-200 dark:border-white/10" required />
                     <p className="text-[10px] text-gray-400 mt-1 italic">Bookings are open up to 3 months in advance.</p>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Payment Method</label>
                      <div className="grid grid-cols-2 gap-4">
                          <button type="button" onClick={() => setPaymentMethod('online')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'online' ? 'border-gold-500 bg-gold-500/10 text-gold-600' : 'border-gray-200 dark:border-white/10 text-gray-500'}`} >
                              <FaCreditCard size={24} />
                              <span className="font-bold text-sm">Pay Online</span>
                          </button>
                          <button type="button" onClick={() => setPaymentMethod('onsite')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'onsite' ? 'border-gold-500 bg-gold-500/10 text-gold-600' : 'border-gray-200 dark:border-white/10 text-gray-500'}`} >
                              <FaMoneyBillWave size={24} />
                              <span className="font-bold text-sm">Pay at Salon</span>
                          </button>
                      </div>
                  </div>
                  <button type="submit" className="btn-gold w-full py-4 text-lg mt-4 shadow-lg dark:shadow-none">
                    {paymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Reservation'}
                  </button>
                </form>
             </div>
          </div>
       )}

       {/* History Tab */}
       {activeTab === 'history' && (
          <div className="space-y-4">
             {appointments.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                   <FaCalendarAlt className="mx-auto text-4xl mb-4 text-gray-400" />
                   <p className="text-xl font-serif text-gray-500 dark:text-gray-400">No booking history yet.</p>
                </div>
             ) : (
                appointments.map((appt, index) => (
                  <motion.div key={appt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card-hover p-6 rounded-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6" >
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-white/5 shrink-0 ${
                         appt.status === 'confirmed' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                         appt.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                         appt.status === 'completed' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                         appt.status === 'cancelled' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                         'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}>
                         {(appt.status === 'confirmed' || appt.status === 'completed') && <FaCheckCircle size={24} />}
                         {appt.status === 'pending' && <FaHourglassHalf size={24} />}
                         {appt.status === 'cancelled' && <FaTimesCircle size={24} />}
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-gray-900 dark:text-white">{appt.service?.name || 'Service'}</h3>
                        <p className="text-sm text-gold-600 dark:text-gold-400 mt-1">{format(new Date(appt.date), 'MMM d, yyyy • h:mm a')}</p>
                        <p className="text-xs text-gray-500 mt-1">Stylist: {appt.worker ? appt.worker.name : 'Pending Assignment'}</p>
                        <div className="mt-2 flex gap-2">
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                                 appt.paymentStatus === 'paid' ? 'border-green-500 text-green-600' :
                                 appt.paymentStatus === 'refunded' ? 'border-purple-500 text-purple-600' :
                                 'border-orange-500 text-orange-600'
                             }`}>
                                 {appt.paymentMethod === 'onsite' ? 'Pay at Salon' : (appt.paymentStatus || 'UNPAID')}
                             </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
                        {appt.status === 'completed' && (
                            <button onClick={() => setReviewModal(appt)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gold-500 hover:text-white transition-colors text-xs font-bold uppercase flex items-center gap-2"><FaStar /> Review</button>
                        )}

                        {appt.status !== 'cancelled' && (
                            <button onClick={() => downloadReceipt(appt)} className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black hover:bg-black transition-colors text-xs font-bold uppercase flex items-center gap-2"><FaDownload /> Receipt</button>
                        )}

                        {(appt.status === 'confirmed' || appt.status === 'pending') && (
                            <button onClick={() => openCancelModal(appt)} className="px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-xs font-bold uppercase">Cancel</button>
                        )}

                        {appt.paymentStatus === 'unpaid' && appt.paymentMethod === 'online' && appt.status !== 'cancelled' && (
                             <button onClick={() => navigate('/payment-demo', { state: { appointmentId: appt.id, amount: appt.service?.price } })} className="px-4 py-2 rounded-lg bg-gold-500 text-white hover:bg-gold-600 transition-colors text-xs font-bold uppercase" > Pay Now </button>
                        )}
                    </div>
                  </motion.div>
                ))
             )}
          </div>
       )}

    </DashboardLayout>
  );
};

export default CustomerDashboard;