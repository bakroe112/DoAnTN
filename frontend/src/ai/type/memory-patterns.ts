// Các pattern này dùng để xác định xem một message có khả năng chứa thông tin đáng nhớ không

export const MEMORY_PATTERNS = {
    // Tên
    name: [
        /\btôi tên\b/i,
        /\btên tôi là\b/i,
        /\bhãy gọi tôi là\b/i,
        /\bgọi tôi là\b/i,
        /\btên của tôi\b/i,
    ],

    // Sở thích
    preferences: [
        /\btôi thích\b/i,
        /\btôi không thích\b/i,
        /\btôi hay\b/i,
        /\btôi ưa\b/i,
        /\btôi ghét\b/i,
        /\btôi yêu\b/i,
    ],

    // Thói quen
    habits: [
        /\btôi thường\b/i,
        /\btôi hay\b/i,
        /\btôi luôn\b/i,
        /\bmỗi ngày tôi\b/i,
        /\bhàng ngày tôi\b/i,
    ],

    // Thông tin cá nhân
    personal: [
        /\btôi sống\b/i,
        /\btôi làm\b/i,
        /\btôi dùng\b/i,
        /\btôi ở\b/i,
        /\btôi làm việc\b/i,
        /\bnhà tôi\b/i,
        /\bgia đình tôi\b/i,
    ],

    // Nhu cầu
    needs: [
        /\btôi cần\b/i,
        /\btôi muốn\b/i,
        /\btôi không muốn\b/i,
        /\btôi mong muốn\b/i,
        /\btôi hy vọng\b/i,
    ],

    // Sức khỏe / sự kiện đáng nhớ
    health_events: [
        /\btôi bị\b/i,
        /\btôi đang\b/i,
        /\bhôm qua tôi\b/i,
        /\bhôm nay tôi\b/i,
        /\btuần trước tôi\b/i,
        /\btuần này tôi\b/i,
        /\bgần đây tôi\b/i,
        /\btháng trước tôi\b/i,
        /\btôi vừa\b/i,
        /\btôi đã\b/i,
    ],

    // Cách giao tiếp mong muốn
    communication: [
        /\bhãy\s+\w+\s+(?:ngắn|dài|chi tiết|đơn giản)/i,
        /\btôi muốn bạn\b/i,
        /\bbạn nên\b/i,
        /\bđừng\s+\w+\s+quá/i,
    ],
};

// Kiểm tra xem một message có phải là memory candidate không 
export function isMemoryCandidate(text: string): boolean {
    if (!text || text.trim().length < 10) {
        return false;
    }

    const normalizedText = text.toLowerCase().trim();

    // Kiểm tra tất cả các pattern groups
    for (const patterns of Object.values(MEMORY_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(normalizedText)) {
                return true;
            }
        }
    }

    return false;
}
