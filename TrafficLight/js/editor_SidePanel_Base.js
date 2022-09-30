import * as EditNode from "./editor_SidePanel_Node.js";
import * as EditConditionNode from "./editor_SidePanel_ConditionNode.js";
import * as EditActors from "./editor_SidePanel_Actor.js";
import * as EditGeneral from "./editor_SidePanel_GeneralSettings.js";
import * as EditImageUpload from "./editor_SidePanel_Images_Upload.js";
import * as EditImage from "./editor_SidePanel_Images.js";
import * as EditSource from "./editor_SidePanel_Source.js";
import * as Shared from "./shared/shared.js";

var sidePanelElement;
var sidePanelOffCanvas;

const nodeForm  = document.getElementById('sidePanelEditNodeForm');
const conditionNodeForm  = document.getElementById('sidePanelEditConditionNodeForm');
const generalForm  = document.getElementById('sidePanelEditGeneralForm');
const actorForm  = document.getElementById('sidePanelEditActorForm');
const imageUploadForm  = document.getElementById('sidePanelEditImageUploadForm');
const imageForm  = document.getElementById('sidePanelEditImageForm');
const sourceForm  = document.getElementById('sidePanelEditSourceForm');

function setup(){
    const sidePanelCloseBtn  = document.getElementById('sidePanelCloseBtn');
    sidePanelCloseBtn.addEventListener('click', onCloseSidePanel);

    sidePanelElement = document.getElementById('offcanvas');
    sidePanelOffCanvas = new bootstrap.Offcanvas(sidePanelElement, {
        toggle:false
    });
    
    nodeForm.addEventListener('submit', onSubmitNode);    
    conditionNodeForm.addEventListener('submit', onSubmitConditionNode);    
    generalForm.addEventListener('submit', onSubmitGeneral);
    actorForm.addEventListener('submit', onSubmitActor);
    imageUploadForm.addEventListener('submit', onSubmitImageUpload);
    imageForm.addEventListener('submit', onSubmitImage);
    sourceForm.addEventListener('submit', onSubmitSource);

    const editGeneralBtn  = document.getElementById('editGeneralButton');
    editGeneralBtn.addEventListener('click', onEditGeneral);
    const editActorBtn  = document.getElementById('editActorButton');
    editActorBtn.addEventListener('click', onEditActor);
    const editImageUploadBtn  = document.getElementById('editImageUploadButton');
    editImageUploadBtn.addEventListener('click', onEditImageUpload);
    const editImageBtn  = document.getElementById('editImageButton');
    editImageBtn.addEventListener('click', onEditImage);
    const editSourceBtn  = document.getElementById('editSourceButton');
    editSourceBtn.addEventListener('click', onEditSource);

    EditNode.setup();
    EditConditionNode.setup();
    EditActors.setup();
    EditImageUpload.setup();
    EditImage.setup();
    EditSource.setup();
}

function onCloseSidePanel(e){           
    hideSidePanel();
}

function onSubmitGeneral(e){
    e.preventDefault();

    var formData = getFormData(e.target);
    EditGeneral.submit(formData);

    hideSidePanel();
    return false;
}

function onSubmitNode(e){
    e.preventDefault();

    var formData = getFormData(e.target);
    EditNode.submit(formData);

    hideSidePanel();
    return false;
}

function onSubmitConditionNode(e){
    e.preventDefault();

    var formData = getFormData(e.target);
    EditConditionNode.submit(formData);

    hideSidePanel();
    return false;
}

function onSubmitActor(e){
    e.preventDefault();

    var formData = getFormData(e.target);
    EditActors.submit(formData);

    hideSidePanel();
    return false;
}

function onSubmitSource(e){
    e.preventDefault();

    var formData = getFormData(e.target);
    EditSource.submit(formData);

    hideSidePanel();
    return false;
}

function onSubmitImageUpload(e){
    e.preventDefault();

    var formData = getFormData(e.target);
    EditImageUpload.submit(formData);

    hideSidePanel();
    return false;
}

function onSubmitImage(e){
    e.preventDefault();

    var formData = getFormData(e.target);
    EditImage.submit(formData);

    hideSidePanel();
    return false;
}

function onEditGeneral(e){
    startEditGeneral();
}
function onEditActor(e){
    startEditActor();
}
function onEditImageUpload(e){
    startEditImageUpload();
}
function onEditImage(e){
    startEditImage();
}
function onEditSource(e){
    startEditSource();
}



function startEditNode(nodeId){
    showForm(nodeForm);
    EditNode.setForm(nodeId);
    showSidePanel();
}
function startEditConditionNode(nodeId){
    showForm(conditionNodeForm);
    EditConditionNode.setForm(conditionNodeForm, nodeId);
    showSidePanel();
}
function startEditSource(){
    showForm(sourceForm);
    EditSource.setForm(sourceForm);
    showSidePanel();
}
function startEditGeneral(){
    showForm(generalForm);
    EditGeneral.setForm();
    showSidePanel();
}
function startEditActor(){
    showForm(actorForm);
    EditActors.setForm();
    showSidePanel();
}
function startEditImageUpload(){
    showForm(imageUploadForm);
    EditImageUpload.setForm();
    showSidePanel();
}
function startEditImage(){
    showForm(imageForm);
    EditImage.setForm();
    showSidePanel();
}

function showForm(form){

    var submitElements = sidePanelElement.querySelectorAll('input[type="submit"]');
    var formElements = sidePanelElement.querySelectorAll('form');

    submitElements.forEach(Shared.displayHide);
    formElements.forEach(Shared.displayHide);

    var id = form.getAttribute("id");
    var submit = sidePanelElement.querySelector('input[form="'+ id +'"]');

    Shared.displayShow(form);
    Shared.displayShow(submit);
}




function getFormData(formElement) {
    var formData = new FormData(formElement);
    const root = {};
    for (const [path, value] of formData) {
        deepSet(root, path, value);
    }
    return root;
}
function deepSet(obj, path, value) {
    if (Object(obj) !== obj)
        return obj; // When obj is not an object   

    if (!Array.isArray(path)) // If not yet an array, get the keys from the string-path
        path = path.toString().match(/[^.[\]]+/g) || [];

    path.slice(0, -1).reduce((a, c, i) => // Iterate all of them except the last one
        Object(a[c]) === a[c] // Does the key exist and is its value an object?
            ? a[c] // Yes: then follow that path
            : a[c] = // No: create the key.
            Math.abs(path[i + 1]) >> 0 === +path[i + 1] // Is the next key a potential array-index?
                ? [] // Yes: assign a new array object
                : {} // No: assign a new plain object
        ,
        obj)[path[path.length - 1]] = value; // Finally assign the value to the last key

    return obj; // Return the top-level object to allow chaining
}

function showSidePanel(){
    sidePanelOffCanvas.show();
}
function hideSidePanel(){
    sidePanelOffCanvas.hide();
}




export{setup, getFormData, hideSidePanel, startEditNode, startEditConditionNode}
