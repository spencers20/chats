import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
const GROQ_API_KEY ="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"

const groq = new Groq({ apiKey:GROQ_API_KEY });


export async function POST(req:NextRequest){
    try{
        const body= await req.json()
        const message= body.inputMessage
        // Arrange the work and provide better indentation
        // const formattedMessage = message.trim();
        const prompt = `
            You are a health assistant given the symptoms: ${message}
            
            Please provide your response in a well-organized format with proper indentation and line breaks where appropriate.
            
            Briefly tell the user:
            1. What they are suffering from (if any disease is identifiable)
            2. A quick first aid remedy
        `;
       

        const chatCompletion =groq.chat.completions.create({
            messages: [
            {
                role: "user",
                content: prompt
            },
            ],
            model: "llama3-8b-8192",
            // max_tokens: ,
            temperature: 0.4,

        });

        const results=  (await chatCompletion).choices[0]?.message?.content

        return NextResponse.json({results, status :200})
    }catch(e){
        return NextResponse.json({error:e})
    };
    
}







