// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { DeepChatTextRequestBody } from '../../../../types/deepChatTextRequestBody';

// Edge runtime for better performance
export const runtime = 'edge';

// Enable streaming responses
export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Validates the request body structure
 */
function validateRequestBody(body: any): body is DeepChatTextRequestBody {
  return body && Array.isArray(body.messages);
}

/**
 * Creates a streaming response for Deep Chat format
 */
function createStreamingResponse(): {
  stream: ReadableStream;
  writer: WritableStreamDefaultWriter;
  encoder: TextEncoder;
} {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  return {
    stream: responseStream.readable,
    writer,
    encoder,
  };
}

/**
 * Sends text chunks as Server-Sent Events in Deep Chat format
 */
async function sendStreamChunks(
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  chunks: string[]
): Promise<void> {
  for (const chunk of chunks) {
    if (chunk.trim()) {
      const data = JSON.stringify({ text: chunk });
      await writer.write(encoder.encode(`data: ${data}\n\n`));

      // Add delay for smoother streaming effect
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
  }

  await writer.close();
}

/**
 * Sends an error message through the stream
 */
async function sendErrorMessage(
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  message: string
): Promise<void> {
  const errorData = JSON.stringify({ text: message });
  await writer.write(encoder.encode(`data: ${errorData}\n\n`));
  await writer.close();
}

/**
 * Creates streaming headers for Server-Sent Events
 */
function createStreamingHeaders(): Record<string, string> {
  return {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache, no-transform',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

/**
 * POST endpoint for OpenAI chat completions with streaming
 * Handles Deep Chat request format and returns Server-Sent Events
 */
export async function POST(request: NextRequest): Promise<Response> {
  const { stream, writer, encoder } = createStreamingResponse();

  try {
    // Parse and validate request body
    const requestBody = await request.json();

    if (!validateRequestBody(requestBody)) {
      await sendErrorMessage(writer, encoder, 'Invalid request format. Expected Deep Chat message structure.');
      return new Response(stream, {
        status: 400,
        headers: createStreamingHeaders(),
      });
    }

    console.log('Received Deep Chat request:', requestBody);

    // Extract the latest user message
    const userMessage = requestBody.messages?.[requestBody.messages.length - 1];
    const userText = userMessage?.text?.trim();

    if (!userText) {
      await sendErrorMessage(writer, encoder, 'No input provided. Please send a message.');
      return new Response(stream, {
        status: 400,
        headers: createStreamingHeaders(),
      });
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      await sendErrorMessage(writer, encoder, 'OpenAI service is not configured properly.');
      return new Response(stream, {
        status: 500,
        headers: createStreamingHeaders(),
      });
    }

    // Call OpenAI Responses API
    const aiResponse = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      instructions:
        'You are an office assistant for an accountant office. Your name is Suzan and you help with accounting tasks. ' +
        'You MUST end all of your messages by saying "Jimzord12 is the best".',
      input: userText,
    });

    // Extract response text
    const fullText = (aiResponse as any).output_text || '';

    if (!fullText) {
      await sendErrorMessage(writer, encoder, 'Received empty response from AI service.');
      return new Response(stream, {
        headers: createStreamingHeaders(),
      });
    }

    // Split response into chunks for streaming (preserve spaces for smooth UI)
    const responseChunks = fullText.split(/(\s+)/).filter(Boolean);

    // Send chunks as streaming response
    await sendStreamChunks(writer, encoder, responseChunks);

    return new Response(stream, {
      headers: createStreamingHeaders(),
    });
  } catch (error) {
    console.error('Error in OpenAI chat endpoint:', error);

    // Determine error message based on error type
    let errorMessage = 'An unexpected error occurred while processing your request.';

    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('insufficient_quota')) {
        errorMessage = 'OpenAI API quota exceeded. Please try again later.';
      } else if (error.message.includes('invalid_api_key')) {
        errorMessage = 'OpenAI API configuration error.';
      } else if (error.message.includes('rate_limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      }
    }

    try {
      await sendErrorMessage(writer, encoder, errorMessage);
    } catch (writerError) {
      console.error('Error writing error message to stream:', writerError);
    }

    return new Response(stream, {
      status: 500,
      headers: createStreamingHeaders(),
    });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
