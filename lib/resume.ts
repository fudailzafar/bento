import { z } from 'zod';

const HeaderContactsSchema = z.object({
  website: z.string().describe('Personal website or portfolio URL').optional(),
  email: z.string().describe('Email address').optional(),
  phone: z.string().describe('Phone number').optional(),
  twitter: z.string().describe('Twitter/X username').optional(),
  linkedin: z.string().describe('LinkedIn username').optional(),
  github: z.string().describe('GitHub username').optional(),
});

const HeaderSection = z.object({
  name: z.string(),
  shortAbout: z.string().describe('Short description of your profile'),
  location: z
    .string()
    .describe("Location with format 'City, Country'")
    .optional(),
  contacts: HeaderContactsSchema,
  skills: z
    .array(z.string())
    .describe('Skills used within the different jobs the user has had.'),
});

const SummarySection = z.string().describe('Summary of your profile');

const WorkExperienceSection = z.array(
  z.object({
    company: z.string().describe('Company name'),
    link: z.string().describe('Company website URL'),
    location: z
      .string()
      .describe(
        "Location with format 'City, Country' or could be Hybrid or Remote"
      ),
    contract: z
      .string()
      .describe('Type of work contract like Full-time, Part-time, Contract'),
    title: z.string().describe('Job title'),
    start: z.string().describe("Start date in format 'YYYY-MM-DD'"),
    end: z
      .string()
      .optional()
      .nullable()
      .describe("End date in format 'YYYY-MM-DD'"),
    description: z.string().describe('Job description'),
  })
);

const EducationSection = z.array(
  z.object({
    school: z.string().describe('School or university name'),
    degree: z.string().describe('Degree or certification obtained'),
    start: z.string().describe('Start year'),
    end: z.string().describe('End year'),
  })
);

const ContactSection = z.string().describe('Catchy Phrase for call to action');

const ProjectSection = z.array(
  z.object({
    title: z.string().describe('Project Title'),
    description: z.string().describe('Project description'),
    liveLink: z.string().describe('Project website URL'),
    githubLink: z.string().describe('Project website URL'),
    start: z.string().describe("Start date in format 'YYYY-MM-DD'"),
    end: z
      .string()
      .optional()
      .nullable()
      .describe("End date in format 'YYYY-MM-DD'"),
    skills: z
      .array(z.string())
      .describe('Skills used for building projects the user has made.')
      .optional(),
  })
);

export const ResumeDataSchema = z.object({
  header: HeaderSection,
  summary: SummarySection,
  workExperience: WorkExperienceSection,
  education: EducationSection,
  contact: ContactSection,
  projects: ProjectSection,
});

export type ResumeDataSchemaType = z.infer<typeof ResumeDataSchema>;
