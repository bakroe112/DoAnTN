import { askWebsite } from "@/src/ai/website-rag";
import { Message } from "@/src/components/pages/Chat/page";

export async function POST(req: Request) {
    const { question, chatHistory } = (await req.json()) as {
        question: string;
        chatHistory: Message[];
    };

    return askWebsite(question, chatHistory);
}
