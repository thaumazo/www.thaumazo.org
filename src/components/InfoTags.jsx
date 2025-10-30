import loadMD from "@/utils/loadMD";
import startCase from "lodash-es/startCase";
import Link from "next/link";
import { postSchema } from "@/schemas/post";

export default async function InfoTags({
  title,
  references = null,
  path = "",
  field = [],
}) {
  if (!field || !Array.isArray(field) || field.length === 0) {
    return null;
  }

  const tags = [];
  for (let name of field) {
    let data;
    if (references) {
      data = await loadMD(references + "/" + name, postSchema);
    }
    const classes = "px-3 py-1 rounded-full text-white bg-gray-700";
    let tag = "";
    if (data) {
      tag = (
        <Link key={name} href={path + "/" + name} className={classes}>
          {data.title}
        </Link>
      );
    } else {
      tag = (
        <div key={name} className={classes}>
          {startCase(name)}
        </div>
      );
    }

    tags.push(tag);
  }

  return (
    <div className="text-left">
      <h6 className="mb-1 font-bold">{title}</h6>
      <div className="flex flex-wrap gap-2">{tags}</div>
    </div>
  );
}
