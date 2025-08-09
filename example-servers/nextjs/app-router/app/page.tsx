/* eslint-disable @next/next/no-img-element */
// Define this when using the App router API
'use client';

// !!Useful links at the bottom!!
// import {DeepChat as DeepChatCore} from 'deep-chat'; <- type
import dynamic from 'next/dynamic';
import CohereSection from './components/CohereSection';
import CustomAISection from './components/CustomAISection';
import HuggingFaceSection from './components/HuggingFaceSection';
import OpenAISection from './components/OpenAISection';
import StabilityAISection from './components/StabilityAISection';
import styles from './style.module.css';

// Info to get a reference for the component:
// https://github.com/OvidijusParsiunas/deep-chat/issues/59#issuecomment-1839483469

// Info to add types to a component reference:
// https://github.com/OvidijusParsiunas/deep-chat/issues/59#issuecomment-1839487740

export default function Home() {
  // need to import the component dynamically as it uses the 'window' property
  const DeepChat = dynamic(() => import('deep-chat-react').then((mod) => mod.DeepChat), {
    ssr: false,
  });

  return (
    <>
      <main className={styles.main}>
        {/* Custom - Section */}
        <CustomAISection styles={styles} />

        {/* OpenAI - Section */}
        <OpenAISection styles={styles} />

        {/* Hugging Face - Section */}
        <HuggingFaceSection styles={styles} />

        {/* Stability AI - Section */}
        <StabilityAISection styles={styles} />

        {/* Cohere - Section */}
        <CohereSection styles={styles} />
      </main>
    </>
  );
}
