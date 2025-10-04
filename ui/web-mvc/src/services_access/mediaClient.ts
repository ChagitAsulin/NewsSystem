
export const mediaClient = {
  toUrl: (publicId?: string) =>
    publicId ? `${process.env.NEXT_PUBLIC_MEDIA_BASE}/image/upload/${publicId}.jpg` : undefined,
};
