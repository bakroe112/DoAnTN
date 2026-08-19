import { ChatMessage } from "../components/pages/Chat/page";
import { chatingChatbot } from "./chatting";
import { extractUsefulInformations } from "./extract-useful-informations";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { isMemoryCandidate } from "./type/memory-patterns";

export async function getAnswerFromChatbot(
    question: string,
    chatHistory: ChatMessage[] = []
) {
    const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!,
        model: "gemini-3.6-flash",
        temperature: 0,
    });
    // Check nếu question có keyword MEMORY_PATTERNS để đỡ tốn token
    if (!isMemoryCandidate(question)) {
        // MAIN CHAT
        return chatingChatbot(question, chatHistory, model);
    } else {
        // MEMORY EXTRACTION (chỉ chạy khi cần)
        return extractUsefulInformations(question, chatHistory, model);
    }
}