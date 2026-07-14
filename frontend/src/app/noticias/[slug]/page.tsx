import { redirect } from "next/navigation";

interface LegacyNewsDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyNewsDetail({ params }: LegacyNewsDetailProps) {
  const { slug } = await params;
  redirect(`/vida-institucional/${slug}`);
}
