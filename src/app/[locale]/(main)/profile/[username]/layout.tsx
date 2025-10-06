import { getUserByUsername } from "@/lib/firebase/firestore";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}): Promise<Metadata> {
  const { username, locale } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  const t = await getTranslations({ locale, namespace: "profile" });

  return {
    title: `${user.displayName} (@${user.username}) | Code Snippet Platform`,
    description: `View ${user.displayName}'s code snippets and profile. ${user.snippetCount} snippets shared.`,
    openGraph: {
      title: `${user.displayName} (@${user.username})`,
      description: `${t("viewProfile")} ${user.displayName}`,
      type: "profile",
    },
  };
}

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
