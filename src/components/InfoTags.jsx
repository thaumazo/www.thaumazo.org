import loadMD from "@/utils/loadMD";
import startCase from "lodash-es/startCase";
import Link from "next/link";

export default async function InfoTags({title, references = null, path = "", field = []}) {
  if (!field || !Array.isArray(field) || field.length === 0) {
    return null;
  }

  const tags = [];
  for (let name of field) {
    let data;
    if (references) {
      data = await loadMD(references + "/" + name);
    }
    const classes = "px-3 py-1 rounded-full text-white bg-gray-700";
    let tag = "";
    if (data) {
      tag = (
        <Link href={path + "/" + name} className={classes}>
          {data.title}        
        </Link>
      );
    } else {
      tag = <div className={classes}>{startCase(name)}</div>;
    }

    tags.push(tag);
  }
  


  return (
    <div className="text-left">
      <h3 className="px-3 mb-1 text-h6">{ title }</h3>
      <div className="flex flex-wrap gap-2">
      {tags}
      </div>
    </div>
  );
}
