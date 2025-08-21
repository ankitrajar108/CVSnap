import { Metadata } from "next";
import Refund from "./Refund";

export const metadata: Metadata = {
  title: "The #1 AI Photo Generator",
  description: "Refund Policy for CVSNAP AI headshot service.",
};

export default function Page() {
  return <Refund />;
}
