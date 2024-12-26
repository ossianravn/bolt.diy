import { createCookieSessionStorage, redirect } from '@remix-run/cloudflare';
import bcrypt from 'bcryptjs';
import { getUserById, getUserByUsername } from './schema';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'bolt_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return session.get('userId');
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const session = await getUserSession(request);
  if (!session) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return session;
}

export async function getUser(request: Request) {
  const userId = await getUserSession(request);
  console.log('Getting user with ID:', userId);
  if (!userId) return null;

  try {
    const user = await getUserById(userId);
    console.log('Found user:', user);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw await logout(request);
  }
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function verifyLogin(username: string, password: string) {
  console.log('Attempting login for user:', username);
  const userWithPassword = await getUserByUsername(username);

  if (!userWithPassword) {
    console.log('User not found');
    return null;
  }

  console.log('User found, verifying password');
  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    console.log('Invalid password');
    return null;
  }

  console.log('Login successful');
  const { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
} 