import OpenAI from 'openai';
import { FormState } from '../context/FormContext';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface TopicIdea {
  title: string;
  description: string;
}

export interface TopicSuggestions {
  [key: string]: TopicIdea[];
}

export const generateTopicSuggestions = async (formData: FormState): Promise<TopicSuggestions> => {
  try {
    const prompt = `Based on the following student information, suggest 2 personalized essay ideas for each of the 6 Common App prompts. Format the response as a JSON object where each prompt number (1-6) maps to an array of two idea objects, each with a "title" and "description" field.

Student Information:
- Class Rank: ${formData.academics.classRank}
- Academic Interests: ${formData.academics.subjects.join(', ')}
- Potential Majors: ${formData.academics.majors.join(', ')}
- College Preferences: ${formData.collegeGoals.collegeTypes.join(', ')}
- Activities & Involvement:
${formData.activitiesAndInvolvement.activities.map(activity => 
  `  - ${activity.category}${activity.otherCategory ? ` (${activity.otherCategory})` : ''}:
    Years: ${activity.years.join(', ')}
    Leadership: ${activity.leadership || 'None'}
    Hours per Week: ${activity.hoursPerWeek}
    Description: ${activity.description}`
).join('\n')}
- Personal Insights:
  What makes you happy: ${formData.personalInsights.happy}
  Role model: ${formData.personalInsights.roleModel}
  Learning from mistakes: ${formData.personalInsights.lesson}
  Hobbies: ${formData.personalInsights.hobby}
  Unique perspective: ${formData.personalInsights.unique}
- Challenges: ${formData.personal.challenge}
- Values: ${formData.personal.values.join(', ')}
- Unique Background: ${formData.personal.background}

Example format:
{
  "1": [
    {
      "title": "Brief catchy title for the first idea",
      "description": "2-3 sentence explanation of how this topic relates to the student's experiences"
    },
    {
      "title": "Brief catchy title for the second idea",
      "description": "2-3 sentence explanation of how this topic relates to the student's experiences"
    }
  ],
  // ... repeat for prompts 2-6
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a college admissions expert helping students brainstorm essay topics. Generate specific, personal ideas based on the student's background."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const suggestions = JSON.parse(content);
    return suggestions;
  } catch (error) {
    console.error('Error generating topic suggestions:', error);
    throw error;
  }
};

export const generateEssay = async (
  formData: FormState,
  selectedPrompt: string,
  selectedIdea: string,
  followUpResponses: Record<string, string>
): Promise<string> => {
  try {
    const writingSamplePrompt = formData.personalInsights.writingSample?.text 
      ? `\nWriting Sample (use this to match the student's style and voice):
Title: ${formData.personalInsights.writingSample.title || 'Sample Writing'}
Content:
${formData.personalInsights.writingSample.text}`
      : '';

    const prompt = `Write a compelling, authentic personal essay based on the information provided below. Start with a clear title that reflects the essay's theme, formatted on its own line without asterisks or special characters. Then, follow the 6-step narrative structure:

1. Open in the middle (hook with sensory details)
2. Provide backstory
3. Reflect on thoughts/feelings
4. Develop the story
5. Reflect again on broader meaning
6. Bring to conclusion${writingSamplePrompt}

Student Information:
- Class Rank: ${formData.academics.classRank}
- Academic Interests: ${formData.academics.subjects.join(', ')}
- Potential Majors: ${formData.academics.majors.join(', ')}
- College Preferences: ${formData.collegeGoals.collegeTypes.join(', ')}
- Activities & Involvement:
${formData.activitiesAndInvolvement.activities.map(activity => 
  `  - ${activity.category}${activity.otherCategory ? ` (${activity.otherCategory})` : ''}:
    Years: ${activity.years.join(', ')}
    Leadership: ${activity.leadership || 'None'}
    Hours per Week: ${activity.hoursPerWeek}
    Description: ${activity.description}`
).join('\n')}
- Personal Insights:
  What makes you happy: ${formData.personalInsights.happy}
  Role model: ${formData.personalInsights.roleModel}
  Learning from mistakes: ${formData.personalInsights.lesson}
  Hobbies: ${formData.personalInsights.hobby}
  Unique perspective: ${formData.personalInsights.unique}

Selected Essay Prompt: ${selectedPrompt}
Selected Topic Idea: ${selectedIdea}

Additional Context from Follow-up Questions:
${Object.entries(followUpResponses)
  .map(([question, answer]) => `${question}:\n${answer}`)
  .join('\n\n')}

Write a 650-word essay that sounds authentic to a student in the ${formData.academics.classRank} of their class.${formData.personalInsights.writingSample?.text ? " Use the provided writing sample to match the student's writing style, vocabulary level, and voice." : ''} The essay should show reflection and personal growth while avoiding clichés and overly formal language. Format with proper paragraphs. The title should be clear and engaging, placed on its own line at the start of the essay without any special characters or formatting.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a college essay writer that helps students write authentic, personal essays that showcase their unique voice and experiences. When a writing sample is provided, carefully analyze and match the student's writing style. Format the essay with a clear title on its own line, followed by well-structured paragraphs. Avoid using special characters or formatting in the title."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating essay:', error);
    throw error;
  }
};

export const generateFollowUpQuestions = async (
  formData: FormState,
  selectedPrompt: string,
  selectedIdea: string
): Promise<string[]> => {
  try {
    console.log('Starting generateFollowUpQuestions...');
    const prompt = `As a college admissions expert, generate 5-7 specific follow-up questions to help a student develop their college essay. The questions should help the student provide detailed, reflective responses that will enrich their essay.

Selected Common App Prompt: "${selectedPrompt}"
Student's Chosen Topic: "${selectedIdea}"

Student Background:
- Class Rank: ${formData.academics.classRank}
- Academic Interests: ${formData.academics.subjects.join(', ')}
- Potential Majors: ${formData.academics.majors.join(', ')}
- College Preferences: ${formData.collegeGoals.collegeTypes.join(', ')}
- Activities & Involvement:
${formData.activitiesAndInvolvement.activities.map(activity => 
  `  - ${activity.category}${activity.otherCategory ? ` (${activity.otherCategory})` : ''}:
    Years: ${activity.years.join(', ')}
    Leadership: ${activity.leadership || 'None'}
    Hours per Week: ${activity.hoursPerWeek}
    Description: ${activity.description}`
).join('\n')}
- Personal Insights:
  What makes you happy: ${formData.personalInsights.happy}
  Role model: ${formData.personalInsights.roleModel}
  Learning from mistakes: ${formData.personalInsights.lesson}
  Hobbies: ${formData.personalInsights.hobby}
  Unique perspective: ${formData.personalInsights.unique}

Generate questions that:
1. Are specific to the student's experiences and chosen topic
2. Encourage reflection and personal insight
3. Help draw out concrete details and examples
4. Connect their topic to their broader experiences and goals
5. Help them develop a compelling narrative

Format the response as a JSON object with a "questions" array field containing exactly 7 questions as strings.`;

    console.log('Making API request...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a college admissions expert helping students develop their essays through thoughtful questions. Always respond with properly formatted JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    console.log('API request completed');
    const content = response.choices[0].message.content;
    
    if (!content) {
      console.error('Empty response from OpenAI');
      throw new Error('No content in response');
    }

    console.log('Raw OpenAI response:', content);
    
    try {
      console.log('Attempting to parse JSON...');
      const parsedResponse = JSON.parse(content.trim());
      console.log('JSON parsed successfully:', parsedResponse);
      
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        console.error('Invalid response structure:', parsedResponse);
        throw new Error('Invalid response format');
      }
      
      console.log('Returning questions array:', parsedResponse.questions);
      return parsedResponse.questions;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Content:', content);
      throw parseError;
    }
  } catch (error) {
    console.error('Error in generateFollowUpQuestions:', error);
    // Fallback questions if AI generation fails
    return [
      "What specific moment or experience inspired this topic?",
      "How has this experience changed your perspective?",
      "What concrete details or examples can you share about this story?",
      "How does this topic relate to your future goals?",
      "What did you learn about yourself through this experience?",
      "How has this experience influenced your values or beliefs?",
      "What specific challenges did you face and how did you overcome them?"
    ];
  }
}; 