import DOMPurify from "isomorphic-dompurify"


export function formatCommentText(text: string): string {
    if (!text) return ""

    // Sanitize the input first
    let sanitizedText = DOMPurify.sanitize(text)

    // Format bold text: **text** to <strong>text</strong>
    sanitizedText = sanitizedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Format italic text: *text* to <em>text</em>
    sanitizedText = sanitizedText.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Format bullet points: - item to <li>item</li>
    if (sanitizedText.includes("\n- ")) {
        const lines = sanitizedText.split("\n")
        let inList = false

        sanitizedText = lines
            .map((line) => {
                if (line.startsWith("- ")) {
                    const item = line.substring(2)
                    if (!inList) {
                        inList = true
                        return `<ul><li>${item}</li>`
                    }
                    return `<li>${item}</li>`
                } else {
                    if (inList) {
                        inList = false
                        return `</ul>${line}`
                    }
                    return line
                }
            })
            .join("\n")

        if (inList) {
            sanitizedText += "</ul>"
        }
    }

    // Replace newlines with <br>
    sanitizedText = sanitizedText.replace(/\n/g, "<br>")

    return sanitizedText
}

/**
 * Strips HTML tags for safe storage in database
 */
export function stripHtmlForStorage(text: string): string {
    return text.replace(/<[^>]*>/g, "")
}
