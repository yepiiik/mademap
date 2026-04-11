import React, { useState, useEffect } from "react";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TRANSFORMERS, $convertToMarkdownString } from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BLUR_COMMAND, FOCUS_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { Copy, Check } from "lucide-react";
import LogChangesPlugin from "./plugins/LogChangesPlugin";
import DoubleEmptyParagraphPlugin from "./plugins/DoubleEmptyParagraphPlugin";
import EmptyEditorBackspacePlugin from "./plugins/EmptyEditorBackspacePlugin";
import ExampleTheme from "./themes/ExampleTheme";
import DeleteNewLinePlugin from "./plugins/DeleteNewLinePlugin";
import RebuildFromJSONPlugin from "./plugins/RebuildFromJSONPlugin";
import ArrowNavigationPlugin from "./plugins/ArrowNavigationPlugin";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const formatCreatedAt = (createdAt) => {
  if (!createdAt) return '';
  const date = (createdAt instanceof Date) ? createdAt : 
               (typeof createdAt.toDate === 'function') ? createdAt.toDate() :
               (typeof createdAt.seconds === 'number') ? new Date(createdAt.seconds * 1000 + (createdAt.nanoseconds || 0) / 1e6) :
               (typeof createdAt._seconds === 'number') ? new Date(createdAt._seconds * 1000 + (createdAt._nanoseconds || 0) / 1e6) :
               new Date(createdAt);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const editorConfig = {
    theme: ExampleTheme,
    onError(error) {
      throw error;
    },
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

function FocusTrackingPlugin({ onFocus, onBlur }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    const unregisterFocus = editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        onFocus();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
    const unregisterBlur = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        onBlur();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
    return () => {
      unregisterFocus();
      unregisterBlur();
    };
  }, [editor, onFocus, onBlur]);

  return null;
}

function CopyButton({ index }) {
  const [editor] = useLexicalComposerContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    editor.getEditorState().read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="absolute right-6 top-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-secondary/20 text-muted-foreground"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function EditorInstance({ index, onDoubleEmpty, onDelete, onMutation, onNavigate, scrollToRef, markdownContent, createdAt, isNew }) {
  const [isFocused, setIsFocused] = useState(false);
  
  const localConfig = {
    ...editorConfig,
    namespace: `MyEditor-${index}`,
  };

  return (
    <LexicalComposer initialConfig={localConfig} >
      <div className="group relative mb-4 max-w-4xl mx-auto w-full px-4" ref={scrollToRef}>
        <Card className={cn(
          "transition-all duration-300 bg-[var(--transperant-background)] border-[var(--primary-border)] rounded-[var(--primary-border-radius)] p-[16pt_24pt] overflow-visible",
          isNew && "animate-in fade-in slide-in-from-top-4 duration-500",
          isFocused ? "border-secondary/50 shadow-md ring-1 ring-secondary/20" : "hover:border-accent/20"
        )}>
          <CardContent className="p-0 overflow-visible relative">
            <CopyButton index={index} />
            <div editor-instance={index} className="relative">
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input focus:outline-none outline-none prose prose-slate dark:prose-invert max-w-none min-h-[40px] text-lg leading-relaxed text-[var(--primary-color)]" />}
                placeholder={<div className="editor-placeholder">Start typing...</div>}
              />
              <HistoryPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <FocusTrackingPlugin onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
            </div>
          </CardContent>
        </Card>
        
        <div className={cn(
            "mt-2 flex items-center gap-4 px-1 transition-opacity duration-200",
            isFocused ? "opacity-60" : "opacity-0 group-hover:opacity-40"
        )}>
            <span className="text-[10px] uppercase tracking-wider text-[var(--primary-color)] font-semibold">
                ID: {index.toString().slice(-4)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--primary-color)] font-semibold">
                {formatCreatedAt(createdAt)}
            </span>
        </div>
      </div>

      <DoubleEmptyParagraphPlugin onDoubleEmpty={onDoubleEmpty} />
      <DeleteNewLinePlugin />
      <ArrowNavigationPlugin onNavigate={(direction) => onNavigate(index, direction)} />
      <EmptyEditorBackspacePlugin index={index} onDelete={onDelete} />
      <LogChangesPlugin blockId={index} onMutation={onMutation}/>
      <RebuildFromJSONPlugin markdownContent={markdownContent} />
    </LexicalComposer>
  );
}
