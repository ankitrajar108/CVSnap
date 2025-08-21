'use server'

import { createClient } from "@/utils/supabase/server";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContact(formData: ContactFormData) {
  try {
    const supabase = createClient();
    
    // Try to insert into contact table
    const { data, error } = await supabase
      .from("contact")
      .insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error("Error inserting contact form data:", error);
      
      // If table doesn't exist (error code 42P01), provide helpful message
      if (error.code === '42P01') {
        console.log("Contact table doesn't exist. Need to create it in Supabase.");
        return { 
          success: false, 
          message: "Contact table not found. Please run the SQL script in your Supabase dashboard first." 
        };
      }
      
      // Other database errors
      return { 
        success: false, 
        message: `Database error: ${error.message}` 
      };
    }

    console.log("Contact form submitted successfully:", data);
    return { success: true, message: "Contact form submitted successfully! We'll get back to you soon." };
    
  } catch (error) {
    console.error("Unexpected error in submitContact:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred. Please try again." 
    };
  }
}
