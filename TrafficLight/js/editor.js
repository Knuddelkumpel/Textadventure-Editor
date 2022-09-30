import * as Drag from "./editor_drag.js";
import * as SidePanel from "./editor_SidePanel_Base.js";
import * as Storage from "./shared/storage.js";
import * as Nodes from "./editor_nodes.js";
import * as Scaling from "./shared/scale.js";

setup();

function setup(){         
    const saveButton = document.getElementById("save-btn");
    saveButton.addEventListener("click", onSave);
    const returnToMenuBtn = document.getElementById("returnToMenuBtn");
    returnToMenuBtn.addEventListener("click", onReturnToMenu);

    Storage.loadCurrentGame();
    deleteUnused();
    Nodes.setup();

    Scaling.setup();
    Drag.setup();
    SidePanel.setup();

    setTitle();
    wordCount();
}

function deleteUnused(){
    Storage.currentGame.nodes = Storage.currentGame.nodes.filter(node => node.name != "[DELETE]");
}


function wordCount(){

    var countWordsPrompts = 0;
    var countCharactersPrompts = 0;
    var countWordsOptions = 0;
    var countCharactersOptions = 0;

    var nodes = Storage.currentGame.nodes;

    nodes.forEach(node => {
        node.prompts?.forEach(prompt =>{
            countCharactersPrompts += prompt.text.length
            countWordsPrompts += prompt.text.split(' ').length;
        });
        node.options?.forEach(option =>{
            countCharactersOptions += option.text.length
            countWordsOptions += option.text.split(' ').length;
        });
    });
    console.log("Charcount Prompts: " + countCharactersPrompts);
    console.log("Wordcount Prompts: " + countWordsPrompts);
    console.log("Charcount Options: " + countCharactersOptions);
    console.log("Wordcount Options: " + countWordsOptions);
    console.log("Charcount Total: " + (countCharactersPrompts + countCharactersOptions));
    console.log("Wordcount Total: " + (countWordsPrompts + countWordsOptions));
    console.log("Nodes: " + nodes.length);

    

}

function onReturnToMenu(e) {
    window.location.href = "menu.html";
}

function onSave(e){
    Storage.saveCurrentGame();
}

function setTitle(){
    var title = Storage.currentGame.name;
    document.title = title;
    document.getElementById("navTitle").textContent = title;
}
