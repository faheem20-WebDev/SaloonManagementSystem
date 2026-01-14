const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Service = require('./models/Service');
const Appointment = require('./models/Appointment');

dotenv.config();

const importData = async () => {
  await connectDB();

  try {
    // Note: In SQL, we use destroy({ truncate: true, cascade: true }) to clear tables
    // Cascade is important because appointments depend on users and services
    await Appointment.destroy({ truncate: true, cascade: true });
    await User.destroy({ truncate: true, cascade: true });
    await Service.destroy({ truncate: true, cascade: true });

    // Create Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@luxe.com',
      password: 'password123', // Will be hashed by hook
      role: 'admin',
    });

    const worker1 = await User.create({
      name: 'Alice Stylist',
      email: 'alice@luxe.com',
      password: 'password123',
      role: 'worker',
      schedule: '9AM - 5PM',
    });

    const worker2 = await User.create({
      name: 'Bob Barber',
      email: 'bob@luxe.com',
      password: 'password123',
      role: 'worker',
      schedule: '10AM - 6PM',
    });

    const worker3 = await User.create({
      name: 'Charlie Colorist',
      email: 'charlie@luxe.com',
      password: 'password123',
      role: 'worker',
      schedule: '11AM - 7PM',
    });

    const customer1 = await User.create({
      name: 'Jane Doe',
      email: 'jane@gmail.com',
      password: 'password123',
      role: 'customer',
    });

    const customer2 = await User.create({
      name: 'John Smith',
      email: 'john@gmail.com',
      password: 'password123',
      role: 'customer',
    });

    // Create Services
    const services = await Service.bulkCreate([
      {
        name: 'Classic Haircut',
        description: 'A classic haircut with styling.',
        price: 30,
        duration: 45,
      },
      {
        name: 'Beard Trim',
        description: 'Professional beard trimming and shaping.',
        price: 20,
        duration: 30,
      },
      {
        name: 'Hair Coloring',
        description: 'Full hair coloring service.',
        price: 80,
        duration: 120,
      },
      {
        name: 'Facial Treatment',
        description: 'Rejuvenating facial treatment.',
        price: 50,
        duration: 60,
      },
      {
        name: 'Manicure & Pedicure',
        description: 'Complete nail care package.',
        price: 45,
        duration: 60,
      },
    ]);

    // Create Appointments
    await Appointment.bulkCreate([
      {
        customerId: customer1.id,
        workerId: worker1.id,
        serviceId: services[0].id,
        date: new Date('2026-01-15T10:00:00'),
        status: 'confirmed',
      },
      {
        customerId: customer1.id,
        workerId: worker2.id,
        serviceId: services[1].id,
        date: new Date('2026-01-20T14:00:00'),
        status: 'pending',
      },
      {
        customerId: customer2.id,
        workerId: worker3.id,
        serviceId: services[2].id,
        date: new Date('2026-01-18T11:00:00'),
        status: 'completed',
      },
      {
        customerId: customer2.id,
        workerId: worker1.id,
        serviceId: services[3].id,
        date: new Date('2026-01-22T09:00:00'),
        status: 'cancelled',
      },
      {
        customerId: customer1.id,
        workerId: worker2.id,
        serviceId: services[4].id,
        date: new Date('2026-01-25T16:00:00'),
        status: 'pending',
      },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();