import React from 'react'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import ExampleTheme from './themes/ExampleTheme';
import RebuildFromJSONPlugin from './plugins/RebuildFromJSONPlugin';

const formatCreatedAt = (createdAt) => {
  if (!createdAt) return '';
  if (createdAt instanceof Date) return createdAt.toLocaleString();
  if (typeof createdAt.toDate === 'function') return createdAt.toDate().toLocaleString();
  if (typeof createdAt.seconds === 'number') {
    return new Date(createdAt.seconds * 1000 + (createdAt.nanoseconds || 0) / 1e6).toLocaleString();
  }
  if (typeof createdAt._seconds === 'number') {
    return new Date(createdAt._seconds * 1000 + (createdAt._nanoseconds || 0) / 1e6).toLocaleString();
  }
  return new Date(createdAt).toLocaleString();
};

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

function ReadOnlyEditorInstance({ index, markdownContent, createdAt, scrollToRef }) {
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
            <span className="editor_info">Created at: {formatCreatedAt(createdAt)}</span>
        </span>
        <RebuildFromJSONPlugin markdownContent={markdownContent} />
        </LexicalComposer>
    )
}

export default ReadOnlyEditorInstance