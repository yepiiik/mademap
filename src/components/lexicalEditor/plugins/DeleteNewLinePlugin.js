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
                    console.log(`Mutation in ${nodeKey}`)
                    console.dir(mutation)
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
