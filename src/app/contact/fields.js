/*
  listClass: "flex flex-col gap-2", // Class for the `ul` element
  itemClass: "flex items-center space-x-2", // Class for each `li` element
  containerclass
  labelClass: "text-sm font-medium text-gray-700", // Class for the label
  inputClass 
*/

const fields = {
  first_name: {
    required: true,
    span: "md:col-span-6",
  },
  last_name: {
    required: true,
    span: "md:col-span-6",
  },
  email: {
    required: true,
    type: "email",
    email: true,
  },
  message: {
    label: "What Brought You Here",
    required: true,
    field: "textarea",
    rows: 4,
  },
  interest: {
    label: "I'm Interested In",
    required: true,
    field: "checkboxlist",
    // listClass: "grid grid-cols-1 xl:grid-cols-2 gap-4",
    options: [
      ["event", "Attending a Thaumazo Event"],
      ["joining", "Joining the Thaumazo Community"],
      ["volunteering", "Volunteering at Thaumazo"],
      ["partnering", "Partnering with Thaumazo on a project"],
      ["finding", "Finding out more about a specific project / initiative"],
      ["support", "Supporting Thaumazo's Work"],
      [
        "telling",
        "Telling Thaumazo about a Person, Organization, or Project of interest",
      ],
      ["opportunity", "Discussing an opportunity with Thaumazo"],
    ],
  },
  details: {
    label: "Any Further Details",
    field: "textarea",
    rows: 4,
  },
  project: {
    label: "I'd like to find out about / discuss",
    field: "checkboxlist",
    listClass: "grid grid-cols-1 lg:grid-cols-2 gap-4",
    options: [
      ["StoryTime", "StoryTime"],
      ["CommunityMycelium", "Community Mycelium"],
      ["CrisisForge", "CrisisForge"],
      ["MakeAChange", "Make a Change"],
      ["AIAndUsEvents", "AI & Us Events"],
      ["AIAndUsWorkingGroup", "AI & Us Working Group"],
      ["StewardsOfTomorrow", "Stewards of Tomorrow"],
      ["PersonalPathways", "Personal Pathways"],
    ],
  },
};

export default fields;
