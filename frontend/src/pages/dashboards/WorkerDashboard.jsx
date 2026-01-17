import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaCalendarCheck } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments');

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('appointments');
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const sidebarItems = [
    { id: 'assignments', label: 'My Assignments', icon: FaCalendarCheck },
  ];

  return (
    <DashboardLayout
      title="Stylist Portal"
      items={sidebarItems}
      activeItem={activeTab}
      onItemClick={setActiveTab}
    >
        <div className="mb-10">
           <h1 className="text-4xl font-display text-gray-900 dark:text-white mb-2">Hello, {user.name}</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your upcoming appointments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {appointments.map((appt) => (
             <div key={appt.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="text-xl font-serif text-gray-900 dark:text-white">{appt.service.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Client: {appt.customer.name}</p>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                       appt.status === 'confirmed' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                       appt.status === 'completed' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                       appt.status === 'cancelled' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                       'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                   }`}>
                      {appt.status}
                   </div>
                </div>

                <div className="mb-6">
                   <p className="text-gold-600 dark:text-gold-400 font-display text-2xl">{format(new Date(appt.date), 'h:mm a')}</p>
                   <p className="text-gray-500 text-sm">{format(new Date(appt.date), 'EEEE, MMMM d, yyyy')}</p>
                </div>

                {/* Actions */}
                {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                   <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/5">
                      <button 
                        onClick={() => updateStatus(appt.id, 'completed')}
                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                      >
                         <FaCheck /> Complete
                      </button>
                      <button 
                        onClick={() => updateStatus(appt.id, 'cancelled')}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                      >
                         <FaTimes /> Cancel
                      </button>
                   </div>
                )}
             </div>
           ))}
        </div>
        
        {appointments.length === 0 && (
           <div className="text-center py-20 opacity-50 text-gray-500">
              <p className="text-xl font-serif">No assignments yet.</p>
           </div>
        )}
    </DashboardLayout>
  );
};

export default WorkerDashboard;
