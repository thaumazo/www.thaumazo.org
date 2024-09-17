import { markdownify } from "@/lib/utils/textConverter";
import Link from "next/link";
import ImageFallback from "@/helpers/ImageFallback";

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
    <main className="pt-14">
      <div className="container">
        <div className="row justify-center">
          <div className="lg:col-7 md:col-9 mb-8 text-center">
            <h1
              className="mb-4 text-h3 lg:text-h1"
              dangerouslySetInnerHTML={markdownify(title)}
            />
            <div
              className="main-text mb-4"
              dangerouslySetInnerHTML={markdownify(content ?? "")}
            />
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
          </div>
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
        </div>
      </div>
    </main>
  );
}
