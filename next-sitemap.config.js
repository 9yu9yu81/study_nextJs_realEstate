/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL,
  generateRobotsTxt: true, // (optional)
  // ...other options
}
