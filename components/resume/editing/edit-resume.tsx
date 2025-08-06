import { useState } from 'react';
import { toast } from 'sonner';
import { ResumeData } from '@/lib/server';
import { Input, Label } from '@/components/ui';
import {
  AddButton,
  WorkExperienceField,
  EducationField,
  SkillField,
  AddSkillDialog,
  ProjectsField,
} from '@/components/resume/editing';

export const EditResume = ({
  resume,
  onChangeResume,
}: {
  resume: ResumeData;
  onChangeResume: (newResume: ResumeData) => void;
}) => {
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);

  const handleAddSkill = (skillToAdd: string) => {
    if (resume.header.skills.includes(skillToAdd)) {
      toast.warning('This skill is already added.');
    } else {
      onChangeResume({
        ...resume,
        header: {
          ...resume.header,
          skills: [...resume.header.skills, skillToAdd],
        },
      });
    }
  };

  // Helper to normalize projects so each has skills: []
  const normalizeResume = (resume: ResumeData): ResumeData => ({
    ...resume,
    projects: (resume.projects || []).map((project) => ({
      ...project,
      skills: Array.isArray(project.skills) ? project.skills : [],
    })),
  });

  return (
    <section
      className="mx-auto w-full max-w-2xl space-y-8 bg-white my-8"
      aria-label="Resume Content editing"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Header</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              value={resume?.header?.name || ''}
              onChange={(e) => {
                onChangeResume(
                  normalizeResume({
                    ...resume,
                    header: {
                      ...resume.header,
                      name: e.target.value,
                    },
                  })
                );
              }}
              placeholder="Your full name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="location"
              className="text-sm font-medium text-gray-700"
            >
              Location
            </Label>
            <Input
              type="text"
              id="location"
              value={resume?.header?.location || ''}
              onChange={(e) => {
                onChangeResume(
                  normalizeResume({
                    ...resume,
                    header: {
                      ...resume.header,
                      location: e.target.value,
                    },
                  })
                );
              }}
              placeholder="Your location"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <Label
              htmlFor="shortAbout"
              className="text-sm font-medium text-gray-700"
            >
              Short About
            </Label>
            <textarea
              className="w-full p-2 border rounded-md  text-sm"
              value={resume?.header?.shortAbout || ''}
              onChange={(e) => {
                onChangeResume(
                  normalizeResume({
                    ...resume,
                    header: {
                      ...resume.header,
                      shortAbout: e.target.value,
                    },
                  })
                );
              }}
              rows={4}
              placeholder="Brief description about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={resume?.header?.contacts?.email || ''}
                onChange={(e) => {
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      header: {
                        ...resume.header,
                        contacts: {
                          ...resume.header.contacts,
                          email: e.target.value,
                        },
                      },
                    })
                  );
                }}
                placeholder="Your email address"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                value={resume?.header?.contacts?.phone || ''}
                onChange={(e) => {
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      header: {
                        ...resume.header,
                        contacts: {
                          ...resume.header.contacts,
                          phone: e.target.value,
                        },
                      },
                    })
                  );
                }}
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <Label className="text-sm font-medium text-gray-700">
              Social Links
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'website',
                  label: 'Blog',
                  prefix: '',
                  placeholder: 'your-website.com',
                  key: 'website',
                },
                {
                  id: 'github',
                  label: 'GitHub',
                  prefix: 'github.com/',
                  placeholder: 'username',
                  key: 'github',
                },
                {
                  id: 'linkedin',
                  label: 'LinkedIn',
                  prefix: 'linkedin.com/in/',
                  placeholder: 'username',
                  key: 'linkedin',
                },
                {
                  id: 'twitter',
                  label: 'Twitter/X',
                  prefix: 'x.com/',
                  placeholder: 'username',
                  key: 'twitter',
                },
              ].map(({ id, label, prefix, placeholder, key }) => (
                <div key={id} className="flex flex-col gap-2">
                  <Label htmlFor={id} className="text-sm text-gray-600">
                    {label}
                  </Label>
                  <div className="flex items-center">
                    {prefix && (
                      <span className="text-sm text-gray-500 mr-2">
                        {prefix}
                      </span>
                    )}
                    <Input
                      type="text"
                      id={id}
                      value={
                        resume?.header?.contacts?.[
                          key as keyof typeof resume.header.contacts
                        ] || ''
                      }
                      onChange={(e) => {
                        onChangeResume(
                          normalizeResume({
                            ...resume,
                            header: {
                              ...resume.header,
                              contacts: {
                                ...resume.header.contacts,
                                [key]: e.target.value,
                              },
                            },
                          })
                        );
                      }}
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* About Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">About</h2>
          <textarea
            className="w-full p-2 border rounded-md  text-sm"
            value={resume?.summary}
            onChange={(e) => {
              onChangeResume(
                normalizeResume({
                  ...resume,
                  summary: e.target.value,
                })
              );
            }}
            rows={4}
            placeholder="Enter your professional summary..."
          />
        </div>

        {/* Work Experience Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Work Experience</h2>
          <div className="space-y-4">
            {resume?.workExperience?.map((work, index) => (
              <WorkExperienceField
                key={index}
                work={work}
                index={index}
                onUpdate={(index, updatedWork) => {
                  const newWorkExperience = [...resume.workExperience];
                  newWorkExperience[index] = updatedWork;
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      workExperience: newWorkExperience,
                    })
                  );
                }}
                onDelete={(index) => {
                  const newWorkExperience = [...resume.workExperience];
                  newWorkExperience.splice(index, 1);
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      workExperience: newWorkExperience,
                    })
                  );
                }}
              />
            ))}
            <AddButton
              label="Add Work Experience"
              onClick={() => {
                onChangeResume({
                  ...resume,
                  workExperience: [
                    ...resume.workExperience,
                    {
                      title: '',
                      company: '',
                      description: '',
                      location: '',
                      link: '',
                      contract: '',
                      start: '',
                      end: '',
                    },
                  ],
                });
              }}
            />
          </div>
        </div>

        {/* Education Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Education</h2>
          <div className="space-y-4">
            {resume?.education?.map((edu, index) => (
              <EducationField
                key={index}
                edu={edu}
                index={index}
                onUpdate={(index, updatedEdu) => {
                  const newEducation = [...resume.education];
                  newEducation[index] = updatedEdu;
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      education: newEducation,
                    })
                  );
                }}
                onDelete={(index) => {
                  const newEducation = [...resume.education];
                  newEducation.splice(index, 1);
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      education: newEducation,
                    })
                  );
                }}
              />
            ))}
            <AddButton
              label="Add Education"
              onClick={() => {
                onChangeResume({
                  ...resume,
                  education: [
                    ...resume.education,
                    { degree: '', school: '', start: '', end: '' },
                  ],
                });
              }}
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.header.skills.map((skill, index) => (
              <SkillField
                key={index}
                skill={skill}
                index={index}
                onUpdate={(index, updatedSkill) => {
                  const newSkills = [...resume.header.skills];
                  newSkills[index] = updatedSkill;
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      header: {
                        ...resume.header,
                        skills: newSkills,
                      },
                    })
                  );
                }}
                onDelete={(index) => {
                  const newSkills = [...resume.header.skills];
                  newSkills.splice(index, 1);
                  onChangeResume(
                    normalizeResume({
                      ...resume,
                      header: {
                        ...resume.header,
                        skills: newSkills,
                      },
                    })
                  );
                }}
              />
            ))}
          </div>
          <AddButton
            label="Add Skill"
            onClick={() => setIsAddSkillDialogOpen(true)}
          />
          <AddSkillDialog
            open={isAddSkillDialogOpen}
            onOpenChange={setIsAddSkillDialogOpen}
            onAddSkill={handleAddSkill}
          />
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">My Projects</h2>
          <div className="space-y-4">
            {resume?.projects?.map((project, index) => (
              <div key={index} className="space-y-2">
                <ProjectsField
                  project={{
                    ...project,
                    skills: Array.isArray(project.skills) ? project.skills : [],
                  }}
                  index={index}
                  onUpdate={(index, updatedWork) => {
                    const newProject = [...resume.projects];
                    newProject[index] = {
                      ...updatedWork,
                      skills: Array.isArray(updatedWork.skills)
                        ? updatedWork.skills
                        : resume.projects[index].skills ?? [],
                    };
                    onChangeResume(
                      normalizeResume({
                        ...resume,
                        projects: newProject,
                      })
                    );
                  }}
                  onDelete={(index) => {
                    const newProject = [...resume.projects];
                    newProject.splice(index, 1);
                    onChangeResume(
                      normalizeResume({
                        ...resume,
                        projects: newProject,
                      })
                    );
                  }}
                />
              </div>
            ))}
            <AddButton
              label="Add Projects"
              onClick={() => {
                onChangeResume(
                  normalizeResume({
                    ...resume,
                    projects: [
                      ...(resume.projects || []),
                      {
                        title: '',
                        description: '',
                        githubLink: '',
                        liveLink: '',
                        start: '',
                        end: '',
                        skills: [],
                      },
                    ],
                  })
                );
              }}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Contact</h2>
          <textarea
            className="w-full p-2 border rounded-md text-sm"
            value={resume?.contact || ''}
            onChange={(e) => {
              onChangeResume(
                normalizeResume({
                  ...resume,
                  contact: e.target.value,
                })
              );
            }}
            rows={2}
            placeholder="Enter a catchy phrase for call-to-action..."
          />
        </div>
      </div>
    </section>
  );
};
