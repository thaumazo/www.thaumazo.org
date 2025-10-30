import Image from "next/image";
import Markdown from "@kenstack/components/Markdown";
import { type ImageResult } from "@/utils/getImageMeta";

export default function Main({
  title,
  content,
  image,
}: {
  title: string;
  content: string;
  image: null | ImageResult;
}) {
  return (
    <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto mt-14">
      <h1 className="text-center text-4xl">{title}</h1>
      <Markdown className="markdown text-justify" content={content} />

      {image && (
        <div className="col-12">
          <Image
            src={image}
            className="mx-auto"
            width="800"
            height="420"
            alt="banner image"
            priority
          />
        </div>
      )}
    </main>
  );
}
