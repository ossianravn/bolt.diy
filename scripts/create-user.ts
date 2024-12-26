import bcrypt from 'bcryptjs';
import { createTables, createUser } from '../app/lib/auth/schema';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

async function createAdminUser() {
  // Create tables if they don't exist
  await createTables();

  // Get credentials from environment variables or use defaults
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('Error: ADMIN_PASSWORD environment variable must be set');
    process.exit(1);
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const user = await createUser({
      username,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Admin user created successfully:', {
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 