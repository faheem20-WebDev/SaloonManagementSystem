import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaHistory, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCalendarAlt } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Booking Form State
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');

  const fetchData = async () => {
    try {
      const [apptRes, servicesRes] = await Promise.all([
         api.get('appointments'),
         api.get('services')
      ]);
      setAppointments(apptRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('appointments', {
        service: selectedService,
        date: date,
      });
      toast.success('Appointment booked successfully!');
      fetchData();
      setSelectedService('');
      setDate('');
      setActiveTab('history'); // Switch to history tab on success
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    }
  };

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

       {/* Overview / Booking Tab */}
       {activeTab === 'overview' && (
          <div className="max-w-2xl">
             <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

                <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-6">New Reservation</h2>
                
                <form onSubmit={handleBook} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Service</label>
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="input-field bg-white/50 dark:bg-dark-800"
                      required
                    >
                      <option value="">Select a treatment...</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} (${service.price} • {service.duration}m)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preferred Time</label>
                     <input 
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-field bg-white/50 dark:bg-dark-800 text-gray-900 dark:text-gray-200"
                        required
                     />
                  </div>

                  <button type="submit" className="btn-gold w-full py-4 text-lg mt-4 shadow-lg dark:shadow-none">
                    Confirm Reservation
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
                  <motion.div 
                    key={appt._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card-hover p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-white/5 ${
                         appt.status === 'confirmed' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                         appt.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                         'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}>
                         {appt.status === 'confirmed' && <FaCheckCircle size={24} />}
                         {appt.status === 'pending' && <FaHourglassHalf size={24} />}
                         {appt.status === 'completed' && <FaCheckCircle size={24} />}
                         {appt.status === 'cancelled' && <FaTimesCircle size={24} />}
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-gray-900 dark:text-white">{appt.service.name}</h3>
                        <p className="text-sm text-gold-600 dark:text-gold-400 mt-1">{format(new Date(appt.date), 'MMMM d, yyyy • h:mm a')}</p>
                        <p className="text-xs text-gray-500 mt-1">Stylist: {appt.worker ? appt.worker.name : 'Pending Assignment'}</p>
                      </div>
                    </div>
                    
                    <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border ${
                        appt.status === 'confirmed' ? 'border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400' :
                        appt.status === 'pending' ? 'border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400' :
                        'border-gray-200 dark:border-gray-500/30 text-gray-500 dark:text-gray-400'
                      }`}>
                        {appt.status}
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