'use client';

import React, { useState } from 'react';
import BlurFade from '../../magicui/blur-fade';
import { Section } from '@/components/ui/section';
import { ResumeDataSchemaType } from '@/lib/resume';
import { GithubIcon, LinkedinIcon, Notebook, Pen, Plus, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

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
  onChangeContacts?: (newContacts: ResumeDataSchemaType['header']['contacts']) => void;
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
      icon: <GithubIcon className="size-5" />,
      value: contacts?.github,
      prefix: 'github.com/',
      placeholder: 'username',
      key: 'github',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedinIcon className="size-5" />,
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
                className="size-8 rounded-full bg-black border border-gray-50 shadow-md text-white flex items-center justify-center hover:scale-110 transition-transform duration-200"
                aria-label="Edit social links"
              >
                <Pen className="size-4" />
              </button>
            )}
          </div>

          {isEditMode && isEditing ? (
            <div className="space-y-4 border-2 border-gray-100 rounded-xl p-4 bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinks.map(({ id, label, icon, value, prefix, placeholder, key }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <Label htmlFor={id} className="text-sm text-gray-600 flex items-center gap-2">
                      {icon}
                      {label}
                    </Label>
                    <div className="flex items-center gap-2">
                      {prefix && (
                        <span className="text-sm text-gray-500 whitespace-nowrap">
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
                ))}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map(({ id, label, icon, value, prefix }) => {
                if (!value && !isEditMode) return null;

                const fullUrl = prefix ? `https://${prefix}${value}` : value?.startsWith('http') ? value : `https://${value}`;

                return (
                  <a
                    key={id}
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 group"
                  >
                    <div className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {value || (isEditMode ? 'Not set' : '')}
                      </p>
                    </div>
                  </a>
                );
              })}

              {isEditMode && !hasAnySocialLinks && (
                <div className="col-span-full">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-5 flex items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg transition-all duration-300 hover:shadow-lg bg-transparent hover:bg-muted/5 group"
                  >
                    <Plus className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Add Social Links
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </BlurFade>
    </Section>
  );
}
