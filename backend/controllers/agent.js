const { openai } = require("@ai-sdk/openai");
const { CoreMessage, streamText, tool } = require("ai");
const { z } = require("zod");
const { createServer } = require("./server");
const { apiRequest } = require("../requests/requests");

const messages = [];

async function agent(req, res) {
  try {
    const { userInput } = req.body;

    const token = req.header("auth-token");

    if (!userInput) {
      return res.status(400).json({ error: "Ask me anything :)" });
    }

    if (!token) {
      return res.status(401).json({ error: "Access Denied" });
    }

    messages.push({ role: "user", content: userInput });

    const result = streamText({
      model: openai("gpt-4o"),
      system: `
                  You are an intelligent agent designed to assist users in managing and interacting with Cord, a Discord clone. Follow these guidelines:
                  
                  Perform Actions Based on User Requests: Interpret commands like “Create a channel,” “Mute user,” or “Set a reminder,” and carry out tasks accordingly. Use the appropriate tools to perform these actions in real-time, updating databases and notifying users via Socket.IO.

                  Use Your Knowledge Base: Before responding, gather relevant information from your available resources to process the request. If no information is found, provide a concise response like "Sorry, I don't know."

                  Manage Core Features:

                  Server Management: Create, delete, or modify servers. Notify users of changes in real-time.

                  Channel Management: Create, delete, or modify channels. Notify users of changes in real-time.

                  User Management: Assign roles, mute users, and manage permissions.

                  Message Management: Pin, unpin, or delete messages.

                  Notifications/Reminders: Set and manage reminders or send notifications.

                  Real-Time Updates: After performing actions, ensure real-time updates using Socket.IO to communicate changes to users.

                  Add New Resources: If a user shares information or provides updates, store that in your knowledge base using the appropriate tool.
                  
                  When a tool returns a result with a "message", analyze it using the "getResult" tool before replying to the user. This helps summarize success or clarify errors. Chain tools when necessary.

                  Respond Concisely: When responding, keep it short and to the point. If you need multiple tools to respond, execute them in order without waiting for user feedback.
        `,
      messages,
      tools: {
        server: tool({
          description: "create a server",
          parameters: z.object({
            name: z.string(),
          }),
          execute: async ({ name }) => {
            try {
              const res = await apiRequest({
                endpoint: "server/createserver",
                method: "POST",
                body: { name },
                token,
              });
              return {
                status: "success",
                data: res,
                message: `Server "${name}" created successfully.`,
              };
            } catch (error) {
              console.log(error);
              return {
                status: "error",
                message: error.message,
                data: error.data,
              };
            }
          },
        }),
      },
      maxSteps: 5,
      //   onStepFinish: (step) => {
      //     console.log(JSON.stringify(step, null, 2));
      //   },
    });

    let fullResponse = "";
    for await (const delta of result.textStream) {
      fullResponse += delta;
    }

    messages.push({ role: "assistant", content: fullResponse });

    console.log(messages);

    res.status(201).json(fullResponse);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { agent };
