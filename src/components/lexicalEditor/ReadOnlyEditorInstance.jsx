import React from 'react'

const editorConfig = {
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode
    ]
};

function ReadOnlyEditorInstance() {
    const localConfig = {
        editable: false,
        ...editorConfig,
        namespace: `ReadOnlyEditor-${index}`, // Ensure unique namespaces for each editor
    };

    return (
        <LexicalComposer initialConfig={localConfig} >
        <div key={index} className={`editor-container`} editor-instance={index} ref={scrollToRef}>
            <RichTextPlugin
            contentEditable={<ContentEditable className={`editor-input`} />}
            //   placeholder={<div>Editor {index + 1}...</div>}
            />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            {/* Add other plugins as needed */}
            {/* <CodeHighlightPlugin /> */}
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
        </div>
        <span className="editor_info_block">
            <span className="editor_info">ID: {index}</span>
            <span className="editor_info">Created at: {createdAt.toDate().toLocaleString()}</span>
        </span>
        <RebuildFromJSONPlugin jsonContent={jsonContent} />
        </LexicalComposer>
    )
}

export default ReadOnlyEditorInstance