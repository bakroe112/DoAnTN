"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
    Message as MessageUI,
    MessageAvatar,
    MessageContent,
} from "@/components/ui/message";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import ReactMarkdown from "react-markdown";

export type ChatMessage = {
    role: "user" | "model";
    text: string;
};

export default function ChatContainerPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend() {
        const question = input.trim();
        if (!question || loading) return;

        const userMsg: ChatMessage = { role: "user", text: question };
        const updatedHistory = [...messages, userMsg];

        setMessages(updatedHistory);
        setInput("");
        setLoading(true);

        // Placeholder cho AI reply, sẽ được stream vào
        setMessages((prev) => [
            ...prev,
            { role: "model", text: "" } as ChatMessage,
        ]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    chatHistory: messages,
                }),
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let accumulated = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        role: "model",
                        text: accumulated,
                    };
                    return updated;
                });
            }
        } catch {
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "model",
                    text: "Đã xảy ra lỗi. Vui lòng thử lại.",
                };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex h-screen flex-col">
            {/* Message list */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mx-auto flex max-w-2xl flex-col gap-4">
                    {messages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        return (
                            <MessageUI key={i} align={isUser ? "end" : "start"}>
                                <MessageAvatar>
                                    <Avatar>
                                        {isUser ? <AvatarImage src="/images/avatar/user_avatar.png" alt="@User" className="bg-teal-600 border-[1.5px] border-teal-900" /> : <AvatarImage src="/images/avatar/AI_avatar.png" alt="@Unity" className="bg-teal-600 border-[1.5px] border-teal-900" />}
                                    </Avatar>
                                </MessageAvatar>
                                <MessageContent>
                                    <Bubble variant={isUser ? "default" : "muted"}>
                                        <BubbleContent>
                                            {msg.text ? (
                                                isUser ? (
                                                    msg.text
                                                ) : (
                                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                )
                                            ) : loading &&
                                                i === messages.length - 1 ? (
                                                <span className="animate-pulse text-muted-foreground">
                                                    Đang trả lời...
                                                </span>
                                            ) : null}
                                        </BubbleContent>
                                    </Bubble>
                                </MessageContent>
                            </MessageUI>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input bar */}
            <div className="border-t bg-background px-4 py-4">
                <div className="mx-auto flex max-w-2xl gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập câu hỏi..."
                        disabled={loading}
                        className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={loading || !input.trim()}>
                        Gửi
                    </Button>
                </div>
            </div>
        </div>
    );
}
