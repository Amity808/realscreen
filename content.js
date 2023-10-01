console.log("Hi, I have been injected");

var recorder = null; 
var popupElement = null;

function createPopup() {
    popupElement = document.createElement("div");
    popupElement.style.position = "fixed";
    popupElement.style.top = "10px";
    popupElement.style.left = "10px";
    popupElement.style.padding = "10px";
    popupElement.style.background = "rgba(0, 0, 0, 0.7)";
    popupElement.style.color = "#fff";
    popupElement.style.zIndex = "9999";
    popupElement.style.display = "none";
    // popupElement.textContent = "Recording started...";
    const containerDiv = document.createElement("div");
    containerDiv.className = "border-4 border-solid w-[551px] h-[86px] flex flex-row justify-between px-4 items-center bg-black rounded-full text-white gap-3";

    // Add your HTML content inside the container div
    containerDiv.innerHTML = `
    <div className=" border-4 border-solid w-[551px] h-[86px] flex flex-row justify-between px-4 items-center bg-black rounded-full text-white  gap-3 " style="border: 4px; border-style: solid; width: 551px; height: 86px; display: flex; justify-content: space-between; align-items: center; background: #000; border-radius: 9999px; color: aliceblue; gap: 12px;">
        <p className=" text-xl" style="font-size: 20px;">00:03:45</p>
        <img src={red} alt="red" className=" w-[10px] h-[10px] ml-[16px]" style=" width: 10px; height: 10px; margin-left: 16px;" />
        <span className=" mr-3 border-r-2 border ml-3 h-[48px]" style="margin-right: 3px; border-right-width: 2px; border: white; margin-left: 12px; height: 48px;"></span>
        <span style="display: flex; flex-direction: column; justify-content: center; align-items: center;" className=" flex flex-col justify-center items-center ">
          <img src="https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166664/Icons/gj2gn1upqjimsgv2j8cz.png" alt="" style="width: 24px; height: 24px;" className=" w-[24px] h-[24px]"/>
          <p>pause</p>
        </span>
        <span style="display: flex; flex-direction: column; justify-content: center; align-items: center;" className=" flex flex-col justify-center items-center ">
          <img src="https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166664/Icons/gj2gn1upqjimsgv2j8cz.png" alt="" style="width: 24px; height: 24px;" className=" w-[24px] h-[24px]"/>
          <p>Stop</p>
        </span>
        <span style="display: flex; flex-direction: column; justify-content: center; align-items: center;" className=" flex flex-col justify-center items-center ">
          <img src={pcamera} alt="" style="width: 24px; height: 24px;" className=" w-[24px] h-[24px]"/>
          <p>Camera</p>
        </span>
        <span style="display: flex; flex-direction: column; justify-content: center; align-items: center;" className=" flex flex-col justify-center items-center ">
          <img src={mic} alt="" style="width: 24px; height: 24px;" className=" w-[24px] h-[24px]"/>
          <p>Mic</p>
        </span>
        <span style="display: flex; flex-direction: column; justify-content: center; align-items: center;" className=" flex flex-col justify-center items-center ">
          <img src={bin} alt="" style="width: 24px; height: 24px;" className=" w-[24px] h-[24px]"/>
          
        </span>
      </div>
    `;

    popupElement.appendChild(containerDiv);

    document.body.appendChild(popupElement);
}

function showPopup() {
    if (popupElement) {
        popupElement.style.display = "block";
    }
}

function hidePopup() {
    if (popupElement) {
        popupElement.style.display = "none";
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