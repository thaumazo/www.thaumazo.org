import loadMD from "@/utils/loadMD";
import Markdown from "@kenstack/components/Markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function Home() {
  const data = await loadMD("homepage/_index");
  if (!data) {
    notFound();
  }

  return (
    <div>
      <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto mt-14">
        <h1 className="text-center text-3xl md:text-5xl">{data.title}</h1>
        <Markdown className="markdown text-center" content={data.content} />

        <div className="text-center">
          <Button asChild variant="outline">
            <Link className="btn btn-primary" href="/contact" rel="noopener">
              Join the Movement to Transform Our World!{" "}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
