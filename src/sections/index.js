// Section registry. To add a section:
//   1. create src/sections/<name>.js exporting { id, nav, render(data) }
//   2. (optional) add its styles to src/styles/sections/<name>.css and list it in src/styles/index.json
//   3. add it below, in page order. Nav, sitemap anchors and scroll-spy follow automatically.
module.exports = [
  require('./hero'),
  require('./about'),
  require('./experience'),
  require('./projects'),
  require('./skills'),
  require('./education'),
  require('./contact')
];
