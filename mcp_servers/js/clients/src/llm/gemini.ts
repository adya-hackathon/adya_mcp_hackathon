import axios from "axios";
import {
  LlmResponseStruct,
  GeminiChatCompletionParams,
  SuccessResponseDataFormat,
} from "./dto.js";

// Gemini API 
export async function GeminiProcessor(data: any): Promise<LlmResponseStruct> {
  try {
    // Parse and validate input parameters
    const params: GeminiChatCompletionParams = {
      input: '',
      images_arr: [],
      input_type: 'text',
      is_stream: false,

      prompt: '',
      api_key: process.env.GEMINI_API_KEY || 'AIzaSyBd1fyIyu6gINkNIsIDHibq-8H2BVWYCWc',

      chat_model: 'gemini-2.5-flash',
      vision_model: 'gemini-2.5-flash',
      speech_model: '',

      chat_history: [],
      tools: [],
      temperature: 0.1,

      max_tokens: 1000,
      forced_tool_calls: null,
      tool_choice: 'auto',
      ...data
    };

    let selected_model = params.chat_model;
    if (params.input_type === 'image') {
      selected_model = params.vision_model;
    }

    // Input validation
    if (!params.api_key) {
      return {
        Data: null,
        Error: new Error("Gemini API Key is required"),
        Status: false,
      };
    }

    if (!params.prompt && !params.input) {
      return {
        Data: null,
        Error: new Error("Prompt or input is required"),
        Status: false,
      };
    }
    
    const chatContents: any[] = [];

    // Add chat history if available
    for (const message of params.chat_history || []) {
      if (message.role === "user" || message.role === "model") {
        chatContents.push({
          role: message.role,
          parts: [{ text: message.content }]
        });
      }
    }

    // Add latest user message
    chatContents.push({
      role: "user",
      parts: [{ text: params.input }]
    });

    // Construct full payload
    const payload: any = {
      system_instruction: {
        parts: [
          {
            text: params.prompt 
          }
        ]
      },
      contents: chatContents,
      generationConfig: {
        temperature: params.temperature,
        maxOutputTokens: params.max_tokens
      }
    };

    if (params.tools && params.tools.length > 0) {
      payload.tools = [
        {
          functionDeclarations: params.tools.map((tool: any) => ({
            name: tool.function.name,
            description: tool.function.description,
            parameters: {
              type: tool.function.parameters?.type || 'object',
              properties: Object.entries(tool.function.parameters?.properties || {}).reduce((acc, [key, value]: [string, any]) => ({
                ...acc,
                [key]: value.type === "array" ? {
                  type: "array",
                  items: {type: value.items?.type || "string"},
                  default: value.default || [],
                  description: value.description || ""
                } : {
                  type: value.type || "string",
                  default: value.default || "",
                  description: value.description || ""
                }
              }), {}),
              required:  tool.function.parameters?.required ||  []
            }
          }))
        }
      ];
    }

    // console.log("Gemini Request : ", JSON.stringify(payload));
    // Perform Gemini API call
    try {
      const response = await axios({
        method: 'post',
        url: `https://generativelanguage.googleapis.com/v1beta/models/${selected_model}:generateContent?key=${params.api_key}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload,
        // timeout: 60000
      });
     
      // console.log("Gemini Response : ",JSON.stringify( response.data));

      const messageContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const usage = response.data?.usageMetadata || {};

      var is_tool_call = false;
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
        is_tool_call = true;
      }

      const final_response_format: SuccessResponseDataFormat = {
        total_llm_calls: 1,
        total_tokens: usage.totalTokenCount || 0,
        total_input_tokens: usage.promptTokenCount || 0,
        total_output_tokens: usage.candidatesTokenCount || 0,
        final_llm_response: response.data || {},
        llm_responses_arr: [response.data],
        messages: [messageContent],
        output_type:  is_tool_call ? "tool_call" : "text",
      };

      return {
        Data: final_response_format,
        Error: null,
        Status: true,
      };
    } catch (error: any) {
      return {
        Data: null,
        Error: error?.response?.data || error?.request || error?.message,
        Status: false,
      };
    }

  } catch (error) {
    console.error("Gemini Processing Error:", error);
    return {
      Data: null,
      Error: error instanceof Error ? error : new Error("Unexpected Error"),
      Status: false
    };
  }
}
