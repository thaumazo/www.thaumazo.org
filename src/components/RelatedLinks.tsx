import Link from "next/link";

export type RelatedLink = {
  slug: string;
  title: string;
  draft?: boolean;
};

export default function RelatedLinks({
  title,
  links,
  hrefPrefix,
}: {
  title: string;
  links: RelatedLink[];
  hrefPrefix: string;
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="text-left">
      <h6 className="mb-1 font-bold">{title}</h6>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => {
          const className = "rounded-full bg-gray-700 px-3 py-1 text-white";

          if (link.draft) {
            return (
              <span key={link.slug} className={className}>
                {link.title}
              </span>
            );
          }

          return (
            <Link
              key={link.slug}
              href={`${hrefPrefix}/${link.slug}`}
              className={className}
            >
              {link.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
