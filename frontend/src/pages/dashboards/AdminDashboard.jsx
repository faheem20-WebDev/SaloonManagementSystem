import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FaUserPlus, FaTrash, FaCalendarAlt, FaUsers, FaUserTie } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [appointments, setAppointments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [newWorker, setNewWorker] = useState({ name: '', email: '', password: '', schedule: '' });

  const fetchData = async () => {
    try {
      const [apptRes, workersRes, usersRes] = await Promise.all([
         api.get('appointments'),
         api.get('users/workers'),
         api.get('users')
      ]);
      setAppointments(apptRes.data);
      setWorkers(workersRes.data);
      setUsers(usersRes.data);
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
    { id: 'users', label: 'Users', icon: FaUsers },
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
                            <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
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
                                    <button onClick={() => deleteAppointment(appt._id)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
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
                        <div key={worker._id} className="glass-card-hover p-6 rounded-2xl relative group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-1">{worker.name}</h3>
                                    <p className="text-gold-600 dark:text-gold-500 text-sm mb-4">Master Stylist</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{worker.email}</p>
                                    <div className="mt-4 px-3 py-1 bg-gray-100 dark:bg-white/5 inline-block rounded text-xs text-gray-500 dark:text-gray-300">
                                        {worker.schedule}
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteUser(worker._id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-500/10 rounded-full"><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
             <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold tracking-wider ${
                                        u.role === 'admin' ? 'text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-400/30' :
                                        u.role === 'worker' ? 'text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-400/30' :
                                        'text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30'
                                    }`}>{u.role}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    {u.role !== 'admin' && (
                                        <button onClick={() => handleDeleteUser(u._id)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}

    </DashboardLayout>
  );
};

export default AdminDashboard;
