import {useRef, useEffect} from "react";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { editorController } from "../../../config/base";

export default function LogChangesPlugin({blockId, onMutation}) {
    const [editor] = useLexicalComposerContext();
    const previousStateRef = useRef(null);

    useEffect(() => {
        const unsubscribe = editor.registerUpdateListener(({ editorState }) => {
        const currentState = editorState;

        // Compare current state with the previous state by serializing the state
        if (previousStateRef.current) {
            const previousContent = JSON.stringify(previousStateRef.current.toJSON());
            const currentContent = JSON.stringify(currentState.toJSON());

            // Log changes only if the serialized content is different
            if (currentContent !== previousContent) {
                onMutation(currentState, blockId);
            }
        } else {
            // If no previous state exists, log the initial state
            onMutation(currentState, blockId);
        }

        // Store the current state for future comparisons
        previousStateRef.current = currentState;
        });

        return () => {
        unsubscribe();
        };
    }, [editor, blockId, onMutation]);

    return null;
}

