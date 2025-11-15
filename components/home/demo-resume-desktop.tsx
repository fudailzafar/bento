'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  ProjectCard,
  ResumeCard,
} from '@/components/ui';
import { DATA } from '@/components/home';

const DemoResumeDesktop = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.section
      className="mx-auto min-h-screen max-w-7xl px-8 py-16 font-sans antialiased sm:py-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      aria-label="Resume Content"
    >
      <motion.main className="space-y-12" variants={containerVariants}>
        {/* Hero Section - Full Width */}
        <motion.section id="hero" variants={itemVariants} className="p-12">
          <div className="flex items-start justify-between gap-12">
            <div className="flex-1 space-y-6">
              <motion.h1
                className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-7xl xl:text-8xl/none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ rotate: 2 }}
              >
                Hi, I'm {DATA.name.split(' ')[0]} 👋
              </motion.h1>
              <motion.p
                className="max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ rotate: -2 }}
              >
                {DATA.description}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              whileHover={{ rotate: 10 }}
              className="shrink-0"
            >
              <Avatar className="size-40 border-4 border-white shadow-2xl">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback className="text-3xl font-bold">
                  {DATA.initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </motion.section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - About & Skills */}
          <div className="col-span-12 space-y-8 lg:col-span-5">
            {/* About Section */}
            <motion.section id="about" variants={itemVariants} className="p-8">
              <motion.h2
                className="mb-6 text-3xl font-bold tracking-tight text-gray-900"
                whileHover={{ rotate: -3 }}
              >
                About
              </motion.h2>
              <motion.div
                className="prose dark:prose-invert max-w-none text-pretty font-sans text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ rotate: 2 }}
              >
                <Markdown>{DATA.summary}</Markdown>
              </motion.div>
            </motion.section>

            {/* Skills Section */}
            <motion.section id="skills" variants={itemVariants} className="p-8">
              <motion.h2
                className="mb-6 text-3xl font-bold tracking-tight text-gray-900"
                whileHover={{ rotate: 3 }}
              >
                Skills
              </motion.h2>
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {DATA.skills.map((skill, id) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * id, type: 'spring' }}
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge className="bg-black px-4 py-2 text-sm transition-all duration-200 hover:shadow-md">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          </div>

          {/* Right Column - Work & Education */}
          <div className="col-span-12 space-y-8 lg:col-span-7">
            {/* Work Experience Section */}
            <motion.section id="work" variants={itemVariants} className="p-8">
              <motion.h2
                className="mb-8 text-3xl font-bold tracking-tight text-gray-900"
                whileHover={{ rotate: -2 }}
              >
                Work Experience
              </motion.h2>
              <div className="space-y-6">
                {DATA.work.map((work, id) => (
                  <motion.div
                    key={work.company}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * id }}
                    whileHover={{ x: 4, rotate: 2 }}
                    className="transition-all duration-200"
                  >
                    <ResumeCard
                      logoUrl={work.logoUrl}
                      altText={work.company}
                      title={work.company}
                      subtitle={work.title}
                      href={work.href}
                      badges={work.badges}
                      period={`${work.start} - ${work.end ?? 'Present'}`}
                      description={work.description}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Education Section */}
            <motion.section
              id="education"
              variants={itemVariants}
              className="p-8"
            >
              <motion.h2
                className="mb-8 text-3xl font-bold tracking-tight text-gray-900"
                whileHover={{ rotate: 2 }}
              >
                Education
              </motion.h2>
              <div className="space-y-6">
                {DATA.education.map((education, id) => (
                  <motion.div
                    key={education.school}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * id }}
                    whileHover={{ x: 4, rotate: -2 }}
                    className="transition-all duration-200"
                  >
                    <ResumeCard
                      href={education.href}
                      logoUrl={education.logoUrl}
                      altText={education.school}
                      title={education.school}
                      subtitle={education.degree}
                      period={`${education.start} - ${education.end}`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Projects Section - Full Width */}
        <motion.section
          id="projects"
          variants={itemVariants}
          className="p-12 text-black"
        >
          <div className="space-y-12">
            <motion.div
              className="space-y-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="inline-block rounded-xl border bg-black px-6 py-3 text-sm font-medium text-white backdrop-blur-sm"
                whileHover={{ rotate: -3 }}
              >
                My Projects
              </motion.div>
              <motion.h2
                className="text-5xl font-bold tracking-tighter text-black sm:text-7xl"
                whileHover={{ rotate: -2 }}
              >
                Check out my latest work
              </motion.h2>
              <motion.p
                className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-300 md:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ rotate: 2 }}
              >
                I've worked on a variety of projects, from simple websites to
                complex web applications. Here are a few of my favorites.
              </motion.p>
            </motion.div>

            {/* Projects Grid with Asymmetric Layout */}
            <motion.div
              className="grid grid-cols-1 gap-8 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {DATA.projects.map((project, id) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * id, type: 'spring' }}
                  whileHover={{ y: -8, rotate: 3 }}
                  className={`transition-all duration-300`}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/40">
                    <ProjectCard
                      liveLink={project.href}
                      title={project.title}
                      description={project.description}
                      dates={project.dates}
                      tags={project.technologies}
                      image={project.image}
                      video={project.video}
                      githubLink={
                        project.links?.find((l) => l.type === 'Source')?.href
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </motion.main>
    </motion.section>
  );
};

export default DemoResumeDesktop;
