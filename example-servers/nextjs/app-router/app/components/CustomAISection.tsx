import {DeepChat} from 'deep-chat-react';
import {RequestDetails} from '../../../../../component/src/types/interceptors';

type Props = {
  styles: Record<string, string>;
};

const CustomAISection = (props: Props) => {
  const {styles} = props;

  return (
    <>
      <h1 id={styles.pageTitle}>
        Deep Chat test ground for{' '}
        <a href="https://github.com/OvidijusParsiunas/deep-chat/tree/main/example-servers/nextjs">NextJs</a>
      </h1>
      <h1>Server for a custom API</h1>
      <div className={styles.components}>
        <div className={styles.diagonalLine} style={{background: '#e8f5ff'}}></div>
        {/* by setting maxMessages requestBodyLimits to 0 or lower - each request will send full chat history:
            https://deepchat.dev/docs/connect/#requestBodyLimits */}
        {/* If you don't want to or can't edit the target service, you can process the outgoing message using
            responseInterceptor and the incoming message using responseInterceptor:
            https://deepchat.dev/docs/interceptors */}
        <DeepChat
          style={{borderRadius: '10px'}}
          introMessage={{text: 'Send a chat message to an example server.'}}
          connect={{url: '/api/custom/chat'}}
          requestBodyLimits={{maxMessages: -1}}
          requestInterceptor={(details: RequestDetails) => {
            console.log(details);
            return details;
          }}
          responseInterceptor={(response: any) => {
            console.log(response);
            return response;
          }}
        />
        <DeepChat
          style={{borderRadius: '10px'}}
          introMessage={{text: 'Send a streamed chat message to an example server.'}}
          connect={{url: '/api/custom/chat-stream', stream: true}}
        />
        <DeepChat
          style={{borderRadius: '10px'}}
          introMessage={{text: 'Send files to an example server.'}}
          connect={{url: '/api/custom/files'}}
          audio={true}
          images={true}
          gifs={true}
          camera={true}
          microphone={true}
          mixedFiles={true}
          textInput={{placeholder: {text: 'Send a file!'}}}
          validateInput={(_?: string, files?: File[]) => {
            return !!files && files.length > 0;
          }}
        />
      </div>
    </>
  );
};

export default CustomAISection;
