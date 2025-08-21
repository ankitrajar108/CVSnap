"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import { submitContact } from "@/action/submitContact";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
}

export default function Contact(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // Set page title
  useEffect(() => {
    document.title = "The #1 AI Photo Generator";
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    let tempErrors: FormErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.subject) tempErrors.subject = "Subject is required";
    if (!formData.message) tempErrors.message = "Message is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});
      
      try {
        const result = await submitContact(formData);
        
        if (result.success) {
          setIsSubmitted(true);
          setSubmitMessage(result.message);
        } else {
          setErrors({ general: result.message });
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        setErrors({ 
          general: "An unexpected error occurred. Please try again." 
        });
      }
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mainWhite text-mainBlack flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {!isSubmitted && (
            <>
              <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
              <p className="mb-8 text-center text-lg">
                For any query or refund request, send us a message and we&apos;ll respond as soon as possible.
              </p>
            </>
          )}
          <div className="bg-mainGreen bg-opacity-10 p-8 rounded-lg shadow-lg">
            {isSubmitted ? (
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
                <p className="text-lg mb-4">{submitMessage || "Your message has been sent successfully."}</p>
                <p className="text-gray-600">We&apos;ll get back to you as soon as possible.</p>
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                    setSubmitMessage("");
                  }}
                  className="mt-6 text-mainBlack underline hover:text-gray-600"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {errors.general}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-mainWhite text-mainBlack rounded-md border border-mainBlack focus:outline-none focus:ring-2 focus:ring-mainGreen"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 bg-mainWhite text-mainBlack rounded-md border ${
                      errors.email ? "border-red-500" : "border-mainBlack"
                    } focus:outline-none focus:ring-2 focus:ring-mainGreen`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-2 font-semibold">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full p-3 bg-mainWhite text-mainBlack rounded-md border ${
                      errors.subject ? "border-red-500" : "border-mainBlack"
                    } focus:outline-none focus:ring-2 focus:ring-mainGreen`}
                    required
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 font-semibold">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 bg-mainWhite text-mainBlack rounded-md border ${
                      errors.message ? "border-red-500" : "border-mainBlack"
                    } focus:outline-none focus:ring-2 focus:ring-mainGreen`}
                    required
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-mainBlack text-mainWhite py-3 px-6 rounded-full hover:bg-opacity-90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer className="bg-mainBlack text-mainWhite" />
    </div>
  );
}
