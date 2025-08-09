import dynamic from 'next/dynamic';

type Props = {
  styles: Record<string, string>;
};

const StabilityAISection = (props: Props) => {
  // need to import the component dynamically as it uses the 'window' property
  const DeepChat = dynamic(() => import('deep-chat-react').then((mod) => mod.DeepChat), {
    ssr: false,
  });

  const { styles } = props;

  return (
    <>
      <h1 className={styles.serverTitle}>Server for Stability AI</h1>
      <a href="https://platform.stability.ai/" target="_blank" rel="noreferrer">
        <img
          className="server-title-icon"
          src="https://raw.githubusercontent.com/OvidijusParsiunas/deep-chat/HEAD/website/static/img/stabilityAILogo.png"
          style={{ width: 34, marginBottom: '-6px', marginLeft: '10px' }}
          alt={'Title icon'}
        />
      </a>
      <h3>Make sure to set the STABILITY_API_KEY environment variable in your server</h3>
      <div className={styles.components}>
        <div className={styles.diagonalLine} style={{ background: '#f7efff' }}></div>
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{ text: 'Send a prompt through an example server to Stability AI to generate an image.' }}
          connect={{ url: '/api/stabilityai/text-to-image' }}
          textInput={{ placeholder: { text: 'Describe an image' } }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
        {/* If not using the camera, you can use an example image here:
              https://github.com/OvidijusParsiunas/deep-chat/blob/main/example-servers/ui/assets/example-image.png */}
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{
            text: 'Send an image along with a description through an example server to Stability AI in order to generate a new one with the described changes.',
          }}
          connect={{ url: '/api/stabilityai/image-to-image' }}
          camera={{ files: { maxNumberOfFiles: 1, acceptedFormats: '.png' } }}
          images={{ files: { maxNumberOfFiles: 1, acceptedFormats: '.png' } }}
          textInput={{ placeholder: { text: 'Describe the desired changes' } }}
          errorMessages={{ displayServiceErrorMessages: true }}
          validateInput={(text?: string, files?: File[]) => {
            return !!text && text?.trim() !== '' && !!files && files.length > 0;
          }}
        />
        {/* If not using the camera, you can use an example image here:
              https://github.com/OvidijusParsiunas/deep-chat/blob/main/example-servers/ui/assets/example-image.png */}
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{
            text: 'Send an image through an example server to Stability AI in order to generate a new one with a higher resolution.',
          }}
          connect={{ url: '/api/stabilityai/image-upscale' }}
          camera={{ files: { maxNumberOfFiles: 1, acceptedFormats: '.png' } }}
          images={{ files: { maxNumberOfFiles: 1, acceptedFormats: '.png' } }}
          textInput={{ disabled: true, placeholder: { text: 'Send an image' } }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
      </div>
    </>
  );
};

export default StabilityAISection;
