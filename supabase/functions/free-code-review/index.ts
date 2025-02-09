
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.1.3";

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

    const { code, filePath, prompt, model } = await req.json();
    if (!code) {
      throw new Error('No code provided');
    }

    console.log('Initializing Gemini with provided key');
    const genAI = new GoogleGenerativeAI(geminiKey);
    const modelInstance = genAI.getGenerativeModel({ model: model || "gemini-2.0-flash" });

    // Use custom prompt if provided, otherwise use default
    const promptText = prompt || `Please review this code from file "${filePath}" and provide feedback on potential improvements, bugs, and best practices.`;

    console.log('Sending request to Gemini');
    const result = await modelInstance.generateContent(promptText);
    const review = result.response.text();
    console.log('Received response from Gemini');

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
