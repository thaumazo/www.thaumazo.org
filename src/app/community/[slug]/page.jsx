import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Post from "@/components/Post";

export default async function Page({ params: { slug } }) {
  const defaultImage = (
    <div className="inline-flex items-center justify-center w-48 h-48 mb-4 bg-gray-200 dark:bg-gray-800">
      <UserIcon className="w-24 h-24" />
    </div>
  );

  return <Post file={"community/people/" + slug} defaultImage={defaultImage} />;
}
