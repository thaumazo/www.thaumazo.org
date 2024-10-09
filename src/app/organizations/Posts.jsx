import listMD from "@/utils/listMD";
import Link from "next/link";

export default async function Posts() {
  let postData = await listMD("organizations/posts");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto my-8">
      {posts.map(({ title, slug }) => {
        const link = "/organizations/" + slug;
        return (
          <div key={slug} className="flex justify-center row">
            <Link className="flex justify-center" href={link}>
              {title}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
