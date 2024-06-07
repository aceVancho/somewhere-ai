type Tool = {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, { type: string; description: string }>;
        required: string[];
      };
    };
  };
  
  const toolDefinitions: Record<string, Tool> = {};
  
  function defineTool(tool: Tool) {
    toolDefinitions[tool.function.name] = tool;
  }
  
  defineTool({
    type: "function",
    function: {
      name: "generate_entry_metadata",
      description: "Generate metadata for a journal entry, including title, tags, and analysis.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "A short title for the journal entry.",
          },
          tags: {
            type: "array",
            description: "Tags associated with the journal entry.",
          },
          analysis: {
            type: "string",
            description: "A short analysis of the journal entry.",
          },
        },
        required: ["title", "tags", "analysis"],
      },
    },
  });
  
  export const tools: Tool[] = Object.values(toolDefinitions);
  
  const functionMap: Record<string, Function> = {
    generate_entry_metadata: (args: { title: string; tags: string[]; analysis: string }) => args,
  };
  
  export const handleToolCalls = (result: any) => {
    console.log({ result })
    if (result.response_metadata?.finish_reason === 'tool_calls') {
      const { tool_calls } = result.lc_kwargs.additional_kwargs;
  
      if (!tool_calls) return null;
  
      for (const func of tool_calls) {
        const functionName = func.function.name;
        const functionArgs = JSON.parse(func.function.arguments);
        if (functionMap[functionName]) {
          return functionMap[functionName](functionArgs);
        }
      }
    }
    return null;
  };