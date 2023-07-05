window.onload = function (){
    checkSavedPlayer();
}

function getBaseUrl(){
    return window.location.protocol+"//"+window.location.host+(window.location.pathname).replace("index.html", "");
}

function setStageResults(stageNumber, stageResults){
    localStorage.setItem("stage-results-"+stageNumber, JSON.stringify(stageResults));
}

function getStageResults(stageNumber){
    return localStorage.getItem("stage-results-"+stageNumber) ? JSON.parse(localStorage.getItem("stage-results-"+stageNumber)) : [];
}

function checkSavedPlayer(){
    if(PLAYER.getName()){
        let nickName = document.querySelector("#nickname");

        if(document.querySelector("#regards")){
            document.querySelector("#regards").innerText = "Welcome Back!";
        }
        if(document.querySelector("#start-game")){
            document.querySelector("#start-game").innerText = "Continue";
            document.querySelector("#start-game").classList.remove("btn-purple");
            document.querySelector("#start-game").classList.add("btn-green");
        }

        nickName.value = PLAYER.getName();
        validateNickName(nickName);
    }
}

function startGaming(){
    PLAYER.setName(document.querySelector("#nickname").value);
    include('menu/main-menu', '#main-content');
}

function enableSfxButtonClicked(){
    let selector = '.sfx-click';
    if(document.querySelector(selector)){
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener("click", function (){
                playSFX('pop.mp3');
            })
        })
    }
}

function loadView(viewPath){
    include(viewPath);
}

function loadModal(viewPath, modalTitle, btnName = 'Save', btnRedirect = false, contentPath = false){
    //Fix path name
    viewPath = "views/"+((viewPath.replace("views/", "").replace("/views/", "")).replace(".html", ""))+".html";

    //Load the view in the element and execute some requireds functions
    $('#modalTemplateLoad').load(viewPath, function(responseTxt, statusTxt, xhr){
        if(statusTxt == "error"){
            showErrorInConsole("Error: " + xhr.status + ": " + xhr.statusText);
        }
        if(statusTxt == "success"){
            enableSfxButtonClicked();
            document.querySelector("#modalTemplateTitle").innerHTML = modalTitle;
            document.querySelector("#modalTemplateSave").innerHTML = btnName;

            if(contentPath){
                include(contentPath, '#modalTemplateContent');
            }

            if(btnRedirect){
                document.querySelector("#modalTemplateSave").setAttribute("onclick", "loadView('"+btnRedirect+"')");
            }

            document.querySelector("#modalTemplateBtn").click();
        }
    });
}

function formatTime(timeInSeconds){
    let minutes = Math.floor(timeInSeconds / 60);
    let secondsLeft = timeInSeconds % 60;
    minutes = minutes < 0 ? 0 : minutes;
    secondsLeft = secondsLeft < 0 ? 0 : secondsLeft;
    return `${String(minutes).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
}

function openMenu(){
    loadModal('partials/modal/index', 'Game Settings', 'OK', false, 'menu/settings');

    //Set definitions by history
    setTimeout(function (){
        //Set audio settings
        if(document.querySelector("#master-volume")){
            let audioValue = PLAYER.getMainVolume().toString().replace("0.", "");
            document.querySelector("#master-volume").value = audioValue;
            changeMasterVolume(PLAYER.getMainVolume());
        }
        if(document.querySelector("#fx-volume")){
            let audioValue = PLAYER.getFxVolume().toString().replace("0.", "");
            document.querySelector("#fx-volume").value = audioValue;
            changeFxVolume(PLAYER.getFxVolume());
        }

        if(document.querySelector("#icon-music-stop") && PLAYER.getPauseMainVolume() == "1"){
            document.querySelector("#icon-music-stop").classList.remove('fa-pause');
            document.querySelector("#icon-music-stop").classList.add('fa-play');
        }
    },250);
}