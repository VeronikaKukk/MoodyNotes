import Draggable from 'react-draggable';
import {
    provideFluentDesignSystem,
    fluentTextArea,
    fluentButton
  } from "@fluentui/web-components";
import React, { useState } from 'react';
import { DeleteFilled } from "@fluentui/react-icons";

provideFluentDesignSystem()
    .register(
        fluentTextArea(),
        fluentButton()
    );

function Note(props){
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');
    const promptStart = "Suggest 3 emojis and a 1 color hex code that matches the text. Only add emojis and color all of them separated by one space. TEXT: ";
    
    const [bgColor, setBgColor] = useState('white');
    const [emojis, setEmojis] = useState([".", ".", "."]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const sendPrompt = async () => {
        const prompt = promptStart + text;
        console.log(prompt);
        try {
            const res = await props.openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: props.deploymentName
            });
            const completion = res.choices[0].message.content;
            console.log(completion);
            setResponse(completion);
            extractInfo();
        }
        catch (error) {
            console.error('Error sending prompt to Azure AI:', error);
        }
    };

    const deleteNote = () => {
        props.deleteNote(props.id);
   };

    const extractInfo = () => {
        if(response !== "") {
            let splitResponse = response.split(' ');
            let newEmojis = splitResponse.slice(0, 3);
            let newBgColor = splitResponse[3];
            setEmojis(newEmojis);
            setBgColor(newBgColor);
        }else {
            setBgColor("#FAEBD7");
            setEmojis(["🙂"]);
        }
    };

    return (
        <Draggable handle=".handle" defaultPosition={{x: 50, y: 40}} style={{position: 'absolute', padding:"20px"}}>
            <div style={{position: 'absolute', width: 'fit-content', height: 'fit-content', background: bgColor}}>
                <div className="handle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {emojis.map((emoji) => emoji)}
                    <fluent-button onClick={deleteNote} ><DeleteFilled/></fluent-button>
                </div>
                <div><textarea  resize="both" placeholder="Take a note" onChange={handleTextChange}></textarea></div>
                <fluent-button onClick={sendPrompt}>Refresh note</fluent-button>
            </div>
        </Draggable>
    );
}
export default Note;