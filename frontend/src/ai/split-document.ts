// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { loadServiceFee, loadWebPage, WEBSITE_URLS } from "./load-document";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { TaskType } from "@google/generative-ai";
// import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { supabase } from "../lib/supabase/client";

// export const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY!,
//     model: "gemini-embedding-2-preview",
//     taskType: TaskType.RETRIEVAL_DOCUMENT,
// });

// export const vectorStore = new SupabaseVectorStore(embeddings, {
//     client: supabase,
//     tableName: 'documents',
//     queryName: 'match_documents'
// })

// export async function buildVectorStore() {
//     // webDocs
//     const webDocs = await Promise.all(
//         WEBSITE_URLS.map((url) => loadWebPage(url))
//     );

//     const feeDocs = await loadServiceFee()
//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 800,
//         chunkOverlap: 120,
//     });

//     // Web docs cần split, fee docs đã là từng record riêng — không split thêm
//     const webChunks = await splitter.splitDocuments(
//         webDocs.filter((doc) => doc.pageContent.length > 100)
//     );

//     const docs = [...webChunks, ...feeDocs].flat();

//     const { error } = await supabase.from('documents').delete().neq('id', 0);
//     if (error) console.warn(error);

//     for (let j = 0; j < docs.length; j++) {
//         try {
//             await vectorStore.addDocuments([{
//                 pageContent: docs[j].pageContent,
//                 metadata: {
//                     ...docs[j].metadata,
//                     chunkIndex: j,
//                     site: "thilogi",
//                 }
//             }]);
//         } catch (e) {
//             throw e;
//         }
//     }
//     return {
//         totalDocuments: docs.length,
//         totalChunks: webChunks.length,
//     }
// }