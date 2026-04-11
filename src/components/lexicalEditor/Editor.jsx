import React, { useState, useEffect, useRef, useContext } from 'react'

import { $getRoot, $createRangeSelection, $setSelection, $createTextNode } from 'lexical';

import EditorInstance from './EditorInstance.jsx';
import { editorController } from '../../config/base.js';
import { AuthContext } from '../authentication/Auth';
import { auth } from '../../config/firebase';

function parseCreatedAtValue(value) {
  if (!value) return new Date(0);
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1e6);
  }
  if (typeof value._seconds === 'number') {
    return new Date(value._seconds * 1000 + (value._nanoseconds || 0) / 1e6);
  }
  return new Date(value);
}

function sortByCreatedAt(arr) {
  return arr.sort((a, b) => {
      const dateA = parseCreatedAtValue(a?.createdAt);
      const dateB = parseCreatedAtValue(b?.createdAt);
      return dateA - dateB; // Ascending order oldest to newest
  });
}

export default function Editor() {
  const { currentUser } = useContext(AuthContext);
  const [editors, setEditors] = useState([]);
  const [focusBlockId, setFocusBlockId] = useState(null);
  const [newBlockId, setNewBlockId] = useState(null);
  const lastEditorRef = useRef(null);
  
  useEffect(() => {
    const activeUser = currentUser ?? auth.currentUser;
    if (!activeUser) return;

    const fetchBlocks = async () => {
      try {
        const docs = await editorController.getBlocks() ?? [];
        const sortedDocs = Array.isArray(docs) ? sortByCreatedAt(docs) : [];
        console.log('Editor fetched blocks', activeUser.uid, docs.length, sortedDocs.length);

        if (!sortedDocs.length) {
          await addNewEditor();
        } else {
          setEditors(sortedDocs);
        }
      } catch (error) {
        console.error('Failed to load editor blocks:', error);
        await addNewEditor();
      }
    };

    fetchBlocks();
  }, [currentUser])

  const addNewEditor = async (initialContent = '') => {
    const doc = await editorController.createEmptyBlock(initialContent);

    if (doc && doc.id) {
      setEditors((prevEditors) => [...prevEditors, doc]);
      setFocusBlockId(doc.id);
      setNewBlockId(doc.id);
      return;
    }

    const localId = `local-${Date.now()}`;
    setEditors((prevEditors) => [
      ...prevEditors,
      {
        id: localId,
        content: initialContent ?? '',
        createdAt: new Date(),
      },
    ]);
    setFocusBlockId(localId);
    setNewBlockId(localId);
  };

  

  // Function to log changes
  const logChanges = (markdownContent, blockId) => {
      console.log('Detected editor change:', blockId);
      editorController.updateBlock(blockId, markdownContent ?? '');
  };

  const deleteEditor = (indexToRemove) => {
    if (editors.length === 1) return

    editorController.deleteBlock(indexToRemove)

    const previousEditorIndex = editors.findIndex((block) => block.id === indexToRemove) - 1

    setEditors((prevEditors) => {
      const newEditors = prevEditors.filter((block) => block.id !== indexToRemove);
      return newEditors;
    });
  
    // Focus on the previous editor and set cursor at the end
    setTimeout(() => {
      console.log(indexToRemove)
      // const previousEditorIndex = editors.findIndex((block) => block.id === indexToRemove) - 1;
      console.dir(previousEditorIndex)
      if (previousEditorIndex >= 0) {
        const previousEditorElement = document.querySelector(`[editor-instance="${editors[previousEditorIndex].id}"`).querySelector('.editor-input');
        if (previousEditorElement) {
          // Focus on the previous editor
          previousEditorElement.focus();
  
          // Set cursor at the end of the previous editor's content
          const previousEditor = previousEditorElement.__lexicalEditor;
          console.dir(previousEditor)
          if (previousEditor) {
            previousEditor.update(() => {
              const root = $getRoot();
              const paragraphs = root.getChildren();
              const lastParagraph = paragraphs[paragraphs.length - 1];

              if (lastParagraph) {
                // Ensure lastParagraph has text nodes
                let lastTextNode = null;
                const children = lastParagraph.getChildren();

                if (children.length > 0) {
                  // Find the last text node among the paragraph's children
                  lastTextNode = children[children.length - 1];
                  while (lastTextNode && lastTextNode.__type !== 'text') {
                    lastTextNode = lastTextNode.getLastChild();
                  }
                }

                if (!lastTextNode) {
                  // Create a new text node if none exists
                  lastTextNode = $createTextNode('');
                  lastParagraph.append(lastTextNode);
                }

                // Place the cursor at the end of the last text node
                const textContentSize = lastTextNode.getTextContentSize();
                const selection = $createRangeSelection();
                selection.setTextNodeRange(
                  lastTextNode,
                  textContentSize,
                  lastTextNode,
                  textContentSize
                );
                $setSelection(selection);
              }
            });
          }
        }
      }
    }, 0);
  };

  useEffect(() => {
    if (lastEditorRef.current) {
      lastEditorRef.current.scrollIntoView({block: 'center'});
    }
  }, [editors]);

  useEffect(() => {
    if (!focusBlockId) {
      return;
    }

    const focusTimeout = setTimeout(() => {
      const block = document.querySelector(`[editor-instance="${focusBlockId}"]`);
      const input = block?.querySelector('.editor-input');
      if (input) {
        input.focus();
      }
      setFocusBlockId(null);
    }, 0);

    return () => clearTimeout(focusTimeout);
  }, [editors, focusBlockId]);

  useEffect(() => {
    if (!newBlockId) {
      return;
    }

    const animationTimeout = setTimeout(() => {
      setNewBlockId(null);
    }, 350);

    return () => clearTimeout(animationTimeout);
  }, [newBlockId]);


  return (
    <div className='editor-wrapper'>
      {editors.map((block) => (
        <EditorInstance
          key={block.id}
          index={block.id}
          isNew={block.id === newBlockId}
          onDoubleEmpty={addNewEditor}
          onDelete={deleteEditor}
          onMutation={logChanges}
          scrollToRef={block.id === editors.length - 1 ? lastEditorRef : null}
          markdownContent={typeof block.content === 'string' ? block.content : ''}
          createdAt={block.createdAt ?? new Date()}
        />
      ))}
    </div>
  );
}
