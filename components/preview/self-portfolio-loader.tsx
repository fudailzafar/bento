'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  createUsernameLookup,
  getResume,
  getUsernameById,
  storeResume,
  generateResumeObject,
} from '@/lib/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { MAX_USERNAME_LENGTH } from '@/lib';
import { LoadingFallback } from '@/components/utils';
import PreviewWrapper from './preview-wrapper';

// Function to migrate old section title data to new format
function migrateSectionTitles(resumeData: any) {
  if (!resumeData) return resumeData;

  const migratedData = { ...resumeData };
  const sectionTitles: Record<string, string> = {};

  // Find all sectionTitle-* keys and extract them
  Object.keys(migratedData).forEach(key => {
    if (key.startsWith('sectionTitle-') && typeof migratedData[key] === 'string') {
      sectionTitles[key] = migratedData[key];
      delete migratedData[key];
    }
  });

  // Add sectionTitles if any were found
  if (Object.keys(sectionTitles).length > 0) {
    migratedData.sectionTitles = { ...migratedData.sectionTitles, ...sectionTitles };
  }

  // Remove 'sectionTitles' and 'education' from sectionOrder if they exist
  if (migratedData.sectionOrder && Array.isArray(migratedData.sectionOrder)) {
    migratedData.sectionOrder = migratedData.sectionOrder.filter(
      (section: string) => section !== 'sectionTitles' && section !== 'education'
    );
  }

  // Migrate education array to individual educations
  if (migratedData.education && Array.isArray(migratedData.education)) {
    const educations: Record<string, any> = {};
    migratedData.education.forEach((edu: any, index: number) => {
      const eduId = `education-${index + 1}`;
      educations[eduId] = edu;
      // Add to sectionOrder if not already present
      if (!migratedData.sectionOrder.includes(eduId)) {
        migratedData.sectionOrder.push(eduId);
      }
    });
    migratedData.educations = educations;
    delete migratedData.education;
  }

  return migratedData;
}

async function InitializeAndPreview({ userId }: { userId: string }) {
  const resume = await getResume(userId);
  const session = await getServerSession(authOptions);

  let messageTip: string | undefined;

  // Migrate existing resume data if it has old section title format
  if (resume?.resumeData) {
    const migratedResumeData = migrateSectionTitles(resume.resumeData);
    if (migratedResumeData !== resume.resumeData) {
      // Save the migrated data
      await storeResume(userId, {
        ...resume,
        resumeData: migratedResumeData,
      });
      resume.resumeData = migratedResumeData;
    }
  }

  // If no resume exists at all, create a default one
  if (!resume) {
    const defaultResumeData = {
      header: {
        name: session?.user?.name || session?.user?.email || 'user',
        shortAbout: 'A one-liner on who you are, what you do',
        location: 'Your City, Your Country',
        contacts: {
          email: session?.user?.email || 'your@email.com',
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
      summary:
        'A crisp summary of your past experience, cool projects, and mastered skills...',
      workExperience: [
        {
          company: 'Your Company',
          location: 'Your company location',
          link: '',
          contract: '',
          title: 'Your Job Title',
          start: 'Jan 2023',
          end: '',
          description:
            'Worked on exciting projects that improved product usability, performance, and customer happiness.',
        },
        {
          company: 'Another Company',
          title: 'Previous Job Title',
          location: 'Your company location',
          link: '',
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
          degree: 'Bachelor of Science in Sleeping',
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
      contact: 'Write a catchy phrase here for people to contact you... 👀',
      projects: [
        {
          title: 'Cool Project 1',
          githubLink: 'https://github.com/yourusername/project1',
          liveLink: '',
          start: '',
          end: null,
          description:
            'A fun side project that shows off your creativity and technical skills.',
        },
        {
          title: 'Cool Project 2',
          githubLink: 'https://github.com/yourusername/project2',
          liveLink: '',
          start: '',
          end: null,
          description:
            'Another project that solves a real problem and demonstrates your ability to deliver.',
        },
      ],
      sectionTitles: {},
      educations: {},
      sectionOrder: [
        'summary',
        'workExperience',
        'education',
        'skills',
        'projects',
        'contact',
      ],
    };

    await storeResume(userId, {
      resumeData: defaultResumeData,
    });

    messageTip = 'Start building your portfolio from scratch!';
  }

  // If resume exists but no resumeData, try to generate from PDF or use default
  if (resume && !resume.resumeData) {
    let resumeObject;

    // If there's a PDF file, try to extract data from it
    if (resume.fileContent && resume.file) {
      resumeObject = await generateResumeObject(resume.fileContent);
      console.log(resumeObject);
      if (!resumeObject) {
        messageTip =
          "We couldn't extract data from your PDF. Please edit your resume manually.";
      }
    }

    // If no PDF or extraction failed, use default data
    if (!resumeObject) {
      resumeObject = {
        header: {
          name: session?.user?.name || session?.user?.email || 'user',
          shortAbout: 'A one-liner on who you are, what you do',
          location: 'Your City, Your Country',
          contacts: {
            email: session?.user?.email || 'your@email.com',
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
        summary:
          'A crisp summary of your past experience, cool projects, and mastered skills...',
        workExperience: [
          {
            company: 'Your Company',
            location: 'Your company location',
            link: '',
            contract: '',
            title: 'Your Job Title',
            start: 'Jan 2023',
            end: '',
            description:
              'Worked on exciting projects that improved product usability, performance, and customer happiness.',
          },
          {
            company: 'Another Company',
            title: 'Previous Job Title',
            location: 'Your company location',
            link: '',
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
            degree: 'Bachelor of Science in Sleeping',
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
        contact: 'Write a catchy phrase here for people to contact you... 👀',
        projects: [
          {
            title: 'Cool Project 1',
            githubLink: 'https://github.com/yourusername/project1',
            liveLink: '',
            start: '',
            end: null,
            description:
              'A fun side project that shows off your creativity and technical skills.',
          },
          {
            title: 'Cool Project 2',
            githubLink: 'https://github.com/yourusername/project2',
            liveLink: '',
            start: '',
            end: null,
            description:
              'Another project that solves a real problem and demonstrates your ability to deliver.',
          },
        ],
        sectionOrder: [
          'summary',
          'workExperience',
          'education',
          'skills',
          'projects',
          'contact',
        ],
      };

      if (!messageTip && !resume.fileContent) {
        messageTip = 'Start building your portfolio from scratch!';
      }
    }

    await storeResume(userId, {
      ...resume,
      resumeData: resumeObject,
    });
  }

  // we set the username only if it wasn't already set for this user meaning it's new user
  const foundUsername = await getUsernameById(userId);

  const saltLength = 6;

  const createSalt = () =>
    Math.random()
      .toString(36)
      .substring(2, 2 + saltLength);

  if (!foundUsername) {
    const updatedResume = await getResume(userId);
    const username =
      (
        (updatedResume?.resumeData?.header?.name || 'user')
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

  return <PreviewWrapper messageTip={messageTip} />;
}

export default async function SelfPortfolioLoader({ userId }: { userId: string }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InitializeAndPreview userId={userId} />
    </Suspense>
  );
}
