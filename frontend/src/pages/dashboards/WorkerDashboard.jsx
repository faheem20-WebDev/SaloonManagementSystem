import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaCalendarCheck, FaUserEdit, FaCamera, FaSave } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

const WorkerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('assignments');
  
  // Profile States
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    image: user?.image || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

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
    // If user has bio/image in context, sync it
    if (user) {
        setProfile({
            name: user.name || '',
            bio: user.bio || '',
            image: user.image || ''
        });
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    if (!id) {
        toast.error("Error: Invalid Appointment ID");
        return;
    }
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleProfileUpdate = async (e) => {
      e.preventDefault();
      setIsUpdating(true);
      try {
          const { data } = await api.put('users/profile', profile);
          toast.success('Profile updated successfully!');
          // Note: In a real app, you might want to update the AuthContext here as well
      } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to update profile');
      } finally {
          setIsUpdating(false);
      }
  };

  const sidebarItems = [
    { id: 'assignments', label: 'My Assignments', icon: FaCalendarCheck },
    { id: 'profile', label: 'My Profile', icon: FaUserEdit },
  ];

  return (
    <DashboardLayout
      title="Stylist Portal"
      items={sidebarItems}
      activeItem={activeTab}
      onItemClick={setActiveTab}
    >
        <div className="mb-10">
           <h1 className="text-4xl font-display text-gray-900 dark:text-white mb-2">Hello, {user?.name}</h1>
           <p className="text-gray-500 dark:text-gray-400">
             {activeTab === 'assignments' ? 'Manage your upcoming appointments.' : 'Personalize your public stylist profile.'}
           </p>
        </div>

        {activeTab === 'assignments' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((appt) => (
                    <div key={appt.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-serif text-gray-900 dark:text-white">{appt.service?.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Client: {appt.customer?.name}</p>
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
            </>
        )}

        {activeTab === 'profile' && (
            <div className="max-w-4xl animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Preview Card */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-6 rounded-[2rem] text-center sticky top-8">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <img 
                                    src={profile.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover rounded-full border-4 border-gold-500/30"
                                />
                                <div className="absolute bottom-0 right-0 bg-gold-500 text-black p-2 rounded-full shadow-lg">
                                    <FaCamera size={14} />
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-1">{profile.name}</h3>
                            <p className="text-gold-600 dark:text-gold-500 text-xs font-bold uppercase tracking-widest mb-4">Master Stylist</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm italic line-clamp-4">
                                "{profile.bio || 'Tell customers about your expertise...'}"
                            </p>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="glass-panel p-8 rounded-[2rem]">
                            <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-8">Edit Profile Information</h2>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={profile.name}
                                        onChange={e => setProfile({...profile, name: e.target.value})}
                                        placeholder="Public name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Profile Image URL</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={profile.image}
                                        onChange={e => setProfile({...profile, image: e.target.value})}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2 italic">Provide a high-quality professional headshot URL.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Professional Bio & Expertise</label>
                                    <textarea 
                                        className="input-field min-h-[150px] py-4" 
                                        value={profile.bio}
                                        onChange={e => setProfile({...profile, bio: e.target.value})}
                                        placeholder="Example: Expert in classic fades and traditional hot towel shaves. 10 years experience in premium men's grooming."
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isUpdating}
                                    className="btn-gold w-full py-4 flex items-center justify-center gap-3 shadow-lg shadow-gold-500/20 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving Changes...' : <><FaSave /> Save Profile Details</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </DashboardLayout>
  );
};

export default WorkerDashboard;
