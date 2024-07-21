import './App.css';
import Note from './Note';
import {OpenAIClient, AzureKeyCredential} from "@azure/openai";
import { TooltipHost, DirectionalHint } from '@fluentui/react';
import {
  provideFluentDesignSystem,
  fluentButton,
} from "@fluentui/web-components";
import React, { useState } from 'react';
import { InfoRegular } from "@fluentui/react-icons";
import OpenAI from "openai";

provideFluentDesignSystem()
  .register(
      fluentButton(),
  );

function App() {
  const config = require('./config.json');
  const AIKey = config.openai.key;
  const deploymentName = "gpt-3.5-turbo";
  const openai = new OpenAI({apiKey: AIKey, dangerouslyAllowBrowser: true});

  const [notes, setNotes] = useState([])
  const addNote = () => {
      let newId;
      if (notes.length === 0) {
        newId = 1;
      }else {
        newId = notes[notes.length - 1].id + 1;
      }
      const newNotes = [...notes, {id: newId}];
      setNotes(newNotes);
  }

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => {return note.id !== id});
    setNotes(newNotes);
  }
  
  return (
    <div className="App">
      <header className="App-header">
          <fluent-button onClick={addNote}>Add new note</fluent-button>
          <TooltipHost content="Notes app that changes its appearance based on the text on the notes" directionalHint={DirectionalHint.bottomCenter}>
            <InfoRegular/>
          </TooltipHost>
      </header>
      <body>
        <div style={{position:"relative"}}>
          { notes.length > 0 && 
            notes.map((note) => {return <Note key={note.id} deleteNote={deleteNote} id={note.id} deploymentName={deploymentName} openai={openai}/>})
          }
        </div>
      </body>
    </div>
  );
}

export default App;