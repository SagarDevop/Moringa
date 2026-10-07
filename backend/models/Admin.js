import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: {
    code: { type: String },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

export const Admin = mongoose.model('Admin', adminSchema);

export async function seedDefaultAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'sagar.singh44818@gmail.com';
    const adminUsername = process.env.ADMIN_USERNAME || 'AdminBmji';

    let admin = await Admin.findOne({ username: adminUsername });
    if (!admin) {
      admin = await Admin.create({
        username: adminUsername,
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'fy7de1Jq0PnvIwoB8CTI85GA',
      });
      console.log(`Default Admin seeded successfully: username=${adminUsername}, email=${adminEmail}`);
    } else if (admin.email !== adminEmail) {
      admin.email = adminEmail;
      await admin.save();
      console.log(`Admin email updated to: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Error seeding default admin:', err);
  }
}
