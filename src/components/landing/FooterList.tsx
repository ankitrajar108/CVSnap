"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";

interface FooterLink {
  href: string;
  text: string;
}

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
  children?: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({
  title,
  links,
  children,
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-gray-700 pb-2 mb-4">
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
            prefetch={false}
          >
            <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors duration-200"></span>
            {link.text}
          </Link>
        </li>
      ))}
      {children}
    </ul>
  </div>
);

interface LinkSection {
  title: string;
  links: FooterLink[];
  children?: React.ReactNode;
}

const FooterList: React.FC = () => {
  const linkSections: LinkSection[] = [
    {
      title: "LINKS",
      links: [
        { href: "/contact", text: "Contact Us" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { href: "/terms", text: "Terms of services" },
        { href: "/privacy", text: "Privacy policy" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-md">
      {linkSections.map((section, index) => (
        <FooterSection
          key={index}
          title={section.title}
          links={section.links}
        />
      ))}
    </div>
  );
};

export default FooterList;
