import Markdown from "@kenstack/components/Markdown";

import Image from "next/image";
import InfoTags from "./InfoTags";
import DateRange from "./DateRange";
import Sdgs from "./Sdgs";
import Back from "./Back";
import Social from "@/components/Social";

import { type ImageResult } from "@/utils/getImageMeta";
import { type PostSchema } from "@/schemas/post";
// type WithProcessedImage<T> = Omit<T, "image" | "content"> & {
//   image: ImageResult | null;
//   content: string;
// };

type PageProps = {
  data: Omit<PostSchema, "image"> & { image: ImageResult };
  // data: {
  //   title: string;
  //   location?: string;
  //   start_date?: string;
  //   end_date?: string;
  //   image?: {
  //     width: number;
  //     height: number;
  //     alt: string;
  //     src: string;
  //   };
  //   content?: string;
  //   linkedin?: string;
  //   url?: string;
  //   sdgs?: number[];
  //   roles: string[];
  //   liaison?: string[];
  //   partners: string[];
  // };
  type?: string;
  defaultImage?: React.ReactNode;
  children?: React.ReactNode;
};

export default function Page({
  data,
  type = "",
  defaultImage = null,
  children,
}: PageProps) {
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <Back />
      </div>
      <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto my-8">
        <h1 className="text-left text-2xl"> {data.title} </h1>
        {(() => {
          if (!data.location && !data.start_date) {
            return null;
          }

          const classes = "px-3 rounded-full border-2 border-gray-800";

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
          title="Organizations"
          path="/organizations"
          references="organizations/posts"
          field={data.partners}
        />
        {children}
      </main>
    </>
  );
}
