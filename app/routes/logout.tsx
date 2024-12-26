import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { logout } from '~/lib/auth/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
} 