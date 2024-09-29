import { DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

// Define the Custom Editable Component
const EditableComponent = () => {
  const handleInput = (event) => {
    // Handle input changes if necessary
    // For example, you could sync this content back to Lexical's state
  };

  return (
    <div
      contentEditable={true}
      style={{
        border: '1px solid #4A90E2',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        minHeight: '50px',
      }}
      suppressContentEditableWarning={true}
      onInput={handleInput}
    >
      Edit me...
    </div>
  );
};

// Define the Custom Editable Node
export class EditableComponentNode extends DecoratorNode {
  static getType() {
    return 'editable-component';
  }

  static clone(node) {
    return new EditableComponentNode(node.__key);
  }

  constructor(key) {
    super(key);
  }

  // Create the DOM element for the node
  createDOM(config) {
    const div = document.createElement('div');
    return div;
  }

  // Update the DOM if necessary (return false if no updates)
  updateDOM() {
    return false;
  }

  // Render the React component
  decorate() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <EditableComponent />
      </Suspense>
    );
  }

  // Optional: Serialize the node (for persistence)
  exportJSON() {
    return {
      type: 'editable-component',
      version: 1,
      // Add any additional data you need to serialize
    };
  }

  // Optional: Deserialize the node
  static importJSON(serializedNode) {
    return new EditableComponentNode();
  }
}

// Helper functions to create and check the node
export function $createEditableComponentNode() {
  return new EditableComponentNode();
}

export function $isEditableComponentNode(node) {
  return node instanceof EditableComponentNode;
}
