import React, { useState, useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import './editor.scss';

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  RED: { color: 'red' },
};

export const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
};

export const EditorBox = () => {
  const editorRef = useRef(null);

  const loadEditorContent = () => {
    const savedData = localStorage.getItem("editorText");
    if (savedData) {
      try {
        const parsedContent = JSON.parse(savedData);
        if (parsedContent.blocks && parsedContent.entityMap) {
          const contentState = convertFromRaw(parsedContent);
          return EditorState.createWithContent(contentState);
        }
      } catch (error) {
        console.error("Failed to load saved editor content:", error);
      }
    }
    return EditorState.createEmpty();
  };

  const [editorBoxState, setEditorBoxState] = useState(loadEditorContent);
  const contentText = editorBoxState.getCurrentContent().getPlainText();

  useEffect(() => {
    let newEditorBoxState = editorBoxState;
    if (contentText === '# ') {
      newEditorBoxState = RichUtils.toggleBlockType(editorBoxState, 'header-one', contentText.substring(1));
    }
    if (contentText === '*** ') {
      newEditorBoxState = RichUtils.toggleInlineStyle(editorBoxState, 'UNDERLINE', contentText.substring(4));
    }
    if (contentText === '** ') {
      newEditorBoxState = RichUtils.toggleInlineStyle(editorBoxState, 'RED', contentText.substring(3));
    }
    if (contentText === '* ') {
      newEditorBoxState = RichUtils.toggleInlineStyle(editorBoxState, 'BOLD', contentText.substring(2));
    }
    if (newEditorBoxState !== editorBoxState) {
      setEditorBoxState(newEditorBoxState);
    }
  }, [contentText]);

  const handleSave = () => {
    const contentState = editorBoxState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorText", JSON.stringify(rawContent));
  };

  return (
    <div className="container">
      <div className="header--box">
        <div className="main--heading">Demo Editor by Asif Tahashildar</div>
        <div className="header--btn">
          <div className="btn" onClick={handleSave}>Save</div>
        </div>
      </div>
      <div className="input--box">
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorBoxState}
          onChange={setEditorBoxState}
          placeholder="Type...."
          ref={editorRef}
          spellCheck={true}
        /> 
      </div>
    </div>
  );
};