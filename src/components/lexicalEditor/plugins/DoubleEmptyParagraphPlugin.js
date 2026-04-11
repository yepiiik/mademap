import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode } from 'lexical';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';

export default function DoubleEmptyParagraphPlugin({ onDoubleEmpty }) {
  const [editor] = useLexicalComposerContext();
  const splitTriggeredRef = useRef(false);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        const h1Matches = [...markdown.matchAll(/^#\s.*$/gm)];

        if (h1Matches.length > 1 && !splitTriggeredRef.current) {
          splitTriggeredRef.current = true;
          const secondHeadingIndex = h1Matches[1].index ?? 0;
          const beforeMarkdown = markdown.slice(0, secondHeadingIndex).trimEnd();
          const afterMarkdown = markdown.slice(secondHeadingIndex).trimStart();

          setTimeout(() => {
            editor.update(() => {
              const root = $getRoot();
              root.clear();

              if (beforeMarkdown.length > 0) {
                $convertFromMarkdownString(beforeMarkdown, TRANSFORMERS);
              } else {
                root.append($createParagraphNode());
              }
            });

            onDoubleEmpty(afterMarkdown);
          }, 0);
        }

        if (h1Matches.length <= 1) {
          splitTriggeredRef.current = false;
        }
      });
    });

    return () => {
      unregister();
    };
  }, [editor, onDoubleEmpty]);

  return null;
}
