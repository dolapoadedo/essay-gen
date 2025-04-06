import OpenAI from 'openai';
import { FormState } from '../types/form';

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
    const prompt = `Write a compelling, authentic personal essay based on the information provided below. Follow the 6-step narrative structure:

1. Open in the middle (hook with sensory details)
2. Provide backstory
3. Reflect on thoughts/feelings
4. Develop the story
5. Reflect again on broader meaning
6. Bring to conclusion

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

Selected Essay Prompt: ${selectedPrompt}
Selected Topic Idea: ${selectedIdea}

Additional Context from Follow-up Questions:
${Object.entries(followUpResponses)
  .map(([question, answer]) => `${question}: ${answer}`)
  .join('\n')}

Write a 650-word essay that sounds authentic to a student in the ${formData.academics.classRank} of their class. The essay should show reflection and personal growth while avoiding clichés and overly formal language. Format with proper paragraphs.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a college essay writer that helps students write authentic, personal essays that showcase their unique voice and experiences."
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
  formState: FormState,
  prompt: string,
  idea: string
): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful college essay advisor. Generate 5-7 specific follow-up questions to help the student develop their college essay. The questions should encourage reflection and connect the topic to broader experiences."
        },
        {
          role: "user",
          content: `Student Background:
- Name: ${formState.basicInfo.fullName}
- Email: ${formState.basicInfo.email}
- Selected Topic: ${prompt}
- Specific Idea: ${idea}
- Activities: ${formState.activitiesAndInvolvement.activities.map(a => `${a.category}: ${a.description}`).join(', ')}
- Personal Insights: ${Object.entries(formState.personalInsights).map(([key, value]) => `${key}: ${value}`).join(', ')}

Please generate 5-7 specific questions that will help the student develop their college essay.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const questions = JSON.parse(completion.choices[0].message.content || '[]');
    return questions;
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return [
      "What specific moment or experience inspired this topic?",
      "How has this experience changed you?",
      "What challenges did you face?",
      "What did you learn from this experience?",
      "How will this experience help you in college?"
    ];
  }
}; 