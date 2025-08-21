"use client";
import React, { useState } from 'react';

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        className="w-full flex justify-between items-center text-left py-5 px-6 text-white hover:bg-white/5 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{question}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="text-gray-300 p-6 pt-0">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function Faq() {
  return (
    <section className="w-full py-8 md:py-16 lg:py-24 bg-mainBlack" id="faq">
      <div className="max-w-section mx-auto px-section">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-mainWhite">
            Frequently Asked Questions
          </h2>
          <div className="flex items-center justify-center">
            <span className="text-mainOrange text-xl mr-2 hidden sm:inline">
              📷
            </span>
            <p className="text-mainWhite text-base">
              Full commercial rights and ownership of your AI-generated
              headshots
            </p>
          </div>
          <p className="text-mainWhite text-base mt-3">
            Get answers to common questions about our professional AI-generated
            headshot service for individuals and remote teams.
          </p>
        </div>

        {/* FAQ Items container */}
        <div className="max-w-3xl mx-auto bg-gray-900/50 border border-white/10 rounded-xl overflow-hidden">
          <FaqItem
            question="What kind of photos do I need to upload?"
            answer="Make variety a priority. Varied facial expressions and varied backgrounds, taken at various times of the day, are the keys to high quality input photos. Oh, and minimal makeup and accessories, please!"
          />
          <FaqItem
            question="What do you do with my uploaded photos?"
            answer="The photos you upload are used to train our AI model so it can create realistic AI headshots. These input photos are deleted within 7 days, but you can instantly delete them at any time with our 'Delete' button."
          />
          <FaqItem
            question="Who owns my AI photos?"
            answer="You do. We grant you full commercial license and ownership over your photos."
          />
          <FaqItem
            question="What if I don't like my photos?"
            answer="No problem. We promise 3-6 keepers in every order. If you don't find at least 3 incredible headshots, just don't download any of your results and we'll refund you in full."
          />
          <FaqItem
            question="How long does an AI headshot take?"
            answer="We don't cut corners when it comes to generating photorealistic AI headshots. We're not the fastest, but you'll always get same-day results with CVSNAP. Our Executive package is delivered in 1 hour or less."
          />
          <FaqItem
            question="What do people misunderstand about AI headshots?"
            answer="Not every photo is perfect. Due to the nature of AI, you might see some strange photos. CVSNAP tries to make this clear from the start: not every photo is perfect, but we promise you'll find a profile-worthy headshot in every order to make it all worth it."
          />
          <FaqItem
            question="How many good photos can I expect?"
            answer="The amount of keeper headshots you get back will largely depend on the photos you provide us with. Customers who make an effort to follow the instructions closely often walk away with 8-10+ incredible photos. At the very least, we guarantee you'll get a Profile-Worthy headshot back."
          />
          <FaqItem
            question="Is there a free AI headshot generator?"
            answer="Yes, CVSNAP has a 100% free AI headshot generator for simple photos. No email is required and no credit card is required. It is completely free."
          />
          <FaqItem
            question="What is the most realistic headshot AI?"
            answer="CVSNAP is the most realistic headshot AI with the most reviews. It's the only major AI headshot generator using Flux to generate realistic AI headshots. CVSNAP is regularly used by professionals, companies and photographers."
          />
          <FaqItem
            question="Can I use AI headshots on LinkedIn?"
            answer="25% of CVSNAP customers use their AI headshots on LinkedIn. It's totally okay to use AI headshots on LinkedIn."
          />
          <FaqItem
            question="Can ChatGPT generate headshots?"
            answer="Yes, ChatGPT can generate very basic headshots. These headshots aren't realistic enough to use professionally, but they can be fun to play around with. Use CVSNAP for AI headshots you can use professionally."
          />
          <FaqItem
            question="What AI should I use for headshots?"
            answer="The best AI headshot generators are using Flux to maximize realism. Right now, CVSNAP is the only major headshot AI powered by Flux. You can get up to 200 professional AI headshots within 2 hours"
          />
        </div>
      </div>
    </section>
  );
}
