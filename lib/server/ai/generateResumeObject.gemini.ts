import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeDataSchema } from '@/lib/resume';
import dedent from 'dedent';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateResumeObject = async (resumeText: string) => {
  const startTime = Date.now();
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });
    const prompt = dedent(`You are an expert resume writer. Generate a JSON resume object from the following resume text. Be professional and concise.

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
    console.log("Gemini raw response:", text);

    // Try to extract JSON from code block or markdown
    let jsonString = text;
    // Remove markdown code block if present
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```/, "").replace(/```$/, "").trim();
    }
    // Try to find the first {...} block if still not valid
    if (!jsonString.trim().startsWith("{")) {
      const match = jsonString.match(/\{[\s\S]*\}/);
      if (match) jsonString = match[0];
    }


    // Parse JSON
    let object;
    try {
      object = JSON.parse(jsonString);
    } catch (e) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    // Map Gemini's output to your schema if needed
    if (object.basics) {
      object = {
        header: {
          name: object.basics.name || "",
          shortAbout: object.basics.about || "",
          location: object.basics.location
            ? [
                object.basics.location.city,
                object.basics.location.country,
              ].filter(Boolean).join(", ")
            : "",
          contacts: {
            email: object.basics.email || "",
            linkedin: object.basics.linkedin || "",
            github: object.basics.github || "",
            website: object.basics.website || "",
            phone: object.basics.phone || "",
          },
          skills: object.skills || [],
        },
        summary: object.basics.about || "",
        workExperience: (object.experience || []).map((exp: any) => ({
          title: exp.title || "",
          company: exp.company || "",
          location: exp.location || "",
          startDate: exp.startDate || (exp.years ? exp.years.split("–")[0].trim() : ""),
          endDate: exp.endDate || (exp.years ? exp.years.split("–")[1]?.trim() : ""),
          description: exp.description || "",
        })),
        education: (object.education || []).map((edu: any) => ({
          institution: edu.institution || "",
          degree: edu.degree || edu.area || "",
          graduationDate: edu.graduationDate || edu.expectedGraduation || "",
          location: edu.location || "",
        })),
        // Add other fields as needed, or ignore extra fields
      };
    }

    // Validate with Zod schema
    ResumeDataSchema.parse(object);

    const endTime = Date.now();
    console.log(
      `Generating resume object with Gemini took ${(endTime - startTime) / 1000} seconds`
    );

    return object;
  } catch (error) {
    console.warn('Impossible generating resume object with Gemini', error);
    return undefined;
  }
};
