const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const Service = require('./models/Service');

// Specify exact path to .env
dotenv.config({ path: path.join(__dirname, '.env') });

const fixImages = async () => {
  await connectDB();

  try {
    console.log('Searching for services with broken image links in DB...');
    
    const services = await Service.findAll();
    
    let updatedCount = 0;
    for (let service of services) {
      if (service.image && service.image.includes('via.placeholder.com')) {
        service.image = service.image.replace('via.placeholder.com', 'placehold.co');
        await service.save();
        updatedCount++;
      }
    }

    console.log(`Success! Updated ${updatedCount} services.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixImages();