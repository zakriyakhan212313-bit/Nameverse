import NameClient from './ClientComponent';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

async function getNameData(religion, name) {
  try {
    const response = await fetch(`${API_BASE}/names/${religion}/${name}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching name data:', error);
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { religion, lang, slug } = params;
  const data = await getNameData(religion, slug);

  return {
    title: `${data.name} - ${religion} ${lang} Name Meaning`,
    description: data.short_meaning,
    keywords: [...(data.themes || []), data.name, `${religion} names`, `${lang} names`],
  };
}

export default async function NamePage({ params }) {
  const { religion, lang, slug } = params;
  const data = await getNameData(religion, slug);

  return <NameClient data={data} initialLanguage={lang} />;
}
