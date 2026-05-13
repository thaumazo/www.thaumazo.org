import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  loadMeta,
  MarkdownEdit,
  PageEditor,
  PageEditorSettings,
  TextEdit,
} from "@kenstack/pageEditor";

const slug = "homepage";
const defaultValues = {
  title: "Connect, Create, Change",
  content: "",
};

export const generateMetadata = () => loadMeta(slug, { defaultValues });

export default async function Home() {
  return (
    <div>
      <main className="relative mx-auto mt-8 flex min-h-[560px] max-w-6xl items-center justify-center overflow-hidden px-4 md:mt-10 md:min-h-[640px]">
        <div
          className="absolute inset-0 bg-center bg-no-repeat opacity-65"
          style={{
            backgroundImage: "url('/images/backgrounds/home-sdg-mycelium.png')",
            backgroundSize: "min(116vw, 1200px) auto",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.84) 0%, rgba(255, 255, 255, 0.58) 38%, rgba(255, 255, 255, 0.12) 74%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col gap-4 px-4 text-center">
          <PageEditor slug={slug} defaultValues={defaultValues}>
            <PageEditorSettings />
            <TextEdit
              tag="h1"
              name="title"
              className="text-center text-3xl md:text-5xl"
            />
            <MarkdownEdit name="content" className="markdown text-center" />
          </PageEditor>

          <Button asChild>
            <Link className="mx-auto w-fit" href="/contact" rel="noopener">
              Join the Movement to Transform Our World!{" "}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
