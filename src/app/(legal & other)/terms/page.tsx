import { Metadata } from "next";
import Terms from "./Terms";

export const metadata: Metadata = {
  title: "The #1 AI Photo Generator",
  description: "Terms and Conditions for CVSNAP AI headshot service.",
};

export default function Page() {
  return <Terms />;
}
