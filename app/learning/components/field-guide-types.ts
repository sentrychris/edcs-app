export interface FieldGuideTopic {
  slug: string;
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: "available";
  signal: string;
  overview: string[];
  keyPoints: Array<{ label: string; detail: string }>;
  fieldNotes: string[];
  reference: Array<{ label: string; value: string; note: string }>;
}
