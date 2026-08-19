import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatMessage } from "../components/pages/Chat/page";
import { z } from "zod";
import { TaskType } from "@google/generative-ai";
import { supabase } from "@/lib/supabase/client";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

// Schema gộp: reply + memories trong 1 lần gọi
const combinedSchema = z.object({
    reply: z.string(),
    memories: z.array(
        z.object({
            content: z.string(),
            type: z.enum(["episodic", "semantic", "procedural"]),
            importance: z.number().min(0).max(1),
        })
    ),
});

export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY!,
    model: "gemini-embedding-2-preview",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
});

export const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "memories",
    queryName: "match_memories",
});

export type Memory = z.infer<typeof combinedSchema>["memories"][number];

// 1 prompt, 1 lần gọi API — trả về reply + memories cùng lúc
export async function extractUsefulInformations(
    question: string,
    chatHistory: ChatMessage[],
    model: ChatGoogleGenerativeAI,
) {
    const relevantMemories = await vectorStore.similaritySearch(question, 6, {
        filter: {
            userId: "asd123"
        }
    });
    // const relevantMemories = await vectorStore.similaritySearch(question, 6);

    const historyMessages = chatHistory.map((msg) =>
        msg.role === "user"
            ? new HumanMessage(msg.text)
            : new AIMessage(msg.text)
    );

    const extractor = model.withStructuredOutput(combinedSchema);

    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `
Bạn là trợ lý AI trong hệ thống ElderCare AI.

## VAI TRÒ

- Hỗ trợ giao tiếp, thông tin chung và hướng dẫn an toàn cơ bản
  cho người cao tuổi.
- Không phải bác sĩ, điều dưỡng hoặc chuyên gia y tế.
- Không thay thế bác sĩ, cơ sở y tế hoặc người chăm sóc thực tế.

## GIAO TIẾP

- Ưu tiên tiếng Việt.
- Trả lời tự nhiên, lịch sự, nhẹ nhàng và dễ hiểu.
- Ưu tiên câu ngắn, rõ ràng.
- Tránh thuật ngữ không cần thiết.
- Không gọi người dùng là "bệnh nhân" nếu không phù hợp.

## AN TOÀN

- Không chẩn đoán hoặc khẳng định bệnh.
- Không tự ý kê đơn, thay đổi hoặc ngừng thuốc.
- Với vấn đề sức khỏe, chỉ cung cấp thông tin chung và hướng dẫn an toàn.
- Nếu có dấu hiệu nghiêm trọng hoặc cấp cứu,
  khuyến nghị liên hệ người chăm sóc, cơ sở y tế hoặc dịch vụ cấp cứu.
- Nếu thiếu thông tin quan trọng, hỏi lại thay vì suy đoán.

## NGUYÊN TẮC

- Trả lời trực tiếp và không bịa đặt.
- Không tuyên bố đã thực hiện hành động mà hệ thống chưa thực hiện.
- Sử dụng history để hiểu ngữ cảnh.

## NHIỆM VỤ BỔ SUNG — MEMORY EXTRACTION

Ngoài việc trả lời, hãy trích xuất những thông tin đáng nhớ từ cuộc hội thoại
và đặt vào trường "memories".

CHỈ TRÍCH XUẤT:
- Thông tin ổn định về người dùng: tên, sở thích, thói quen, hoàn cảnh...
- Sự kiện hoặc trải nghiệm đáng nhớ có thể hữu ích về sau.
- Cách người dùng muốn AI giao tiếp hoặc hỗ trợ.

KHÔNG TRÍCH XUẤT:
- Câu hỏi hoặc câu trả lời thông thường.
- Thông tin tạm thời, không có giá trị về sau.
- Nội dung do AI suy đoán hoặc chưa được user xác nhận.

PHÂN LOẠI type:
- semantic: thông tin ổn định về người dùng
- episodic: sự kiện cụ thể đã xảy ra
- procedural: cách user muốn AI hành xử

IMPORTANCE: 0.0–0.3 ít quan trọng | 0.4–0.6 hữu ích | 0.7–0.8 quan trọng | 0.9–1.0 rất quan trọng

Nếu không có thông tin đáng nhớ → memories = [].
`,
        ],
        new MessagesPlaceholder("history"),
        ["human", "{question}"],
    ]);

    const chain = prompt.pipe(extractor);

    const result = await chain.invoke({
        history: historyMessages,
        question,
    });

    // Lưu memories background — không block response
    if (relevantMemories.length == 0) {
        vectorStore
            .addDocuments(
                result.memories.map((mem) => ({
                    pageContent: mem.content,
                    metadata: {
                        userId: "asd123",
                        type: mem.type,
                        importance: mem.importance,
                    },
                }))
            )
            .then(() => console.log("Memory saved:", result.memories))
            .catch((error) => console.error("Memory save error:", error));
    }

    return new Response(result.reply, {
        headers: {
            Connection: "keep-alive",
            "Content-Encoding": "none",
            "Cache-Control": "no-cache, no-transform",
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
