import dynamic from 'next/dynamic';

type Props = {
  styles: Record<string, string>;
};

const CohereSection = (props: Props) => {
  // need to import the component dynamically as it uses the 'window' property
  const DeepChat = dynamic(() => import('deep-chat-react').then((mod) => mod.DeepChat), {
    ssr: false,
  });

  const { styles } = props;
  return (
    <>
      <h1 className={styles.serverTitle}>Server for Cohere</h1>
      <a href="https://docs.cohere.com/docs" target="_blank" rel="noreferrer">
        <img
          className={styles.serverTitleIcon}
          src="https://raw.githubusercontent.com/OvidijusParsiunas/deep-chat/HEAD/website/static/img/cohereLogo.png"
          style={{ width: 37, marginBottom: '-8px', marginLeft: '4px' }}
          alt={'Title icon'}
        />
      </a>
      <h3>Make sure to set the COHERE_API_KEY environment variable in your server</h3>
      <div className={styles.components}>
        <div className={styles.diagonalLine} style={{ background: '#fff2f7' }}></div>
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{
            text: 'Send a chat message through an example server to Cohere. You may need to apply for Coral access before using this.',
          }}
          connect={{ url: '/api/cohere/chat' }}
          requestBodyLimits={{ maxMessages: -1 }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{
            text: 'Send start text through an example server to Cohere and receive its genereated completion. E.g. "Please explain to me how LLMs work"',
          }}
          connect={{ url: '/api/cohere/generate' }}
          textInput={{ placeholder: { text: 'Once upon a time...' } }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
        <DeepChat
          style={{ borderRadius: '10px' }}
          introMessage={{ text: 'Send text through an example server to Cohere and receive its summary.' }}
          connect={{ url: '/api/cohere/summarize' }}
          textInput={{ placeholder: { text: 'Insert text to summarize' } }}
          errorMessages={{ displayServiceErrorMessages: true }}
        />
      </div>
    </>
  );
};

export default CohereSection;
