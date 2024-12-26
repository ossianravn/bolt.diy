import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { Link, useLoaderData } from '@remix-run/react';

export function Header() {
  const chat = useStore(chatStore);
  const data = useLoaderData<{ user?: { isAdmin: boolean } }>();
  
  console.log('Header data:', data);

  return (
    <header
      className={classNames('flex items-center p-5 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          <img src="/logo-light-styled.png" alt="logo" className="w-[90px] inline-block dark:hidden" />
          <img src="/logo-dark-styled.png" alt="logo" className="w-[90px] inline-block hidden dark:block" />
        </a>
      </div>
      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        {chat.started && <ClientOnly>{() => <ChatDescription />}</ClientOnly>}
      </span>
      <div className="flex items-center gap-4">
        {data?.user?.isAdmin && (
          <Link 
            to="/admin" 
            className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors"
          >
            <div className="i-ph:users-three text-xl" />
          </Link>
        )}
        <ClientOnly>
          {() => (
            <div className="mr-1">
              <HeaderActionButtons />
            </div>
          )}
        </ClientOnly>
      </div>
    </header>
  );
}
