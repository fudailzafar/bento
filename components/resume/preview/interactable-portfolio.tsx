'use client';

import {
  withInteractable,
  type WithTamboInteractableProps,
} from '@tambo-ai/react';
import { PreviewPortfolio } from './preview-portfolio';
import { ResumeData } from '@/lib/server';
import { ResumeDataSchema } from '@/lib';
import { useEffect } from 'react';
import { z } from 'zod';

/**
 * Wrapper component that connects Tambo prop updates to the callback-based PreviewPortfolio
 */
const PortfolioWrapper = ({
  resume,
  profilePicture,
  isEditMode,
  onChangeResume,
  onImageChange,
  onPropsUpdate,
}: {
  resume?: ResumeData | null;
  profilePicture?: string;
  isEditMode?: boolean;
  onChangeResume?: (newResume: ResumeData) => void;
  onImageChange?: (newImageUrl: string | null) => void;
} & WithTamboInteractableProps) => {
  // Listen for prop updates from Tambo and apply them via callbacks
  useEffect(() => {
    if (onPropsUpdate) {
      onPropsUpdate((newProps: Record<string, any>) => {
        console.log('Tambo prop update:', newProps);

        // If resume data is being updated
        if (newProps.resume && onChangeResume) {
          // Deep merge the updates with existing resume data
          const updatedResume = {
            ...resume,
            ...newProps.resume,
          } as ResumeData;

          // If header is being updated, merge it properly
          if (newProps.resume.header) {
            updatedResume.header = {
              ...resume?.header,
              ...newProps.resume.header,
              contacts: {
                ...resume?.header?.contacts,
                ...newProps.resume.header.contacts,
              },
            } as any;
          }

          console.log('Calling onChangeResume with:', updatedResume);
          onChangeResume(updatedResume);
        }

        // If profile picture is being updated
        if (newProps.profilePicture !== undefined && onImageChange) {
          onImageChange(newProps.profilePicture);
        }
      });
    }
  }, [onPropsUpdate, onChangeResume, onImageChange, resume]);

  return (
    <PreviewPortfolio
      resume={resume}
      profilePicture={profilePicture}
      isEditMode={isEditMode}
      onChangeResume={onChangeResume}
      onImageChange={onImageChange}
    />
  );
};

/**
 * InteractablePortfolio - A Tambo-enabled version of PreviewPortfolio
 * that can be controlled via AI chat interface
 */
export const InteractablePortfolio = withInteractable(PortfolioWrapper, {
  componentName: 'PreviewPortfolio',
  description:
    'A portfolio component that displays resume data including header, work experience, education, projects, skills, and contact information. AI can update any field in the resume data.',
  propsSchema: z.object({
    resume: ResumeDataSchema.describe('The complete resume data object'),
    profilePicture: z
      .string()
      .optional()
      .describe('URL of the profile picture'),
    isEditMode: z
      .boolean()
      .optional()
      .describe('Whether the portfolio is in edit mode'),
  }),
});
