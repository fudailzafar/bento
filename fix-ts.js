const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/(auth)/reset-password/confirm/page.tsx',
  'app/api/auth/claim-username/route.ts',
  'app/api/auth/signup/route.ts',
  'app/api/company-logo/delete/route.ts',
  'app/api/company-logo/upload/route.ts',
  'app/api/education-logo/delete/route.ts',
  'app/api/education-logo/upload/route.ts',
  'app/api/profile-image/delete/route.ts',
  'app/api/profile-image/upload/route.ts',
  'app/api/project-image/delete/route.ts',
  'app/api/project-image/upload/route.ts',
  'app/api/resume/route.ts',
  'app/api/user/auth-info/route.ts',
  'app/api/user/profile/route.ts',
  'app/api/user/update-email/route.ts',
  'app/api/user/update-password/route.ts',
  'app/api/username/route.ts'
];

filesToFix.forEach(relPath => {
  const file = path.join(__dirname, relPath);
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  // Remove the nextauth import
  content = content.replace(/import\s*{\s*authOptions\s*}\s*from\s*['"]@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route['"];?\n?/g, "");
  content = content.replace(/import\s*{\s*authOptions\s*}\s*from\s*['"]\.\.\/\[\.\.\.nextauth\]\/route['"];?\n?/g, "");
  
  // Replace leftover session variables with user
  content = content.replace(/session\?.user/g, "user");
  content = content.replace(/session\.user/g, "user");
  content = content.replace(/session\?/g, "user?");

  fs.writeFileSync(file, content, 'utf-8');
});
console.log('Fixed imports and session variables');
