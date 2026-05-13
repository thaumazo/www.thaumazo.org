import baseTransformations from "@kenstack/forms/ImageField/transformations";

const transformations = {
  ...baseTransformations,
  thumbnail: "w_360,h_250,c_fill,g_auto,f_webp",
};

export default transformations;
