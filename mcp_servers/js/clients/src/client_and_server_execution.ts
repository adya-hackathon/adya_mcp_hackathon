import {MCPServers} from "./server_connection.js"
import {ClientsConfig, ServersConfig} from "./client_and_server_config.js"
import { AzureOpenAIProcessor } from "./llm/azure_openai.js";
import { OpenAIProcessor } from "./llm/openai.js";
import { GeminiProcessor } from "./llm/gemini.js";
import { LlmResponseStruct } from "./llm/dto.js";



interface ClientAndServerExecutionResponseStruct {
    Data: SuccessResponseDataFormat;
    Error: any | null;
    Status: boolean;
}
interface SuccessResponseDataFormat {
    total_llm_calls : number;
    total_tokens : number;
    total_input_tokens : number;
    total_output_tokens : number;
    final_llm_response : any;
    llm_responses_arr : Array<any>;
    messages : Array<any>;
    output_type : string;
    executed_tool_calls : Array<any>;
}
  


export async function ClientAndServerExecution(payload:any, streaming_callback:any) {
    try{
        var ClientAndServerExecution:ClientAndServerExecutionResponseStruct={
            "Data": {
                "total_llm_calls": 0,
                "total_tokens": 0,
                "total_input_tokens": 0,
                "total_output_tokens": 0,
                "final_llm_response": null,
                "llm_responses_arr": [],
                "messages": [],
                "output_type": "text",
                "executed_tool_calls": []
            },
            "Error": null,
            "Status": false
        }

        
        var selected_server_credentials = payload?.selected_server_credentials;
        var client_details = payload?.client_details;
        var selected_client = payload?.selected_client || "";
        var selected_server = payload?.selected_servers?.[0] || "";


        if(client_details?.chat_history){
            client_details.chat_history.push({
                "role": "user",
                "content": client_details?.input || ""
            });
        } else{
            client_details["chat_history"] = [{
                "role": "user",
                "content": client_details?.input || ""
            }];
        }

        
        
        var temp_tools = JSON.stringify(client_details?.tools);
        var temp_prompt = `${client_details?.prompt}`;

        var tool_call_details_arr=[];
        for (var tool of client_details?.tools || []){
            tool_call_details_arr.push({
                "function_name": tool?.function?.name || "",
                "function_description":  tool?.function?.description || "",
            })
        }

        var tools_getting_agent_prompt = `
        You are an ${selected_server} AI assistant that analyzes user requests and determines the require tool calls from available tools.
        Available tools: ${JSON.stringify(tool_call_details_arr)}
        Analyze each request to determine if it matches available tool capabilities or needs clarification.
        Return TRUE for tool calls when the request clearly maps to available tools without checking the required parameters.
        Return FALSE when the request is ambiguous, missing parameters, or requires more information.
        Output format:
            <function_call>TRUE/FALSE</function_call>
            <selected_tools>function_name1,function_name2 or "none"</selected_tools>
        Use exact tool names from available tools. List all relevant tools ordered by relevance.The output format should be exactly the same as mentioned above.It should be in string
        `;


        client_details.prompt = tools_getting_agent_prompt;
        client_details.tools = [];

        

        if (selected_client == "MCP_CLIENT_AZURE_AI") {        
            
            // ================== Default llm Call start ===========================================================
            
            let initialLlmResponse:LlmResponseStruct = await AzureOpenAIProcessor(client_details);
            if (initialLlmResponse.Status == false) {
                if(streaming_callback?.is_stream){
                    streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: initialLlmResponse.Error, Error: initialLlmResponse?.Error?.message || initialLlmResponse?.Error, Status: false, StreamingStatus : "ERROR", Action:"ERROR"}));
                    return ClientAndServerExecution
                }
                
                ClientAndServerExecution.Error = initialLlmResponse?.Error?.message || initialLlmResponse?.Error;
                ClientAndServerExecution.Status =  false;
                return ClientAndServerExecution
            }
            var extractedResult = extractDataFromResponse(initialLlmResponse.Data?.messages?.[0] || "");
            

            ClientAndServerExecution.Data.total_llm_calls += 1;
            ClientAndServerExecution.Data.total_tokens += initialLlmResponse.Data?.total_tokens || 0;
            ClientAndServerExecution.Data.total_input_tokens += initialLlmResponse.Data?.total_input_tokens || 0;
            ClientAndServerExecution.Data.total_output_tokens += initialLlmResponse.Data?.total_output_tokens || 0;
            ClientAndServerExecution.Data.final_llm_response = initialLlmResponse.Data?.final_llm_response;
            ClientAndServerExecution.Data.llm_responses_arr.push(initialLlmResponse.Data?.final_llm_response);

            if(streaming_callback?.is_stream){
                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Optimized Token LLM call Successfully Completed", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
            }
            // ================== Default llm Call end  ===========================================================
            
            
            if (extractedResult.isFunctionCall){
                var final_tool_calls = [];
                for (const tool_name of extractedResult.selectedTools) {
                    const parsedTools = JSON.parse(temp_tools) || [];
                    const matchingTool = parsedTools.find((temp_tool:any) => temp_tool?.function?.name == tool_name);
                    if (matchingTool) {
                        final_tool_calls.push(matchingTool);
                    }
                }
                client_details.prompt = temp_prompt;
                client_details.tools = final_tool_calls;
                while(true){
                    let response:LlmResponseStruct = await AzureOpenAIProcessor(client_details);
                    if(!response.Status){
                        ClientAndServerExecution.Error = response.Error;
                        ClientAndServerExecution.Status = response.Status;
                        return ClientAndServerExecution
                    }
                    ClientAndServerExecution.Data.total_llm_calls += 1;
                    ClientAndServerExecution.Data.total_tokens += response.Data?.total_tokens || 0;
                    ClientAndServerExecution.Data.total_input_tokens += response.Data?.total_input_tokens || 0;
                    ClientAndServerExecution.Data.total_output_tokens += response.Data?.total_output_tokens || 0;
                    ClientAndServerExecution.Data.final_llm_response = response.Data?.final_llm_response;
                    ClientAndServerExecution.Data.llm_responses_arr.push(response.Data?.final_llm_response);

                    if (response.Data?.output_type == "text"){
                        ClientAndServerExecution.Data.messages.push(...response.Data?.messages);
                        ClientAndServerExecution.Data.output_type=response.Data?.output_type || "";
                        ClientAndServerExecution.Error = response.Error;
                        ClientAndServerExecution.Status = response.Status;

                        for (var message of response.Data?.messages || []){
                            if(streaming_callback?.is_stream){
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                            }
                        }
                        return ClientAndServerExecution
                    }

                    if(streaming_callback?.is_stream){
                        streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Tool Calls Started", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                    }

                    for (var tool of response.Data?.final_llm_response?.choices?.[0]?.message?.tool_calls || []){
                        const toolName = tool?.function?.name;
                        const args = JSON.parse(tool?.function?.arguments);

                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call initiated`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                        }

                        var tool_call_result:any = await CallAndExecuteTool(selected_server, selected_server_credentials, toolName, args);
                        
                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call result  : ${JSON.stringify(tool_call_result)}`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                        }

                        ClientAndServerExecution.Data.executed_tool_calls.push({
                            "id": tool?.id,
                            "name": toolName,
                            "arguments": args,
                            "result": tool_call_result,
                        });

                        let tool_call_content_data = `Calling tool: ${toolName} with arguments: ${JSON.stringify(args)} and result: ${JSON.stringify(tool_call_result)}`;
                        client_details.chat_history.push({
                            "role": "assistant",
                            "content": tool_call_content_data,
                        });
                    }
                }
            } else{
                client_details.prompt =  `${temp_prompt}. Available tools: ${JSON.stringify(tool_call_details_arr)}`;
                client_details.tools = [];
                let normalResponse:LlmResponseStruct = await AzureOpenAIProcessor(client_details);
                
                ClientAndServerExecution.Data.total_llm_calls += 1;
                ClientAndServerExecution.Data.total_tokens += normalResponse.Data?.total_tokens || 0;
                ClientAndServerExecution.Data.total_input_tokens += normalResponse.Data?.total_input_tokens || 0;
                ClientAndServerExecution.Data.total_output_tokens += normalResponse.Data?.total_output_tokens || 0;
                ClientAndServerExecution.Data.final_llm_response = normalResponse.Data?.final_llm_response;
                ClientAndServerExecution.Data.llm_responses_arr.push(normalResponse.Data?.final_llm_response);
                
                ClientAndServerExecution.Data.output_type=normalResponse.Data?.output_type || "";
                ClientAndServerExecution.Error = normalResponse.Error;
                ClientAndServerExecution.Status = normalResponse.Status;

                 if (!normalResponse.Status  || (normalResponse.Data?.final_llm_response?.choices?.[0]?.message?.content != null &&  normalResponse.Data?.final_llm_response?.choices?.[0]?.message?.content != "")){
                    ClientAndServerExecution.Data.messages = normalResponse.Data?.messages || [];
                    for (var message of normalResponse.Data?.messages || []){
                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                        }
                    }
                    return ClientAndServerExecution
                }


                if ((normalResponse.Data?.final_llm_response?.choices?.[0]?.message?.tool_calls || []).length > 0 ){
                    var final_tool_calls = [];
                    for (const tool_name of extractedResult.selectedTools) {
                        const parsedTools = JSON.parse(temp_tools) || [];
                        const matchingTool = parsedTools.find((temp_tool:any) => temp_tool?.function?.name == tool_name);
                        if (matchingTool) {
                            final_tool_calls.push(matchingTool);
                        }
                    }
                    client_details.prompt = temp_prompt;
                    client_details.tools = final_tool_calls;
                    while(true){
                        let response:LlmResponseStruct = await AzureOpenAIProcessor(client_details);
                        if(!response.Status){
                            ClientAndServerExecution.Error = response.Error;
                            ClientAndServerExecution.Status = response.Status;
                            return ClientAndServerExecution
                        }
                        ClientAndServerExecution.Data.total_llm_calls += 1;
                        ClientAndServerExecution.Data.total_tokens += response.Data?.total_tokens || 0;
                        ClientAndServerExecution.Data.total_input_tokens += response.Data?.total_input_tokens || 0;
                        ClientAndServerExecution.Data.total_output_tokens += response.Data?.total_output_tokens || 0;
                        ClientAndServerExecution.Data.final_llm_response = response.Data?.final_llm_response;
                        ClientAndServerExecution.Data.llm_responses_arr.push(response.Data?.final_llm_response);

                        if (response.Data?.output_type == "text"){
                            ClientAndServerExecution.Data.messages.push(...response.Data?.messages);
                            ClientAndServerExecution.Data.output_type=response.Data?.output_type || "";
                            ClientAndServerExecution.Error = response.Error;
                            ClientAndServerExecution.Status = response.Status;

                            for (var message of response.Data?.messages || []){
                                if(streaming_callback?.is_stream){
                                    streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                                }
                            }
                            return ClientAndServerExecution
                        }

                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Tool Calls Started", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                        }

                        for (var tool of response.Data?.final_llm_response?.choices?.[0]?.message?.tool_calls || []){
                            const toolName = tool?.function?.name;
                            const args = JSON.parse(tool?.function?.arguments);

                            if(streaming_callback?.is_stream){
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call initiated`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                            }

                            var tool_call_result:any = await CallAndExecuteTool(selected_server, selected_server_credentials, toolName, args);
                            
                            if(streaming_callback?.is_stream){
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call result  : ${JSON.stringify(tool_call_result)}`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                            }

                            ClientAndServerExecution.Data.executed_tool_calls.push({
                                "id": tool?.id,
                                "name": toolName,
                                "arguments": args,
                                "result": tool_call_result,
                            });

                            let tool_call_content_data = `Calling tool: ${toolName} with arguments: ${JSON.stringify(args)} and result: ${JSON.stringify(tool_call_result)}`;
                            client_details.chat_history.push({
                                "role": "assistant",
                                "content": tool_call_content_data,
                            });
                        }
                    }
                }
                
                return ClientAndServerExecution
            }

        }
        else if (selected_client == "MCP_CLIENT_GEMINI") {        
            
            // ================== Default llm Call start ===========================================================
            
            let initialLlmResponse:LlmResponseStruct = await GeminiProcessor(client_details);
            if (initialLlmResponse.Status == false) {
                if(streaming_callback?.is_stream){
                    streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: initialLlmResponse.Error, Error: initialLlmResponse?.Error?.message || initialLlmResponse?.Error, Status: false, StreamingStatus : "ERROR", Action:"ERROR"}));
                    return ClientAndServerExecution
                }
                
                ClientAndServerExecution.Error = initialLlmResponse?.Error?.message || initialLlmResponse?.Error;
                ClientAndServerExecution.Status =  false;
                return ClientAndServerExecution
            }
            var extractedResult = extractDataFromResponse(initialLlmResponse.Data?.messages?.[0] || "");

            ClientAndServerExecution.Data.total_llm_calls += 1;
            ClientAndServerExecution.Data.total_tokens += initialLlmResponse.Data?.total_tokens || 0;
            ClientAndServerExecution.Data.total_input_tokens += initialLlmResponse.Data?.total_input_tokens || 0;
            ClientAndServerExecution.Data.total_output_tokens += initialLlmResponse.Data?.total_output_tokens || 0;
            ClientAndServerExecution.Data.final_llm_response = initialLlmResponse.Data?.final_llm_response;
            ClientAndServerExecution.Data.llm_responses_arr.push(initialLlmResponse.Data?.final_llm_response);

            if(streaming_callback?.is_stream){
                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Optimized Token LLM call Successfully Completed", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
            }
            // ================== Default llm Call end  ===========================================================
            
            
            if (extractedResult.isFunctionCall){

                var final_tool_calls = [];
                for (const tool_name of extractedResult.selectedTools) {
                    const parsedTools = JSON.parse(temp_tools) || [];
                    const matchingTool = parsedTools.find((temp_tool:any) => temp_tool?.function?.name == tool_name);
                    if (matchingTool) {
                        final_tool_calls.push(matchingTool);
                    }
                }

                client_details.prompt = temp_prompt;
                client_details.tools = final_tool_calls;
                while(true){

                    let response:LlmResponseStruct = await GeminiProcessor(client_details);
                    if(!response.Status){
                        ClientAndServerExecution.Error = response.Error;
                        ClientAndServerExecution.Status = response.Status;
                        return ClientAndServerExecution
                    }
                    ClientAndServerExecution.Data.total_llm_calls += 1;
                    ClientAndServerExecution.Data.total_tokens += response.Data?.total_tokens || 0;
                    ClientAndServerExecution.Data.total_input_tokens += response.Data?.total_input_tokens || 0;
                    ClientAndServerExecution.Data.total_output_tokens += response.Data?.total_output_tokens || 0;
                    ClientAndServerExecution.Data.final_llm_response = response.Data?.final_llm_response;
                    ClientAndServerExecution.Data.llm_responses_arr.push(response.Data?.final_llm_response);

                    if (response.Data?.output_type == "text"){

                        ClientAndServerExecution.Data.messages.push(...response.Data?.messages);
                        ClientAndServerExecution.Data.output_type=response.Data?.output_type || "";
                        ClientAndServerExecution.Error = response.Error;
                        ClientAndServerExecution.Status = response.Status;

                        for (var message of response.Data?.messages || []){
                            if(streaming_callback?.is_stream){
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                            }
                        }
                        return ClientAndServerExecution
                    }

                    if(streaming_callback?.is_stream){
                        streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Tool Calls Started", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                    }    

                    for (const part of response.Data?.final_llm_response?.candidates?.[0]?.content?.parts || []) {
                        const toolName = part?.functionCall?.name;
                        const args =  part?.functionCall?.args;

                        if (streaming_callback?.is_stream) {
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({
                                Data: `${selected_server} MCP server ${toolName} call initiated`,
                                Error: null,
                                Status: true,
                                StreamingStatus: "IN-PROGRESS",
                                Action: "NOTIFICATION"
                            }));
                        }

                        const tool_call_result: any = await CallAndExecuteTool(selected_server, selected_server_credentials, toolName, args);

                        if (streaming_callback?.is_stream) {
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({
                                Data: `${selected_server} MCP server ${toolName} call result  : ${JSON.stringify(tool_call_result)}`,
                                Error: null,
                                Status: true,
                                StreamingStatus: "IN-PROGRESS",
                                Action: "NOTIFICATION"
                            }));
                        }

                        ClientAndServerExecution.Data.executed_tool_calls.push({
                            name: toolName,
                            arguments: args,
                            result: tool_call_result,
                        });

                        const tool_call_content_data = `Calling tool: ${toolName} with arguments: ${JSON.stringify(args)} and result: ${JSON.stringify(tool_call_result)}`;
                        client_details.chat_history.push({
                            role: "model",
                            content: tool_call_content_data,
                        });
                    }
                }
            } else{
                client_details.prompt =  `${temp_prompt}. Available tools: ${JSON.stringify(tool_call_details_arr)}`;
                client_details.tools = [];
                let normalResponse:LlmResponseStruct = await GeminiProcessor(client_details);
                
                ClientAndServerExecution.Data.total_llm_calls += 1;
                ClientAndServerExecution.Data.total_tokens += normalResponse.Data?.total_tokens || 0;
                ClientAndServerExecution.Data.total_input_tokens += normalResponse.Data?.total_input_tokens || 0;
                ClientAndServerExecution.Data.total_output_tokens += normalResponse.Data?.total_output_tokens || 0;
                ClientAndServerExecution.Data.final_llm_response = normalResponse.Data?.final_llm_response;
                ClientAndServerExecution.Data.llm_responses_arr.push(normalResponse.Data?.final_llm_response);
                
                ClientAndServerExecution.Data.output_type=normalResponse.Data?.output_type || "";
                ClientAndServerExecution.Error = normalResponse.Error;
                ClientAndServerExecution.Status = normalResponse.Status;

                if (!normalResponse.Status  || (normalResponse.Data?.final_llm_response?.candidates?.[0]?.content?.parts?.[0]?.text != null &&  normalResponse.Data?.final_llm_response?.candidates?.[0]?.content?.parts?.[0]?.text != "")){
                    ClientAndServerExecution.Data.messages = normalResponse.Data?.messages || [];
                    for (var message of normalResponse.Data?.messages || []){
                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                        }
                    }
                    return ClientAndServerExecution
                }

                if ((normalResponse.Data?.final_llm_response?.candidates?.[0]?.content?.parts[0]?.functionCall || []).length > 0 ){
                   
                    var final_tool_calls = [];
                    for (const tool_name of extractedResult.selectedTools) {
                        const parsedTools = JSON.parse(temp_tools) || [];
                        const matchingTool = parsedTools.find((temp_tool:any) => temp_tool?.function?.name == tool_name);
                        if (matchingTool) {
                            final_tool_calls.push(matchingTool);
                        }
                    }

                    client_details.prompt = temp_prompt;
                    client_details.tools = final_tool_calls;
                    while(true){

                        let response:LlmResponseStruct = await GeminiProcessor(client_details);
                        if(!response.Status){
                            ClientAndServerExecution.Error = response.Error;
                            ClientAndServerExecution.Status = response.Status;
                            return ClientAndServerExecution
                        }
                        ClientAndServerExecution.Data.total_llm_calls += 1;
                        ClientAndServerExecution.Data.total_tokens += response.Data?.total_tokens || 0;
                        ClientAndServerExecution.Data.total_input_tokens += response.Data?.total_input_tokens || 0;
                        ClientAndServerExecution.Data.total_output_tokens += response.Data?.total_output_tokens || 0;
                        ClientAndServerExecution.Data.final_llm_response = response.Data?.final_llm_response;
                        ClientAndServerExecution.Data.llm_responses_arr.push(response.Data?.final_llm_response);

                        if (response.Data?.output_type == "text"){

                            ClientAndServerExecution.Data.messages.push(...response.Data?.messages);
                            ClientAndServerExecution.Data.output_type=response.Data?.output_type || "";
                            ClientAndServerExecution.Error = response.Error;
                            ClientAndServerExecution.Status = response.Status;

                            for (var message of response.Data?.messages || []){
                                if(streaming_callback?.is_stream){
                                    streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                                }
                            }
                            return ClientAndServerExecution
                        }

                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Tool Calls Started", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                        }    

                        for (const part of response.Data?.final_llm_response?.candidates?.[0]?.content?.parts || []) {
                            const toolName = part?.functionCall?.name;
                            const args =  part?.functionCall?.args;

                            if (streaming_callback?.is_stream) {
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({
                                    Data: `${selected_server} MCP server ${toolName} call initiated`,
                                    Error: null,
                                    Status: true,
                                    StreamingStatus: "IN-PROGRESS",
                                    Action: "NOTIFICATION"
                                }));
                            }

                            const tool_call_result: any = await CallAndExecuteTool(selected_server, selected_server_credentials, toolName, args);

                            if (streaming_callback?.is_stream) {
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({
                                    Data: `${selected_server} MCP server ${toolName} call result  : ${JSON.stringify(tool_call_result)}`,
                                    Error: null,
                                    Status: true,
                                    StreamingStatus: "IN-PROGRESS",
                                    Action: "NOTIFICATION"
                                }));
                            }

                            ClientAndServerExecution.Data.executed_tool_calls.push({
                                name: toolName,
                                arguments: args,
                                result: tool_call_result,
                            });

                            const tool_call_content_data = `Calling tool: ${toolName} with arguments: ${JSON.stringify(args)} and result: ${JSON.stringify(tool_call_result)}`;
                            client_details.chat_history.push({
                                role: "model",
                                content: tool_call_content_data,
                            });
                        }
                    }
                }
                
                return ClientAndServerExecution
            }

        }
        else if (selected_client == "MCP_CLIENT_OPENAI") {        
            
            // ================== Default llm Call start ===========================================================
            
            let initialLlmResponse:LlmResponseStruct = await OpenAIProcessor(client_details);
            if (initialLlmResponse.Status == false) {
                if(streaming_callback?.is_stream){
                    streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: initialLlmResponse.Error, Error: initialLlmResponse?.Error?.message || initialLlmResponse?.Error, Status: false, StreamingStatus : "ERROR", Action:"ERROR"}));
                    return ClientAndServerExecution
                }
                
                ClientAndServerExecution.Error = initialLlmResponse?.Error?.message || initialLlmResponse?.Error;
                ClientAndServerExecution.Status =  false;
                return ClientAndServerExecution
            }
            var extractedResult = extractDataFromResponse(initialLlmResponse.Data?.messages?.[0] || "");
            

            ClientAndServerExecution.Data.total_llm_calls += 1;
            ClientAndServerExecution.Data.total_tokens += initialLlmResponse.Data?.total_tokens || 0;
            ClientAndServerExecution.Data.total_input_tokens += initialLlmResponse.Data?.total_input_tokens || 0;
            ClientAndServerExecution.Data.total_output_tokens += initialLlmResponse.Data?.total_output_tokens || 0;
            ClientAndServerExecution.Data.final_llm_response = initialLlmResponse.Data?.final_llm_response;
            ClientAndServerExecution.Data.llm_responses_arr.push(initialLlmResponse.Data?.final_llm_response);

            if(streaming_callback?.is_stream){
                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Optimized Token LLM call Successfully Completed", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
            }
            // ================== Default llm Call end  ===========================================================
            
            
            if (extractedResult.isFunctionCall){
                var final_tool_calls = [];
                for (const tool_name of extractedResult.selectedTools) {
                    const parsedTools = JSON.parse(temp_tools) || [];
                    const matchingTool = parsedTools.find((temp_tool:any) => temp_tool?.function?.name == tool_name);
                    if (matchingTool) {
                        final_tool_calls.push(matchingTool);
                    }
                }
                client_details.prompt = temp_prompt;
                client_details.tools = final_tool_calls;
                while(true){
                    let response:LlmResponseStruct = await OpenAIProcessor(client_details);
                    if(!response.Status){
                        ClientAndServerExecution.Error = response.Error;
                        ClientAndServerExecution.Status = response.Status;
                        return ClientAndServerExecution
                    }
                    ClientAndServerExecution.Data.total_llm_calls += 1;
                    ClientAndServerExecution.Data.total_tokens += response.Data?.total_tokens || 0;
                    ClientAndServerExecution.Data.total_input_tokens += response.Data?.total_input_tokens || 0;
                    ClientAndServerExecution.Data.total_output_tokens += response.Data?.total_output_tokens || 0;
                    ClientAndServerExecution.Data.final_llm_response = response.Data?.final_llm_response;
                    ClientAndServerExecution.Data.llm_responses_arr.push(response.Data?.final_llm_response);

                    if (response.Data?.output_type == "text"){
                        ClientAndServerExecution.Data.messages.push(...response.Data?.messages);
                        ClientAndServerExecution.Data.output_type=response.Data?.output_type || "";
                        ClientAndServerExecution.Error = response.Error;
                        ClientAndServerExecution.Status = response.Status;

                        for (var message of response.Data?.messages || []){
                            if(streaming_callback?.is_stream){
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                            }
                        }
                        return ClientAndServerExecution
                    }

                    if(streaming_callback?.is_stream){
                        streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Tool Calls Started", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                    }

                    for (var tool of response.Data?.final_llm_response?.choices?.[0]?.message?.tool_calls || []){
                        const toolName = tool?.function?.name;
                        const args = JSON.parse(tool?.function?.arguments);

                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call initiated`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                        }

                        var tool_call_result:any = await CallAndExecuteTool(selected_server, selected_server_credentials, toolName, args);
                        
                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call result  : ${JSON.stringify(tool_call_result)}`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                        }

                        ClientAndServerExecution.Data.executed_tool_calls.push({
                            "id": tool?.id,
                            "name": toolName,
                            "arguments": args,
                            "result": tool_call_result,
                        });

                        let tool_call_content_data = `Calling tool: ${toolName} with arguments: ${JSON.stringify(args)} and result: ${JSON.stringify(tool_call_result)}`;
                        client_details.chat_history.push({
                            "role": "assistant",
                            "content": tool_call_content_data,
                        });
                    }
                }
            } else{
                client_details.prompt =  `${temp_prompt}. Available tools: ${JSON.stringify(tool_call_details_arr)}`;
                client_details.tools = [];
                let normalResponse:LlmResponseStruct = await OpenAIProcessor(client_details);
                
                ClientAndServerExecution.Data.total_llm_calls += 1;
                ClientAndServerExecution.Data.total_tokens += normalResponse.Data?.total_tokens || 0;
                ClientAndServerExecution.Data.total_input_tokens += normalResponse.Data?.total_input_tokens || 0;
                ClientAndServerExecution.Data.total_output_tokens += normalResponse.Data?.total_output_tokens || 0;
                ClientAndServerExecution.Data.final_llm_response = normalResponse.Data?.final_llm_response;
                ClientAndServerExecution.Data.llm_responses_arr.push(normalResponse.Data?.final_llm_response);
                
                ClientAndServerExecution.Data.output_type=normalResponse.Data?.output_type || "";
                ClientAndServerExecution.Error = normalResponse.Error;
                ClientAndServerExecution.Status = normalResponse.Status;

                 if (!normalResponse.Status  || (normalResponse.Data?.final_llm_response?.choices?.[0]?.message?.content != null &&  normalResponse.Data?.final_llm_response?.choices?.[0]?.message?.content != "")){
                    ClientAndServerExecution.Data.messages = normalResponse.Data?.messages || [];
                    for (var message of normalResponse.Data?.messages || []){
                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                        }
                    }
                    return ClientAndServerExecution
                }


                if ((normalResponse.Data?.final_llm_response?.choices?.[0]?.message?.tool_calls || []).length > 0 ){
                    var final_tool_calls = [];
                    for (const tool_name of extractedResult.selectedTools) {
                        const parsedTools = JSON.parse(temp_tools) || [];
                        const matchingTool = parsedTools.find((temp_tool:any) => temp_tool?.function?.name == tool_name);
                        if (matchingTool) {
                            final_tool_calls.push(matchingTool);
                        }
                    }
                    client_details.prompt = temp_prompt;
                    client_details.tools = final_tool_calls;
                    while(true){
                        let response:LlmResponseStruct = await OpenAIProcessor(client_details);
                        if(!response.Status){
                            ClientAndServerExecution.Error = response.Error;
                            ClientAndServerExecution.Status = response.Status;
                            return ClientAndServerExecution
                        }
                        ClientAndServerExecution.Data.total_llm_calls += 1;
                        ClientAndServerExecution.Data.total_tokens += response.Data?.total_tokens || 0;
                        ClientAndServerExecution.Data.total_input_tokens += response.Data?.total_input_tokens || 0;
                        ClientAndServerExecution.Data.total_output_tokens += response.Data?.total_output_tokens || 0;
                        ClientAndServerExecution.Data.final_llm_response = response.Data?.final_llm_response;
                        ClientAndServerExecution.Data.llm_responses_arr.push(response.Data?.final_llm_response);

                        if (response.Data?.output_type == "text"){
                            ClientAndServerExecution.Data.messages.push(...response.Data?.messages);
                            ClientAndServerExecution.Data.output_type=response.Data?.output_type || "";
                            ClientAndServerExecution.Error = response.Error;
                            ClientAndServerExecution.Status = response.Status;

                            for (var message of response.Data?.messages || []){
                                if(streaming_callback?.is_stream){
                                    streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: message, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"MESSAGE"}));
                                }
                            }
                            return ClientAndServerExecution
                        }

                        if(streaming_callback?.is_stream){
                            streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: "Tool Calls Started", Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                        }

                        for (var tool of response.Data?.final_llm_response?.choices?.[0]?.message?.tool_calls || []){
                            const toolName = tool?.function?.name;
                            const args = JSON.parse(tool?.function?.arguments);

                            if(streaming_callback?.is_stream){
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call initiated`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                            }

                            var tool_call_result:any = await CallAndExecuteTool(selected_server, selected_server_credentials, toolName, args);
                            
                            if(streaming_callback?.is_stream){
                                streaming_callback?.streamCallbacks.onData(JSON.stringify({Data: `${selected_server} MCP server ${toolName} call result  : ${JSON.stringify(tool_call_result)}`, Error: null, Status: true, StreamingStatus : "IN-PROGRESS", Action:"NOTIFICATION"}));
                            }

                            ClientAndServerExecution.Data.executed_tool_calls.push({
                                "id": tool?.id,
                                "name": toolName,
                                "arguments": args,
                                "result": tool_call_result,
                            });

                            let tool_call_content_data = `Calling tool: ${toolName} with arguments: ${JSON.stringify(args)} and result: ${JSON.stringify(tool_call_result)}`;
                            client_details.chat_history.push({
                                "role": "assistant",
                                "content": tool_call_content_data,
                            });
                        }
                    }
                }
                
                return ClientAndServerExecution
            }

        }
         else{
            return {
                "Data": null,
                "Error": "Invalid Client",
                "Status": false
            }
        }
    } catch (err) {
        console.log("Error initializing MCP ==========>>>> " , err);
        return  {
            "Data": null,
            "Error": `${err}`,
            "Status": false
        }
    }
}

function extractDataFromResponse(responseContent: string): { isFunctionCall: boolean, selectedTools: string[] } {
    // Default values
    let result:any = {
        isFunctionCall: false,
        selectedTools:[]
    };
    
    try {
        // Extract function call status
        const functionCallMatch = responseContent.match(/<function_call>([^<]+)<\/function_call>/);
        if (functionCallMatch && functionCallMatch[1]) {
            result.isFunctionCall = functionCallMatch[1].trim().toUpperCase() === 'TRUE';
        }
        
        // Extract selected tools
        const selectedToolsMatch = responseContent.match(/<selected_tools>([^<]+)<\/selected_tools>/);
        if (selectedToolsMatch && selectedToolsMatch[1]) {
            // Split by comma and trim each tool name
            result.selectedTools = selectedToolsMatch[1].split(',').map(tool => tool.trim()).filter(tool => tool.length > 0);
        }
    } catch (error) {
        console.error('Error parsing response content:', error);
    }
    
    return result;
}

async function CallAndExecuteTool(selected_server:any, server_credentials:any,tool_name:any, args:any) {
    var tool_call_result:any

    switch (selected_server) {
        case "CONFLUENCE":
            const confluenceCreds = server_credentials[selected_server]?.credentials || server_credentials[selected_server] || {};
            args["__credentials__"] = {
                "api_token": confluenceCreds.api_token || "",
                "user_email": confluenceCreds.user_email || "",
                "base_url": confluenceCreds.base_url || ""
            };
            break;
        case "WORDPRESS":
            args.siteUrl = server_credentials[selected_server]?.siteUrl || "";
            args.username = server_credentials[selected_server]?.username || "";
            args.password = server_credentials[selected_server]?.password || "";
            break;
        case "ZOOMMCP":
            args["__credentials__"] = {
                "account_id": server_credentials[selected_server]?.account_id || "",
                "client_id":server_credentials[selected_server]?.client_id || "",
                "client_secret":server_credentials[selected_server]?.client_secret || ""
            }
            break;
        case "G_DRIVE":
            // Pass the entire credentials object, supporting both direct and web formats
            args["__credentials__"] = server_credentials[selected_server]?.web || server_credentials[selected_server] || {};
            break;
        case "SALESFORCE_MCP":
            args.username = server_credentials[selected_server]?.username || "";
            args.password = server_credentials[selected_server]?.password || "";
            args.token = server_credentials[selected_server]?.token || "";
            // args.consumer_key = server_credentials[selected_server]?.consumer_key || "";
            // args.consumer_secret = server_credentials[selected_server]?.consumer_secret || "";
            break;
        case "SLACK":
            args["__credentials__"] = {
                "slack_bot_token": server_credentials[selected_server]?.slack_bot_token || "",
                "slack_team_id": server_credentials[selected_server]?.slack_team_id || "",
                "slack_channel_ids": server_credentials[selected_server]?.slack_channel_ids || ""
            }
            break;
        case "JIRA":
            args["__credentials__"] = {
                "jira_email": server_credentials[selected_server]?.jira_email || "",
                "jira_api_token": server_credentials[selected_server]?.jira_api_token || "",
                "jira_domain": server_credentials[selected_server]?.jira_domain || "",
                "project_key": server_credentials[selected_server]?.project_key || ""
            }
            break;
        case "ZENDESK_MCP":
            args["__credentials__"] = {
                "email": server_credentials[selected_server]?.email || "",
                "token": server_credentials[selected_server]?.token || "",
                "subdomain": server_credentials[selected_server]?.subdomain || ""
            }
            break;
        case "HUBSPOT_MCP":
            args["__credentials__"] = {
                "access_token": server_credentials[selected_server]?.access_token || ""
            }
            break;
        case "X_MCP":
            const xCredentials = server_credentials[selected_server]?.credentials || server_credentials[selected_server] || {};
            args["__credentials__"] = {
                "app_key": xCredentials.app_key ||  "",
                "app_secret": xCredentials.app_secret || "",
                "access_token": xCredentials.access_token || "",
                "access_token_secret": xCredentials.access_token_secret || ""
            }
            break;
        case "NOTION_MCP":
            args["__credentials__"] = {
                "notion_token": server_credentials[selected_server]?.notion_token || "",
            }
            break;
        case "CLICKUP_MCP":
            args["__credentials__"] = {
                "api_token": server_credentials[selected_server]?.api_token || "",
            }
            break;
        case "DROPBOX":
            const dropboxCreds = server_credentials[selected_server]?.credentials || server_credentials[selected_server] || {};
            args["__credentials__"] = {
                "app_key": dropboxCreds.app_key || dropboxCreds.appKey || "",
                "app_secret": dropboxCreds.app_secret || dropboxCreds.appSecret || "",
                "refresh_token": dropboxCreds.refresh_token || dropboxCreds.refreshToken || "",
            }
            break;
        case "FIGMA_MCP":
            args["__credentials__"] = {
                "api_token": server_credentials[selected_server]?.api_token || "",
                "figma_url": server_credentials[selected_server]?.figma_url || "",
                "depth": server_credentials[selected_server]?.depth || 0,
            }
            break;
        case "AIRTABLE":
            const airtableCreds = server_credentials[selected_server] || {};
            args["__credentials__"] = {
                "api_key": airtableCreds.api_key || "",
            }
            break;
        case "SHOPIFY":
            const shopifyCreds = server_credentials[selected_server] || {};
            args["__credentials__"] = {
                "access_token": shopifyCreds.access_token || "",
                "domain": shopifyCreds.domain || "",
            }
            break;
        case "LINKEDIN":
            args.accessToken = server_credentials[selected_server]?.access_token || "";
            break;
        case "INSTAGRAM_MCP":
            args["__credentials__"] = {
                "accessToken": server_credentials[selected_server]?.accessToken || "",
                "businessAccountId": server_credentials[selected_server]?.businessAccountId || "",
                "appId": server_credentials[selected_server]?.appId || "",
                "appSecret": server_credentials[selected_server]?.appSecret || "",
            }
            break;
        case "MCP-JOOMLA":
            args.base_url = server_credentials[selected_server]?.base_url || "";
            args.bearer_token = server_credentials[selected_server]?.bearer_token || "";
            break;
        case "MOBILE-MCP-MAIN":
            // Mobile MCP typically doesn't require credentials for basic operations
            // Add any mobile-specific configuration if needed
            break;
        case "EVENTBRITE-MCP-MAIN":
            // Eventbrite requires API key
            args.api_key = server_credentials[selected_server]?.api_key || "";
            break;
        case "FEDORA-MCP-SERVER":
            // Fedora MCP server typically doesn't require credentials for basic operations
            break;
        default:
            break;
    }

    try {
        tool_call_result = await MCPServers[selected_server].callTool({
            name: tool_name,
            arguments: args
        });
    } catch(err){
        tool_call_result = `${err}`
    }
    return tool_call_result;
}