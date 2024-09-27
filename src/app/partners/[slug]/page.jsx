import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Post from "@/components/Post";

import loadMD from "@/utils/loadMD";
import { notFound } from "next/navigation";

export default async function Page({ params: { slug } }) {
  const data = await loadMD("partners/posts/" + slug);
  if (data === false) {
    notFound();
  }

  return <Post data={data} />;
}
