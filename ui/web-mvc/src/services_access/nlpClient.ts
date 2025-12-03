//export const nlpClient={};

/**
 * NLP Client placeholder
 */
export const nlpClient = {
  /**
   * Analyze sentiment (not yet implemented)
   * @param text Input text
   */
  analyzeSentiment: async (text: string): Promise<number> => {
    console.warn("nlpClient.analyzeSentiment not implemented yet");
    console.info(`nlpClient.analyzeSentiment called: length=${text.length}`);
    return 0;
  },
};
