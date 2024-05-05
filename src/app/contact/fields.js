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
  details: {
    label: "Any Further Details",
    required: true,
    field: "textarea",
    rows: 4,
  },
};

export default fields;
