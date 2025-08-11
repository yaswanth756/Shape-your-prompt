
import { NextResponse } from "next/server";
import { geminiClient } from "../../../lib/gemini";

// Input validation interface
interface RequestBody {
  text: string;
  strategy?: string;
}

// Gemini API response interface
interface GeminiCompletion {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Validate request body
function validateRequestBody(body: unknown): body is RequestBody {
  return (
    !!body &&
    typeof (body as RequestBody).text === 'string' &&
    (body as RequestBody).text.trim().length > 0
  );
}

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    
    if (!validateRequestBody(body)) {
      return NextResponse.json(
        { error: "Invalid input: 'text' field is required and must be a non-empty string" }, 
        { status: 400 }
      );
    }

    const { text, strategy } = body;

    // Enhanced prompt template with better structure and conciseness emphasis
    let template = `
You are an expert prompt engineer specializing in transforming raw user input into highly effective LLM prompts.

TASK: Transform the user's unstructured, incomplete, or unclear text into a well-crafted, professional prompt that maximizes LLM performance.

TRANSFORMATION RULES:
1. **Preserve Intent**: Maintain all original meaning and user objectives
2. **Enhance Clarity**: Fix grammar, spelling, and structural issues
3. **Add Context**: Infer and include missing but crucial details
4. **Optimize Structure**: Organize content with logical flow and clear sections
5. **Include Examples**: Add relevant examples or explanations when beneficial
6. **Maximize Effectiveness**: Ensure the output prompt generates high-quality, comprehensive responses
7. **Professional Tone**: Use clear, professional language suitable for business or academic contexts
8. **Be Concise**: Keep the improved prompt as brief as possible while retaining all necessary details and effectiveness - avoid unnecessary verbosity or repetition

OUTPUT FORMAT: Return only the improved prompt - no meta-commentary, explanations, or additional text.

USER INPUT TO TRANSFORM:
<<<
${text.trim()}
>>>`;

    if (strategy) {
      template += `

STRATEGY: Apply this specific strategy to the transformation: ${strategy.trim()}`;
    }

    // Make API call with timeout and retry logic
    const completion = await Promise.race([
      geminiClient.chat.completions.create({
        model: "gemini-1.5-flash",
        messages: [{ role: "user", content: template }],
        max_tokens: 1500,
        temperature: 0.2,
      }) as Promise<GeminiCompletion>,
      // 30-second timeout
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      )
    ]);

    // Validate API response
    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Gemini API');
    }

    const result = completion.choices[0].message.content.trim();

    return NextResponse.json({ 
      result,
      metadata: {
        originalLength: text.length,
        improvedLength: result.length,
        strategyUsed: strategy || 'default',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Specific error handling
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" }, 
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
        { error: "Request timeout - please try again" }, 
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error - please try again later" }, 
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({ 
    status: "healthy", 
    service: "prompt-shaper",
    timestamp: new Date().toISOString()
  });
}
