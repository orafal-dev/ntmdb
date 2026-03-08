'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Film, Tv } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Movies', icon: Film },
  { href: '/tv', label: 'TV Shows', icon: Tv },
] as const;

const AppNav = () => {
  const pathname = usePathname();
  const isMovies = pathname === '/';
  const isTv = pathname.startsWith('/tv');

  return (
    <nav
      className="flex items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground"
      role="tablist"
      aria-label="Switch between Movies and TV Shows"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = (href === '/' && isMovies) || (href === '/tv' && isTv);
        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
              'hover:bg-background hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive && 'bg-background text-foreground shadow-sm'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label === 'Movies' ? 'Movies' : 'TV'}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default AppNav;
