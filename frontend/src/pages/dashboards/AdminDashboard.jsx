import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FaUserPlus, FaTrash, FaCalendarAlt, FaUsers, FaUserTie, FaCut, FaPlus, FaClock, FaCog, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [appointments, setAppointments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [salonHours, setSalonHours] = useState({ shopOpenTime: '09:00', shopCloseTime: '21:00' });
  
  const [newWorker, setNewWorker] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    shiftStart: '09:00', 
    shiftEnd: '21:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    skills: [] 
  });
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '' });
  const [editingWorker, setEditingWorker] = useState(null);

  const toggleNewWorkerSkill = (serviceId) => {
    const idStr = String(serviceId);
    let skills = [...newWorker.skills];
    if (skills.includes(idStr)) {
        skills = skills.filter(s => s !== idStr);
    } else {
        skills.push(idStr);
    }
    setNewWorker({...newWorker, skills});
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    if (newWorker.skills.length === 0) {
        toast.warning('Please select at least one skill for the worker');
        return;
    }
    try {
      await api.post('users/workers', newWorker);
      toast.success('Worker created successfully');
      setNewWorker({ 
        name: '', email: '', password: '', 
        shiftStart: '09:00', shiftEnd: '21:00', 
        breakStart: '13:00', breakEnd: '14:00',
        skills: [] 
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to create worker');
    }
  };

  const handleUpdateWorker = async (e) => {
      e.preventDefault();
      try {
          await api.put(`/users/${editingWorker.id}`, editingWorker);
          toast.success('Worker updated');
          setEditingWorker(null);
          fetchData();
      } catch (error) {
          toast.error('Update failed');
      }
  };

  const toggleEditWorkerSkill = (serviceId) => {
      if (!editingWorker) return;
      let skills = Array.isArray(editingWorker.skills) ? [...editingWorker.skills] : [];
      // Convert to string for consistent check
      const idStr = String(serviceId);
      if (skills.includes(idStr) || skills.includes(serviceId)) {
          skills = skills.filter(s => String(s) !== idStr);
      } else {
          skills.push(idStr);
      }
      setEditingWorker({...editingWorker, skills});
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
    { id: 'settings', label: 'Settings', icon: FaCog },
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
                {/* Modal for Editing Worker */}
                {editingWorker && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
                            <h3 className="text-2xl font-serif mb-6 text-gray-900 dark:text-white">Edit Stylist: {editingWorker.name}</h3>
                            <form onSubmit={handleUpdateWorker} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs uppercase text-gray-500 font-bold mb-2 block">Shift Start</label>
                                        <input className="input-field" type="time" value={editingWorker.shiftStart} onChange={e => setEditingWorker({...editingWorker, shiftStart: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase text-gray-500 font-bold mb-2 block">Shift End</label>
                                        <input className="input-field" type="time" value={editingWorker.shiftEnd} onChange={e => setEditingWorker({...editingWorker, shiftEnd: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase text-gray-500 font-bold mb-2 block">Break Start</label>
                                        <input className="input-field" type="time" value={editingWorker.breakStart} onChange={e => setEditingWorker({...editingWorker, breakStart: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase text-gray-500 font-bold mb-2 block">Break End</label>
                                        <input className="input-field" type="time" value={editingWorker.breakEnd} onChange={e => setEditingWorker({...editingWorker, breakEnd: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs uppercase text-gray-500 font-bold mb-3 block">Expertise (Skills)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {services.map(s => {
                                            const skills = Array.isArray(editingWorker.skills) ? editingWorker.skills : [];
                                            const isActive = skills.includes(String(s.id)) || skills.includes(s.id);
                                            return (
                                                <button 
                                                    key={s.id} 
                                                    type="button"
                                                    onClick={() => toggleEditWorkerSkill(s.id)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-gold-500 text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                                                >
                                                    {s.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                    <button type="submit" className="btn-gold flex-1 py-3">Save Changes</button>
                                    <button type="button" onClick={() => setEditingWorker(null)} className="flex-1 py-3 border border-gray-200 dark:border-white/10 text-gray-500 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Form to Add Worker */}
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-xl font-serif mb-6 flex items-center gap-2 text-gray-900 dark:text-white"><FaUserPlus className="text-gold-500" /> Recruit Stylist</h3>
                    <form onSubmit={handleCreateWorker} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input className="input-field" type="text" placeholder="Full Name" value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})} required />
                        <input className="input-field" type="email" placeholder="Email Address" value={newWorker.email} onChange={e => setNewWorker({...newWorker, email: e.target.value})} required />
                        <input className="input-field" type="password" placeholder="Password" value={newWorker.password} onChange={e => setNewWorker({...newWorker, password: e.target.value})} required />
                        
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Shift</label>
                                    <div className="flex gap-1">
                                        <input className="input-field text-xs py-2 px-2" type="time" value={newWorker.shiftStart} onChange={e => setNewWorker({...newWorker, shiftStart: e.target.value})} />
                                        <input className="input-field text-xs py-2 px-2" type="time" value={newWorker.shiftEnd} onChange={e => setNewWorker({...newWorker, shiftEnd: e.target.value})} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Break</label>
                                    <div className="flex gap-1">
                                        <input className="input-field text-xs py-2 px-2" type="time" value={newWorker.breakStart} onChange={e => setNewWorker({...newWorker, breakStart: e.target.value})} />
                                        <input className="input-field text-xs py-2 px-2" type="time" value={newWorker.breakEnd} onChange={e => setNewWorker({...newWorker, breakEnd: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs uppercase text-gray-500 font-bold mb-2 block">Assign Skills</label>
                            <div className="flex flex-wrap gap-2">
                                {services && services.length > 0 ? (
                                    services.map(s => (
                                        <button 
                                            key={s.id} 
                                            type="button"
                                            onClick={() => toggleNewWorkerSkill(s.id)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${newWorker.skills && newWorker.skills.includes(String(s.id)) ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500 border border-transparent'}`}
                                        >
                                            {s.name}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-xs italic">No services available. Create services first.</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="md:col-span-2 btn-gold py-4 font-bold uppercase tracking-widest mt-2">Recruit Stylist</button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workers.map(worker => (
                        <div key={worker.id} className="glass-card-hover p-6 rounded-2xl relative group border border-gray-100 dark:border-white/5">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-display text-2xl text-gray-900 dark:text-white mb-1">{worker.name}</h3>
                                    <p className="text-gold-600 dark:text-gold-500 text-sm mb-4">Master Stylist</p>
                                    <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2"><FaClock className="text-gold-500" /> {worker.shiftStart} — {worker.shiftEnd}</div>
                                        <div className="flex items-center gap-2"><FaCut className="text-gold-500" /> {Array.isArray(worker.skills) ? worker.skills.length : 0} Skills</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingWorker(worker)} className="p-2 text-gold-600 hover:bg-gold-500/10 rounded-full"><FaEdit /></button>
                                    <button onClick={() => handleDeleteUser(worker.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><FaTrash /></button>
                                </div>
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
                    {services && services.length > 0 ? services.map(service => (
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
                    )) : (
                        <div className="md:col-span-3 text-center py-10 text-gray-500">No services found. Add one above.</div>
                    )}
                </div>
            </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
            <div className="max-w-xl">
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-2xl font-serif mb-8 text-gray-900 dark:text-white flex items-center gap-3"><FaClock className="text-gold-500" /> Salon Hours</h3>
                    <form onSubmit={handleUpdateShopHours} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-bold mb-3 block">Opening Time</label>
                                <input className="input-field text-xl" type="time" value={salonHours?.shopOpenTime || '09:00'} onChange={e => setSalonHours({...salonHours, shopOpenTime: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500 font-bold mb-3 block">Closing Time</label>
                                <input className="input-field text-xl" type="time" value={salonHours?.shopCloseTime || '21:00'} onChange={e => setSalonHours({...salonHours, shopCloseTime: e.target.value})} />
                            </div>
                        </div>
                        <button type="submit" className="btn-gold w-full py-4 font-bold tracking-widest flex items-center justify-center gap-3"><FaCheck /> Update Salon Hours</button>
                    </form>
                </div>
            </div>
        )}

    </DashboardLayout>
  );
};

export default AdminDashboard;
