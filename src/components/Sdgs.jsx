export default function Sdgs({ sdgs }) {
  if (!sdgs || !Array.isArray(sdgs)) {
    return null;
  }

  const list = sdgs.map((s) => parseInt(s)).filter((s) => s >= 1 && s <= 17);

  if (list.length === 0) {
    return null;
  }

  return (
    <div>
      <h6 className="mb-1">Sustainable Development Goals</h6>
      <div className="flex flex-wrap gap-2">
        {sdgs.map((sdg) => (
          <a
            key={sdg}
            href={"https://sdgs.un.org/goals/goal" + sdg}
            target="_blank"
          >
            <img
              src={"/images/sdgs/" + sdg + ".svg"}
              width="20"
              height="20"
              alt={"SDG " + sdg}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
