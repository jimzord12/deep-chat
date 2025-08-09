import dynamic from 'next/dynamic';

type Props = {
  styles: Record<string, string>;
};

const HuggingFaceSection = (props: Props) => {
  // need to import the component dynamically as it uses the 'window' property
  const DeepChat = dynamic(() => import('deep-chat-react').then((mod) => mod.DeepChat), {
    ssr: false,
  });

  const { styles } = props;
  return (
    <>
      <h1 className={styles.serverTitle}>Server for Hugging Face</h1>
      <a href="https://huggingface.co/docs/api-inference/index" target="_blank" rel="noreferrer">
        <img
          className={styles.serverTitleIcon}
          src="https://raw.githubusercontent.com/OvidijusParsiunas/deep-chat/HEAD/website/static/img/huggingFaceLogo.png"
          style={{ width: 36, marginBottom: '-6px', marginLeft: '7px' }}
          alt={'Title icon'}
        />
      </a>
      <h3>Make sure to set the HUGGING_FACE_API_KEY environment variable in your server</h3>
      <div className={styles.components}>
        <div className={styles.diagonalLine} style={{ background: '#fffdd9' }}></div>
        {/* by setting maxMessages requestBodyLimits to 0 or lower - each request will send full chat history:
            https://deepchat.dev/docs/connect/#requestBodyLimits */}
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{ text: 'Send a conversation message through an example server to Hugging Face.' }}
          requestBodyLimits={{ maxMessages: -1 }}
          connect={{ url: '/api/huggingface/conversation' }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
        {/* If not using the camera, you can use an example image here:
            https://github.com/OvidijusParsiunas/deep-chat/blob/main/example-servers/ui/assets/example-image.png */}
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{
            text: 'Send an image through an example server to Hugging Face and retrieve its classification.',
          }}
          connect={{ url: '/api/huggingface/image' }}
          camera={{ files: { maxNumberOfFiles: 1, acceptedFormats: '.png' } }}
          images={{ files: { maxNumberOfFiles: 1, acceptedFormats: '.png' } }}
          textInput={{ disabled: true, placeholder: { text: 'Send an image!' } }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
        {/* If not using the microphone, you can send an example audio file here:
            https://github.com/OvidijusParsiunas/deep-chat/blob/main/example-servers/ui/assets/example-audio.m4a */}
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{
            text: 'Send an audio file through an example server to Hugging Face and recieve its transcript.',
          }}
          connect={{ url: '/api/huggingface/speech' }}
          audio={{ files: { maxNumberOfFiles: 1 } }}
          microphone={{ files: { maxNumberOfFiles: 1 } }}
          textInput={{ disabled: true, placeholder: { text: 'Send an audio file!' } }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
      </div>
    </>
  );
};

export default HuggingFaceSection;
