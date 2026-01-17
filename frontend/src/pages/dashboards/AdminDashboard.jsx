import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FaUserPlus, FaTrash, FaCalendarAlt, FaUsers, FaUserTie, FaCut, FaPlus } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [appointments, setAppointments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  
  const [newWorker, setNewWorker] = useState({ name: '', email: '', password: '', schedule: '' });
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '' });

  const fetchData = async () => {
    try {
      const [apptRes, workersRes, usersRes, servicesRes] = await Promise.all([
         api.get('appointments'),
         api.get('users/workers'),
         api.get('users'),
         api.get('services')
      ]);
      setAppointments(apptRes.data);
      setWorkers(workersRes.data);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    try {
      await api.post('users/workers', newWorker);
      toast.success('Worker created');
      setNewWorker({ name: '', email: '', password: '', schedule: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create worker');
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.post('services', newService);
      toast.success('Service added successfully');
      setNewService({ name: '', description: '', price: '', duration: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add service');
    }
  };

  const handleDeleteService = async (id) => {
    if(window.confirm('Delete this service?')) {
        try {
            await api.delete(`/services/${id}`);
            toast.success('Service removed');
            fetchData();
        } catch (error) { toast.error('Failed to delete service'); }
    }
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm('Delete user?')) {
        try {
            await api.delete(`/users/${id}`);
            toast.success('Deleted');
            fetchData();
        } catch (error) { toast.error('Failed'); }
    }
  };

  const deleteAppointment = async (id) => {
      if(window.confirm('Delete appointment?')) {
          try {
              await api.delete(`/appointments/${id}`);
              toast.success('Deleted');
              fetchData();
          } catch (error) { toast.error('Failed'); }
      }
  }

  const sidebarItems = [
    { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
    { id: 'workers', label: 'Stylists', icon: FaUserTie },
    { id: 'customers', label: 'Customers', icon: FaUsers },
    { id: 'services', label: 'Services', icon: FaCut },
  ];

  return (
    <DashboardLayout 
       title="Admin Panel" 
       items={sidebarItems} 
       activeItem={activeTab} 
       onItemClick={setActiveTab}
    >
        <div className="mb-8">
            <h1 className="text-4xl font-display text-gray-900 dark:text-white mb-2">{sidebarItems.find(i => i.id === activeTab)?.label}</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your salon's operations.</p>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
            <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Stylist</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {appointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{appt.customer?.name || 'Unknown'}</td>
                                <td className="px-6 py-4 text-gold-600 dark:text-gold-400">{appt.service?.name}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{appt.worker?.name || '—'}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{format(new Date(appt.date), 'MMM d, h:mm a')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        appt.status === 'confirmed' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                                        appt.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                                        'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                    }`}>{appt.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => deleteAppointment(appt.id)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {appointments.length === 0 && <div className="p-8 text-center text-gray-500">No bookings found.</div>}
            </div>
        )}

        {/* Workers Tab */}
        {activeTab === 'workers' && (
            <div className="space-y-8">
                {/* Form */}
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-xl font-serif mb-6 flex items-center gap-2 text-gray-900 dark:text-white"><FaUserPlus className="text-gold-500" /> Recruit Stylist</h3>
                    <form onSubmit={handleCreateWorker} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input className="input-field" type="text" placeholder="Full Name" value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})} required />
                        <input className="input-field" type="email" placeholder="Email Address" value={newWorker.email} onChange={e => setNewWorker({...newWorker, email: e.target.value})} required />
                        <input className="input-field" type="password" placeholder="Password" value={newWorker.password} onChange={e => setNewWorker({...newWorker, password: e.target.value})} required />
                        <input className="input-field" type="text" placeholder="Schedule (e.g. 9-5)" value={newWorker.schedule} onChange={e => setNewWorker({...newWorker, schedule: e.target.value})} />
                        <button type="submit" className="md:col-span-2 btn-gold py-4">Recruit Stylist</button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workers.map(worker => (
                        <div key={worker.id} className="glass-card-hover p-6 rounded-2xl relative group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-1">{worker.name}</h3>
                                    <p className="text-gold-600 dark:text-gold-500 text-sm mb-4">Master Stylist</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{worker.email}</p>
                                    <div className="mt-4 px-3 py-1 bg-gray-100 dark:bg-white/5 inline-block rounded text-xs text-gray-500 dark:text-gray-300">
                                        {worker.schedule}
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteUser(worker.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-500/10 rounded-full"><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
             <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {users.filter(u => u.role === 'customer').map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteUser(u.id)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
            <div className="space-y-8">
                {/* Form to Add Service */}
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-xl font-serif mb-6 flex items-center gap-2 text-gray-900 dark:text-white"><FaPlus className="text-gold-500" /> Add New Treatment</h3>
                    <form onSubmit={handleCreateService} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input className="input-field" type="text" placeholder="Service Name" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required />
                        <input className="input-field" type="number" placeholder="Price ($)" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
                        <input className="input-field" type="number" placeholder="Duration (mins)" value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} required />
                        <textarea className="input-field md:col-span-3 h-24" placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
                        <button type="submit" className="md:col-span-3 btn-gold py-4 font-bold uppercase tracking-widest">Create Service</button>
                    </form>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="glass-card-hover p-6 rounded-2xl relative group border border-gray-100 dark:border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gold-500/10 rounded-xl text-gold-600">
                                    <FaCut size={24} />
                                </div>
                                <button onClick={() => handleDeleteService(service.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <FaTrash />
                                </button>
                            </div>
                            <h3 className="text-xl font-display text-gray-900 dark:text-white mb-2">{service.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                                <span className="text-gold-600 dark:text-gold-400 font-bold text-lg">${service.price}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">{service.duration} mins</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

    </DashboardLayout>
  );
};

export default AdminDashboard;

    </DashboardLayout>
  );
};

export default AdminDashboard;
