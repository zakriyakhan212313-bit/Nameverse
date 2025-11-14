import NameDetails from './ClientSide'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'

async function getNameData(religion, name) {
  try {
    const res = await fetch(`${API_BASE}/names/${religion}/${name}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch name data')
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error fetching name data:', error)
    return null
  }
}

export default async function NamePage({ params }) {
  const { religion, lang } = params
  const nameData = await getNameData(religion, lang)

  if (!nameData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Name Not Found</h1>
          <p className="text-gray-600">
            Sorry, we couldn't find the name you're looking for.
          </p>
        </div>
      </div>
    )
  }

  return <NameDetails nameData={nameData} religion={religion} />
}

export async function generateMetadata({ params }) {
  const { religion, lang } = params
  const nameData = await getNameData(religion, lang)

  if (!nameData) {
    return { title: 'Name Not Found' }
  }

  return {
    title: `${nameData.name} - ${religion.charAt(0).toUpperCase() + religion.slice(1)} Name Meaning`,
    description: nameData.short_meaning || `Discover the meaning of ${nameData.name} in ${religion} tradition`,
  }
}
