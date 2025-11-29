/*

export const mediaClient = {
  toUrl: (publicId?: string) =>
    publicId ? `${process.env.NEXT_PUBLIC_MEDIA_BASE}/image/upload/${publicId}.jpg` : undefined,
};

*/

/**
 * @file mediaClient.ts
 * @description Constructs URLs for media assets (images, videos).
 * Abstracts public ID to full URL conversion, supporting dynamic media loading.
 */

export const mediaClient = {
  /**
   * Returns a fully qualified image URL from a public ID.
   * @param publicId - Media public ID
   * @returns Full URL to the image or undefined if no ID
   */
  toUrl: (publicId?: string): string | undefined =>
    publicId ? `${process.env.NEXT_PUBLIC_MEDIA_BASE}/image/upload/${publicId}.jpg` : undefined,
};
