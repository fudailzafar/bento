'use client';

import React, { useState } from 'react';
import { Section, Input, Label, Button } from '@/components/ui';
import { ResumeDataSchemaType } from '@/lib/resume';
import { Notebook, Plus } from 'lucide-react';
import { BlurFade } from '@/components/magicui';
import { GitHubIcon, LinkedInIcon, PenIcon, XIcon } from '@/components/icons';

const BLUR_FADE_DELAY = 0.04;

interface SocialLink {
  id: string;
  label: string;
  icon: React.ReactNode;
  value?: string;
  prefix: string;
  placeholder: string;
  key: keyof ResumeDataSchemaType['header']['contacts'];
}

export function SocialLinks({
  contacts,
  isEditMode,
  onChangeContacts,
}: {
  contacts: ResumeDataSchemaType['header']['contacts'];
  isEditMode?: boolean;
  onChangeContacts?: (
    newContacts: ResumeDataSchemaType['header']['contacts']
  ) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const socialLinks: SocialLink[] = [
    {
      id: 'website',
      label: 'Blog',
      icon: <Notebook className="size-5" />,
      value: contacts?.website,
      prefix: '',
      placeholder: 'your-blog.com',
      key: 'website',
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: <GitHubIcon className="size-5" />,
      value: contacts?.github,
      prefix: 'github.com/',
      placeholder: 'username',
      key: 'github',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedInIcon className="size-5" />,
      value: contacts?.linkedin,
      prefix: 'linkedin.com/in/',
      placeholder: 'username',
      key: 'linkedin',
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: <XIcon className="size-5" />,
      value: contacts?.twitter,
      prefix: 'x.com/',
      placeholder: 'username',
      key: 'twitter',
    },
  ];

  // Check if any social link has a value
  const hasAnySocialLinks = socialLinks.some((link) => link.value);

  // Don't render in public view (only show in preview/edit mode)
  if (!isEditMode) {
    return null;
  }

  // Don't render if no links and not in edit mode
  if (!hasAnySocialLinks && !isEditMode) {
    return null;
  }

  return (
    <Section>
      <BlurFade delay={BLUR_FADE_DELAY * 17}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" id="social-links">
              Social Links
            </h2>
            {isEditMode && onChangeContacts && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex size-8 items-center justify-center rounded-full border border-gray-50 bg-black text-white shadow-md transition-transform duration-200 hover:scale-110"
                aria-label="Edit social links"
              >
                <PenIcon className="size-4" />
              </button>
            )}
          </div>

          {isEditMode && isEditing ? (
            <div className="space-y-4 rounded-xl border-2 border-gray-100 bg-gray-50 p-4 dark:bg-gray-900">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {socialLinks.map(
                  ({ id, label, icon, value, prefix, placeholder, key }) => (
                    <div key={id} className="flex flex-col gap-2">
                      <Label
                        htmlFor={id}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        {icon}
                        {label}
                      </Label>
                      <div className="flex items-center gap-2">
                        {prefix && (
                          <span className="whitespace-nowrap text-sm text-gray-500">
                            {prefix}
                          </span>
                        )}
                        <Input
                          type="text"
                          id={id}
                          value={value || ''}
                          onChange={(e) => {
                            onChangeContacts?.({
                              ...contacts,
                              [key]: e.target.value,
                            });
                          }}
                          placeholder={placeholder}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {socialLinks.map(({ id, label, icon, value, prefix }) => {
                if (!value && !isEditMode) return null;

                const fullUrl = prefix
                  ? `https://${prefix}${value}`
                  : value?.startsWith('http')
                    ? value
                    : `https://${value}`;

                return (
                  <a
                    key={id}
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-300 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                  >
                    <div className="text-gray-600 transition-colors group-hover:text-black dark:text-gray-400 dark:group-hover:text-white">
                      {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {value || (isEditMode ? 'Not set' : '')}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </BlurFade>
    </Section>
  );
}
