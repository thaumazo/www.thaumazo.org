'use client';

import Link from 'next/link';
import MetaDates from '@kenstack/admin/MetaDates';

export default function ListItem({ path, item }) {
  return (
    <div className="flex flex-col">
      <Link className="text-lg" href={path}>
        {item.title}
      </Link>
      <MetaDates createdAt={item.createdAt} updatedAt={item.updatedAt} />
    </div>
  );
}
