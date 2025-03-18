// import ImageFallback from "@/helpers/ImageFallback";
// import { getListPage } from "@/lib/contentParser";
// import { markdownify } from "@/lib/utils/textConverter";
// import CallToAction from "@/partials/CallToAction";
import SeoMeta from "@/partials/SeoMeta";
// import Testimonials from "@/partials/Testimonials";
// import { FaCheck } from "react-icons/fa";

import loadMD from "@/utils/loadMD";
import Markdown from "@kenstack/components/Markdown";
import Link from "next/link";

export default async function Home() {
  const { banner } = await loadMD("homepage/_index");

  return (
    <>
      <SeoMeta />
      <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto mt-14">
        <h1 className="text-center text-3xl md:text-5xl">{banner.title}</h1>
        <Markdown className="markdown text-center" content={banner.content} />

        <div className="text-center">
          <Link
            className="btn btn-primary"
            href={banner.button.link}
            rel="noopener"
          >
            {banner.button.label}
          </Link>
        </div>
      </main>

      {/*
      {features.map((feature, index: number) => (
        <section
          key={index}
          className={`section-sm ${index % 2 === 0 && "bg-gradient"}`}
        >
          <div className="container">
            <div className="row items-center justify-between">
              <div
                className={`mb:md-0 mb-6 md:col-5 ${
                  index % 2 !== 0 && "md:order-2"
                }`}
              >
                <ImageFallback
                  src={feature.image}
                  height={480}
                  width={520}
                  alt={feature.title}
                />
              </div>
              <div
                className={`md:col-7 lg:col-6 ${
                  index % 2 !== 0 && "md:order-1"
                }`}
              >
                <h2
                  className="mb-4"
                  dangerouslySetInnerHTML={markdownify(feature.title)}
                />
                <p
                  className="mb-8 text-lg"
                  dangerouslySetInnerHTML={markdownify(feature.content)}
                />
                <ul>
                  {feature.bulletpoints.map((bullet: string) => (
                    <li className="relative mb-4 pl-6" key={bullet}>
                      <FaCheck className={"absolute left-0 top-1.5"} />
                      <span dangerouslySetInnerHTML={markdownify(bullet)} />
                    </li>
                  ))}
                </ul>
                {feature.button.enable && (
                  <Link
                    className="btn btn-primary mt-5"
                    href={feature.button.link}
                  >
                    {feature.button.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
      /*}
      {/*
      <Testimonials data={testimonial} />
    */}
      {/*
      <CallToAction data={callToAction} />
    */}
    </>
  );
}
