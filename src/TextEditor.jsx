import React, { useCallback, useEffect, useRef, useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]
  

function TextEditor() {

    const {id: documentId} = useParams();
    const [socket,setSocket] = useState();
    const [quill,setQuill] = useState();
    // console.log(documentId);

    const connectingUrl = "https://docs-clone-backend.onrender.com";

    useEffect(()=>{
      const s = io(connectingUrl);
      setSocket(s);

      return () => {
        s.disconnect(); 
      }
    },[]);

    useEffect(()=>{
      if(socket==null || quill == null) return;

      socket.once("load-document", doucment => {
        quill.setContents(doucment)
        quill.enable()
      })

      socket.emit('get-document', documentId);

    },[socket, quill, documentId]);

    useEffect(()=>{
      if(socket==null || quill == null) return;

      const interval = setInterval(() => {
        socket.emit('save-document', quill.getContents())
      },2000)

      return () => {
        clearInterval(interval);
      }

    },[socket, quill]);

    useEffect(()=>{
      if(socket==null || quill == null) return;

      const changeHandler = (delta) => {
        quill.updateContents(delta)
      }
      socket.on('receive-changes', changeHandler );

      return () => {
        socket.off('receive-changes', changeHandler );
      }

    },[socket, quill]);

    useEffect(()=>{
      if(socket==null || quill == null) return;

      const changeHandler = (delta, oldDelta, source) => {
        if(source !== 'user') return;
        socket.emit("send-changes", delta);
      }
      quill.on('text-change', changeHandler );

      return () => {
        quill.off('text-change', changeHandler );
      }

    },[socket, quill]);


    const wrapperRef = useCallback( wrapper => {
        if(wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS },});
        q.disable();
        q.setText('Loading...');
        setQuill(q);
    },[]);

  return (
    <div className="container" ref={wrapperRef}> TextEditor. </div>
  )
}

export default TextEditor