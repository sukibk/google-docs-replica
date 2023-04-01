import 'quill/dist/quill.snow.css'
import Quill from 'quill';
import {useCallback, useEffect, useState} from "react";
import styles from './TextEditor.module.css'
import {background} from "quill/ui/icons.js";
import {io} from 'socket.io-client';
import {redirect, useNavigate} from "react-router";
import {v4 as uuidV4} from 'uuid';
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
    [{header: [1, 2, 3, 4, 5, 6, false] }],
    [{font: [] }],
    [{color: []}, { background: []}],
    [{script: 'sub'}, {script: 'super'}],
    [{align: [] }],
    ['image', 'blockquote', 'code-block'],
    ['clean']
]

export const TextEditor = () => {
    const {routeID: documentId} = useParams()
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const navigate = useNavigate();

    console.log()

    useEffect(() => {
        const s = io('http://localhost:5175');
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if(socket == null || quill == null) return

        socket.once('load-document', document => {
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-document', documentId);
    }, [socket, quill, documentId])



    useEffect(() => {
        if(socket == null || quill == null) return
        const handler = (delta) => {
            quill.updateContents(delta)
        }

        socket.on('receive-changes', handler)

        return () => {
            socket.off('receive-changes', handler)
        }
    }, [socket, quill])

    useEffect(() => {
        if(socket == null || quill == null) return
        const handler = (delta, oldDelta, source) => {
            if(source !== 'user') return
            socket.emit("send-changes", delta)
        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])

    const wrapperRef = useCallback(wrapper => {
        if(wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS}})
        q.disable()
        q.setText('Loading...')
        setQuill(q);

    }, [])

    return <div className='container' ref={wrapperRef}></div>
}

