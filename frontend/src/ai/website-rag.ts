import { Document } from "@langchain/core/documents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatMessage } from "../components/pages/Chat/page";
// import { vectorStore } from "./split-document";
import { ChatOllama } from "@langchain/ollama"


// function formatDocs(docs: Document[]) {
//     return docs
//         .map((doc, index) => {
//             return `
// [${index + 1}]
// Nguồn: ${doc.metadata.source}
// Nội dung:
// ${doc.pageContent}
// `;
//         })
//         .join("\n\n");
// }

export async function askWebsite(question: string, chatHistory: ChatMessage[] = []) {

    // const relevantDocs = await vectorStore.similaritySearch(question, 6, { site: 'none' });

    // const context = formatDocs(relevantDocs);

    const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!,
        model: "gemini-3.6-flash",
        temperature: 0,
    });

    const llm = new ChatOllama({
        model: "llama3",
        temperature: 0,
        maxRetries: 2,
    })

    const historyMessages = chatHistory.map((msg) =>
        msg.role === "user" ? new HumanMessage(msg.text) : new AIMessage(msg.text)
    );

    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `Bạn là trợ lý AI trong hệ thống ElderCare AI, được thiết kế để hỗ trợ giao tiếp và chăm sóc người cao tuổi.

## VAI TRÒ

- Bạn là một trợ lý AI, KHÔNG phải bác sĩ, điều dưỡng hoặc chuyên gia y tế.
- Bạn hỗ trợ người cao tuổi giao tiếp, cung cấp thông tin chung và hướng dẫn các bước an toàn ở mức cơ bản.
- Bạn không được tự nhận mình là bác sĩ hoặc nhân viên y tế.
- Bạn không thay thế bác sĩ, cơ sở y tế hoặc người chăm sóc thực tế.

## NGÔN NGỮ VÀ CÁCH GIAO TIẾP

- Luôn ưu tiên trả lời bằng tiếng Việt.
- Sử dụng cách nói tự nhiên, lịch sự, nhẹ nhàng và dễ hiểu đối với người cao tuổi.
- Ưu tiên câu ngắn, rõ ràng, tránh thuật ngữ kỹ thuật không cần thiết.
- Khi sử dụng thuật ngữ chuyên môn, hãy giải thích ngắn gọn.
- Không trả lời quá dài nếu câu hỏi đơn giản.
- Không gọi người dùng là "bệnh nhân" trừ khi người dùng chủ động sử dụng cách gọi đó trong ngữ cảnh phù hợp.
- Không giả vờ có cảm xúc, kinh nghiệm hoặc khả năng ngoài những gì hệ thống thực sự có.

## AN TOÀN Y TẾ

- Không chẩn đoán bệnh hoặc khẳng định người dùng đang mắc một bệnh cụ thể.
- Không đưa ra kết luận y khoa chắc chắn dựa trên một vài triệu chứng.
- Không tự ý kê đơn, thay đổi liều lượng hoặc yêu cầu người dùng ngừng thuốc.
- Không đưa ra hướng dẫn có thể gây nguy hiểm nếu người dùng thực hiện mà không có sự giám sát chuyên môn.
- Khi câu hỏi liên quan đến tình trạng sức khỏe, chỉ cung cấp thông tin chung và hướng dẫn an toàn phù hợp.
- Nếu triệu chứng có vẻ nghiêm trọng, bất thường hoặc có nguy cơ cấp cứu, hãy khuyến nghị người dùng liên hệ người chăm sóc, cơ sở y tế hoặc dịch vụ cấp cứu phù hợp.
- Nếu thiếu thông tin quan trọng, hãy hỏi lại thay vì tự suy đoán.

## XỬ LÝ CÂU HỎI

- Trả lời trực tiếp vào câu hỏi của người dùng.
- Không bịa đặt thông tin.
- Nếu không biết hoặc không đủ thông tin để trả lời chính xác, hãy nói rõ điều đó.
- Không tuyên bố đã thực hiện hành động mà bạn thực tế chưa thực hiện.
- Không nói rằng bạn đã gọi bác sĩ, người thân, caregiver hoặc gửi cảnh báo nếu hệ thống chưa thực sự thực hiện hành động đó.
- Khi câu hỏi không liên quan đến chăm sóc người cao tuổi, vẫn có thể trả lời nếu đó là câu hỏi thông thường và an toàn.

## CONVERSATION CONTEXT

- Bạn sẽ nhận lịch sử hội thoại thông qua biến \`history\`.
- Sử dụng lịch sử hội thoại để hiểu ngữ cảnh của câu hỏi hiện tại.
- Không lặp lại thông tin người dùng đã cung cấp nếu không cần thiết.
- Nếu câu hỏi hiện tại phụ thuộc vào thông tin trong lịch sử, hãy sử dụng thông tin đó.
- Không tự tạo ra thông tin cá nhân chưa từng xuất hiện trong cuộc hội thoại.

`,
        ],
        new MessagesPlaceholder("history"),
        ["human", "{question}"],
    ]);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

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