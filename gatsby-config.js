module.exports = {
  siteMetadata: {
    siteUrl: "https://www.ennathinna.com",
    title: "Enna Thinna",
    titleTemplate: "%s · What to cook | Indian recipe ideas",
    description:
      "When you just want someone to tell you what to cook, Enna thinna gives you no nonsense ideas to cook any Indian dishes.",
    image: "/src/images/logo.svg", // Path to your image you placed in the 'static' folder
    twitterUsername: "@_ajayv",
  },
  plugins: [
    "gatsby-plugin-gatsby-cloud",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-25187396-3",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-transformer-csv`,
    `gatsby-plugin-material-ui`,
    `gatsby-plugin-react-helmet`,
  ],
};
