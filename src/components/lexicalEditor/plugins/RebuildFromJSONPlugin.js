import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getRoot } from 'lexical';

function RebuildFromJSONPlugin({ jsonContent }) {
    const [editor] = useLexicalComposerContext();

    const buildRawEditorState = () => {
        editor.update(() => {
            const root = $getRoot();
            root.clear(); // Clear all nodes
            const paragraphNode = $createParagraphNode();
            root.append(paragraphNode);
        })
    }

    // Function to rebuild editor state from JSON
    const rebuildEditorState = () => {
        if (Object.keys(jsonContent).length === 0) {
            buildRawEditorState()
        } else {
            // Parse JSON content and build the Lexical state
            const editorState = editor.parseEditorState(jsonContent);
            console.log(editor, editorState.isEmpty())

            if (editorState.isEmpty()) buildRawEditorState()
            else editor.setEditorState(editorState);
            
        }
    }

    // Call the function to rebuild the editor state
    React.useEffect(() => {
        if (jsonContent) {
            rebuildEditorState();
        }
    }, [jsonContent]);

    return null;
}

export default RebuildFromJSONPlugin;
