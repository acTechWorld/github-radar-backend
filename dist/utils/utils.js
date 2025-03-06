"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanText = cleanText;
function cleanText(text) {
    return text
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\[.*?\]\((.*?)\)/g, "$1") // Convert Markdown links to URLs
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting
        .replace(/`([^`]+)`/g, "$1") // Remove inline code formatting
        .replace(/-\s+/g, "- ") // Fix bullet points
        .replace(/\n{2,}/g, "\n\n") // Reduce excessive newlines
        .trim(); // Remove leading and trailing spaces
}
