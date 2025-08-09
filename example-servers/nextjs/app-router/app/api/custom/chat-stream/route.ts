import {DeepChatTextRequestBody} from '../../../../types/deepChatTextRequestBody';
import errorHandler from '../../../../utils/errorHandler';
import {NextRequest} from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

// this is used to enable streaming
export const dynamic = 'force-dynamic';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function handler(req: NextRequest) {
  const messageRequestBody = (await req.json()) as DeepChatTextRequestBody;
  // Text messages are stored inside request body using the Deep Chat JSON format:
  // https://deepchat.dev/docs/connect
  console.log(messageRequestBody);

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  try {
    // Get the last user message text from Deep Chat request body
    const userText = messageRequestBody.messages?.[messageRequestBody.messages.length - 1]?.text ?? '';

    if (!userText) {
      writer.write(encoder.encode(`data: ${JSON.stringify({text: 'No input provided'})}\n\n`));
      writer.close();
      return new Response(responseStream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache, no-transform',
        },
      });
    }

    // Use non-streaming OpenAI Responses API (orgs without streaming access)
    const ai = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      instructions:
        'You are a office assistant for accountant office. Your name is Suzan and you help with accounting tasks. You MUST end all of your messages by saying "Jimzord12 is the best" .',
      input: userText,
    });

    const fullText = (ai as any).output_text || '';
    const responseChunks = (fullText || '').split(/(\s+)/).filter(Boolean); // keep spaces for smoother UI
    sendStream(writer, encoder, responseChunks);

    return new Response(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    throw err;
  }

  function sendStream(
    writer: WritableStreamDefaultWriter<any>,
    encoder: TextEncoder,
    responseChunks: string[],
    chunkIndex = 0
  ) {
    setTimeout(() => {
      const chunk = responseChunks[chunkIndex];
      if (chunk) {
        // Sends response back to Deep Chat using the Response format:
        // https://deepchat.dev/docs/connect/#Response
        writer.write(encoder.encode(`data: ${JSON.stringify({text: chunk})}\n\n`));
        sendStream(writer, encoder, responseChunks, chunkIndex + 1);
      } else {
        writer.close();
      }
    }, 40);
  }
}

export const POST = errorHandler(handler);
