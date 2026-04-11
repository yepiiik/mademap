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
      return dateA - dateB;
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

  const logChanges = (markdownContent, blockId) => {
      editorController.updateBlock(blockId, markdownContent ?? '');
  };

  const deleteEditor = (indexToRemove) => {
    if (editors.length === 1) return
    editorController.deleteBlock(indexToRemove)
    const previousEditorIndex = editors.findIndex((block) => block.id === indexToRemove) - 1
    setEditors((prevEditors) => prevEditors.filter((block) => block.id !== indexToRemove));
  
    setTimeout(() => {
      if (previousEditorIndex >= 0) {
        focusOnEditor(editors[previousEditorIndex].id, 'end');
      }
    }, 0);
  };

  const focusOnEditor = (blockId, position = 'end') => {
    const editorElement = document.querySelector(`[editor-instance="${blockId}"]`)?.querySelector('.editor-input');
    if (editorElement) {
      editorElement.focus();
      const lexicalEditor = editorElement.__lexicalEditor;
      if (lexicalEditor) {
        lexicalEditor.update(() => {
          const root = $getRoot();
          if (position === 'start') {
            const firstChild = root.getFirstChild();
            if (firstChild) {
              firstChild.selectStart();
            }
          } else {
            const lastChild = root.getLastChild();
            if (lastChild) {
              lastChild.selectEnd();
            }
          }
        });
      }
    }
  }

  const handleNavigation = (currentIndex, direction) => {
    const indexInArray = editors.findIndex(block => block.id === currentIndex);
    if (direction === 'up' && indexInArray > 0) {
      setTimeout(() => {
        focusOnEditor(editors[indexInArray - 1].id, 'end');
      }, 0);
    } else if (direction === 'down' && indexInArray < editors.length - 1) {
      setTimeout(() => {
        focusOnEditor(editors[indexInArray + 1].id, 'start');
      }, 0);
    }
  };

  useEffect(() => {
    if (lastEditorRef.current) {
      lastEditorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editors]);

  useEffect(() => {
    if (!focusBlockId) return;
    const focusTimeout = setTimeout(() => {
      focusOnEditor(focusBlockId, 'start');
      setFocusBlockId(null);
    }, 0);
    return () => clearTimeout(focusTimeout);
  }, [editors, focusBlockId]);

  useEffect(() => {
    if (!newBlockId) return;
    const animationTimeout = setTimeout(() => {
      setNewBlockId(null);
    }, 500);
    return () => clearTimeout(animationTimeout);
  }, [newBlockId]);

  return (
    <div className="min-h-screen pt-12 pb-32 bg-background">
      <div className="space-y-4">
        {editors.map((block) => (
          <EditorInstance
            key={block.id}
            index={block.id}
            isNew={block.id === newBlockId}
            onDoubleEmpty={addNewEditor}
            onDelete={deleteEditor}
            onMutation={logChanges}
            onNavigate={handleNavigation}
            scrollToRef={block.id === editors.length - 1 ? lastEditorRef : null}
            markdownContent={typeof block.content === 'string' ? block.content : ''}
            createdAt={block.createdAt ?? new Date()}
          />
        ))}
      </div>
    </div>
  );
}
