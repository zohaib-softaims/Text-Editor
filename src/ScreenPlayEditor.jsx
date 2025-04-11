import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

// Define initialValue with default blocks (Scene, Action, etc.)
const initialValue = [
  {
    type: "scene_heading",
    children: [{ text: "INT. ROOM – NIGHT" }],
  },
  {
    type: "action",
    children: [{ text: "John enters the dark room cautiously." }],
  },
  {
    type: "character",
    children: [{ text: "JOHN" }],
  },
  {
    type: "dialogue",
    children: [{ text: "Is anyone here?" }],
  },
];

// Render elements with conditional formatting for each type (Scene, Action, Character, Dialogue)
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "scene_heading":
      return (
        <h3 {...attributes} style={{ textTransform: "uppercase", margin: "1em 0", fontWeight: "bold" }}>
          {children}
        </h3>
      );
    case "action":
      return <p {...attributes} style={{ margin: "1em 0" }}>{children}</p>;
    case "character":
      return (
        <p {...attributes} style={{ textAlign: "center", textTransform: "uppercase", margin: "1em 0" }}>
          {children}
        </p>
      );
    case "dialogue":
      return (
        <p {...attributes} style={{ textAlign: "center", margin: "0.5em 0 1.5em" }}>
          {children}
        </p>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

// Main Screenplay Editor component
const ScreenplayEditor = () => {
  // Initialize Slate editor and manage state
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(initialValue); // This is where initialValue is passed

  const renderElement = useCallback(props => <Element {...props} />, []);

  // Function to insert specific block type (Scene, Action, etc.)
  const insertBlock = (type) => {
    const newBlock = { type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, newBlock);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Slate editor={editor} initialValue={value} onChange={newValue => setValue(newValue)}>
        {/* Block Buttons */}
        <div className="flex gap-2 mb-4">
          <BlockButton type="scene_heading">Scene</BlockButton>
          <BlockButton type="action">Action</BlockButton>
          <BlockButton type="character">Character</BlockButton>
          <BlockButton type="dialogue">Dialogue</BlockButton>
        </div>
        {/* Editable Slate component */}
        <Editable
          renderElement={renderElement}
          placeholder="Start writing your screenplay..."
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
};

// BlockButton component to insert new blocks
const BlockButton = ({ type, children }) => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        const block = { type, children: [{ text: "" }] };
        Transforms.insertNodes(editor, block);
      }}
      style={{
        padding: "6px 12px",
        marginRight: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        background: "#f9f9f9",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

export default ScreenplayEditor;
