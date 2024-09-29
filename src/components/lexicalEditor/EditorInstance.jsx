import React from "react";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import LogChangesPlugin from "./plugins/LogChangesPlugin";
// import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin"
import DoubleEmptyParagraphPlugin from "./plugins/DoubleEmptyParagraphPlugin";
import EmptyEditorBackspacePlugin from "./plugins/EmptyEditorBackspacePlugin";
import ExampleTheme from "./themes/ExampleTheme";
import prepopulatedText from "./templates/SampleText";
import DeleteNewLinePlugin from "./plugins/DeleteNewLinePlugin";
import RebuildFromJSONPlugin from "./plugins/RebuildFromJSONPlugin";

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

// Component that encapsulates the ContentEditable with its associated plugins
export default function EditorInstance({ index, onDoubleEmpty, onDelete, onMutation, scrollToRef, jsonContent, createdAt }) {
  const localConfig = {
    ...editorConfig,
    namespace: `MyEditor-${index}`, // Ensure unique namespaces for each editor
  };

//   const saveContent = (changes) => {
//     console.dir(changes)
//   }

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
      {/* <DoubleEmptyParagraphPlugin onDoubleEmpty={onDoubleEmpty} /> */}
      <DeleteNewLinePlugin onDoubleEmpty={onDoubleEmpty} />
      <EmptyEditorBackspacePlugin index={index} onDelete={onDelete} />
      <LogChangesPlugin blockId={index} onMutation={onMutation}/>
      <RebuildFromJSONPlugin jsonContent={jsonContent} />
    </LexicalComposer>
  );
}