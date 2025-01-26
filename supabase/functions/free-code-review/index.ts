import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiKey = Deno.env.get('GEMINI_KEY');
    if (!geminiKey) {
      throw new Error('GEMINI_KEY not configured');
    }

    const { code } = await req.json();
    if (!code) {
      throw new Error('No code provided');
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Please review this code and provide feedback on potential improvements, bugs, and best practices:
    
    ${code}`;

    const result = await model.generateContent(prompt);
    const review = result.response.text();

    return new Response(
      JSON.stringify({ review }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in free-code-review function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});