import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getUserData } from '../utils';

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split('/')[1];

    const { resume, userData } = await getUserData(username);

    // Get data from resume
    const name = resume?.resumeData?.header?.name;
    const role = resume?.resumeData?.header?.shortAbout;

    // Use profile image from stored user data
    const profileImageUrl = userData?.image;

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
            fontFamily: 'Inter, sans-serif',
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
                  fontWeight: 900,
                  margin: '0 0 20px 0',
                  color: '#222',
                  lineHeight: 1.1,
                }}
              >
                {name}
              </h1>
              <p
                style={{
                  fontSize: '32px',
                  color: '#444',
                  margin: 0,
                  lineHeight: 1.4,
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
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
