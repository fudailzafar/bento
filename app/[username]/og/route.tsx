import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getUserData } from '../utils';

async function loadGoogleFont(font: string, text: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split('/')[1];
    const { resume, userData } = await getUserData(username);
    const name = resume?.resumeData?.header?.name;
    const role = resume?.resumeData?.header?.shortAbout;
    const profileImageUrl = userData?.image;

    // Load Inter font for the text that will be displayed
    const nameText = name || '';
    const roleText = role || '';

    const interBoldData = await loadGoogleFont('Inter', nameText, 700);
    const interSemiBoldData = await loadGoogleFont('Inter', roleText, 400);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '80px',
            position: 'relative',
            fontFamily: 'Inter',
          }}
        >
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginTop: '40px',
              height: '480px',
            }}
          >
            {/* Left side - Text content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '60%',
                paddingRight: '40px',
              }}
            >
              <h1
                style={{
                  fontSize: '80px',
                  fontWeight: 700,
                  margin: '0 0 20px 0',
                  color: '#222',
                  lineHeight: 1.1,
                  fontFamily: 'Inter',
                }}
              >
                {name}
              </h1>
              <p
                style={{
                  fontSize: '32px',
                  fontWeight: 400,
                  margin: 0,
                  color: '#444',
                  lineHeight: 1.4,
                  fontFamily: 'Inter',
                }}
              >
                {role && role?.length > 90
                  ? `${role?.substring(0, 90)}...`
                  : role}
              </p>
            </div>

            {/* Right side - Profile image */}
            <div
              style={{
                width: '40%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={
                  profileImageUrl ||
                  'https://portfoliofy.me/user/placeholder.svg'
                }
                alt="Profile"
                style={{
                  width: '360px',
                  height: '360px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interBoldData,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'Inter',
            data: interSemiBoldData,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
