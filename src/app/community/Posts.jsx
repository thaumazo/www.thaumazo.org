import listMD from "@/utils/listMD";
import Link from "next/link";
import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";

export default async function Posts() {
  let postData = await listMD("community/people");
  const posts = postData.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="container">
      <div className="row justify-center">
        <div className="lg:col-7 md:col-9  grid grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(({ title, slug }) => {
            const link = "/community/" + slug;
            return (
              <div key={slug} className="flex justify-center row">
                <Link
                  className="flex items-center justify-center w-32 h-32 bg-gray-200 dark:bg-gray-800"
                  href={link}
                >
                  <UserIcon className="w-16 h-16" />
                </Link>
                <Link className="flex justify-center" href={link}>
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
