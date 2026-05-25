const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/api/profile-image/delete/route.ts',
  'app/api/profile-image/upload/route.ts',
  'app/api/project-image/delete/route.ts',
  'app/api/project-image/upload/route.ts',
  'app/api/company-logo/delete/route.ts',
  'app/api/company-logo/upload/route.ts',
  'app/api/education-logo/delete/route.ts',
  'app/api/education-logo/upload/route.ts',
];

filesToFix.forEach(relPath => {
  const file = path.join(__dirname, relPath);
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(/id:\s*user\.email,/g, "id: user.id,");
  fs.writeFileSync(file, content, 'utf-8');
});
console.log('Fixed ids');
