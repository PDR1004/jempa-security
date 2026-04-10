import Groq from "groq-sdk";
import { environment } from "@/envConfig";
import { SYSTEM_PROMPT } from "@/app/lib/security/systemPrompt";

export class AddMessageHandler {
  private _groq: Groq;

  constructor() {
    this._groq = new Groq({
      apiKey: environment.credentials.groq,
    });
  }

  async handle(command: AddMessageCommand): Promise<AddMessageResponse> {
    const instruction: Groq.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];
    const history: Groq.Chat.ChatCompletionMessageParam[] = [];
    const conversation: Groq.Chat.ChatCompletionMessageParam[] = [
      ...instruction,
      ...history,
      {
        role: "user",
        content: command.message,
      },
    ];

    const completion = await this._groq.chat.completions.create({
      messages: conversation,
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      max_tokens: 350,
    });

    return {
      message:
        completion.choices[0]?.message?.content?.trim() ||
        "No pude generar una respuesta.",
    };
  }
}

export interface AddMessageCommand {
  message: string;
}

export interface AddMessageResponse {
  message: string;
}
