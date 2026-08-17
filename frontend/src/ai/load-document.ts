// import * as cheerio from "cheerio";
// import { Document } from "@langchain/core/documents";
// import { supabase } from "../lib/supabase/client";
// import { buildChildrenByParent, getParentCategories } from "../components/pages/order/function/orderCategoryUtils";

// export const WEBSITE_URLS = [
// ];


// export async function loadWebPage(url: string): Promise<Document> {

//     const response = await fetch(url, {
//         headers: {
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
//         },
//     });

//     if (!response.ok) {
//         throw new Error(`Không thể tải trang: ${url}`);
//     }

//     const html = await response.text();
//     const $ = cheerio.load(html);

//     $("script, style, nav, footer, header, noscript").remove();

//     const text = $("main").text() || $("body").text();

//     const cleanedText = text.replace(/\s+/g, " ").trim();

//     return new Document({
//         pageContent: cleanedText,
//         metadata: {
//             source: url,
//         },
//     });
// }

// export async function loadServiceFee(): Promise<Document[]> {

//         return new Document({
//             pageContent: lines.join("\n"),
//             metadata: {
//                 source: ""
//             }
//         });
//     });
// }