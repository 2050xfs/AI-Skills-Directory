
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Skill, BlogPost } from "../types";

// Helper to get AI Client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Outcome Matcher / Search Grounding
export const matchSkillsWithIntent = async (query: string, availableSkills: string[]): Promise<string> => {
  const ai = getAiClient();
  // Using Flash for fast reasoning/ranking
  const prompt = `
    User Query: "${query}"
    
    Available Skills Database (JSON):
    ${JSON.stringify(availableSkills)}
    
    Task:
    1. Analyze the user's intent.
    2. Search for the most relevant skills.
    3. Return a JSON array of skill names that match, sorted by relevance.
    
    Format: just the JSON array of strings, nothing else.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return response.text || "[]";
  } catch (error) {
    console.error("Error matching skills:", error);
    return "[]";
  }
};

// 2. Sentinel Code Audit
export const auditCodeSnippet = async (code: string): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    You are the Sentinel, an autonomous security agent.
    Analyze the following code snippet for high-risk primitives (fs:write, network calls, shell execution).
    
    Code:
    \`\`\`
    ${code}
    \`\`\`
    
    Return a JSON object with:
    - riskScore (0-100)
    - findings (array of strings)
    - status (APPROVED | FLAGGED | QUARANTINED)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro for complex reasoning
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("Error auditing code:", error);
    throw error;
  }
};

// 3. Blog Post Generation (Gemini 3 Pro - Most Reliable)
export const generateBlogPost = async (skill: Skill): Promise<BlogPost> => {
  const ai = getAiClient();
  const prompt = `
    You are 'Writer-01', an autonomous AI technical content strategist.
    Write a comprehensive, SEO-optimized blog post for the following Enterprise AI Skill.

    Skill Name: ${skill.name}
    Description: ${skill.description}
    Category: ${skill.category}
    Outcomes: ${skill.outcomes.join(', ')}

    Requirements:
    1. Title: Catchy and professional.
    2. Content: 400-600 words, formatted in Markdown. Include headers, bullet points for benefits, and a "Technical Deep Dive" section.
    3. Tone: Authoritative, futuristic, enterprise-grade.
    4. SEO: Provide a meta description and keywords.

    Output JSON Schema:
    {
      "title": "string",
      "content": "markdown string",
      "seoDescription": "string",
      "keywords": ["string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            seoDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "seoDescription", "keywords"]
        }
      }
    });

    if (!response.text) throw new Error("No text generated");
    
    const data = JSON.parse(response.text);
    return {
      ...data,
      generatedDate: new Date().toISOString(),
      authorAgent: "Writer-01 (Gemini 3 Pro)"
    };
  } catch (error) {
    console.error("Blog generation error:", error);
    throw error;
  }
};

// 4. Blog Image Generation (Nano Banana - Gemini 2.5 Flash Image)
export const generateBlogImage = async (skillName: string, category: string): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    A futuristic, abstract, high-tech 3D illustration representing ${skillName} in the context of ${category}.
    Cyberpunk aesthetic, neon blue and violet lighting, isometric view, clean lines, data visualization elements.
    Minimalist background. High resolution, 4k.
  `;

  try {
    // Using Nano Banana (gemini-2.5-flash-image) as requested for images
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [{ text: prompt }]
      },
      // Note: nano banana does not support imageConfig like aspect ratio in the same way 3-pro does, 
      // but standard generation works.
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Nano Banana");
  } catch (error) {
    console.error("Image generation error:", error);
    // Return a fallback placeholder if generation fails to avoid breaking UI
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }
};

// 5. Generate Image (Gemini 3 Pro Image)
export const generateImage = async (params: { prompt: string, size: '1K'|'2K'|'4K', aspectRatio: '1:1'|'3:4'|'4:3'|'9:16'|'16:9' }): Promise<string> => {
  const ai = getAiClient();
  // Using gemini-3-pro-image-preview for high quality and size control
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: params.prompt }]
    },
    config: {
      imageConfig: {
        imageSize: params.size,
        aspectRatio: params.aspectRatio
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// 6. Edit Image (Gemini 2.5 Flash Image)
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getAiClient();
    
    // Extract base64 data and mime type if strictly provided as DataURL
    const match = base64Image.match(/^data:(.*?);base64,(.*)$/);
    const mimeType = match ? match[1] : 'image/png';
    const data = match ? match[2] : base64Image;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType,
                        data
                    }
                },
                { text: prompt }
            ]
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No edited image generated");
};

// 7. Generate Video (Veo)
export const generateVideo = async (params: { prompt: string, aspectRatio: '16:9'|'9:16', resolution: '720p'|'1080p' }): Promise<string> => {
    const ai = getAiClient();
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: params.prompt,
        config: {
            numberOfVideos: 1,
            resolution: params.resolution,
            aspectRatio: params.aspectRatio
        }
    });

    // Polling
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed");

    // Fetch the video to create a blob URL that can be played securely
    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};
