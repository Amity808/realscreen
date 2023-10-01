console.log("Hi, I have been injected");

var recorder = null; 
var popupElement = null;
let barContainner
function createPopup() {
    barContainner = document.createElement("div");
barContainner.style.display = "none";
barContainner.style.gap = "1rem";
barContainner.style.alignItems = "center";
barContainner.style.minWidth = "400px";
barContainner.style.backgroundColor = "#141414";
barContainner.style.borderRadius = "100vh";
barContainner.style.paddingBlock = "0.5rem";
barContainner.style.justifyContent = "space-evenly";
barContainner.style.position = "fixed";
barContainner.style.bottom = "5%";
barContainner.style.left = "5%";
let time = document.createElement("div");
let timeP = document.createElement("p");
let timeSpan = document.createElement("span");
time.style.display = "flex";
time.style.alignItems = "center";
time.style.gap = "1rem";
timeP.style.fontWeight = "500";
timeP.style.fontSize = "1.25rem";
timeP.style.fontFamily = "Inter";
timeP.style.color = "#fff";
timeP.textContent = "00:03:35";
timeSpan.style.height = "8px";
timeSpan.style.width = "8px";
timeSpan.style.backgroundColor = "red";
timeSpan.style.borderRadius = "50%";
time.appendChild(timeP);
time.appendChild(timeSpan);
barContainner.appendChild(time);
let barPropContainner = document.createElement("div");
barPropContainner.style.display = "flex";
barPropContainner.style.alignItems = "center";
barPropContainner.style.gap = "1rem";
barPropContainner.style.borderLeft = "1px solid #E8E8E8";
barPropContainner.style.paddingLeft = "1rem";
document.body.appendChild(barContainner);
const controlItem1 = createControlItem("Pause", "https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166602/Icons/ae3ufl4s59dy7tvh0tsb.png");
const controlItem2 = createControlItem("Stop", "https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166664/Icons/gj2gn1upqjimsgv2j8cz.png");
const controlItem3 = createControlItem("Camera", "https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166781/Icons/cawunk9gdd9yfnnvlnei.png");
barPropContainner.appendChild(controlItem1);
barPropContainner.appendChild(controlItem2);
barPropContainner.appendChild(controlItem3);
function createControlItem(labelText, imgUrl) {
  const controlItem = document.createElement("div");
  //   controlItem.className = "controlItem";
  controlItem.style.display = "flex";
  controlItem.style.alignItems = "center";
  controlItem.style.gap = ".3rem";
  //   controlItem.style.paddingLeft = "1rem";
  controlItem.style.flexDirection = "column";
  const button = document.createElement("button");
  button.style.borderRadius = "50%";
  button.style.display = "grid";
  button.style.placeContent = "center";
  button.style.backgroundColor = "#fff";
  button.style.border = "none";
  button.style.height = "30px";
  button.style.width = "30px";
  const img = document.createElement("img");
  img.style.height = "15px";
  img.style.objectFit = "contain";
  img.src =imgUrl;

  button.appendChild(img);
  const label = document.createElement("small");
  label.style.fontWeight = "500";
  label.style.fontSize = "0.75rem";
  label.style.color = "#fff";
  label.textContent = labelText;
  controlItem.appendChild(button);
  controlItem.appendChild(label);
  return controlItem;
}

  barContainner.appendChild(barPropContainner);
}

function showPopup() {
    if (barContainner) {
        barContainner.style.display = "flex";
    }
}

function hidePopup() {
    if (barContainner) {
        barContainner.style.display = "none";
    }
}
function onAccessApproved(stream) {
    recorder = new MediaRecorder(stream)

    recorder.start()

    recorder.onstop = function(){
        hidePopup();
        stream.getTracks().forEach(function(track) {
            if(track.readyState === 'live') {
                track.stop()
            }
        });
    }

    recorder.ondataavailable = function (event){
        let recorededBlob = event.data;
        let url = URL.createObjectURL(recorededBlob);

        let a = document.createElement("a")
        a.style.display = "none";
        a.href = url;
        a.download = "recording.webm";

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a)

        URL.revokeObjectURL(url)

    }
}


chrome.runtime.onMessage.addListener( (message, sender, sendResponse)=>{

    if(message.action === "request_recording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);
        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 999999999,
                height: 999999999
            },

        }) .then((stream)=> {
            onAccessApproved(stream)
            showPopup()
            
            
        })
        
    }
    if(message.action === "stopvideo"){
        console.log("stopping recording");
        sendResponse(`processed: ${message.action}`);
        if(!recorder) return  console.log("no recorder");
        recorder.stop()
        document.body.removeChild(container)
        
    }
})

createPopup();



