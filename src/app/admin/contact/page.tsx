"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Set page title
  useEffect(() => {
    document.title = "The #1 AI Photo Generator";
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(`Failed to fetch messages: ${error.message}`);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching contact messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("contact")
        .update({ status })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
      } else {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, status } : msg
        ));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "read": return "bg-yellow-100 text-yellow-800";
      case "replied": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mainWhite">
        <Header userAuth={true} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainBlack"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mainWhite">
      <Header userAuth={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-mainBlack">Contact Messages</h1>
          <button
            onClick={fetchMessages}
            className="bg-mainBlack text-mainWhite px-4 py-2 rounded-md hover:bg-opacity-90"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No contact messages yet.</p>
            <p className="text-gray-400 mt-2">
              Messages will appear here when users submit the contact form.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-mainBlack mb-1">
                      {message.subject}
                    </h3>
                    <p className="text-gray-600">
                      From: <strong>{message.name}</strong> ({message.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                    <select
                      value={message.status}
                      onChange={(e) => updateStatus(message.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-mainBlack whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                    className="bg-mainGreen text-mainBlack px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => updateStatus(message.id, "read")}
                    className="bg-gray-200 text-mainBlack px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={message.status === "read"}
                  >
                    Mark as Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
