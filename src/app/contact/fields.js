const fields = {
  first_name: {
    required: true,
    md: 6,
  },
  last_name: {
    required: true,
    md: 6,
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
    options: [
      ["event", "Attending a Thaumazo Event"],
      ["joining", "Joining the Thaumazo Community"],
      ["volunteering", "Volunteering at Thaumazo"],
      ["partnering", "Partnering with Thaumazo on a project"],
      ["finding", "Finding out more about a specific project / initiative"],
      ["support", "Supporting Thaumazo's Work"],
      ["telling", "Telling Thaumazo about a Person, Organization, or Project of interest"],
      ["opportunity", "Discussing an opportunity with Thaumazo"],
    ]
  },
  details: {
    label: "Any Further Details",
    field: "textarea",
    rows: 4,
  },
  project: {
    label: "I'd like to find out about / discuss",
    field: "checkboxlist",
    options: [
      ["StoryTime", "StoryTime"],
      ["CommunityMycelium", "Community Mycelium"],
      ["CrisisForge", "CrisisForge"],
      ["MakeAChange", "Make a Change"],
      ["AIAndUsEvents", "AI & Us Events"],
      ["AIAndUsWorkingGroup", "AI & Us Working Group"],
      ["StewardsOfTomorrow", "Stewards of Tomorrow"],
      ["PersonalPathways", "Personal Pathways"],
   ]
  },

};

export default fields;
