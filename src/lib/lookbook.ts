import raw from "@/content/lookbook.json";

export type LookbookShot = {
  src: string;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
  span?: "wide" | "tall";
  caption?: string;
};

export type Lookbook = {
  title: string;
  subtitle: string;
  credits: { photographer: string; stylist: string; models: string };
  shots: LookbookShot[];
};

export const lookbook: Lookbook = raw as Lookbook;
