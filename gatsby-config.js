module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "what to cook",
  },
  plugins: [
    "gatsby-plugin-gatsby-cloud",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "289914215",
      },
    },
  ],
};
