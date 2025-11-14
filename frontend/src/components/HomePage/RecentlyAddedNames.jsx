'use client';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function RecentlyAddedNames() {
  const [recentNames, setRecentNames] = useState([]);

  useEffect(() => {
    // 🧪 Mock data — in real use, fetch from API/DB
    const mock = [
      { name: 'Ayat', gender: 'Girl', addedAt: Date.now() - 2 * 86400000 },   // 2 days ago
      { name: 'Zayyan', gender: 'Boy', addedAt: Date.now() - 5 * 3600000 },   // 5 hours ago
      { name: 'Meher', gender: 'Girl', addedAt: Date.now() - 3 * 86400000 },
      { name: 'Aariz', gender: 'Boy', addedAt: Date.now() - 6 * 3600000 },
      { name: 'Eshal', gender: 'Girl', addedAt: Date.now() - 1 * 86400000 },
      { name: 'Saad', gender: 'Boy', addedAt: Date.now() - 9 * 3600000 },
      { name: 'Hoorain', gender: 'Girl', addedAt: Date.now() - 12 * 3600000 },
      { name: 'Taha', gender: 'Boy', addedAt: Date.now() - 4 * 86400000 },
      { name: 'Aleena', gender: 'Girl', addedAt: Date.now() - 2 * 3600000 },
      { name: 'Nayel', gender: 'Boy', addedAt: Date.now() - 6 * 86400000 },
    ];
    setRecentNames(mock);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 mt-12">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        🆕 Recently Added Names
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
        {recentNames.map((item, index) => (
          <li
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm py-3 px-4 hover:bg-green-50 transition"
          >
            <span className="text-lg font-bold text-green-600">{item.name}</span>
            <div className="text-sm text-gray-500">{item.gender}</div>
            <div className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(new Date(item.addedAt), { addSuffix: true })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
