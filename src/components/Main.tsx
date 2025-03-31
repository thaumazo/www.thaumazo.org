// import { markdownify } from "@/lib/utils/textConverter";
import ImageFallback from "@/helpers/ImageFallback";
import Markdown from "@kenstack/components/Markdown";

export default function Main({
  title = "",
  content = "",
  // button = {
  //   enable: false,
  //   link: "",
  //   label: "",
  // },
  image = "",
}) {
  return (
    <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto mt-14">
      <h1 className="text-center text-4xl">{title}</h1>
      <Markdown className="markdown text-justify" content={content} />

      {image && (
        <div className="col-12">
          <ImageFallback
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
