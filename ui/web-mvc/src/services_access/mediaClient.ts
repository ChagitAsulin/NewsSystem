/*

export const mediaClient = {
  toUrl: (publicId?: string) =>
    publicId ? `${process.env.NEXT_PUBLIC_MEDIA_BASE}/image/upload/${publicId}.jpg` : undefined,
};

*/

/**
 * Media Client to construct URLs for images/videos
 */
export const mediaClient = {
  /**
   * Converts public media ID to full URL
   * @param publicId Media public ID
   */
  toUrl: (publicId?: string): string | undefined => {
    if (!publicId) console.warn("mediaClient.toUrl called without publicId");
    const url = publicId ? `${process.env.NEXT_PUBLIC_MEDIA_BASE}/image/upload/${publicId}.jpg` : undefined;
    console.info(`mediaClient.toUrl -> ${url}`);
    return url;
  },
};

