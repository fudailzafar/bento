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
          // Deep merge function for nested objects
          const deepMerge = (target: any, source: any): any => {
            const output = { ...target };

            if (isObject(target) && isObject(source)) {
              Object.keys(source).forEach((key) => {
                if (isObject(source[key])) {
                  if (!(key in target)) {
                    output[key] = source[key];
                  } else {
                    output[key] = deepMerge(target[key], source[key]);
                  }
                } else {
                  output[key] = source[key];
                }
              });
            }

            return output;
          };

          const isObject = (item: any): boolean => {
            return item && typeof item === 'object' && !Array.isArray(item);
          };

          // Deep merge the updates with existing resume data
          const updatedResume = deepMerge(
            resume || {},
            newProps.resume
          ) as ResumeData;

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
