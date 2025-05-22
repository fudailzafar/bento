import PreviewClient from './client';
import {
  createUsernameLookup,
  getResume,
  getUsernameById,
  storeResume,
} from '@/lib/server/redis-actions';
import { generateResumeObject } from '@/lib/server/ai/generate-resume-object-gemini';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import LoadingFallback from '@/components/loading-fallback';
import { MAX_USERNAME_LENGTH } from '@/lib/config';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function LLMProcessing({ userId }: { userId: string }) {
  let resume = await getResume(userId);
  const session = await getServerSession(authOptions);

  if (!resume?.fileContent || !resume.file) redirect('/upload');

  let messageTip: string | undefined;

  if (!resume.resumeData) {
    let resumeObject = await generateResumeObject(resume?.fileContent);
    console.log(resumeObject);
    if (!resumeObject) {
      messageTip =
        "We couldn't extract data from your PDF. Please edit your resume manually.";
      resumeObject = {
        header: {
          name: session.user.name || session.user.email || 'user',
          shortAbout: 'This is a short description of your profile',
          location: 'Your City, Your Country',
          contacts: {
            email: 'your@email.com',
            phone: '+1 234 567 890',
            website: 'your-portfolio.com',
            linkedin: 'yourusername',
            github: 'yourusername',
            twitter: 'yourusername',
          },
          skills: [
            'Add your skills here',
            'More skills here',
            'And even more skills here lol',
          ],
        },
        summary: 'You should add a summary here',
        workExperience: [
          {
            company: 'Your Company',
            location: 'Your company location',
            contract: '',
            role: 'Your Job Title',
            start: 'Jan 2023',
            end: '',
            description:
              'Worked on exciting projects that improved product usability, performance, and customer happiness.',
          },
          {
            company: 'Another Company',
            role: 'Previous Job Title',
            location: 'Your company location',
            contract: '',
            start: 'Jun 2021',
            end: 'Dec 2022',
            description:
              'Contributed to feature development, collaborated with teammates, and helped ship products that matter.',
          },
        ],
        education: [
          {
            school: 'Your University',
            degree: 'Bachelor of Technology in Computer Science',
            start: '2019',
            end: '2023',
          },
          {
            school: 'Your High School',
            degree: 'High School Diploma',
            start: '2017',
            end: '2019',
          },
        ],
        contact:
          'Write some text here... maybe a catchy phrase for people to contact you? 👀',
        projects: [
          {
            title: 'Cool Project 1',
            githubLink: 'https://github.com/yourusername/project1',
            description:
              'A fun side project that shows off your creativity and technical skills.',
          },
          {
            title: 'Cool Project 2',
            githubLink: 'https://github.com/yourusername/project2',
            description:
              'Another project that solves a real problem and demonstrates your ability to deliver.',
          },
        ],
      };
    }

    await storeResume(userId, {
      ...resume,
      resumeData: resumeObject,
    });
    resume.resumeData = resumeObject;
  }

  // we set the username only if it wasn't already set for this user meaning it's new user
  const foundUsername = await getUsernameById(userId);

  const saltLength = 6;

  const createSalt = () =>
    Math.random()
      .toString(36)
      .substring(2, 2 + saltLength);

  if (!foundUsername) {
    const username =
      (
        (resume.resumeData?.header?.name || 'user')
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') + '-'
      ).slice(0, MAX_USERNAME_LENGTH - saltLength) + createSalt();

    const creation = await createUsernameLookup({
      userId,
      username,
    });

    if (!creation) redirect('/upload?error=usernameCreationFailed');
  }

  return <PreviewClient messageTip={messageTip} />;
}

export default async function Preview() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const userId = session.user.email;

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <LLMProcessing userId={userId} />
      </Suspense>
    </>
  );
}

export const maxDuration = 40;
