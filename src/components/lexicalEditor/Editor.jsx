import React, { useState, useEffect, useRef } from 'react'

import { $getRoot, $createRangeSelection, $setSelection, $createTextNode } from 'lexical';

import EditorInstance from './EditorInstance.jsx';
import { editorController } from '../../config/base.js';


function sortByCreatedAt(arr) {
  return arr.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      return dateA - dateB; // Descending order (latest to earliest)
  });
}

export default function Editor() {
  const [editors, setEditors] = useState([]);
  const lastEditorRef = useRef(null);
  
  useEffect(() => {
    editorController.getBlocks().then((docs) => {
      // console.log(docs)
      // setEditors([...docs])

      const sortedDocs = sortByCreatedAt(docs)
      console.log(sortedDocs)

      if (docs.length == 0) {
        addNewEditor()
        return
      }

      setEditors([...sortedDocs])
      
    })
  }, [])


  const addNewEditor = async () => {
    const doc = await editorController.createEmptyBlock()
    setEditors((prevEditors) => [...prevEditors, doc])
  };

  // Function to log changes
  const logChanges = (editorState, blockId) => {
      const content = JSON.stringify(editorState.toJSON(), null, 2); // Pretty-print JSON

      console.log('Detected editor change:');
      // console.dir(editorState)
      editorController.updateBlock(blockId, editorState.toJSON())
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
    // console.log(editors)
    if (lastEditorRef.current) {
      lastEditorRef.current.scrollIntoView({block: 'center'});
      console.dir(lastEditorRef)
    }
  }, [editors]);


  return (
    <div className='editor-wrapper'>
      {editors.map((block) => (
        <EditorInstance
          key={block.id}
          index={block.id}
          onDoubleEmpty={addNewEditor}
          onDelete={deleteEditor}
          onMutation={logChanges}
          scrollToRef={block.id === editors.length - 1 ? lastEditorRef : null}
          jsonContent={block.content}
          createdAt={block.createdAt}
        />
      ))}
    </div>
  );
}
