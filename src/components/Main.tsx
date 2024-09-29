// import { markdownify } from "@/lib/utils/textConverter";
import Link from "next/link";
import ImageFallback from "@/helpers/ImageFallback";
import Markdown from "@kenstack/components/Markdown";

export default function Main({
  title = "",
  content = "",
  button = {
    enable: false,
    link: "",
    label: "",
  },
  image = "",
}) {
  return (
    <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto mt-14">
      <h1 className="text-center text-h3 lg:text-h1">{title}</h1>
      <Markdown className="main-text text-justify" content={content} />
      {button!.enable && (
        <Link
          className="mx-4 btn btn-primary"
          href={button!.link}
          target={button!.link.startsWith("http") ? "_blank" : "_self"}
          rel="noopener"
        >
          {button!.label}
        </Link>
      )}
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
