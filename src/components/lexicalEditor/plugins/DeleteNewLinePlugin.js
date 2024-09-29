import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, ParagraphNode } from 'lexical';
// import { $isParagraphNode } from '@lexical/rich-text';

function DeleteNewLinePlugin({ onDoubleEmpty }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterMutationListener = editor.registerMutationListener(
        ParagraphNode,  // Listen for mutations on paragraph nodes
        (mutations) => {
            editor.update(() => {
                mutations.forEach((mutation, nodeKey) => {
                    console.dir(mutation)
                    if (mutation === 'created') {
                    // We read the editor state to access the node by its key
                        editor.getEditorState().read(() => {
                            const root = $getRoot();
                            const children = root.getChildren()

                            let emptyParagraphCount = 0

                            for (let i = children.length - 1; i >= 0; i--) {
                                const child = children[i];

                                // console.dir(children)


                                if (child.getTextContent().trim() === '' && child.getType() === 'paragraph') {
                                    emptyParagraphCount++;
                                } else {
                                    break;
                                }


                                if (emptyParagraphCount === 2 && children.length > 2) {
                                    // Trigger the callback to add a new editor
                                    onDoubleEmpty();


                                    setTimeout(() => {
                                        // Remove the last two paragraphs
                                        for (let j = 0; j < 2; j++) {
                                            editor.update(() => {
                                                const childToRemove = children[i + 1 - j];
                                                // console.dir(childToRemove)
                                                if (childToRemove) {
                                                    childToRemove.remove();
                                                }
                                            });
                                            // console.dir(children)
                                        }
                                    }, 1000)

                                    
                                    break;            
                                }
                            }

                            // console.log(emptyParagraphCount)
                            }
                        )
                    }
                });
            });
        }
    );

    return () => {
      unregisterMutationListener();
    };
  }, [editor, onDoubleEmpty]);

  return null;
}

export default DeleteNewLinePlugin;
