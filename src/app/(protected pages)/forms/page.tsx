import { redirect } from "next/navigation";
import { Metadata } from "next";
import FormJourney from "./FormJourney";

export const metadata: Metadata = {
  title: "The #1 AI Photo Generator",
  description: "Create your AI professional headshots - step by step guide.",
};

export default async function Page() {
  return (
    <div className="w-full min-h-screen">
      <FormJourney />
    </div>
  );
}
