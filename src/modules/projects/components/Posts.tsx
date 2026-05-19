import { listProjects } from "@/modules/projects/queries";
import { ProjectCardList } from "./ProjectCards";

export default async function Posts() {
  const posts = await listProjects();

  return (
    <div className="mx-auto my-8 max-w-3xl px-4">
      <ProjectCardList projects={posts} />
    </div>
  );
}
