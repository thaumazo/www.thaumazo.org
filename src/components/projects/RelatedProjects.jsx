import listMD from "@/utils/listMD";
import Link from "next/link";
export default async function RelatedProjects({ field, slug }) {
  const postData = await listMD("projects/posts");

  const list = postData
    .filter((p) => Array.isArray(p[field]) && p[field].includes(slug))
    .sort((a, b) => a.title.localeCompare(b.title));

  if (list.length === 0) {
    return;
  }

  return (
    <div>
      <h6>Projects</h6>
      <div className="grid lg:grid-cols-2 gap-4">
        {list.map((p) => (
          <Link key={p.slug} href={"/projects/" + p.slug}>
            {p.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
