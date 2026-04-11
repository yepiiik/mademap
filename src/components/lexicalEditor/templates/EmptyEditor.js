import { createEditor } from 'lexical';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';

// Function to create editor state with a paragraph and export it as JSON
export default function createInitialEditorState() {
    // Create a new Lexical editor instance
    const editor = createEditor({});

    // Update the editor state
    editor.update(() => {
        const root = $getRoot();

        // Clear any existing content (optional, but ensures we're starting fresh)
        root.clear();

        // Create a new paragraph node and some text content
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode("This is a default paragraph.");

        // Append text node to the paragraph node
        paragraphNode.append(textNode);

        // Append the paragraph node to the root
        root.append(paragraphNode);
    })

    return editor._pendingEditorState.toJSON() // Seems to be a potential problem
    
}
