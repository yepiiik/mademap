import { useEffect } from "react";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from 'lexical';


// Plugin to detect two consecutive empty paragraphs
export default function DoubleEmptyParagraphPlugin({ onDoubleEmpty }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeEnterListener = editor.registerCommand(
      KEY_ENTER_COMMAND,
      async () => {
        // Get the current selection
        const selection = $getSelection();
        const root = $getRoot();

        if (root.getLastChild() == selection.anchor.getNode()) {
          console.log("We should delete now")

          // Trigger the callback to add a new editor
          await onDoubleEmpty();

          // Remove the last two paragraphs
          for (let j = 1; j <= 2; j++) {
            editor.update(() => {
                const childToRemove = root.getLastChild();

                // Remobe last paragraph node
                if (childToRemove) {
                    childToRemove.remove();
                }
            });
          }

          
        } 

        // // Ensure the selection is a range selection (i.e., not node or grid selection)
        // if ($isRangeSelection(selection)) {
        //   // Get the anchor node (the node where the cursor is located)
        //   const anchorNode = selection.anchor.getNode();
          
        //   // If it's inside a paragraph node, we can check its content
        //   if (anchorNode.getParent()) {
        //     const parentNode = anchorNode.getParent();

        //     if (parentNode.getType() === 'paragraph') {
        //       const paragraphText = parentNode.getTextContent().trim();

        //       if (paragraphText === '') {
        //         // Handle logic for an empty paragraph node
        //         console.log('Empty paragraph node detected:', parentNode);
                
        //         // You can now perform actions, like checking consecutive paragraphs
        //         // and calling the onDoubleEmpty callback if needed
        //       }
        //     }
        //   }
        // }
        return false; // Returning false allows other listeners to run
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeEnterListener();
    };
  }, [editor, onDoubleEmpty]);

  return null;
}
