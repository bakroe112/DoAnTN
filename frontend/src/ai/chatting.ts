import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
    HumanMessage,
    AIMessage,
} from "@langchain/core/messages";
import { ChatMessage } from "../components/pages/Chat/page";

export async function chatingChatbot(
    question: string,
    chatHistory: ChatMessage[] = [],
    model: ChatGoogleGenerativeAI,
) {

    const historyMessages = chatHistory.map((msg) =>
        msg.role === "user"
            ? new HumanMessage(msg.text)
            : new AIMessage(msg.text)
    );

    // MAIN CHAT
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
`,
        ],
        new MessagesPlaceholder("history"),
        ["human", "{question}"],
    ]);

    const chain = prompt
        .pipe(model)
        .pipe(new StringOutputParser());

    const result = await chain.stream({
        context: "",
        history: historyMessages,
        question,
    });

    return new Response(result, {
        headers: {
            Connection: "keep-alive",
            "Content-Encoding": "none",
            "Cache-Control": "no-cache, no-transform",
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}