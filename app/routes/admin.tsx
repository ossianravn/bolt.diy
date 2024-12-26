import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { getUser } from '~/lib/auth/auth.server';
import { createNewUser, listUsers, type User } from '~/lib/auth/schema';

type LoaderData = {
  users: User[];
};

type ActionData = 
  | { error: string }
  | { success: true };

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user?.isAdmin) {
    return redirect('/');
  }

  const users = await listUsers();
  return json<LoaderData>({ users });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  if (!user?.isAdmin) {
    return redirect('/');
  }

  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');
  const isAdmin = formData.get('isAdmin') === 'true';

  if (typeof username !== 'string' || typeof password !== 'string') {
    return json<ActionData>({ error: 'Invalid form submission' }, { status: 400 });
  }

  try {
    await createNewUser({ username, password, isAdmin });
    return json<ActionData>({ success: true });
  } catch (error) {
    return json<ActionData>({ error: 'Failed to create user' }, { status: 500 });
  }
}

export default function Admin() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-bolt-elements-background-depth-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-bolt-elements-background-depth-3 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-4">Current User Status</h2>
          <p className="text-bolt-elements-textSecondary">
            You are logged in as <span className="text-bolt-elements-textPrimary font-semibold">{users.find(u => u.isAdmin)?.username}</span>
            {users.find(u => u.isAdmin)?.isAdmin ? ' (Admin)' : ' (Regular User)'}
          </p>
        </div>

        <h1 className="text-3xl font-bold text-bolt-elements-textPrimary mb-8">User Management</h1>
        
        {/* Create User Form */}
        <div className="bg-bolt-elements-background-depth-3 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-4">Create New User</h2>
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-bolt-elements-textPrimary">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="mt-1 block w-full rounded-md border-0 bg-bolt-elements-background-depth-2 py-2 px-3 text-bolt-elements-textPrimary shadow-sm ring-1 ring-inset ring-bolt-elements-borderColor/50 focus:ring-2 focus:ring-inset focus:ring-bolt-elements-focus"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bolt-elements-textPrimary">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full rounded-md border-0 bg-bolt-elements-background-depth-2 py-2 px-3 text-bolt-elements-textPrimary shadow-sm ring-1 ring-inset ring-bolt-elements-borderColor/50 focus:ring-2 focus:ring-inset focus:ring-bolt-elements-focus"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                value="true"
                className="h-4 w-4 rounded border-bolt-elements-borderColor text-bolt-elements-focus focus:ring-bolt-elements-focus"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-bolt-elements-textPrimary">
                Admin User
              </label>
            </div>
            {actionData && 'error' in actionData && (
              <div className="text-red-500 text-sm">{actionData.error}</div>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bolt-elements-focus"
            >
              Create User
            </button>
          </Form>
        </div>

        {/* User List */}
        <div className="bg-bolt-elements-background-depth-3 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-bolt-elements-borderColor">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-bolt-elements-textSecondary uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-bolt-elements-textSecondary uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-bolt-elements-textSecondary uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bolt-elements-borderColor">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-bolt-elements-textPrimary">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-bolt-elements-textPrimary">
                      {user.isAdmin ? 'Admin' : 'User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-bolt-elements-textPrimary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 