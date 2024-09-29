import SeoMeta from "@/partials/SeoMeta";

import Markdown from "@kenstack/components/Markdown";

import UserIcon from "@heroicons/react/24/outline/UserCircleIcon";

import Image from "next/image";
import InfoTags from "./InfoTags";
import Back from "./Back";
import Social from "@/components/Social";

export default function Page({ data, defaultImage = null }) {
  return (
    <>
      <SeoMeta {...data} />
      <div className="max-w-3xl mx-auto">
        <Back />
      </div>
      <main className="flex flex-col gap-4 max-w-3xl px-4 mx-auto my-8">
        <h1 className="text-center"> {data.title} </h1>
        {data.location && (
          <div className="-mt-4 text-center">{data.location}</div>
        )}

        {data.image ? (
          <div className="flex justify-center">
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
      </main>
    </>
  );
}
