// svgr.config.js
module.exports = {
  jsx: true, // Ensures output is JSX
  svgProps: {
    width: "24",
    height: "24",
    fill: "currentColor",
  },
  svgoConfig: {
    plugins: [
      {
        name: "removeAttrs",
        params: { attrs: "(class|className|id|data-testid)" },
      },
      {
        name: "removeUselessDefs", // Cleans up defs that aren't needed
      },
      {
        name: "removeEmptyContainers", // Removes any remaining empty containers, which may be empty <div>s
      },
      {
        name: "removeUnknownsAndDefaults", // Removes any elements that don’t belong in SVG (like <div>)
        params: { keepDataAttrs: false },
      },
    ],
  },
};
