export const productsData = {
  /* SAAME renders from components/SaameProduct.jsx and the shared screen data
     in components/saame-ui/apps.jsx, so only the fields the route and the
     metadata still read are kept here.

     What was removed was wrong, not just unused: metrics claiming "1,500+
     Students" and "1,500+ Active Parents" (neither figure appears anywhere in
     the product), an ecosystem entry titled "Parent App" describing visibility
     into "their child's academic journey" (it is the student's own app, signed
     into with a UUCMS ID, renamed in the product months ago), and a badge
     claiming the app is live on the Google Play Store, which nothing in the
     repository supports. */
  "saame": {
    title: "SAAME",
    image: "",
    hero: {
      headline: "The system a college runs on",
      subheadline:
        "Attendance, mentoring, reports and parent notifications in one place, with an app each for teaching staff, the office and students. Live at MLA Academy of Higher Learning, Bengaluru.",
    },
  },
  "studio": {
    title: "OZL Studio",
    image: "",
    hero: {
      headline: "OZL Studio",
      subheadline: "Where we experiment with next-generation interfaces, branding, and digital experiences.",
    },
    metrics: [],
    ecosystemApps: [],
    capabilities: [],
    ctaText: "Explore the Studio →"
  }
};
