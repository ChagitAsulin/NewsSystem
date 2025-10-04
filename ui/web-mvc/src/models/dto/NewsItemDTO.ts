export type NewsItemDTO = {
  id: string;
  title: string;
  summary: string;
  image_public_id?: string;
  topics?: string[];
  classification?: string;
  tags?: string[];
  entities?: Array<{ type: 'person' | 'location' | 'org' | 'misc'; value: string; salience?: number }>;
  created_at?: string; // ISO
};
