import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeDataSchema } from '@/lib/resume';
import dedent from 'dedent';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateResumeObject = async (resumeText: string) => {
  const startTime = Date.now();
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log the raw response for debugging
    console.log('Gemini raw response:', text);


    // Robust JSON extraction from code block or markdown
    let jsonString = text.trim();

    // Remove all code block markers (```json, ```, etc.)
    jsonString = jsonString.replace(/^```json[\r\n]*/i, '').replace(/^```[\r\n]*/i, '').replace(/```$/g, '').trim();

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
    // console.log('Cleaned JSON string:', jsonString);

    // Parse JSON
    let object;
    try {
      object = JSON.parse(jsonString);
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
      throw new Error('Could not parse JSON from Gemini response');
    }


    // Map Gemini's output to match ResumeDataSchema exactly
    if (object.basics) {
      object = {
        header: {
          name: object.basics.name || 'Your name',
          shortAbout: object.basics.about || 'This is a short description of your profile',
          location: object.basics.location
            ? [object.basics.location.city, object.basics.location.country].filter(Boolean).join(', ')
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
              start: exp.start || exp.startDate || (exp.years ? exp.years.split('–')[0].trim() : ''),
              end: exp.end || exp.endDate || (exp.years ? exp.years.split('–')[1]?.trim() : ''),
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
        contact: object.contact || 'Write some text here... maybe a catchy phrase for people to contact you? 👀',
        projects: Array.isArray(object.projects)
          ? object.projects.map((pro: any) => ({
              title: pro.name || '',
              link: pro.link || '',
              description: pro.description || '',
              start: pro.start || pro.startDate || (pro.years ? pro.years.split('–')[0].trim() : ''),
              end: pro.end || pro.endDate || (pro.years ? pro.years.split('–')[1]?.trim() : ''),
              githubLink: '',
              liveLink: '',
              skills: Array.isArray(pro.technologies) ? pro.technologies : [],
            }))
          : [],
      };
    }

    // Validate with Zod schema
    ResumeDataSchema.parse(object);

    const endTime = Date.now();
    console.log(
      `Generating resume object with Gemini took ${
        (endTime - startTime) / 1000
      } seconds`
    );

    return object;
  } catch (error) {
    console.warn('Impossible generating resume object with Gemini', error);
    return undefined;
  }
};
