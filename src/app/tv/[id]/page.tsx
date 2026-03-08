import type { Metadata } from 'next';
import TvShowDetail from '@/components/TvShowDetail';
import { getTvShowWithCredits, getTvShowDetails } from '@/lib/server-actions';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 86400;

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const seriesId = parseInt(id, 10);
  if (Number.isNaN(seriesId)) return { title: 'TV Show' };
  const show = await getTvShowDetails(seriesId);
  if (!show?.name) return { title: 'TV Show' };
  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : null;
  const title = year != null ? `${show.name} (${year})` : show.name;
  const description =
    show.overview?.slice(0, 160).trim().replace(/\s+/g, ' ') +
      (show.overview && show.overview.length > 160 ? '…' : '') ||
    `TV Show: ${show.name}`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
};

export default async function TvShowPage({ params }: PageProps) {
  const { id } = await params;
  const seriesId = parseInt(id, 10);

  if (Number.isNaN(seriesId)) {
    notFound();
  }

  const data = await getTvShowWithCredits(seriesId);
  const show = data.show as Parameters<typeof TvShowDetail>[0]['show'];

  return (
    <TvShowDetail
      show={show}
      credits={data.credits}
      watchProviders={data.watchProviders}
      videos={data.videos}
    />
  );
}
