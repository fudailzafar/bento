require('dotenv').config({ path: '.env.local' });
try {
  const { createRouteHandler } = require('uploadthing/next');
  console.log("Success");
} catch(e) {
  console.error(e);
}
