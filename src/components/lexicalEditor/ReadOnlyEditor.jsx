import React, { useState, useEffect, useRef } from 'react'

import { $getRoot, $createRangeSelection, $setSelection, $createTextNode } from 'lexical';

import { editorController } from '../../config/base.js';
import ReadOnlyEditorInstance from './ReadOnlyEditorInstance.jsx';



function sortByCreatedAt(arr) {
  return arr.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      return dateA - dateB; // Descending order (latest to earliest)
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
          jsonContent={block.content}
          createdAt={block.createdAt}
        />
      ))}
    </div>
  );
}