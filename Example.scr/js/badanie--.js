//GLOBAL VARIABLES ====================================================================
var parSurveyId = -1,
    parStageNo  = -1,
    parUserId   = -1,
    parIntvNum  = -1;

var respondentOk = true;

var surveyId     = -1,
    stagesNum    = 1,
    stageNo      = -1,
    userId       = -1,
    intvNum      = -1,
    clientName   = "",
    subjectTxt   = "",
    firstIntvNum = 1,
    lastIntvNum  = 100000,
    intvNumAuto  = false,  //ankiety są numerowane automatycznie, jeżeli numer jest podany, to jest olewany
    intvNumTable = false,  //ankiety są numerowane automatycznie według tabeli, jeżeli numer, to powinien zostać sprawdzony
    intvNumGiven = false,  //numer musi być podany albo wpisany
    intvNumShow  = false;  //numer ankiety jest widoczny dla uzytkownika jako pierwsze pytanie

var cookiesTab    = ["0"],
    ckSurveyId    = -1,
    ckStageNo     = -1,
    ckUserId      = -1,
    ckIntvNum     = -1,
    ckStartTime   = -1,
    ckEndTime     = -1,
    restoredIntv  = false,
    ckExpiresText = ";expires=";

var startDataIsSet = false;

var currDateTime = "2017-04-01 01-01-01";

//=====================================================================================
var mouseX = 0,
    mouseY = 0,
    mouseObj;
function mouseMonitoring (e) {
  if (!e)
    e = window.event;
  mouseX = e.clientX,
  mouseY = e.clientY,
  mouseObj = (e.target) ? e.target : e.srcElement;
}//mouseMonitoring


var kbdChar = "",
    kbdObj;
function keyboardMonitoring (e) {
  if (!e)
    e = window.event;
  kbdChar = String.fromCharCode(e.keyCode? e.keyCode : e.which);
  kbdObj = (e.target) ? e.target : e.srcElement;
}//keyboardMonitoring


function MONITOR (txt) {
  if (txt == "clear" || txt == "reset")
    document.getElementById("monitor-monitor").innerHTML = "";
  else
    document.getElementById("monitor-monitor").innerHTML += txt;
}//MONITOR


function senseClick (e) {
  if (!e)
    e = window.event;
  var obj = (e.target) ? e.target : e.srcElement;
  if (obj.nodeName == "DIV" && 0 < obj.childNodes.length && (obj.childNodes[0].nodeName == "INPUT" || obj.childNodes[0].nodeName == "LABEL"))
    obj.childNodes[0].click();
}//senseClick
function makeInputsClickSensitive () {
  var inputs = document.questForm.getElementsByTagName("DIV");
MONITOR("<hr>makeInputsClickSensitive: " + inputs.length);
  for (var i = 0; i < inputs.length; i++)
    if (0 < inputs[i].childNodes.length && (inputs[i].childNodes[0].nodeName == "INPUT" || inputs[i].childNodes[0].nodeName == "LABEL"))
      inputs[i].onclick = senseClick;
}//senseClick


function displayOffQuestElements () {
  var objs,
      i;
  objs = document.getElementsByClassName("question_");
  for (i = 0; i < objs.length; i++)
    objs[i].style.display = "none";
  objs = document.getElementsByClassName("ask-user-box");
  for (i = 0; i < objs.length; i++)
    objs[i].style.display = "none";
  document.getElementById("all-questions").style.display = "block";
}//displayOffQuestElements


function displayOnAllQuestions () {
  var allQuestions = document.getElementsByClassName("question_");
  for (var i = 0; i < allQuestions.length; i++)
    allQuestions[i].style.display = "flex";
}//displayOnAllQuestions


function hideSomeInterviewElements () {
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("fill-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "hidden";
  document.getElementById("quest-nav-buttons").style.visibility = "visible";
  document.getElementById("position-info").style.visibility = "hidden";
}//hideSomeInterviewElements


function unhideAllQuestions () {
  var objs;
MONITOR("<hr>unhideAllQuestions<br>");
  objs = document.getElementsByClassName("question_");
  for (var i = 0; i < objs.length; i++)
    objs[i].hidden = false;
}//unhideAllQuestions


//=====================================================================================
//GETTING STARTUP INFORMATION =========================================================
function getInfoFromParams () {
  var params;
MONITOR("<hr>getInfoFromParams::search.len=" + window.location.search.length);
  parSurveyId = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
  parSurveyId = parSurveyId.substring(parSurveyId.lastIndexOf("/") + 1, parSurveyId.length);
  if (window.location.search.length < 4)
    parUserId = -1;
  else {
    params = window.location.search.substring(1, window.location.search.length).split("&");
    for (var i = 0; i < params.length; i++) {
      if (params[i].indexOf("sno=") != -1)
        parStageNo = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      if (params[i].indexOf("uid=") != -1)
        parUserId = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      if (params[i].indexOf("ino=") != -1)
        parIntvNum = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
    }//for
    if (parStageNo != -1)
      parStageNo = parStageNo.trim();
    if (parUserId != -1) {
      parUserId = parUserId.trim();
      if (parUserId == ".")
        parUserId = "";
    }//if
    if (parIntvNum != -1)
      parIntvNum = parIntvNum.trim();
  }//else
MONITOR("<br>parSurveyId=[" + parSurveyId + "]" + "<br>parStageNo=[" + parStageNo + "]" + "<br>parUserId=[" + parUserId + "]" + "<br>parIntvNum=[" + parIntvNum + "]");
  return parSurveyId;
}//getInfoFromParams


//ankieta powieszona z automatycznym nadaaniem numerów
//  AUTO HIDE !! bez podania numeru ankiety ino w parametrze
//    AUTO SHOW ?? bez podania numeru ankiety ino w parametrze
//anketa do CLT
//    GIVEN HIDE ?? numer ankiety ino powinien być podany w parametrze
//  GIVEN SHOW !! bez podania numeru ankiety ino w parametrze
//ankieta do HUT - 1 etap
//  TABLE HIDE !! numer ankiety ino powinien być podany w parametrze
//    TABLE SHOW ?? bez podania numeru ankiety ino w parametrze
//ankieta do HUT - wiele etapów
//  Multi TABLE HIDE !! numer ankiety ino powinien być podany w parametrze
//    Multi TABLE SHOW ?? bez podania numeru ankiety ino w parametrze
function getSurveysInfoFromDB () {
  var xhttp,
      elemTab,
      survey,
      survPos = -1,
      gotUser,
      i,
      intvNumType,
      XMLurl;
MONITOR("<hr>getSurveysInfoFromDB");
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "xml/badanie_.xml", false);//SYNCHRONICZNIE
  xhttp.send();
  elemTab = xhttp.responseXML.getElementsByTagName("SURVEY");
MONITOR("<br>elemTab.len=" + elemTab.length + ", " + elemTab[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue);
  survey = -1;
  if (parSurveyId != -1)
    for (i = 0; i < elemTab.length; i++)
      if (elemTab[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue == parSurveyId)//zakładam, że jest survey
        survey = elemTab[survPos=i];
  if (survey != -1) { //survPos < elemTab.length
    surveyId  = parSurveyId;//zmienna globalna
    stagesNum = survey.getElementsByTagName("STAGES")[0].childNodes[0].nodeValue;
    if (1 < stagesNum)
      if (1 <= parStageNo && parStageNo <= stagesNum)
        stageNo = parStageNo;
      else
        stageNo = parStageNo = 1;
    else {
      stagesNum = 1;
      parStageNo = -1;
      stageNo = -1;
    }//else
    clientName   = survey.getElementsByTagName("CLIENT")[0].childNodes[0].nodeValue;
    subjectTxt   = survey.getElementsByTagName("SUBJECT")[0].childNodes[0].nodeValue;
    firstIntvNum = survey.getElementsByTagName("FIRST_NUMBER")[0].childNodes[0].nodeValue;
    lastIntvNum  = survey.getElementsByTagName("LAST_NUMBER")[0].childNodes[0].nodeValue;
    intvNumType  = survey.getElementsByTagName("INTV_NUMBER")[0].childNodes[0].nodeValue;
    intvNumAuto  = intvNumType.indexOf("AUTO") != -1;
    intvNumGiven = intvNumType.indexOf("GIVEN") != -1;
    intvNumTable = intvNumType.indexOf("TABLE") != -1;
    if (intvNumTable) {
      intvNumAuto = false;
      intvNumGiven = false;
    }//if
    if (intvNumAuto)
      intvNumGiven = false;
    if (intvNumAuto || intvNumGiven) {
      stagesNum = 1;
      parStageNo = -1;
      stageNo = -1;
    }//if
    intvNumShow = intvNumType.indexOf("SHOW") != -1;
    intvNumShow = intvNumType.indexOf("HIDE") == -1;
    elemTab     = survey.getElementsByTagName("USER_ID");
MONITOR("<br>sId=[" + surveyId + "]" + "<br>sNum=[" + stagesNum + "]" + "<br>sNo=[" + stageNo + "]");
MONITOR("<br>client=[" + clientName + "]" + "<br>subject=[" + subjectTxt + "]" + "<br>frst=[" + firstIntvNum + "]" + ", last=[" + lastIntvNum + "]");
MONITOR("<br>iNGiven=[" + intvNumGiven + "]" + "<br>iNAuto=[" + intvNumAuto + "]" + "<br>iNTable=[" + intvNumTable + "]" + "<br>iNShow=[" + intvNumShow + "]");
MONITOR("<br>elemTab.len=[" + elemTab.length + "]<br> users=");
    if (intvNumAuto && parUserId == -1 && elemTab.length) {
      gotUser = elemTab[0].childNodes[0].nodeValue;
      userId = gotUser.substring(0, gotUser.indexOf("%")).trim();
    }//if
    for (i = 0; i < elemTab.length; i++) {//wczytanie użytkowników
      gotUser = elemTab[i].childNodes[0].nodeValue;
MONITOR(gotUser + ",");
      gotUser = gotUser.substring(0, gotUser.indexOf("%")).trim();
      if (parUserId != -1 && parUserId == gotUser) //parUserId.search(gotUser) != -1)  // znaleziony użytkownik
        userId = parUserId;
    }//for po wszystkich użytkownikach dla danego badania
MONITOR("<br>parUserId=[" + parUserId + "]" + "<br>userId=[" + userId + "]");
  }//if
}//getSurveysInfoFromDB


function saveSurveyLog (extraText) {
  var xhttp, txt;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200)
        txt = this.responseText;
    };//function()
  xhttp.open("GET", "php/zapiszSurveyLog.php?stage_no=" + parStageNo + "&user_id=" + parUserId + "&int_no=" + parIntvNum +
                                             "&agent=" + "agent" + "&extra=" + extraText, true);
  xhttp.send();
}//saveSurveyLog


function getDateTime (when) {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "php/getDateTime.php?when=" + when, false);
  xhttp.send();
  currDateTime = xhttp.responseText;
}//getDateTime


//COOKIES CONFIRM  ==============================================================
function cookiesConfirmed () {
  document.getElementById("cookies-confirm").style.display = "none";
}//cookiesConfirmed


function setLastCookies () {
  var currDate = new Date(),
      expDate  = new Date(currDate.getTime() + (91*24*60*60*1000));
MONITOR("<hr>setLastCookies<br>");
  ckExpiresText = ";expires=" + expDate.toUTCString();
  document.cookie = "LastVisit=" + currDate + ckExpiresText;
  document.cookie = "LastSurvey=" + surveyId + ckExpiresText;
  document.cookie = "LastUser=" + userId + ckExpiresText;
}//setLastCookies


//=====================================================================================
//IDENTYFIKATOR =======================================================================
function isIntvNumWaiting (tstUserId, tstIntvNum, tstStageNo) {
  var xhttp;
  intvNum = -1;
MONITOR("<hr>isIntvNumWaiting(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhttp = new XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhttp.open("GET", "php/isAutoIntvNumWaiting.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhttp.open("GET", "php/isTableIntvNumWaiting.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhttp.open("GET", "php/isM_TabIntvNumWaiting.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhttp.send();
  intvNum = xhttp.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
  if (intvNum.indexOf("<?php") == 0)//jeśli PHP nie działa
    intvNum = -1;
  return intvNum != -1;  
}//isIntvNumWaiting


function isIntvNumStarted (tstUserId, tstIntvNum, tstStageNo) {
  var xhttp;
  intvNum = -1;
MONITOR("<hr>isIntvNumStarted(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhttp = new XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhttp.open("GET", "php/isAutoIntvNumStarted.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhttp.open("GET", "php/isTableIntvNumStarted.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhttp.open("GET", "php/isM_TabIntvNumStarted.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhttp.send();
  intvNum = xhttp.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]");
  if (intvNum.indexOf("<?php") == 0)//jeśli PHP nie działa
    intvNum = -1;
  return intvNum != -1;
}//isIntvNumStarted


function isIntvNumUsable (tstUserId, tstIntvNum, tstStageNo) {
  var xhttp;
  intvNum = -1;
MONITOR("<hr>isIntvNumUsable(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhttp = new XMLHttpRequest();
  if (intvNumAuto)
    xhttp.open("GET", "php/isAutoIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  if (intvNumGiven)
    xhttp.open("GET", "php/isGivenIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  if (intvNumTable)
    if (stagesNum == 1)//tstStageNo == -1)
      xhttp.open("GET", "php/isTableIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhttp.open("GET", "php/isM_TabIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhttp.send();
  intvNum = xhttp.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]");
  if (intvNum.indexOf("<?php") == 0)//jeśli PHP nie działa
    intvNum = -1;
  return intvNum != -1;  
}//isIntvNumUsable


function useIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  var xhttp;
  intvNum = -1;
MONITOR("<hr>useIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhttp = new XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhttp.open("GET", "php/useAutoIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhttp.open("GET", "php/useTableIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhttp.open("GET", "php/useM_TabIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhttp.send();
  intvNum = xhttp.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
  if (intvNum.indexOf("<?php") == 0)//jeśli PHP nie działa
    intvNum = -1;
  return intvNum != -1;
}//useIntvNum


function getIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  var xhttp;
  intvNum = -1;
MONITOR("<hr>getIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhttp = new XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhttp.open("GET", "php/getAutoIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhttp.open("GET", "php/getTableIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhttp.open("GET", "php/getM_TabIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhttp.send();
  intvNum = xhttp.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]");
  if (intvNum.indexOf("<?php") == 0)//jeśli PHP nie działa
    intvNum = -1;
  return intvNum != -1;
}//getIntvNum


function assignIntvNum (tstUserId, tstIntvNum, tstStageNo) {
MONITOR("<hr>assignIntvNum<br>" + "intvNumAuto=" + intvNumAuto + ", intvNumTable=" + intvNumTable + ", tstUserId=" + tstUserId + ", tstIntvNum=" + tstIntvNum);
  if (intvNumAuto || intvNumTable) {//JEŻELI IDENTYFIKATOR NADAWANY AUTOMATYCZNIE LUB Z TABELI
    //getIntvNum(intvNumAuto, tstUserId, tstIntvNum, tstStageNo);//sprawdza tstIntvNum >--> ustawia intvNum
    //if (intvNum != -1)// && 0 <= intvNum-firstIntvNum && 0 <= lastIntvNum-intvNum)//udało się ustalić numer ankiety w zdanym zakresie
    if (isIntvNumUsable(tstUserId, tstIntvNum, tstStageNo))//sprawdza tstIntvNum >--> ustawia intvNum
      document.questForm.intv_num.readOnly = true;
    else {
      intvNum = -1;//pozostałość po sprawdzaniu zakresu
      intvNumShow = false;
    }//else
MONITOR("<br>intvNum=" + intvNum);
  }//if
  else {//if (intvNumGiven) {{//JEŻELI IDENTYFIKATOR NADAWANY JAKO PARAMETR
    if (tstIntvNum == -1)//nie ma numeru
      intvNumShow = true;//poprosić użytkownika o wpisanie
    else {
      //useIntvNumWaiting(true, tstUserId, tstIntvNum, tstStageNo);
      //if (intvNum != -1)// && 0 <= intvNum-firstIntvNum && 0 <= lastIntvNum-intvNum)//udało się ustalić numer ankiety w zdanym zakresie
      if (isIntvNumWaiting(tstUserId, tstIntvNum, tstStageNo))
        document.questForm.intv_num.readOnly = true;
      else {
        intvNum = -1;
        intvNumShow = true;
      }//else
    }//else
  }//else
  return intvNum != -1 || intvNumShow;
}//assignIntvNum


function setUpIntvNum (txt) {
MONITOR("<hr>setUpIntvNum::" + txt);
  if (assignIntvNum(userId, parIntvNum, parStageNo)) {//udało się ustalić numer lub ma być wpisany ręcznie
MONITOR("<hr>setUp:intvNum=" + intvNum + "<hr>");
    if (intvNum != -1) //jeśli jest ustalony numer i jest w zakresie
      document.questForm.intv_num.value = intvNum;
    else
      document.getElementById("intv-num-info").innerHTML = "";
    document.getElementById("next-button").style.visibility = "visible";
    document.getElementById("position-info").style.visibility = "visible";
MONITOR("<br>setUp:intvNumShow=" + intvNumShow + "<br>");
    currQuest = 0;
    if (!intvNumShow) 
      document.getElementById("log-in-div").style.display = "none";
    document.getElementById("quest-progress").value = 1;//currQuest + (intvNumShow? 1 : 0);
    document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
    //MONITOR("reset");
    //questsTab[ordQsTab[currQuest]][2](questsTab[ordQsTab[currQuest]][0], questsTab[ordQsTab[currQuest]][1]);
    questsTab[ordQsTab[0]][2](questsTab[ordQsTab[0]][0], questsTab[ordQsTab[0]][1]);
  }//if
  else {//nie można dać sobie rady z numerem ankiety
    document.getElementById("bottom-banner-left").style.visibility = "hidden";
//    document.getElementById("position-info").style.visibility = "hidden";
//    document.getElementById("reload-survey-info").style.display = "block";
//    document.getElementById("reload-survey").focus();
    errorAlert("Błąd: Niepoprawny identyfikator ankiety.", parIntvNum == -1? "Nie został podany." : "Jest błędny lub został już wykorzystany.");
  }//else
}//setUpIntvNum



//=====================================================================================
function restoreFromCookies () {
  var ckName = "",
      ckValue = "",
      j;
  MONITOR("reset");
MONITOR("<hr>restoreFromCookies<br>");
  document.questForm.reset();
  document.getElementById("restore-progress").style.display = "block";
  document.getElementById("restore-progress").max = cookiesTab.length - 3;
  document.getElementById("restore-progress").value = 0;
  for (var i = 0; i < cookiesTab.length; i++) {
    document.getElementById("restore-progress").value = i;
    ckName = cookiesTab[i].substr(0, cookiesTab[i].indexOf("="));
    ckValue = cookiesTab[i].substr(cookiesTab[i].indexOf("=")+1, cookiesTab[i].length);
    switch (ckName) {
      case "SurveyId":  document.questForm.survey_id.value     = ckValue; break;
      case "StageNo":   document.questForm.stage_no.value      = ckValue; break;
      case "UserId":    document.questForm.user_id.value       = ckValue; break;
      case "IntvNum":   document.questForm.intv_num.value      = ckValue; break;
      case "StartTime": document.questForm.start_time.value    = ckValue; break;
      case "EndTime":   document.questForm.end_time.value      = ckValue; break;
      case "Duration":  document.questForm.duration.value      = ckValue; break;
//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 1/3 171554scrtst
//-------------------------------------------------------------------------------------
//TEXT/VALUE
      case "rA":     //ZMIANA
      case "rGat10": //ZMIANA
        document.questForm[ckName].value = ckValue;
MONITOR(ckName + "=>" + document.questForm[ckName].value + "<br>");
        break;
//RADIO
      case "r0":     //ZMIANA
      case "rB":     //ZMIANA
      case "rC_1":   //ZMIANA
      case "rC_2":   //ZMIANA
      case "rC_3":   //ZMIANA
      case "rC_4":   //ZMIANA
      case "rC_5":   //ZMIANA
      case "rC_6":   //ZMIANA
      case "rC_7":   //ZMIANA
      case "rC_8":   //ZMIANA
      case "rC_9":   //ZMIANA
      case "rD_1":   //ZMIANA
      case "rD_2":   //ZMIANA
      case "rD_3":   //ZMIANA
      case "rD_4":   //ZMIANA
      case "rD_5":   //ZMIANA
      case "rD_6":   //ZMIANA
      case "rD_7":   //ZMIANA
      case "rE":     //ZMIANA
      case "rF":     //ZMIANA
      case "rGb":    //ZMIANA
      case "rI":     //ZMIANA
      case "rJ":     //ZMIANA
      case "rK":     //ZMIANA
        document.questForm[ckName].value = ckValue;
        for (j = 0; j < document.questForm[ckName].length; j++)
          if (document.questForm[ckName][j].value == ckValue)
            document.questForm[ckName][j].checked = true;
MONITOR(ckName + "=>" + document.questForm[ckName].value + "<br>");
        break;
//CHECK
      case "rGa_1":  
      case "rGa_2":  
      case "rGa_3":  
      case "rGa_4":  
      case "rGa_5":  
      case "rGa_6":  
      case "rGa_7":  
      case "rGa_8":  
      case "rGa_9":  
      case "rGa_10": 
      case "rGa_11": 
        document.questForm[ckName].checked = ckValue == "true";
MONITOR(ckName + "=>" + document.questForm[ckName].checked + "<br>");
        break;
//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 1/3 171554scrtst
//=====================================================================================
    }//switch
  }//for od ciasteczek
//window.alert("restoreFromCookies()-koniec");
  document.getElementById("ask-restore-intv").style.display = "none";
//showInterview
  restoredIntv = true;
  document.questForm.intv_num.readOnly = true;
  if (!intvNumShow)
    document.getElementById("log-in-div").style.display = "none";
  document.getElementById("next-button").focus();
  document.getElementById("next-button").style.visibility = "visible";
//  document.getElementById("intv-num-info").innerHTML = intvNum
  document.getElementById("position-info").style.visibility = "visible";
  document.getElementById("quest-progress").value = currQuest + 1;//(intvNumShow? 1 : 0);
  document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
  currQuest = 0;
  questsTab[ordQsTab[0]][2](questsTab[ordQsTab[0]][0], questsTab[ordQsTab[0]][1]);//prepareInt_num
  //questsTab[ordQsTab[currQuest]][2](questsTab[ordQsTab[currQuest]][0], questsTab[ordQsTab[currQuest]][1]);
}//restoreFromCookies


function removeCookies () {
  var ckName = "";
MONITOR("<hr>removeCookies");
//window.alert("removeCookies");
  cookiesTab = document.cookie.split(";");
MONITOR("<br>cookies=[" + cookiesTab + "]<br>cookiesTab.length=" + cookiesTab.length);
  for (var i = 0; i < cookiesTab.length; i++) {
    cookiesTab[i] = cookiesTab[i].trim();
    ckName = cookiesTab[i].substr(0, cookiesTab[i].indexOf("="));
    switch (ckName) {
      case "LastVisit":
      case "LastSurvey":
      case "LastUser":
        break;
      default:
        document.cookie = ckName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        break;
    }//switch
  }//for
  startDataIsSet = false;
}//removeCookies


function saveVariable (variable, value, openQest) {
  var xhttp, txt;
  if (openQest === undefined) openQest = false;
MONITOR("<hr>saveVariable(" + variable + ", " + value + ", " + openQest + ")");
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200)
        txt = this.responseText;
    };//function()
  xhttp.open("GET", "php/zapiszTempValue.php?int=" + intvNum + "&sid=" + surveyId + "&sno=" + stageNo + "&uid=" + userId +
                    "&var=" + variable + "&val=" + value + "&opq=" + openQest, true);
  xhttp.send();
}//saveVariable


function tempFileExists (tstIntvNum) {
  var xhttp, txt;
MONITOR("<hr>tempFileExists(" + tstIntvNum + ")");
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "php/tempFileExists.php?int=" + tstIntvNum + "&sid=" + surveyId + "&sno=" + stageNo + "&uid=" + userId, false);//SYNCHRONICZNIE
  xhttp.send();
  txt = xhttp.responseText == tstIntvNum;
MONITOR("=>" + txt);  
  return txt;
}//tempFileExists


function restoreFromTempFile () {
  var xhttp, 
      restoredJson,
      restoredTab,
      resName,
      resValue,
      i;
  restoredIntv = false;
MONITOR("<hr>restoreFromTempFile()");
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "php/restoreFromTempFile.php?int=" + intvNum + "&sid=" + surveyId + "&sno=" + stageNo + "&uid=" + userId, false);//SYNCHRONICZNIE
  xhttp.send();
  restoredJson = xhttp.responseText;
MONITOR("<br>rJson=" + restoredJson);
  
  if (restoredJson != "") {
    restoredTab = JSON.parse(restoredJson);
  //  document.getElementById("restore-progress").style.display = "block";
  //  document.getElementById("restore-progress").max = restoredTab.length - 3;
  //  document.getElementById("restore-progress").value = 0;
    i = 0;
MONITOR("<br>rTab.len=" + restoredTab.length + "<br>");
    for (resName in restoredTab) {
      i++;
  //    document.getElementById("restore-progress").value = i;
      resValue = restoredTab[resName];
      switch (resName) {
        case "SurveyId":  document.questForm.survey_id.value     = resValue; break;
        case "StageNo":   document.questForm.stage_no.value      = resValue; break;
        case "UserId":    document.questForm.user_id.value       = resValue; break;
        case "IntvNum":   document.questForm.intv_num.value      = resValue; break;
        case "StartTime": document.questForm.start_time.value    = resValue; break;
        case "EndTime":   document.questForm.end_time.value      = resValue; break;
        case "Duration":  document.questForm.duration.value      = resValue; break;
  //=====================================================================================
  //ZMIANA - POCZĄTEK BLOKU ZMIAN 1/3 171554scrtst
  //-------------------------------------------------------------------------------------
  //TEXT/VALUE
        case "rA":     //ZMIANA
        case "rGat10": //ZMIANA
          document.questForm[resName].value = resValue;
  MONITOR(resName + "=>" + document.questForm[resName].value + "<br>");
          break;
  //RADIO
        case "r0":     //ZMIANA
          restoredIntv = true;     //<<---PRZY PIERWSZYM ZNACZĄCYM PYTANIU
        case "rB":     //ZMIANA
        case "rC_1":   //ZMIANA
        case "rC_2":   //ZMIANA
        case "rC_3":   //ZMIANA
        case "rC_4":   //ZMIANA
        case "rC_5":   //ZMIANA
        case "rC_6":   //ZMIANA
        case "rC_7":   //ZMIANA
        case "rC_8":   //ZMIANA
        case "rC_9":   //ZMIANA
        case "rD_1":   //ZMIANA
        case "rD_2":   //ZMIANA
        case "rD_3":   //ZMIANA
        case "rD_4":   //ZMIANA
        case "rD_5":   //ZMIANA
        case "rD_6":   //ZMIANA
        case "rD_7":   //ZMIANA
        case "rE":     //ZMIANA
        case "rF":     //ZMIANA
        case "rGb":    //ZMIANA
        case "rI":     //ZMIANA
        case "rJ":     //ZMIANA
        case "rK":     //ZMIANA
          document.questForm[resName].value = resValue;
          for (j = 0; j < document.questForm[resName].length; j++)
            if (document.questForm[resName][j].value == resValue)
              document.questForm[resName][j].checked = true;
  MONITOR(resName + "=>" + document.questForm[resName].value + "<br>");
          break;
  //CHECK
        case "rGa_1":  
        case "rGa_2":  
        case "rGa_3":  
        case "rGa_4":  
        case "rGa_5":  
        case "rGa_6":  
        case "rGa_7":  
        case "rGa_8":  
        case "rGa_9":  
        case "rGa_10": 
        case "rGa_11": 
          document.questForm[resName].checked = resValue == "true";
  MONITOR(resName + "=>" + document.questForm[resName].checked + "<br>");
          break;
  //-------------------------------------------------------------------------------------
  //ZMIANA - KONIEC BLOKU ZMIAN 1/3 171554scrtst
  //=====================================================================================
      }//switch
    }//for 
  //window.alert("restoreFromTempFile()-koniec");
//    document.getElementById("ask-restore-intv").style.display = "none";
  //  document.getElementById("intv-num-info").innerHTML = intvNum
  }//if
  return restoredIntv;
}//restoreFromTempFile         


//=====================================================================================
function newInterview () {
MONITOR("<hr>newInterview()");
  removeCookies();
  document.questForm.reset();
  setLastCookies();
  document.getElementById("ask-restore-intv").style.display = "none";
  intvNum = -1;
  setUpIntvNum("newInterview");
}//newInterview


function saveStartData () {
  var currDate = new Date(),
      expDate  = new Date(currDate.getTime() + (7*24*60*60*1000));//+7dni
  ckExpiresText = ";expires=" + expDate.toUTCString();
//window.alert("saveStartData:" + ckExpiresText);
  document.questForm.survey_id.value    = surveyId;
  document.questForm.stage_no.value     = stageNo;
  document.questForm.user_id.value      = userId;
  getDateTime("now");
  document.questForm.start_time.value   = currDateTime;//.toLocaleString();
  document.questForm.end_time.value     = "started_";
  document.questForm.duration.value     = 0;
  document.cookie = "SurveyId="  + document.questForm.survey_id.value  + ckExpiresText;
  document.cookie = "StageNo="   + document.questForm.stage_no.value   + ckExpiresText;
  document.cookie = "UserId="    + document.questForm.user_id.value    + ckExpiresText;
  document.cookie = "IntvNum="   + document.questForm.intv_num.value   + ckExpiresText;
  document.cookie = "StartTime=" + document.questForm.start_time.value + ckExpiresText;
  document.cookie = "EndTime="   + document.questForm.end_time.value   + ckExpiresText;
  document.cookie = "Duration="  + document.questForm.duration.value   + ckExpiresText;
  saveVariable("start_time", document.questForm.start_time.value);
  saveVariable("end_time",   document.questForm.end_time.value);
  saveVariable("duration",   document.questForm.duration.value);
//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 2/3 171554scr
//-------------------------------------------------------------------------------------
// tu mogą być zapamiętywane rotacje
  //document.cookie = "tp1_ord="  + document.questForm.tp1_ord.value + ckExpiresText;  //ZMIANA
  //document.cookie = "tp1_name=" + document.questForm.tp1_name.value + ckExpiresText;  //ZMIANA
  //document.cookie = "tp2_ord="  + document.questForm.tp2_ord.value + ckExpiresText;  //ZMIANA
  //document.cookie = "tp2_name=" + document.questForm.tp2_name.value + ckExpiresText;  //ZMIANA
  //saveVariable("tp1_ord",  document.questForm.tp1_ord.value);
  //saveVariable("tp1_name", document.questForm.tp1_name.value);
  //saveVariable("tp2_ord",  document.questForm.tp2_ord.value);
  //saveVariable("tp2_name", document.questForm.tp2_name.value);
//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 2/3 171554scr
//=====================================================================================
  startDataIsSet = true;
}//saveStartData


function checkIntvIdEnter (e) {
  if (!e) e = window.event;
  if ((e.keyCode? e.keyCode : e.which) == 13)
    gotoNextQuestion();
}//checkIntvIdEnter


function gotoNextQuestion () {
MONITOR("<hr>gotoNQ::" + currQuest + "::");//->" + questsTab[ordQsTab[currQuest]][0] + ":" + questsTab[ordQsTab[currQuest]][1]);
  if (questsTab[ordQsTab[currQuest]][3](questsTab[ordQsTab[currQuest]][0], questsTab[ordQsTab[currQuest]][1])) {//funkcja sprawdzająca przeszła
    if (currQuest < ordQsTab.length - 1) {//jeśli nie jest to ostanie pytanie
      //document.getElementById(questsTab[ordQsTab[currQuest]][0]).style.display = "none";
      currQuest++;
      questsTab[ordQsTab[currQuest]][2](questsTab[ordQsTab[currQuest]][0], questsTab[ordQsTab[currQuest]][1]);
      //document.getElementById(questsTab[ordQsTab[currQuest]][0]).style.display = "flex";
      document.getElementById("quest-progress").value = currQuest + 1;//(intvNumShow? 1 : 0);
      document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
      if (document.getElementById(questsTab[ordQsTab[currQuest]][0]).hidden)
        gotoNextQuestion();
      else
        if (document.getElementById(questsTab[ordQsTab[currQuest]][0]).classList.contains("pause_"))
          makePause(questsTab[ordQsTab[currQuest]][0]);
    }//if
    else {
      //document.getElementById(questsTab[ordQsTab[currQuest]][0]).style.display = "none";
      document.getElementById("prev-button").style.visibility = "hidden";
      document.getElementById("next-button").style.visibility = "hidden";
      document.getElementById("position-info").style.visibility = "hidden";
      submitFormData();
    }//else
  }//if
}//gotoNextQuestion


function gotoPrevQuestion () {
MONITOR("<br>gotoPrevQuestion: " + currQuest + "->" + questsTab[ordQsTab[currQuest]][0] + ":" + questsTab[ordQsTab[currQuest]][1]);
  if (1 < currQuest) {
    document.getElementById(questsTab[ordQsTab[currQuest]][0]).style.display = "none";
    currQuest--;
    questsTab[ordQsTab[currQuest]][2](questsTab[ordQsTab[currQuest]][0], questsTab[ordQsTab[currQuest]][1]);
    //document.getElementById(questsTab[ordQsTab[currQuest]][0]).style.display = "flex";
    document.getElementById("quest-progress").value = currQuest + 1;//(intvNumShow? 1 : 0);
    document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
    if (document.getElementById(questsTab[ordQsTab[currQuest]][0]).hidden)
      gotoPrevQuestion();
  }//if
  else
    window.alert("Ni Dudy, niczego wcześniej nie ma.");
}//gotoPrevQuestion


function gotoFirstEmptyQuestion () {
MONITOR("<hr>gotoFE::" + currQuest + "::");//->" + questsTab[ordQsTab[currQuest]][0] + ":" + questsTab[ordQsTab[currQuest]][1]);
  if (questsTab[ordQsTab[currQuest]][3](questsTab[ordQsTab[currQuest]][0], questsTab[ordQsTab[currQuest]][1])) {//funkcja sprawdzająca przeszła
    if (currQuest < ordQsTab.length - 1) {//jeśli nie jest to ostanie pytanie
      currQuest++;
      questsTab[ordQsTab[currQuest]][2](questsTab[ordQsTab[currQuest]][0], questsTab[ordQsTab[currQuest]][1]);
      document.getElementById("quest-progress").value = currQuest + 1;//(intvNumShow? 1 : 0);
      document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
      gotoFirstEmptyQuestion();
    }//if
  }//if
}//gotoFirstEmptyQuestion


function setIntvNumComplete (tstUserId, tstIntvNum, tstStageNo) {
  var xhttp;
  intvNum = -1;
MONITOR("<hr>setIntvNumComplete(" + tstUserId + "," + tstIntvNum + "," + tstStageNo);
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        intvNum = this.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]");
      }//if
    };//function()
  if (intvNumAuto || intvNumGiven)
    xhttp.open("GET", "php/setAutoIntvNumComplete.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, true);//ASYNCHRONICZNIE
  else
    if (tstStageNo == -1)
      xhttp.open("GET", "php/setTableIntvNumComplete.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, true);//ASYNCHRONICZNIE
    else
      xhttp.open("GET", "php/setM_TabIntvNumComplete.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, true);//ASYNCHRONICZNIE
  xhttp.send();
}//setIntvNumComplete


function durationSec (startStr, endStr) {//2017-04-28 23:36:11
  var startDate = new Date(startStr.substr(0, 4), startStr.substr(5, 2)-1, startStr.substr(8, 2),
                           startStr.substr(11, 2), startStr.substr(14, 2), startStr.substr(17, 2));
      endDate   = new Date(endStr.substr(0, 4), endStr.substr(5, 2)-1, endStr.substr(8, 2),
                           endStr.substr(11, 2), endStr.substr(14, 2), endStr.substr(17, 2));
  return (endDate.getTime() - startDate.getTime()) / 1000;
}//durationSec

var savingInterval = 0;
function submitFormData () {
  var dd = new Date();
MONITOR("<HR>submitFormData:");

  //respondentOk = document.questForm.r13[0].checked || document.questForm.r13[1].checked;  //ZMIANA

//  rearrangeQ17data();

  document.getElementById("finish-quest-info").style.display = "block";

  document.getElementById("data-submit-info").style.visibility = "hidden";
  document.getElementById("data-saved-next").style.visibility = "hidden";
  document.getElementById("press-text1").style.display = "none";
  document.getElementById("data-saved").style.visibility = "hidden";
  document.getElementById("data-removing-info").style.display = "none";//visibility = "hidden";
  document.getElementById("cookies-removing-info").style.display = "none";//visibility = "hidden";
  document.getElementById("all-done-end").style.visibility = "hidden";
//  document.getElementById("all-done-next").style.visibility = "hidden";
  getDateTime("teraz");
  document.questForm.end_time.value = currDateTime;//.toLocaleString();
  //document.questForm.duration.value = (Date.parse(document.questForm.end_time.value) - Date.parse(document.questForm.start_time.value)) / 1000;
  document.questForm.duration.value = durationSec(document.questForm.start_time.value, document.questForm.end_time.value);
  document.getElementById("data-submit-info").style.visibility = "visible";
//window.alert("submitFormData:submit");

MONITOR("<BR>questForm.submit");
  document.questForm.submit();
  document.getElementById("data-saving-progess").innerHTML = ".";
  savingInterval = setInterval(function(){document.getElementById("data-saving-progess").innerHTML += ".";}, 100);
//  document.getElementById("press-text1").style.display = "block";
//  document.getElementById("data-saved-next").style.visibility = "visible";
//  document.getElementById("data-saved-next").focus();
  setTimeout(cleanData, 3000);

MONITOR("<BR>setIntvNumComplete:");
  setIntvNumComplete(userId, intvNum, stageNo);

  return false;
}//submitFormData


function cleanData () {
MONITOR("<HR>cleanData:");
//  document.getElementById("data-saved-next").style.visibility = "hidden";
//  document.getElementById("press-text1").style.visibility = "hidden";
  if (savingInterval != 0) {
    clearInterval(savingInterval);
    savingInterval = 0;
  }//if
  document.getElementById("data-saved").style.visibility = "visible";

//  document.getElementById("data-removing-info").style.display = "block";//visibility = "visible";
//window.alert("cleanData::submitFormData:reset");

MONITOR("<BR>questForm.reset");
  document.questForm.reset();

//  document.getElementById("cookies-removing-info").style.display = "block";//.visibility = "visible";
//window.alert("cleanData::submitFormData:removeCookies");
  document.cookie = "LastVisit=" + Date() + ckExpiresText;
  document.cookie = "LastSurvey=" + surveyId + ckExpiresText;
  document.cookie = "LastUser=" + userId + ckExpiresText;
  removeCookies();

  setTimeout(endInterview, 1000);
//  document.getElementById("all-done-end").style.visibility = "visible";
//  document.getElementById("all-done-next").style.visibility = "visible";
//  document.getElementById("all-done-end").focus();
}//cleanData


function endInterview () {
  //goToBadania();
  var txt = window.location.href;
  txt = txt.substring(0, txt.lastIndexOf("/") + 1);
  if (intvNumGiven && intvNumShow)
    txt += "?uid=" + userId;
  else //intvNumTable || intvNumGiven && !intvNumShow)
    if (respondentOk)
      txt += "thx.html";// + "?sid=" + surveyId;//"index.html";
    else
      txt += "thx_.html";// + "?sid=" + surveyId;//"index.html";
  window.location.replace(txt);
//  window.location.replace("http://badania.azetkaankiety.pl");
//  window.location.replace("http://www.azetkaankiety.pl");
//  window.location.replace("http://www.azkstrony.pl");
//  window.location.replace("http://www.almares.com.pl");
}//endInterview


function nextInterview () {
var txt = "";
  if (intvNumGiven && intvNumShow ||
      intvNumAuto && window.confirm("Zostanie rozpoczęty kolejny wywiad.\nZostanie pobrany i zarezerowany kolejny numer ankiety."))
    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) +
                           "?uid=" + userId;//"index.html";
  else //intvNumTable || intvNumGiven && !intvNumShow)
    goToBadania();
}//nextInterview


function goToBadania () {
  var txt = window.location.href;
  txt = txt.substring(0, txt.lastIndexOf("/"));
  txt = txt.substring(0, txt.lastIndexOf("/") + 1);// + "?sid=" + surveyId;//"index.html";
  window.location.replace(txt);
}//goToBadania



//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 3/3 171554scr
//-------------------------------------------------------------------------------------
//OBSŁUGA ANKIETY =====================================================================
var questsTab = [["quest-intv_num",  "intv_num",  prepareInt_num,         verifyInt_num],
                 ["quest-intro0",    "intro0",    prepareQuest_intro0,    verifyQuest_intro0],   //ZMIANA v
                 ["quest-r0",        "r0",        prepare__,              verifyQuestSingle],
                 ["quest-rA",        "rA",        prepare__,              verifyQuest_rA],
                 ["quest-rB",        "rB",        prepare__,              verifyQuestSingle],
                 ["quest-rC",        "rC",        prepare__,              verifyQuestSingleN_9],
                 ["quest-rD",        "rD",        prepare__,              verifyQuestSingleN_7],
                 ["quest-rE",        "rE",        prepare__,              verifyQuestSingle],
                 ["quest-rF",        "rF",        prepare__,              verifyQuestSingle],
                 ["quest-rGa",       "rGa",       prepare__,              verifyQuest_rGa],
                 ["quest-rGb",       "rGb",       prepare__,              verifyQuestSingle],
                 ["quest-rI",        "rI",        prepare__,              verifyQuestSingle],
                 ["quest-rJ",        "rJ",        prepare__,              verifyQuestSingle],
                 ["quest-rK",        "rK",        prepare__,              verifyQuestSingle]];//ZMIANA ^
var ordQsTab = [0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13];  //ZMIANA
var questsNumber = ordQsTab.length,
    prevQuest = 0,
    currQuest = 0,
    nextQuest = 0;

function arrangeOrdQsTab () {
}//arrangeOrdQsTab


function arrangeQuestions () {
MONITOR("reset");
MONITOR("<br>arrangeQuestions: ");
//  arrangeQ17items();
//  arrangeOrdQsTab();
//  findRotation();
}//arrangeQuestions


//QUESTION PREPARTION/VARIFICATION FUNCTIONS =====================================================
function prepareInt_num (qId, fldName) {
MONITOR("<br>pre(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "flex";
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "visible";
  document.getElementById("next-button").innerHTML = "Rozpoczęcie wywiadu";//Dalej, Kolejne pytanie;
  if (document.getElementById(qId).readOnly)
    document.getElementById("next-button").focus();
  else
    document.getElementById(qId).focus();//autofocus = true;
  return true;
}//prepareInt_num


function verifyInt_num (qId, fldName) {
  var isOk = true,
      tstIntvNum;
  MONITOR("reset");
  MONITOR("<br>ver(" + qId + ":" + fldName + ")<br>ino=" + document.questForm[fldName].value + ", ronly=" + document.questForm[fldName].readOnly + "<br>");
  //MONITOR("<br>useIN(" + intvNumAuto + "," + userId + "," + document.questForm[fldName].value + "," + stageNo + ")<br>");
  if (document.questForm[fldName].readOnly)
    isOk = restoredIntv || useIntvNum(userId, document.questForm[fldName].value, stageNo);
  else {
    tstIntvNum = decodeURI(document.questForm[fldName].value); MONITOR("[" + tstIntvNum + "]<br>");
    document.questForm[fldName].value = tstIntvNum;
    //tstIntvNum = parseInt(document.questForm[fldName].value); MONITOR(tstIntvNum + "<br>");
    if (tstIntvNum && 0 <= tstIntvNum - firstIntvNum && 0 <= lastIntvNum - tstIntvNum) {
      if (intvNumGiven) {
        if (!useIntvNum(userId, tstIntvNum, stageNo)) 
          if (isIntvNumStarted(userId, tstIntvNum, stageNo) && 
              (!tempFileExists(tstIntvNum) ||
               !window.confirm("Ankieta o tym identyfikatorze zostal już rozpoczęta i jakieś jej dane zachowane są na serwerze.\n" +
                               "Czy chcesz kontynować tę ankietę po wczytaniu danych?")))
            intvNum = -1;
        isOk = intvNum != -1;            
      }//if
      else  
        getIntvNum(userId, tstIntvNum, stageNo);
      if (intvNum == -1)//udało się ustalić numer ankiety w zdanym zakresie
        isOk = false;
    }//if
    else
      isOk = false;
  }//if
//  window.alert("isOk=" + isOk + ", restoredIntv=" + restoredIntv);
  if (isOk) {
    document.getElementById("intv-num-info").innerHTML = intvNum;
    arrangeQuestions();
    if (/*!restoredIntv &&*/ tempFileExists(intvNum))
      restoreFromTempFile();
    saveStartData();
    document.getElementById(qId).style.display = "none";
    document.getElementById("prev-button").style.visibility = "visible";
    document.getElementById("next-button").innerHTML = "Kolejne pytanie";
    if (restoredIntv) {
      currQuest++;
      minLength = 1;
      gotoFirstEmptyQuestion();
      minLength = 10;
      if (2 < currQuest)
        currQuest--;
    }//if
  }//if
  else {
    document.questForm[fldName].value = "";//.intv_num.value = "";
    document.getElementById("quest-intv_num-error").style.display = "inline";//visibility = "visible";
  }//else
//  window.alert("restoredIntv=" + restoredIntv + ", currQuest=" + currQuest);
MONITOR("<br>isOk=" + isOk + ", restoredIntv=" + restoredIntv + ", currQuest=" + currQuest);
  return isOk;
}//verifyInt_num


function prepare__ (qId, fldName) {
var objs;
MONITOR("<br>prepare__(" + qId + ":" + fldName + ")");
  if (!document.getElementById(qId).hidden) {
    document.getElementById(qId).style.display = "flex";
    objs = document.getElementById(qId).getElementsByClassName("fill-info");
    for (var i = 0; i < objs.length; i++)
      objs[i].style.color = "black";
  }//if
  return true;
}//prepare__


function verify__ (qId, fldName) {
MONITOR("<br>verify__(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "none";
  return true;
}//verify__


function verifyQuestSingle (qId, fldName) {
  var isOk = false,
      i;
MONITOR("<br>verQS(" + qId + ":" + fldName + ")='" + document.questForm[fldName].value + "'");
//window.alert(qId);
  if (document.getElementById(qId).hidden)
    isOk = true;
  else {
    for (i = 0; i < document.questForm[fldName].length && !document.questForm[fldName][i].checked; i++);
    if (isOk = i < document.questForm[fldName].length && document.questForm[fldName][i].checked)    //if (document.questForm[fldName].value != "" && document.questForm[fldName].value !== undefined) {
      document.questForm[fldName].value = document.questForm[fldName][i].value;
  }//else
  if (isOk) {
    document.cookie = fldName + "=" + document.questForm[fldName].value + ckExpiresText;
    saveVariable(fldName, document.questForm[fldName].value);
MONITOR("=>'" + document.questForm[fldName].value + "'");
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "green";
    document.getElementById(qId).style.display = "none";
  }//if isOk
  else
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "red";
  return isOk;
}//verifyQuestSingle


function verifyQuestSingleN (qId, fldName, length) {
  var isOk = true,
      i, j,
      fldName__;
MONITOR("<br>verQSN(" + qId + ":" + fldName + ":" + length + ")");
  fldName += "_";
  if (document.getElementById(qId).hidden)
    isOk = true;
  else {
    for (j = 1; j <= length; j++) {
      fldName__ = fldName + j;
      for (i = 0; i < document.questForm[fldName__].length && !document.questForm[fldName__][i].checked; i++);
      if (i < document.questForm[fldName__].length && document.questForm[fldName__][i].checked)      //if (document.questForm[fldName__].value != "" && document.questForm[fldName__].value !== undefined) {
        document.questForm[fldName__].value = document.questForm[fldName__][i].value;
      else
        isOk = false;
    }//for
  }//else
  if (isOk) {
    for (j = 1; j <= length; j++) {
      fldName__ = fldName + j;
      document.cookie = fldName__ + "=" + document.questForm[fldName__].value + ckExpiresText;
      saveVariable(fldName__, document.questForm[fldName__].value);
  MONITOR("<br>[" + j + "]=>'" + document.questForm[fldName__].value + "'");
    }//for
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "green";
    document.getElementById(qId).style.display = "none";
  }//if
  else
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "red";
  return isOk;
}//verifyQuestSingleN


function verifyQuestOpen (qId, fldName) {
  var isOk = false;
MONITOR("<br>verQO(" + qId + ":" + fldName + ")='" + document.questForm[fldName].value + "'");
//window.alert(qId);
  if (document.getElementById(qId).hidden)
    isOk = true;
  else
    isOk = document.questForm[fldName].value != "" && document.questForm[fldName].value !== undefined;
  if (isOk) {
    document.cookie = fldName + "=" + document.questForm[fldName].value + ckExpiresText;
    saveVariable(fldName, document.questForm[fldName].value, true);
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "green";
    document.getElementById(qId).style.display = "none";
  }//if isOk
  else
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "red";
  return isOk;
}//verifyQuestOpen


function verifyQuestMultiN (qId, fldName, length) {
MONITOR("<br>verQMN(" + qId + ":" + fldName + ":" + length + ")");
  var isOk = false,
      i;
//window.alert(qId);
  if (document.getElementById(qId).hidden)
    isOk = true;
  else
    for (i = 1; i <= length; i++)
      if (document.questForm[fldName + "_" + i].checked)
        isOk = true;
  if (isOk) {
    for (i = 1; i <= length; i++)
      if (document.questForm[fldName + "_" + i].checked) {
        document.cookie = fldName + "_" + i + "=true" + ckExpiresText;
        saveVariable(fldName + "_" + i, "true");
      }//if
      else {
        document.cookie = fldName + "_" + i + "=false" + ckExpiresText;
        saveVariable(fldName + "_" + i, "false");
      }//else
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "green";
    document.getElementById(qId).style.display = "none";
  }//if isOk
  else
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "red";
//window.alert(isOk);
  return isOk;
}//verifyQuestMultiN


function verifyQuestMultiNoth (qId, fldName, length, othNo) {
MONITOR("<br>verQMNo(" + qId + ":" + fldName + ":" + length + ", " + othNo + ")");
  var isOk = false,
      i;
//window.alert(qId);
  if (othNo === undefined)
    othNo = length;
  if (document.getElementById(qId).hidden)
    isOk = true;
  else {
    document.questForm[fldName + "_" + othNo].checked = document.questForm[fldName + "t" + othNo].value != "" &&
                                                        document.questForm[fldName + "t" + othNo].value !== undefined;
  MONITOR("<br>t=" + document.questForm[fldName + "t" + othNo].value);
    for (i = 1; i <= length; i++)
      if (document.questForm[fldName + "_" + i].checked)
        isOk = true;
  }//else
  if (isOk) {
    for (i = 1; i <= length; i++)
      if (document.questForm[fldName + "_" + i].checked) {
        document.cookie = fldName + "_" + i + "=true" + ckExpiresText;
        saveVariable(fldName + "_" + i, "true");
      }//if
      else {
        document.cookie = fldName + "_" + i + "=false" + ckExpiresText;
        saveVariable(fldName + "_" + i, "false");
      }//else
    if (document.questForm[fldName + "_" + othNo].checked) {
      document.cookie = fldName + "t" + othNo + "=" + document.questForm[fldName + "t" + othNo].value + ckExpiresText;
      saveVariable(fldName + "t" + othNo, document.questForm[fldName + "t" + othNo].value, true);
    }//if
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "green";
    document.getElementById(qId).style.display = "none";
  }//if isOk
  else
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "red";
//window.alert(isOk);
  return isOk;
}//verifyQuestMultiNoth


//"quest-intro0"
function prepareQuest_intro0 (qId, fldName) {
MONITOR("<br>pre(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "flex";
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "visible";
  document.getElementById("next-button").innerHTML = "Dalej";//Kolejne pytanie";
  return true;
}//prepareQuest_intro0
function verifyQuest_intro0 (qId, fldName) {
MONITOR("<br>verify__(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "none";
  document.getElementById("prev-button").style.visibility = "visible";
  return true;
}//verify__


function verifyQuest_rA (qId, fldName) {
MONITOR("<br>ver(" + qId + ":" + fldName + ")");
  var isOk = true,
      number = parseInt(document.questForm[fldName].value);
  if (number && 25 <= number && number <= 45) {
    document.cookie = fldName + "=" + document.questForm[fldName].value + ckExpiresText;
    saveVariable(fldName, document.questForm[fldName].value);
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "green";
    document.getElementById(qId).style.display = "none";
    if (number < 33)
      document.questForm.rB[1].checked = true;
    else
      document.questForm.rB[2].checked = true;  
  }//if
  else {
    document.questForm[fldName].value = "";
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "red";
    isOk = false;
  }//else
MONITOR(isOk);
  return isOk;

}//verifyQuest_rA


function verifyQuestSingleN_9 (qId, fldName) {
  return verifyQuestSingleN (qId, fldName, 9);
}//verifyQuest_SingleN9


function verifyQuestSingleN_7 (qId, fldName) {
  return verifyQuestSingleN (qId, fldName, 7);
}//verifyQuest_SingleN9


function verifyQuest_rGa (qId, fldName) {
MONITOR("<br>ver(" + qId + ":" + fldName + ")");
  if (verifyQuestMultiNoth(qId, fldName, 11, 10)) {
    for (var i = 1; i <= 11; i++) {
      document.questForm.rGb[i - 1].disabled = !document.questForm["rGa_" + i].checked;
MONITOR(".");
    }
    return true;
  }//if 
  else
    return false;
}//verifyQuest_rGa


//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 3/3 171554scr
//=====================================================================================




function errorAlert (text1, text2, color) {
  document.getElementById("reload-text1").innerHTML = text1;
  document.getElementById("reload-text2").innerHTML = text2;
  if (color === undefined) color = "black";
  document.getElementById("reload-text1").style.color = color;
  document.getElementById("reload-text2").style.color = color;
  document.getElementById("reload-survey-info").style.display = "block";
}//errorAlert


//=====================================================================================
function initAll () {
  var txt = "",
      txt2 = "",
      pos = -1;
  var ckName = "",
      ckValue = "";
MONITOR("initAll:<br>");
//  document.getElementById("monitor-monitor").style.display = "block";
//  document.getElementById("iframe-php-monitor").style.display = "block";
  makeInputsClickSensitive();
  displayOffQuestElements();
//  displayOnAllQuestions();
  hideSomeInterviewElements();

  document.questForm.reset();//ankieta nazywa się questForm

  getInfoFromParams();// odczytaj parametry z linii polecenia - zmienne: parSurveyId, parUserId, parIntvNum
  getSurveysInfoFromDB();//odczytaj PONIŻSZE informacje z bay danych - zmienne surveyId, userId .. intvNumShow

  document.getElementById("top-banner-center").innerHTML = "<em>" + subjectTxt + "</em>";
  document.getElementById("top-banner-center").style.visibility = "hidden";
  document.getElementById("client-name-info").innerHTML = clientName;

  saveSurveyLog("initAll");
  getDateTime("start");

  //firstIntvNum, lastIntvNum,   intvNumType,   intvNumAuto, intvNumTable, intvNumGiven, intvNumShow
  if (surveyId == -1) {
    errorAlert("Błąd: Nieznany identyfikator badania.", "");
    return 1;
  }//if
  document.getElementById("survey-id-info").innerHTML = surveyId;
  if (stageNo != -1)
    document.getElementById("survey-id-info").innerHTML += "." + stageNo;
  if (userId == -1) {
    errorAlert("Błąd: Nieznany identyfikator użytkownika.", "");
    return 2;
  }//if
//  if (parIntvNum != -1 && (0 < firstIntvNum - parIntvNum || lastIntvNum - parIntvNum < 0)) {
//    errorAlert("Błąd: Numer ankiety poza zakresem.", "Zakres: {" + firstIntvNum + ", " + lastIntvNum + "}");
//    return 3;
//  }//if
  document.getElementById("user-id-info").innerHTML = userId;
//  document.getElementById("intv-num-info").innerHTML = parIntvNum == -1 ? "" : parIntvNum;
  document.getElementById("quest-progress").value = 0;
  document.getElementById("quest-progress").max = questsNumber + 1;//(intvNumShow? 1 : 0);
  document.getElementById("question-no").innerHTML = 0;
  document.getElementById("questions-num").innerHTML = document.getElementById("quest-progress").max;
  document.getElementById("quest-intv_num-error").style.display = "none";//visibility = "hidden";

  cookiesTab = document.cookie.split(";"); MONITOR("<hr>cookies=[" + cookiesTab + "]<br>cookiesTab.length=" + cookiesTab.length);
  if (cookiesTab.length < 2) {//JEŚLI OKAZUJE SIĘ ŻE NIE MA ŻADNYCH CIASTECZEK TO WYŚWIETLIĆ INFORAMCJĘ
    document.getElementById("cookies-confirm").style.display = "inline-flex";
    setTimeout(function(){document.getElementById("cookies-confirm").style.display = "none";}, 30000);
    document.getElementById("cookies-confirm-yes").focus();
    setUpIntvNum("noCookies");
  }//if nie ma ciasteczek
  else {//JAK SĄ CIASTECZKA
    for (var i = 0; i < cookiesTab.length; i++) {
      cookiesTab[i] = cookiesTab[i].trim(); //MONITOR(",cookiesTab[" + i +"]=" + cookiesTab[i]);
      ckName = cookiesTab[i].substr(0, cookiesTab[i].indexOf("="));
      ckValue = cookiesTab[i].substr(cookiesTab[i].indexOf("=")+1, cookiesTab[i].length);
      switch (ckName) {
        case "SurveyId":   ckSurveyId  = ckValue; break;
        case "StageNo":    ckStageNo   = ckValue; break;
        case "UserId" :    ckUserId    = ckValue; break;
        case "IntvNum" :   ckIntvNum   = ckValue; break;
        case "StartTime" : ckStartTime = ckValue; break;
        case "EndTime" :   ckEndTime   = ckValue; break;
      }//switch
    }//for od ciasteczek
    MONITOR("<hr>ckSId=" + ckSurveyId + ", sId=" + surveyId + ", ckSNo=" + ckStageNo + ", sNo=" + stageNo + ", ckUserId=" + ckUserId + ", userId=" + userId + ", ");
    MONITOR("parIntvNum=" + parIntvNum + ", ckIntvNum=" + ckIntvNum + ", ckStartTime=" + ckStartTime + ", ckEndTime=" + ckEndTime + ".");
    if (ckSurveyId != -1 && ckSurveyId == surveyId &&
        ckStageNo == stageNo &&
        ckUserId == userId &&
        ckIntvNum != -1 && (parIntvNum == -1 || ckIntvNum == parIntvNum) &&
        ckStartTime != -1 && ckStartTime != "" && ckEndTime == "started_") //SĄ JAKIEŚ DANE W CIASTECZKACH Z NIESKOŃCZONEGO WYWIADU
      if (isIntvNumStarted(ckUserId, ckIntvNum, ckStageNo)) {//I WYWIAD JEST started 
        document.getElementById("restore-progress").style.display = "none";  //zapytanie czy z niego skorzystać
        document.getElementById("ask-restore-intv").style.display = "block";
        document.getElementById("restore-interview").focus();
      }//if
      else {//TO NIE TEN WYWIAD
        removeCookies();
        setUpIntvNum("ckIntvNumDoesn'tFit");
      }//else
    else {//TO NIE TEN WYWIAD
      removeCookies();
      setUpIntvNum("cookiesDon'tFit");
    }//else
  }//else
  setLastCookies();
}//initAll

window.onload = initAll;
