import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND } from 'lexical';


// Plugin to handle backspace when the editor is empty
export default function EmptyEditorBackspacePlugin({ index, onDelete }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeBackspaceListener = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length === 1 && children[0].getTextContent() === '' && children[0].getType() === 'paragraph') {
            // If the current editor is empty, delete it and focus on the previous one
            onDelete(index);
            return true; // Prevent the default backspace behavior
          }
        }
        return false; // Let the default behavior happen
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeBackspaceListener();
    };
  }, [editor, index, onDelete]);

  return null;
}