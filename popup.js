document.addEventListener("DOMContentLoaded", () => {
    // Get the select of the button
    const startVideoButton = document.querySelector("button#start_video")
    const stopVideoButton = document.querySelector("button#stopvideo")

    // adding event listeners

    startVideoButton.addEventListener("click", ()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "request_recording"},  function(response){
                if(!chrome.runtime.lastError){
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError, 'error line 14')
                }
            })
        } )
        
    })
    stopVideoButton.addEventListener("click", () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, { action: "stopvideo"}, 
            function(response) {
                if(!chrome.runtime.lastError){
                    console.log(response);
                } else {
                    console.log(chrome.runtime.lastError, "error line ");
                }
            })
        })
    })
})