import React, { useState, useEffect, useRef } from 'react'

import { $getRoot, $createRangeSelection, $setSelection, $createTextNode } from 'lexical';

import { editorController } from '../../config/base.js';
import ReadOnlyEditorInstance from './ReadOnlyEditorInstance.jsx';



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

export default function ReadOnlyEditor() {
  const [editors, setEditors] = useState([]);
  const lastEditorRef = useRef(null);
  
  useEffect(() => {
    editorController.getBlocks().then((docs) => {

      const sortedDocs = sortByCreatedAt(docs)
      console.log(sortedDocs)

      setEditors([...sortedDocs])
      
    })
  }, [])

  return (
    <div className='editor-wrapper'>
      {editors.map((block) => (
        <ReadOnlyEditorInstance
          key={block.id}
          index={block.id}
          markdownContent={typeof block.content === 'string' ? block.content : ''}
          createdAt={block.createdAt}
        />
      ))}
    </div>
  );
}