const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Often needed for hosted Postgres services
    }
  },
  logging: false // Toggle to true if you want to see raw SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected: Neon DB');
    
    // Sync models
    // alter: true updates tables if models change. force: true drops tables (careful!)
    await sequelize.sync({ alter: true }); 
    console.log('Database Synced');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
