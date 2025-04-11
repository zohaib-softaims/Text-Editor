import React, { useCallback, useMemo, useState, useEffect } from "react";
import { createEditor, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

// Define initialValue with default blocks (Scene, Action, etc.)
const defaultValue = [
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

const ScreenplayEditor = () => {
  // Initialize Slate editor and manage state
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  // Load the saved screenplay from localStorage if it exists, otherwise use default value
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem("screenplay");
    return savedValue ? JSON.parse(savedValue) : defaultValue;
  });
console.log("value is",value)
  // Save the screenplay value to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("screenplay", JSON.stringify(value));
  }, [value]);

  const renderElement = useCallback((props) => <Element {...props} />, []);

  // Function to insert specific block type (Scene, Action, etc.)
  const insertBlock = (type) => {
    const newBlock = { type, children: [{ text: "" }] };
    Transforms.insertNodes(editor, newBlock);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Slate editor={editor} initialValue={value} onChange={(newValue) => setValue(newValue)}>
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

// Element rendering function (with the previous custom styling)
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "scene_heading":
      return (
        <h3
          {...attributes}
          style={{
            fontFamily: "Courier, monospace",
            fontSize: "12pt",
            marginLeft: "1.5in",
            marginRight: "1in",
            marginTop: "1in",
            marginBottom: "1in",
            textAlign: "left",
            fontWeight: "bold",
            textTransform: "uppercase",
            whiteSpace: "pre",
          }}
        >
          {children}
        </h3>
      );
    case "action":
      return (
        <p
          {...attributes}
          style={{
            fontFamily: "Courier, monospace",
            fontSize: "12pt",
            marginLeft: "1.5in",
            marginRight: "1in",
            marginTop: "0",
            marginBottom: "0",
            textAlign: "left",
            whiteSpace: "pre",
          }}
        >
          {children}
        </p>
      );
    case "character":
      return (
        <p
          {...attributes}
          style={{
            fontFamily: "Courier, monospace",
            fontSize: "12pt",
            marginLeft: "2.9in",
            marginRight: "2.3in",
            marginTop: "0.5in",
            marginBottom: "0.5in",
            textAlign: "center",
            textTransform: "uppercase",
            whiteSpace: "pre",
          }}
        >
          {children}
        </p>
      );
    case "dialogue":
      return (
        <p
          {...attributes}
          style={{
            fontFamily: "Courier, monospace",
            fontSize: "12pt",
            marginLeft: "2.9in",
            marginRight: "2.3in",
            marginTop: "0.5in",
            marginBottom: "0.5in",
            textAlign: "center",
            whiteSpace: "pre",
          }}
        >
          {children}
        </p>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default ScreenplayEditor;
