import listMD from "@/utils/listMD";
import Link from "next/link";

export default async function Posts() {
  let postData = await listMD("partners/posts");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="container">
      <div className="row justify-center">
        <div className="lg:col-7 md:col-9 flex row gap-4">
          {posts.map(({ title, slug }) => {
            const link = "/partners/" + slug;
            return (
              <div key={slug} className="flex justify-left row">
                <Link className="flex justify-left" href={link}>
                  {title}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
