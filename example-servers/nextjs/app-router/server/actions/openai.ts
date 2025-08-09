import OpenAI from 'openai';

export const openAI_TestPrompt = async (apiKey: string, modelName: string) => {
  const client = new OpenAI({
    apiKey: apiKey,
  });

  const response = await client.responses.create({
    model: modelName,
    instructions: 'You are a coding assistant that talks like a pirate',
    input: 'Are semicolons optional in JavaScript?',
  });

  return response;
};
