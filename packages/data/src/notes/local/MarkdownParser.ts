/**
 * A simple Markdown parser for note previews and rendering.
 * This is a lightweight implementation for the desktop app.
 */
export class MarkdownParser {
  /**
   * Converts Markdown to plain text (strips formatting).
   */
  static toPlainText(markdown: string): string {
    if (!markdown) return '';
    let text = markdown;
    // Remove headers
    text = text.replace(/^#{1,6}\s+/gm, '');
    // Remove bold/italic
    text = text.replace(/\*\*(.+?)\*\*/g, '$1');
    text = text.replace(/\*(.+?)\*/g, '$1');
    text = text.replace(/_(.+?)_/g, '$1');
    text = text.replace(/~~(.+?)~~/g, '$1');
    // Remove links
    text = text.replace(/\[(.+?)\]\(.+?\)/g, '$1');
    // Remove images
    text = text.replace(/!\[.+?\]\(.+?\)/g, '');
    // Remove inline code
    text = text.replace(/`(.+?)`/g, '$1');
    // Remove blockquotes
    text = text.replace(/^>\s+/gm, '');
    // Remove lists markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');
    // Remove horizontal rules
    text = text.replace(/^-{3,}$/gm, '');
    // Remove extra whitespace
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
  }

  /**
   * Extracts a preview (first N characters) from Markdown content.
   */
  static preview(markdown: string, maxLength: number = 100): string {
    const plain = this.toPlainText(markdown);
    if (plain.length <= maxLength) {
      return plain;
    }
    return plain.substring(0, maxLength) + '…';
  }

  /**
   * Converts Markdown to HTML (for rendering in React/Web).
   * This is a very basic implementation; for full support use a library.
   */
  static toHTML(markdown: string): string {
    if (!markdown) return '';
    let html = markdown;

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Underline (not standard, but we'll support it)
    html = html.replace(/_(.+?)_/g, '<u>$1</u>');
    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Unordered lists
    html = html.replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');

    // Horizontal rules
    html = html.replace(/^-{3,}$/gm, '<hr>');

    // Paragraphs (add <p> around text blocks that aren't already wrapped)
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p><\/(p)>/g, '');

    return html;
  }
}