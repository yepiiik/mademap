import { useRef, useEffect } from "react";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';

export default function LogChangesPlugin({ blockId, onMutation }) {
    const [editor] = useLexicalComposerContext();
    const previousMarkdownRef = useRef(null);

    useEffect(() => {
        const unsubscribe = editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const markdown = $convertToMarkdownString(TRANSFORMERS);

                if (previousMarkdownRef.current !== markdown) {
                    previousMarkdownRef.current = markdown;
                    onMutation(markdown, blockId);
                }
            });
        });

        return () => {
            unsubscribe();
        };
    }, [editor, blockId, onMutation]);

    return null;
}

