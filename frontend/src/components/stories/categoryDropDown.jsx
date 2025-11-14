'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import API from '../apiInstance/apiInstance';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function CategoryDropdown({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState('All');
  const [triggerWidth, setTriggerWidth] = useState(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    API.get('/stories/categories?limit=50')
      .then(res => {
        const raw = res.data || [];
        const formatted = raw.map(name => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        }));
        setCategories(formatted);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [active]);

  const handleSelect = (slug, name) => {
    setActive(name);
    onSelect(slug);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          className="flex items-center gap-1"
        >
          {active} <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-50 bg-white text-black shadow-lg"
        style={{ width: triggerWidth || 'auto' }}
      >
        <DropdownMenuItem
          onSelect={() => handleSelect(null, 'All')}
          className="text-black hover:bg-gray-100"
        >
          All Categories
        </DropdownMenuItem>
        {categories.map(cat => (
          <DropdownMenuItem
            key={cat.slug}
            onSelect={() => handleSelect(cat.slug, cat.name)}
            className="capitalize text-black hover:bg-gray-100"
          >
            {cat.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
