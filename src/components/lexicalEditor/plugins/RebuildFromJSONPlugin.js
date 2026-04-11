import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getRoot } from 'lexical';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';

function RebuildFromJSONPlugin({ markdownContent }) {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        editor.update(() => {
            const root = $getRoot();
            root.clear();

            if (typeof markdownContent === 'string' && markdownContent.trim().length > 0) {
                $convertFromMarkdownString(markdownContent, TRANSFORMERS);
            } else {
                const paragraphNode = $createParagraphNode();
                root.append(paragraphNode);
            }
        });
    }, [editor, markdownContent]);

    return null;
}

export default RebuildFromJSONPlugin;
