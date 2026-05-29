import { AdminShortcutLink } from "@kenstack/admin/components/PageControls";
import { listProjects } from "@/modules/projects/queries";
import { ProjectCardList } from "./ProjectCards";

export default async function Posts() {
  const posts = await listProjects();

  return (
    <div className="relative mx-auto my-8 max-w-3xl px-4">
      <AdminShortcutLink href="/admin/projects" label="Edit Projects" />
      <ProjectCardList projects={posts} />
    </div>
  );
}
