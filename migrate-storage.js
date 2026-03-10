const fs = require('fs');
const path = require('path');

const uploadRoutes = [
  { file: 'app/api/profile-image/upload/route.ts', folder: 'profile-images', hasProfileUpdate: true },
  { file: 'app/api/project-image/upload/route.ts', folder: 'project-images', hasProfileUpdate: false },
  { file: 'app/api/company-logo/upload/route.ts', folder: 'company-logos', hasProfileUpdate: false },
  { file: 'app/api/education-logo/upload/route.ts', folder: 'education-logos', hasProfileUpdate: false },
];

const deleteRoutes = [
  { file: 'app/api/profile-image/delete/route.ts', hasProfileUpdate: true },
  { file: 'app/api/project-image/delete/route.ts', hasProfileUpdate: false },
  { file: 'app/api/company-logo/delete/route.ts', hasProfileUpdate: false },
  { file: 'app/api/education-logo/delete/route.ts', hasProfileUpdate: false },
];

function processUploadRoute({ file, folder, hasProfileUpdate }) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace everything from "// Convert file to base64" up to "return NextResponse.json({ imageUrl });"
  const regex = /\/\/ Convert file to base64[\s\S]*?(?=\/\/ Update user profile|return NextResponse\.json\(\{ imageUrl \}\);)/;
  
  const replacement = `
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = \`\${user.id}-\${Date.now()}.\${fileExt}\`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(\`${folder}/\${fileName}\`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload failed:', error);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(\`${folder}/\${fileName}\`);

    const imageUrl = publicUrlData.publicUrl;

    `;

  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated upload route: ${file}`);
  } else {
    console.log(`Failed to match regex in ${file}`);
  }
}

function processDeleteRoute({ file, hasProfileUpdate }) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex to extract delete logic
  const regex = /const publicId =[\s\S]*?(?=\/\/ Update user profile|return NextResponse\.json\(\{ success: true \}\);)/;

  const replacement = `
    // Extract file path from URL
    let filePathToDelete = imageUrl;
    try {
      const url = new URL(imageUrl);
      const parts = url.pathname.split('/images/');
      if (parts.length > 1) {
        filePathToDelete = parts[1];
      }
    } catch (e) {
      console.error('Failed to parse imageUrl', e);
    }

    const { error } = await supabase.storage
      .from('images')
      .remove([filePathToDelete]);

    if (error) {
      console.error('Supabase delete failed:', error);
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    `;

  if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated delete route: ${file}`);
  } else {
    console.log(`Failed to match regex in ${file}`);
  }
}

uploadRoutes.forEach(processUploadRoute);
deleteRoutes.forEach(processDeleteRoute);
