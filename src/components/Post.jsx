import SeoMeta from "@/partials/SeoMeta";

import Markdown from "@kenstack/components/Markdown";

import Image from "next/image";
import InfoTags from "./InfoTags";
import DateRange from "./DateRange";
import Sdgs from "./Sdgs";
import Back from "./Back";
import Social from "@/components/Social";

export default function Page({
  data,
  type = "",
  defaultImage = null,
  children,
}) {
  return (
    <>
      <SeoMeta {...data} />
      <div className="max-w-3xl mx-auto">
        <Back />
      </div>
      <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto my-8">
        <h1 className="text-left"> {data.title} </h1>
        {(() => {
          if (!data.location && !data.start_date) {
            return null;
          }

          const classes =
            "px-3 rounded-full border-2 border-gray-800 dark:border-gray-200";

          return (
            <div className="flex flex-flow gap-4">
              {data.location && <div className={classes}>{data.location}</div>}
              {data.start_date && (
                <div className={classes}>
                  <DateRange
                    start_date={data.start_date}
                    end_date={data.end_date}
                  />
                </div>
              )}
            </div>
          );
        })()}

        {data.image ? (
          <div
            className={
              "flex justify-center bg-gray-100 dark:bg-gray-800" +
              (type === "project" ? " -order-1" : "")
            }
          >
            <Image
              {...data.image}
              alt={data.image.alt || ""}
              className="max-w-full max-h-full"
              priority
            />
          </div>
        ) : (
          defaultImage
        )}
        <Markdown className="markdown text-justify" content={data.content} />

        {data.linkedin && (
          <div className="flex justify-end">
            <Social linkedin={data.linkedin} />
          </div>
        )}

        <Sdgs sdgs={data.sdgs} />
        {data.url && (
          <div className="text-left">
            <h6>Url</h6>
            <a href={data.url}>{data.url}</a>
          </div>
        )}

        <InfoTags title="Roles" field={data.roles} />

        <InfoTags
          title="Liaisons"
          path="/community"
          references="community/people"
          field={data.liaison}
        />

        <InfoTags
          title="Partners"
          path="/partners"
          references="partners/posts"
          field={data.partners}
        />
        {children}
      </main>
    </>
  );
}
