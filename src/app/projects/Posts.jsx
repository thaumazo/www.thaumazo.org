import listMD from "@/utils/listMD";
import Link from "next/link";

export default async function Posts() {
  let postData = await listMD("projects/posts");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl mx-auto my-8">
      {posts.map(({ title, slug }) => {
        const link = "/projects/" + slug;
        return (
          <div key={slug} className="flex justify-left row">
            <Link className="flex justify-left" href={link}>
              {title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
