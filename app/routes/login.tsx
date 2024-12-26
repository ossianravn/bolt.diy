import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { createUserSession, getUser, verifyLogin } from '~/lib/auth/auth.server';
import BackgroundRays from '~/components/ui/BackgroundRays';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect('/');
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  console.log('Login form submitted');
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');
  const redirectTo = formData.get('redirectTo') || '/';

  console.log('Form data:', { username, redirectTo });

  if (typeof username !== 'string' || typeof password !== 'string' || typeof redirectTo !== 'string') {
    console.log('Invalid form data types');
    return json({ error: 'Invalid form submission' }, { status: 400 });
  }

  const user = await verifyLogin(username, password);
  if (!user) {
    console.log('Login failed');
    return json({ error: 'Invalid username or password' }, { status: 400 });
  }

  console.log('Login successful, creating session');
  return createUserSession(user.id, redirectTo);
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <div className="w-full max-w-md space-y-8 rounded-lg bg-bolt-elements-background-depth-3 p-8 shadow-lg relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-4xl font-bold text-bolt-elements-focus">⚡️</div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-bolt-elements-textPrimary">
            Sign in to bolt.diy
          </h2>
          <p className="mt-2 text-sm text-bolt-elements-textSecondary">
            Enter your credentials to access the AI coding assistant
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="redirectTo" value={searchParams.get('redirectTo') ?? undefined} />
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-bolt-elements-textPrimary">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-0 bg-bolt-elements-background-depth-2 py-2 px-3 text-bolt-elements-textPrimary shadow-sm ring-1 ring-inset ring-bolt-elements-borderColor/50 placeholder:text-bolt-elements-textSecondary/75 focus:bg-bolt-elements-background-depth-1 focus:ring-2 focus:ring-inset focus:ring-bolt-elements-focus transition-colors"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bolt-elements-textPrimary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border-0 bg-bolt-elements-background-depth-2 py-2 px-3 text-bolt-elements-textPrimary shadow-sm ring-1 ring-inset ring-bolt-elements-borderColor/50 placeholder:text-bolt-elements-textSecondary/75 focus:bg-bolt-elements-background-depth-1 focus:ring-2 focus:ring-inset focus:ring-bolt-elements-focus transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {actionData?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="i-ph:warning text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{actionData.error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.65)] hover:from-blue-600 hover:to-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="i-ph:lightning-fill mr-2 text-lg" />
                Sign in
              </div>
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
} 