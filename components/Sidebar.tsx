'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: 'https://www.figma.com/api/mcp/asset/9abc5cfa-c3e4-4b20-87f5-49fbce32572c',
      alt: 'Dashboard',
    },
    {
      href: '/campaigns',
      icon: 'https://www.figma.com/api/mcp/asset/a4bc4294-2efb-4ee3-96b1-e746479e8ea7',
      alt: 'Campaigns',
    },
    {
      href: '/tickets',
      icon: 'https://www.figma.com/api/mcp/asset/afcf01ae-5d28-499a-898a-18de08cf341f',
      alt: 'Tickets',
    },
    {
      href: '/cart',
      icon: 'https://www.figma.com/api/mcp/asset/ffe8a6f5-b0ab-495a-8333-4c698119db5e',
      alt: 'Shopping Cart',
    },
    {
      href: '/users',
      icon: 'https://www.figma.com/api/mcp/asset/7e021301-d7f9-4e7f-9e22-199707c7ff63',
      alt: 'Users',
    },
    {
      href: '/documents',
      icon: 'https://www.figma.com/api/mcp/asset/a35d18b9-ae4d-463e-942a-308986873912',
      alt: 'Documents',
    },
  ];

  return (
    <aside className="w-16 bg-white border-r border-[rgba(0,0,0,0.1)] flex flex-col items-center p-3 gap-6">
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-10 h-10 rounded-lg flex items-center justify-center p-2 transition-colors ${
                isActive
                  ? 'bg-[#4c65f0]'
                  : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={item.icon}
                alt={item.alt}
                className="w-6 h-6"
                style={{
                  filter: isActive ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%)'
                }}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
