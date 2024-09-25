import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Post from "@/components/Post";

export default async function Page({ params: { slug } }) {
  return <Post file={"partners/posts/" + slug} />;
}
