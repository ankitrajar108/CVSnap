import { Metadata } from "next";
import Privacy from "./Privacy";

export const metadata: Metadata = {
  title: "The #1 AI Photo Generator",
  description: "Privacy Policy for CVSNAP AI headshot service.",
};

export default function Page() {
  return <Privacy />;
}
