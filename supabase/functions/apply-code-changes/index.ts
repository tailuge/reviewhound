
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiKey = Deno.env.get('GEMINI_KEY');
    if (!geminiKey) {
      throw new Error('GEMINI_KEY not configured');
    }

    const { code, review, filePath } = await req.json();
    if (!code || !review) {
      throw new Error('Code and review are required');
    }

    console.log('Initializing Gemini for applying changes');
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a code modification assistant. Given the following code from file "${filePath}" and the review suggestions, please provide the updated code that implements the suggested changes. Return ONLY the modified code without any explanations or markdown formatting.

Original code:
${code}

Review suggestions:
${review}`;

    console.log('Sending request to Gemini for code modifications');
    const result = await model.generateContent(prompt);
    const modifiedCode = result.response.text();
    console.log('Received modified code from Gemini');

    return new Response(
      JSON.stringify({ modifiedCode }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in apply-code-changes function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
