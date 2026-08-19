import { getAnswerFromChatbot } from "@/src/ai/website-rag";
import { ChatMessage } from "@/src/components/pages/Chat/page";

export async function POST(req: Request) {
    const { question, chatHistory } = (await req.json()) as {
        question: string;
        chatHistory: ChatMessage[];
    };

    return getAnswerFromChatbot(question, chatHistory);
}
