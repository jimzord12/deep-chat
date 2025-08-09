import {DeepChat} from 'deep-chat-react';
import Image from 'next/image';
import React from 'react';
import {gpt5_mini} from '../constants/openai.constants';

interface OpenAISectionProps {
  styles: {
    [key: string]: string;
  };
}

const model = gpt5_mini;

const OpenAISection = ({styles}: OpenAISectionProps) => {
  return (
    <>
      <h1 className={styles.serverTitle}>Server for OpenAI</h1>
      <a href="https://openai.com/blog/openai-api" target="_blank" rel="noreferrer">
        <Image
          className={styles.serverTitleIcon}
          width={26}
          height={26}
          src="https://raw.githubusercontent.com/OvidijusParsiunas/deep-chat/HEAD/website/static/img/openAILogo.png"
          style={{width: 26, marginBottom: '-1px'}}
          alt={'Title icon'}
        />
      </a>
      <h3>Make sure to set the OPENAI_API_KEY environment variable in your server</h3>
      <div className={styles.components}>
        <div className={styles.diagonalLine} style={{background: '#f2f2f2'}}></div>
        {/* additionalBodyProps is used to set other properties that will be sent to the server along with the message:
            https://deepchat.dev/docs/connect#connect */}
        {/* by setting maxMessages requestBodyLimits to 0 or lower - each request will send full chat history:
            https://deepchat.dev/docs/connect/#requestBodyLimits */}
        <DeepChat
          style={{borderRadius: '10px'}}
          introMessage={{text: 'Send a chat message through an example server to OpenAI.'}}
          connect={{url: '/api/openai/chat', additionalBodyProps: {model: model.name}}}
          requestBodyLimits={{maxMessages: -1}}
          errorMessages={{displayServiceErrorMessages: true}}
        />
        <DeepChat
          style={{borderRadius: '10px'}}
          introMessage={{text: 'Send a streamed chat message through an example server to OpenAI.'}}
          connect={{url: '/api/openai/chat-stream', stream: true, additionalBodyProps: {model: model.name}}}
          
          requestBodyLimits={{maxMessages: -1}}
          errorMessages={{displayServiceErrorMessages: true}}
        />
        {/* If not using the camera, you can use an example image here:
            https://github.com/OvidijusParsiunas/deep-chat/blob/main/example-servers/ui/assets/example-image.png */}
        <DeepChat
          style={{borderRadius: '10px'}}
          introMessage={{
            text: 'Send a 1024x1024 .png image through an example server to OpenAI, which will generate its variation.',
          }}
          connect={{url: '/api/openai/image'}}
          camera={{files: {maxNumberOfFiles: 1, acceptedFormats: '.png'}}}
          images={{files: {maxNumberOfFiles: 1, acceptedFormats: '.png'}}}
          textInput={{disabled: true, placeholder: {text: 'Send an image!'}}}
          errorMessages={{displayServiceErrorMessages: true}}
        />
      </div>
    </>
  );
};

export default OpenAISection;
