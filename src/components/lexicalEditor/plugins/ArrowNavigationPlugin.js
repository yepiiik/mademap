import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
    $getSelection, 
    $isRangeSelection, 
    COMMAND_PRIORITY_HIGH, 
    KEY_ARROW_UP_COMMAND, 
    KEY_ARROW_DOWN_COMMAND,
    $getRoot
} from 'lexical';

export default function ArrowNavigationPlugin({ onNavigate }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const removeUpListener = editor.registerCommand(
            KEY_ARROW_UP_COMMAND,
            (event) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection) && selection.isCollapsed()) {
                    const anchor = selection.anchor;
                    const root = $getRoot();
                    const firstChild = root.getFirstChild();
                    
                    // Check if the selection is at the start of the first block
                    const firstDescendant = firstChild?.getFirstDescendant() || firstChild;
                    if (firstDescendant && anchor.key === firstDescendant.getKey() && anchor.offset === 0) {
                        event.preventDefault();
                        onNavigate('up');
                        return true;
                    }
                }
                return false;
            },
            COMMAND_PRIORITY_HIGH
        );

        const removeDownListener = editor.registerCommand(
            KEY_ARROW_DOWN_COMMAND,
            (event) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection) && selection.isCollapsed()) {
                    const anchor = selection.anchor;
                    const root = $getRoot();
                    const lastChild = root.getLastChild();
                    
                    // Check if the selection is at the end of the last block
                    const lastDescendant = lastChild?.getLastDescendant() || lastChild;
                    if (lastDescendant && anchor.key === lastDescendant.getKey()) {
                        const isAtEnd = lastDescendant.getTextContentSize 
                            ? anchor.offset === lastDescendant.getTextContentSize()
                            : true;
                        
                        if (isAtEnd) {
                            event.preventDefault();
                            onNavigate('down');
                            return true;
                        }
                    }
                }
                return false;
            },
            COMMAND_PRIORITY_HIGH
        );

        return () => {
            removeUpListener();
            removeDownListener();
        };
    }, [editor, onNavigate]);

    return null;
}
