const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Often needed for hosted Postgres services
    },
    connectTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  retry: {
    max: 3
  },
  logging: false // Toggle to true if you want to see raw SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected: Neon DB');
    
    // Ensure reset password columns exist idempotently without dropping tables
    await sequelize.query(`
      ALTER TABLE "Users"
      ADD COLUMN IF NOT EXISTS "resetPasswordToken" VARCHAR(255);
      ALTER TABLE "Users"
      ADD COLUMN IF NOT EXISTS "resetPasswordExpire" TIMESTAMPTZ;
    `);

    // In production, avoid alter: true to prevent table locks and unexpected schema alterations on live data.
    // In development, alter: true updates tables if models change.
    if (process.env.NODE_ENV === 'production') {
      await sequelize.sync();
      console.log('Database Synced (Production Safe Mode)');
    } else {
      await sequelize.sync();
      console.log('Database Synced (Safe Schema Mode)');
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
