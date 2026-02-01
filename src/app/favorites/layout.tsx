import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'Your saved movies. View and manage your favorite films.',
  openGraph: {
    title: 'My Favorites',
    description: 'Your saved movies. View and manage your favorite films.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Favorites',
    description: 'Your saved movies. View and manage your favorite films.',
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
