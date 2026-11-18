import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function sync() {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.collection('sitesettings').updateOne({}, {
    $set: {
      company_name: 'Nova Infotech Solutions',
      tagline: 'Enterprise IT Infrastructure, Corporate Fleet Leasing & Asset Liquidation',
      email: 'procurement@novainfotech.in',
      phone: '+919876543210',
      whatsapp: '+919876543210',
      address: 'Plot No. 42, Sector 18, Electronic City / Industrial Area, Delhi NCR',
      gst_number: '07AAACN8412K1Z9'
    }
  });

  // Also sync admin user's company name
  await mongoose.connection.collection('users').updateOne(
    { role: 'admin' },
    { $set: { company_name: 'Nova Infotech Solutions', name: 'Nova Infotech Desk' } }
  );

  console.log('Site settings and admin identity synchronized with Nova Infotech.');
  process.exit(0);
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
