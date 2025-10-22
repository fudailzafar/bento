import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeDataSchema } from '@/lib';
import dedent from 'dedent';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateResumeObject = async (resumeText: string) => {
  const startTime = Date.now();
  console.log('🚀 Starting Gemini resume generation...');
  console.log('📄 Resume text length:', resumeText.length);
  console.log('📄 Resume text preview:', resumeText.substring(0, 200) + '...');

  try {
    console.log('🔧 Initializing Gemini model...');
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });
    console.log('✅ Gemini model initialized successfully');
    const prompt =
      dedent(`You are an expert resume writer. Generate a JSON resume object from the following resume text. Be professional and concise.

## Instructions:
- If the resume text does not include an 'about' section or specific skills mentioned, please generate appropriate content for these sections based on the context of the resume and based on the job role.
- For the about section: Create a professional summary that highlights the candidate's experience, expertise, and career objectives.
- For the skills: Generate a maximum of 10 skills taken from the ones mentioned in the resume text or based on the job role / job title infer some if not present.
- If the resume doesn't contain the full link to social media website leave the username/link as empty strings to the specific social media websites. The username never contains any space so make sure to only return the full username for the website otherwise don't return it.

## Resume text:

${resumeText}

Return only the JSON object, nothing else.`);

    console.log('📤 Sending prompt to Gemini...');
    console.log('📝 Prompt preview:', prompt.substring(0, 300) + '...');

    const result = await model.generateContent(prompt);
    console.log('✅ Received response from Gemini');

    const response = await result.response;
    const text = response.text();

    // Log the raw response for debugging
    console.log('📥 Gemini raw response:', text);
    console.log('📏 Raw response length:', text.length);

    // Robust JSON extraction from code block or markdown
    let jsonString = text.trim();

    // Remove all code block markers (```json, ```, etc.)
    jsonString = jsonString
      .replace(/^```json[\r\n]*/i, '')
      .replace(/^```[\r\n]*/i, '')
      .replace(/```$/g, '')
      .trim();

    // If still not valid, try to extract the first {...} JSON object
    if (!jsonString.startsWith('{')) {
      const match = jsonString.match(/\{[\s\S]*\}/);
      if (match) jsonString = match[0];
    }

    // Remove any trailing or leading non-JSON content
    // (e.g., if the model adds extra text before/after)
    const firstCurly = jsonString.indexOf('{');
    const lastCurly = jsonString.lastIndexOf('}');
    if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
      jsonString = jsonString.substring(firstCurly, lastCurly + 1);
    }

    // Optionally log the cleaned jsonString for debugging
    console.log('🧹 Cleaned JSON string:', jsonString);
    console.log('🧹 Cleaned JSON length:', jsonString.length);

    // Parse JSON
    let object;
    try {
      console.log('🔍 Attempting to parse JSON...');
      object = JSON.parse(jsonString);
      console.log('✅ JSON parsed successfully');
      console.log('📊 Parsed object keys:', Object.keys(object));
      console.log('📊 Full parsed object:', JSON.stringify(object, null, 2));
    } catch (e) {
      console.error('❌ JSON parsing failed:', e);
      console.error('🔍 Failed JSON string:', jsonString);
      throw new Error('Could not parse JSON from Gemini response');
    }

    // Map Gemini's output to match ResumeDataSchema exactly
    console.log('🔄 Starting object transformation...');
    console.log('🔍 Object has basics property:', !!object.basics);

    if (object.basics) {
      console.log('📝 Transforming object with basics structure...');
      object = {
        header: {
          name: object.basics.name || 'Your name',
          shortAbout:
            object.basics.about ||
            'This is a short description of your profile',
          location: object.basics.location
            ? [object.basics.location.city, object.basics.location.country]
                .filter(Boolean)
                .join(', ')
            : 'City, Country',
          contacts: {
            website: object.basics.website || 'example.com',
            email: object.basics.email || 'johndoe@gmail.com',
            phone: object.basics.phone || '+1234567890',
            twitter: object.basics.twitter || 'elonmusk',
            linkedin: object.basics.linkedin || 'yourusername',
            github: object.basics.github || 'yourusername',
          },
          skills: Array.isArray(object.skills) ? object.skills : [],
        },
        summary: object.basics.about || 'You should add a summary here',
        workExperience: Array.isArray(object.experience)
          ? object.experience.map((exp: any) => ({
              company: exp.company || '',
              link: exp.link || '',
              location: exp.location || '',
              contract: exp.contract || '',
              title: exp.title || '',
              start:
                exp.start ||
                exp.startDate ||
                (exp.years ? exp.years.split('–')[0].trim() : ''),
              end:
                exp.end ||
                exp.endDate ||
                (exp.years ? exp.years.split('–')[1]?.trim() : ''),
              description: exp.description || '',
            }))
          : [],
        education: Array.isArray(object.education)
          ? object.education.map((edu: any) => ({
              school: edu.school || edu.institution || '',
              degree: edu.degree || edu.area || '',
              start: edu.start || edu.startYear || '',
              end: edu.end || edu.endYear || '',
            }))
          : [],
        contact:
          object.contact ||
          'Write some text here... maybe a catchy phrase for people to contact you? 👀',
        projects: Array.isArray(object.projects)
          ? object.projects.map((pro: any) => ({
              title: pro.name || '',
              link: pro.link || '',
              description: pro.description || '',
              start:
                pro.start ||
                pro.startDate ||
                (pro.years ? pro.years.split('–')[0].trim() : ''),
              end:
                pro.end ||
                pro.endDate ||
                (pro.years ? pro.years.split('–')[1]?.trim() : ''),
              githubLink: '',
              liveLink: '',
              skills: Array.isArray(pro.technologies) ? pro.technologies : [],
            }))
          : [],
      };
      console.log('✅ Object transformation completed');
    } else {
      console.log('⚠️ No basics property found, using object as-is');
    }

    console.log(
      '🔍 Final object before validation:',
      JSON.stringify(object, null, 2)
    );

    // Validate with Zod schema
    console.log('🛡️ Starting Zod schema validation...');
    ResumeDataSchema.parse(object);
    console.log('✅ Zod validation passed');

    const endTime = Date.now();
    console.log(
      `🎉 Generating resume object with Gemini took ${
        (endTime - startTime) / 1000
      } seconds`
    );
    console.log('🎯 Final result:', JSON.stringify(object, null, 2));

    return object;
  } catch (error) {
    console.error('❌ Error generating resume object with Gemini:', error);
    console.error(
      '❌ Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    console.error('❌ Error type:', typeof error);
    console.error('❌ Full error object:', JSON.stringify(error, null, 2));
    return undefined;
  }
};
