"use strict";
/*global window*/
/*global document*/

//GLOBAL VARIABLES ====================================================================

var generalBackgroundColor = "#f0fff0";
//var generalBackgroundColor = "#e6f6ff";//Almares

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
  mouseX = e.clientX;
  mouseY = e.clientY;
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


//ankieta powieszona z automatycznym nadawaniem numerów
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
function getSurveysInfoFromXML () {
  var xhr,
      elemTab,
      survey,
      survPos = -1,
      gotUser,
      i,
      intvNumType,
      XMLurl;
  window.console.log("getSurveysInfoFromXML");
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "./xmlfiles/badanie.xml", false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status != 200) {
    window.console.log("Nie ma pliku badania.xml, status=" + xhr.status);
    window.alert("Nie ma pliku badania.xml, status=" + xhr.status);
  }//if
  else {
    elemTab = xhr.responseXML.getElementsByTagName("SURVEY");
    window.console.log("elemTab.len=" + elemTab.length + ", " + elemTab[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue);
    survey = -1;
    if (parSurveyId != -1) {
      for (i = 0; i < elemTab.length; i++) {
        if (elemTab[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue == parSurveyId) {//zakładam, że jest survey
          survey = elemTab[survPos=i];
        }//if
      }//for
    }//if
    if (survey != -1) { //survPos < elemTab.length
      surveyId  = parSurveyId;//zmienna globalna
      elemtab = survey.getElementsByTagName("STAGES");
      stagesNum = elemtab.length == 0 ? 1 : elemtab[0].childNodes[0].nodeValue;
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
      elemtab = survey.getElementsByTagName("CLIENT");
      clientName = elemtab.length == 0 ? "CLIENT" : elemtab[0].childNodes[0].nodeValue;
      elemtab = survey.getElementsByTagName("SUBJECT");
      subjectTxt   =  elemtab.length == 0 ? "SUBJECT" : elemtab[0].childNodes[0].nodeValue;
      elemtab = survey.getElementsByTagName("FIRST_NUMBER");
      firstIntvNum = elemtab.length == 0 ? 1 : elemtab[0].childNodes[0].nodeValue;
      elemtab = survey.getElementsByTagName("LAST_NUMBER");
      lastIntvNum = elemtab.length == 0 ? 1000000 : elemtab[0].childNodes[0].nodeValue;
      elemtab = survey.getElementsByTagName("INTV_NUMBER");
      intvNumType = elemtab.length == 0 ? "AUTO HIDDEN" : elemtab[0].childNodes[0].nodeValue;
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
      if (intvNumShow && (intvNumAuto || intvNumTable)) {
        document.getElementById("intv_num-range").style.display = "none";
      }//if
      elemTab     = survey.getElementsByTagName("USER_ID");
      window.console.log("sId=[" + surveyId + "]" + "\nsNum=[" + stagesNum + "]" + "\nsNo=[" + stageNo + "]" +
                         "\nclient=[" + clientName + "]" + "\nsubject=[" + subjectTxt + "]" + "\nfrst=[" + firstIntvNum + "]" + ", last=[" + lastIntvNum + "]" +
                         "\niNGiven=[" + intvNumGiven + "]" + "\niNAuto=[" + intvNumAuto + "]" + "\niNTable=[" + intvNumTable + "]" + "\niNShow=[" + intvNumShow + "]" +
                         "\nelemTab.len=[" + elemTab.length + "]");
      if (parUserId == -1 && (intvNumAuto || intvNumGiven)) {//nie ma użytkownika w parametrach
        if ( elemTab.length == 0) {
          gotUser = "empty";
          userId = "YOU";
        }//if
        else {
          gotUser = elemTab[0].childNodes[0].nodeValue;
          userId = gotUser.substring(0, gotUser.indexOf("%")).trim();
        }//else
        window.console.log(gotUser + "=> userId=" + userId);
      }//if
      else {//jeśli parUserId == -1, to tylko wydruk użytkowników, bo i tak kupa
        window.console.log("users:");
        for (i = 0; i < elemTab.length; i++) {//wczytanie użytkowników
          gotUser = elemTab[i].childNodes[0].nodeValue;
          window.console.log(gotUser);
          gotUser = gotUser.substring(0, gotUser.indexOf("%")).trim();
          if (parUserId != -1 && parUserId == gotUser) //parUserId.search(gotUser) != -1)  // znaleziony użytkownik
            userId = parUserId;
        }//for po wszystkich użytkownikach dla danego badania
      }//else
      window.console.log("parUserId=[" + parUserId + "]" + "\nuserId=[" + userId + "]");
    }//if
  }//else
}//getSurveysInfoFromXML


function saveSurveyLog (extraText) {
  var xhr, txt;
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200)
      txt = this.responseText;
  };//function()
  xhr.open("GET", "_php_/zapiszSurveyLog.php?stage_no=" + parStageNo + "&user_id=" + parUserId + "&int_no=" + parIntvNum +
                                             "&agent=" + "agent" + "&extra=" + extraText, true);
  xhr.send();
}//saveSurveyLog


function getDateTime (when) {
  var xhr;
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "_php_/getDateTime.php?when=" + when, false);
  xhr.send();
  if (xhr.status == 200) {
    currDateTime = xhr.responseText;
  }//if
  else {
MONITOR("Nie działa php, status=" + xhr.status);
    var currDate = new Date();
    var n;
    currDateTime = currDate.getFullYear() + "-";
    n = currDate.getMonth() + 1;
    currDateTime += (n < 10? "0" : "") + n + "-";
    n = currDate.getDate();
    currDateTime += (n < 10? "0" : "") + n + " ";
    n = currDate.getHours();
    currDateTime += (n < 10? "0" : "") + n + ":";
    n = currDate.getMinutes();
    currDateTime += (n < 10? "0" : "") + n + ":";
    n = currDate.getSeconds();
  }//else
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
  var xhr;
  intvNum = -1;
MONITOR("<hr>isIntvNumWaiting(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhr = new window.XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhr.open("GET", "_php_/isAutoIntvNumWaiting.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhr.open("GET", "_php_/isTableIntvNumWaiting.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhr.open("GET", "_php_/isM_TabIntvNumWaiting.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    intvNum = xhr.responseText;
  }//if
  else {
MONITOR("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1)//jeśli PHP nie działa lu nie ma pliku
    intvNum = -1;
  return intvNum != -1;
}//isIntvNumWaiting


function isIntvNumStarted (tstUserId, tstIntvNum, tstStageNo) {
  var xhr;
  intvNum = -1;
MONITOR("<hr>isIntvNumStarted(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhr = new window.XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhr.open("GET", "_php_/isAutoIntvNumStarted.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhr.open("GET", "_php_/isTableIntvNumStarted.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhr.open("GET", "_php_/isM_TabIntvNumStarted.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status != 200 && xhr.responseText == "ERROR") {
    window.alert("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
  }//if
  else {
    intvNum = xhr.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
    if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1)//jeśli PHP nie działa lu nie ma pliku
      intvNum = -1;
  }//else
  return intvNum != -1;
}//isIntvNumStarted


function isIntvNumUsable (tstUserId, tstIntvNum, tstStageNo) {
  var xhr;
  intvNum = -1;
MONITOR("<hr>isIntvNumUsable(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhr = new window.XMLHttpRequest();
  if (intvNumAuto)
    xhr.open("GET", "_php_/isAutoIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  if (intvNumGiven)
    xhr.open("GET", "_php_/isGivenIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  if (intvNumTable)
    if (stagesNum == 1)//tstStageNo == -1)
      xhr.open("GET", "_php_/isTableIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhr.open("GET", "_php_/isM_TabIntvNumUsable.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    intvNum = xhr.responseText;
  }//if
  else {
MONITOR("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1)//jeśli PHP nie działa lu nie ma pliku
    intvNum = -1;
  return intvNum != -1;
}//isIntvNumUsable


function useIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  var xhr;
  intvNum = -1;
MONITOR("<hr>useIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhr = new window.XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhr.open("GET", "_php_/useAutoIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhr.open("GET", "_php_/useTableIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhr.open("GET", "_php_/useM_TabIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    intvNum = xhr.responseText;
  }//if
  else {
MONITOR("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1)//jeśli PHP nie działa lu nie ma pliku
    intvNum = -1;
  return intvNum != -1;
}//useIntvNum


function getIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  var xhr;
  intvNum = -1;
MONITOR("<hr>getIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo);
  xhr = new window.XMLHttpRequest();
  if (intvNumAuto || intvNumGiven)
    xhr.open("GET", "_php_/getAutoIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
  else
    if (stagesNum == 1)//tstStageNo == -1)
      xhr.open("GET", "_php_/getTableIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    else
      xhr.open("GET", "_php_/getM_TabIntvNum.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    intvNum = xhr.responseText;
  }//if
  else {
MONITOR("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
MONITOR("<br>intvNum=[" + intvNum + "]<hr>");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1)//jeśli PHP nie działa lu nie ma pliku
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
MONITOR("<br>aIN::intvNum=" + intvNum);
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
  window.console.log("setUpIntvNum(" + txt + ")");
  if (assignIntvNum(parIntvNum)) {//udało się ustalić numer lub ma być wpisany ręcznie
    window.console.log("setUp:intvNum=" + intvNum);
    if (intvNum != -1) //jeśli jest ustalony numer i jest w zakresie
      document.questForm.intv_num.value = intvNum;
    else
      document.getElementById("intv-num-info").innerHTML = "";
    document.getElementById("next-button").style.visibility = "visible";
    document.getElementById("position-info").style.visibility = "visible";
    window.console.log("setUp:intvNumShow=" + intvNumShow);
    currQuest = 0;
    if (!intvNumShow)
      document.getElementById("log-in-div").style.display = "none";
    document.getElementById("quest-progress").value = 1;//currQuest + (intvNumShow? 1 : 0);
    document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
    //window.console.log("reset");
    //questsTab[qsOrdTab[currQuest]][2](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1]);
    questsTab[qsOrdTab[0]][2](questsTab[qsOrdTab[0]][0], questsTab[qsOrdTab[0]][1]);
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
//ZMIANA - POCZĄTEK BLOKU ZMIAN 1/5 Example.scr
//-------------------------------------------------------------------------------------
//TEXT/VALUE
      case "rAt16": //ZMIANA
      case "rG":    //ZMIANA
      case "rH":    //ZMIANA
        document.questForm[ckName].value = ckValue;
MONITOR(ckName + "=>" + document.questForm[ckName].value + "<br>");
        break;
//RADIO
      case "rC":    //ZMIANA
      case "rD":    //ZMIANA
      case "rE":    //ZMIANA
      case "rF":    //ZMIANA
      case "rI_1":  //ZMIANA
      case "rI_2":  //ZMIANA
      case "rI_3":  //ZMIANA
      case "rI_4":  //ZMIANA
      case "rI_5":  //ZMIANA
      case "rI_6":  //ZMIANA
      case "rI_7":  //ZMIANA
      case "rI_8":  //ZMIANA
      case "rI_9":  //ZMIANA
      case "rI_10": //ZMIANA
      case "rI_11": //ZMIANA
      case "rI_12": //ZMIANA
      case "rJ_1":  //ZMIANA
      case "rJ_2":  //ZMIANA
      case "rJ_3":  //ZMIANA
      case "rJ_4":  //ZMIANA
      case "rJ_5":  //ZMIANA
      case "rJ_6":  //ZMIANA
      case "rJ_7":  //ZMIANA
      case "rJ_8":  //ZMIANA
      case "rJ_9":  //ZMIANA
      case "rJ_10": //ZMIANA
      case "rJ_11": //ZMIANA
      case "rJ_12": //ZMIANA
      case "rK":    //ZMIANA
      case "rL":    //ZMIANA
      case "rM":    //ZMIANA
        document.questForm[ckName].value = ckValue;
        for (j = 0; j < document.questForm[ckName].length; j++)
          if (document.questForm[ckName][j].value == ckValue)
            document.questForm[ckName][j].checked = true;
MONITOR(ckName + "=>" + document.questForm[ckName].value + "<br>");
        break;
//CHECK
      case "rA_1":  //ZMIANA
      case "rA_2":  //ZMIANA
      case "rA_3":  //ZMIANA
      case "rA_4":  //ZMIANA
      case "rA_5":  //ZMIANA
      case "rA_6":  //ZMIANA
      case "rA_7":  //ZMIANA
      case "rA_8":  //ZMIANA
      case "rA_9":  //ZMIANA
      case "rA_10": //ZMIANA
      case "rA_11": //ZMIANA
      case "rA_12": //ZMIANA
      case "rA_13": //ZMIANA
      case "rA_14": //ZMIANA
      case "rA_15": //ZMIANA
      case "rA_16": //ZMIANA
      case "rB_1":  //ZMIANA
      case "rB_2":  //ZMIANA
      case "rB_3":  //ZMIANA
      case "rB_4":  //ZMIANA
      case "rB_5":  //ZMIANA
      case "rB_6":  //ZMIANA
      case "rB_7":  //ZMIANA
      case "rB_8":  //ZMIANA
      case "rB_9":  //ZMIANA
      case "rB_10": //ZMIANA
      case "rB_11": //ZMIANA
      case "rB_12": //ZMIANA
      case "rB_13": //ZMIANA
      case "rB_14": //ZMIANA
      case "rB_15": //ZMIANA
      case "rB_16": //ZMIANA
        document.questForm[ckName].checked = ckValue == "true";
MONITOR(ckName + "=>" + document.questForm[ckName].checked + "<br>");
        break;
//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 1/5 Example.scr
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
  var xhr, txt;
  if (openQest === undefined) openQest = false;
MONITOR("<hr>saveVariable(" + variable + ", " + value + ", " + openQest + ")");
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200)
        txt = this.responseText;
    };//function()
  xhr.open("GET", "_php_/zapiszTempValue.php?int=" + intvNum + "&sid=" + surveyId + "&sno=" + stageNo + "&uid=" + userId +
                    "&var=" + variable + "&val=" + value + "&opq=" + openQest, true);
  xhr.send();
}//saveVariable


function tempFileExists (tstIntvNum) {
  var xhr, t;
MONITOR("<hr>tempFileExists(" + tstIntvNum + ")");
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "_php_/tempFileExists.php?int=" + tstIntvNum + "&sid=" + surveyId + "&sno=" + stageNo + "&uid=" + userId, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    t = xhr.responseText == tstIntvNum;
  }//if
  else {
    t = false;
MONITOR("Błąd php, status=" + xhr.status);
  }//else
MONITOR("=>" + t);
  return t;
}//tempFileExists


function restoreFromTempFile () {
  var xhr,
      restoredJson,
      restoredTab,
      resName,
      resValue,
      i;
  restoredIntv = false;
MONITOR("<hr>restoreFromTempFile()");
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "_php_/restoreFromTempFile.php?int=" + intvNum + "&sid=" + surveyId + "&sno=" + stageNo + "&uid=" + userId, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    restoredJson = xhr.responseText;
  }//if
  else {
    restoredJson = "";
MONITOR("Błąd odczytu TempFile, status=" + xhr.status);
  }//else
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
  //ZMIANA - POCZĄTEK BLOKU ZMIAN 2/5 Example.scr
  //-------------------------------------------------------------------------------------
  //TEXT/VALUE
        case "rAt16": //ZMIANA
        case "rG":    //ZMIANA
        case "rH":    //ZMIANA
          restoredIntv = true;     //<<---PRZY PIERWSZYM ZNACZĄCYM PYTANIU
       document.questForm[resName].value = resValue;
  MONITOR(resName + "=>" + document.questForm[resName].value + "<br>");
          break;
  //RADIO
        case "rC":    //ZMIANA
        case "rD":    //ZMIANA
        case "rE":    //ZMIANA
        case "rF":    //ZMIANA
        case "rI_1":  //ZMIANA
        case "rI_2":  //ZMIANA
        case "rI_3":  //ZMIANA
        case "rI_4":  //ZMIANA
        case "rI_5":  //ZMIANA
        case "rI_6":  //ZMIANA
        case "rI_7":  //ZMIANA
        case "rI_8":  //ZMIANA
        case "rI_9":  //ZMIANA
        case "rI_10": //ZMIANA
        case "rI_11": //ZMIANA
        case "rI_12": //ZMIANA
        case "rJ_1":  //ZMIANA
        case "rJ_2":  //ZMIANA
        case "rJ_3":  //ZMIANA
        case "rJ_4":  //ZMIANA
        case "rJ_5":  //ZMIANA
        case "rJ_6":  //ZMIANA
        case "rJ_7":  //ZMIANA
        case "rJ_8":  //ZMIANA
        case "rJ_9":  //ZMIANA
        case "rJ_10": //ZMIANA
        case "rJ_11": //ZMIANA
        case "rJ_12": //ZMIANA
        case "rK":    //ZMIANA
        case "rL":    //ZMIANA
        case "rM":    //ZMIANA
          restoredIntv = true;     //<<---PRZY PIERWSZYM ZNACZĄCYM PYTANIU
          document.questForm[resName].value = resValue;
          for (var j = 0; j < document.questForm[resName].length; j++)
            if (document.questForm[resName][j].value == resValue)
              document.questForm[resName][j].checked = true;
  MONITOR(resName + "=>" + document.questForm[resName].value + "<br>");
          break;
  //CHECK
        case "rA_1":  //ZMIANA
        case "rA_2":  //ZMIANA
        case "rA_3":  //ZMIANA
        case "rA_4":  //ZMIANA
        case "rA_5":  //ZMIANA
        case "rA_6":  //ZMIANA
        case "rA_7":  //ZMIANA
        case "rA_8":  //ZMIANA
        case "rA_9":  //ZMIANA
        case "rA_10": //ZMIANA
        case "rA_11": //ZMIANA
        case "rA_12": //ZMIANA
        case "rA_13": //ZMIANA
        case "rA_14": //ZMIANA
        case "rA_15": //ZMIANA
        case "rA_16": //ZMIANA
        case "rB_1":  //ZMIANA
        case "rB_2":  //ZMIANA
        case "rB_3":  //ZMIANA
        case "rB_4":  //ZMIANA
        case "rB_5":  //ZMIANA
        case "rB_6":  //ZMIANA
        case "rB_7":  //ZMIANA
        case "rB_8":  //ZMIANA
        case "rB_9":  //ZMIANA
        case "rB_10": //ZMIANA
        case "rB_11": //ZMIANA
        case "rB_12": //ZMIANA
        case "rB_13": //ZMIANA
        case "rB_14": //ZMIANA
        case "rB_15": //ZMIANA
        case "rB_16": //ZMIANA
          restoredIntv = true;     //<<---PRZY PIERWSZYM ZNACZĄCYM PYTANIU
          document.questForm[resName].checked = resValue == "true";
  MONITOR(resName + "=>" + document.questForm[resName].checked + "<br>");
          break;
  //-------------------------------------------------------------------------------------
  //ZMIANA - KONIEC BLOKU ZMIAN 2/5 Example.scr
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
  getDateTime("saveStartData_" + intvNum);
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
//ZMIANA - POCZĄTEK BLOKU ZMIAN 3/5 Example.scr
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
//ZMIANA - KONIEC BLOKU ZMIAN 3/5 Example.scr
//=====================================================================================
  startDataIsSet = true;
}//saveStartData


function checkIntvIdEnter (e) {
  if (!e) e = window.event;
  if ((e.keyCode? e.keyCode : e.which) == 13)
    gotoNextQuestion();
}//checkIntvIdEnter


function makePause (qqq) {

}//makePause


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
  var xhr;
  intvNum = -1;
MONITOR("<hr>setIntvNumComplete(" + tstUserId + "," + tstIntvNum + "," + tstStageNo);
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        intvNum = this.responseText;
MONITOR("<br>intvNum=[" + intvNum + "]");
      }//if
    };//function()
  if (intvNumAuto || intvNumGiven)
    xhr.open("GET", "_php_/setAutoIntvNumComplete.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, true);//ASYNCHRONICZNIE
  else
    if (tstStageNo == -1)
      xhr.open("GET", "_php_/setTableIntvNumComplete.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum, true);//ASYNCHRONICZNIE
    else
      xhr.open("GET", "_php_/setM_TabIntvNumComplete.php?user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, true);//ASYNCHRONICZNIE
  xhr.send();
}//setIntvNumComplete


function durationSec (startStr, endStr) {//2017-04-28 23:36:11
  var startDate = new Date(startStr.substr(0, 4), startStr.substr(5, 2)-1, startStr.substr(8, 2),
                           startStr.substr(11, 2), startStr.substr(14, 2), startStr.substr(17, 2));
  var endDate   = new Date(endStr.substr(0, 4), endStr.substr(5, 2)-1, endStr.substr(8, 2),
                           endStr.substr(11, 2), endStr.substr(14, 2), endStr.substr(17, 2));
  return (endDate.getTime() - startDate.getTime()) / 1000;
}//durationSec

var savingInterval = 0;
function submitFormData () {
  var dd = new Date();
MONITOR("<HR>submitFormData:");
  document.body.style.cursor = "progress";

  window.onbeforeunload = function() {return "jeszcze zapisuję";};
MONITOR("onbeforeunload-ON");

  //respondentOk = document.questForm.r13[0].checked || document.questForm.r13[1].checked;  //ZMIANA

//  rearrangeQ3data();
//  rearrangeQ13data();

  document.getElementById("finish-quest-info").style.display = "block";

  document.getElementById("data-submit-info").style.visibility = "hidden";
  document.getElementById("data-saved-next").style.visibility = "hidden";
  document.getElementById("press-text1").style.display = "none";
  document.getElementById("data-saved").style.visibility = "hidden";
  document.getElementById("data-removing-info").style.display = "none";//visibility = "hidden";
  document.getElementById("cookies-removing-info").style.display = "none";//visibility = "hidden";
  document.getElementById("all-done-end").style.visibility = "hidden";
//  document.getElementById("all-done-next").style.visibility = "hidden";
  getDateTime("submitFormData_" + intvNum);
  document.questForm.end_time.value = currDateTime;//.toLocaleString();
  //document.questForm.duration.value = (Date.parse(document.questForm.end_time.value) - Date.parse(document.questForm.start_time.value)) / 1000;
  document.questForm.duration.value = durationSec(document.questForm.start_time.value, document.questForm.end_time.value);
  document.getElementById("data-submit-info").style.visibility = "visible";
//window.alert("submitFormData:submit");

MONITOR("<BR>questForm.submit");
  document.questForm.submit();
  document.getElementById("data-saving-progess").innerHTML = ".";
  savingInterval = window.setInterval(function(){document.getElementById("data-saving-progess").innerHTML += ".";}, 100);
//  document.getElementById("press-text1").style.display = "block";
//  document.getElementById("data-saved-next").style.visibility = "visible";
//  document.getElementById("data-saved-next").focus();
  window.setTimeout(cleanData, 3000);

MONITOR("<BR>setIntvNumComplete:");
  setIntvNumComplete(userId, intvNum, stageNo);

  return false;
}//submitFormData


function cleanData () {
MONITOR("<HR>cleanData:");
//  document.getElementById("data-saved-next").style.visibility = "hidden";
//  document.getElementById("press-text1").style.visibility = "hidden";
  if (savingInterval != 0) {
    window.clearInterval(savingInterval);
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

  document.body.style.cursor = "auto";
  window.setTimeout(endInterview, 1000);
//  document.getElementById("all-done-end").style.visibility = "visible";
//  document.getElementById("all-done-next").style.visibility = "visible";
//  document.getElementById("all-done-end").focus();
}//cleanData


function endInterview () {
  //goToBadania();
  window.onbeforeunload = null;
MONITOR("onbeforeunload-OFF");

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
//ZMIANA - POCZĄTEK BLOKU ZMIAN 4/5 Example.scr
//-------------------------------------------------------------------------------------
//OBSŁUGA ANKIETY =====================================================================
var questsTab = [["quest-intv_num",  "intv_num",  prepareInt_num,         verifyInt_num],
                 //["quest-intro0",    "intro0",    prepareQuest_intro0,    verifyQuest_intro0],   //ZMIANA v
                 ["quest-r0",        "r0",        prepareQuest_r0,        verifyQuest_r0],
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
                12];  //ZMIANA
var questsNumber = ordQsTab.length,
    prevQuest = 0,
    currQuest = 0,
    nextQuest = 0;
var scenariaTab = [[3, 4, 5, 6, 7, 8, 9, 10],
                   [10, 9, 8, 7, 6, 5, 4, 3],
                   [3, 5, 7, 9, 4, 6, 8, 10],
                   [10, 8, 6, 4, 9, 7, 5, 3]];
var scenariaNum = scenariaTab.length,
    questsNum = 8;
function arrangeOrdQsTab () {
/*
MONITOR("<hr>arrangeOrdQsTab: [" + intvNum + "]");
var scenario = (intvNum - 1) % scenariaNum + 1,  //WYBÓR WIERSZA W TABELI q1_8arrTab -- intvNum,//powinno być jak jest dla każdego
    firstQuest = (intvNum - 1) % questsNum,      //pierwszy w rotacji wybranego wiersza tabeli q1_8arrTab
    i;
  for (i = 0; i < questsNum - firstQuest; i++)
    ordQsTab[3 + i] = scenariaTab[scenario][i + firstQuest];
  for (; i < questsNum; i++)
    ordQsTab[3 + i] = scenariaTab[scenario][i + firstQuest - questsNum];
for (i = 0; i <= 10; i++) MONITOR("," + ordQsTab[i]);
*/
}//arrangeOrdQsTab


var rotations = [[1001, "p001"],
                 [1002, "p002"],
                 [1003, "p003"],
                 [1004, "p004"],
                 [1005, "p005"],
                 [1006, "p006"],
                 [1007, "p007"],
                 [1008, "p008"],
                 [1009, "p009"],
                 [1010, "p010"],
                 [1011, "p011"],
                 [1012, "p012"],
                 [1013, "p013"],
                 [1014, "p014"],
                 [1015, "p015"],
                 [1016, "p016"],
                 [1017, "p017"],
                 [1018, "p018"],
                 [1019, "p019"],
                 [1020, "p020"],
                 [1021, "p021"],
                 [1022, "p022"],
                 [1023, "p023"],
                 [1024, "p024"],
                 [1025, "p025"],
                 [1026, "p026"],
                 [1027, "p027"],
                 [1028, "p028"],
                 [1029, "p029"],
                 [1030, "p030"],
                 [1031, "p031"],
                 [1032, "p032"],
                 [1033, "p033"],
                 [1034, "p034"],
                 [1035, "p035"],
                 [1036, "p036"],
                 [1037, "p037"],
                 [1038, "p038"],
                 [1039, "p039"],
                 [1040, "p040"],
                 [1041, "p041"],
                 [1042, "p042"],
                 [1043, "p043"],
                 [1044, "p044"],
                 [1045, "p045"],
                 [1046, "p046"],
                 [1047, "p047"],
                 [1048, "p048"],
                 [1049, "p049"],
                 [1050, "p050"],
                 [1051, "p051"],
                 [1052, "p052"],
                 [1053, "p053"],
                 [1054, "p054"],
                 [1055, "p055"],
                 [1056, "p056"],
                 [1057, "p057"],
                 [1058, "p058"],
                 [1059, "p059"],
                 [1060, "p060"],
                 [1061, "p061"],
                 [1062, "p062"],
                 [1063, "p063"],
                 [1064, "p064"],
                 [1065, "p065"],
                 [1066, "p066"],
                 [1067, "p067"],
                 [1068, "p068"],
                 [1069, "p069"],
                 [1070, "p070"],
                 [1071, "p071"],
                 [1072, "p072"],
                 [1073, "p073"],
                 [1074, "p074"],
                 [1075, "p075"],
                 [1076, "p076"],
                 [1077, "p077"],
                 [1078, "p078"],
                 [1079, "p079"],
                 [1080, "p080"],
                 [1081, "p081"],
                 [1082, "p082"],
                 [1083, "p083"],
                 [1084, "p084"],
                 [1085, "p085"],
                 [1086, "p086"],
                 [1087, "p087"],
                 [1088, "p088"],
                 [1089, "p089"],
                 [1090, "p090"],
                 [1091, "p091"],
                 [1092, "p092"],
                 [1093, "p093"],
                 [1094, "p094"],
                 [1095, "p095"],
                 [1096, "p096"],
                 [1097, "p097"],
                 [1098, "p098"],
                 [1099, "p099"],
                 [1100, "p100"]];

function findRotation () {
  var i;
MONITOR("<hr>findRotation: [" + intvNum + "]");
  for (i = 0; i < rotations.length && rotations[i][0] != intvNum; i++);
  document.questForm.tp1_ord.value = 1;
  //document.questForm.tp2_ord.value = 2;
  if (i < rotations.length) {
    document.questForm.tp1_name.value = rotations[i][1];
    //document.questForm.tp2_name.value = rotations[i][2];
  }
  else {
    if (rotations.length && 0 < intvNum) {
      document.questForm.tp1_name.value = rotations[(intvNum - 1) % rotations.length][1];
    }//if
    else {
      document.questForm.tp1_name.value = "pierwszy";
    //document.questForm.tp2_name.value = "drugi";
    }//esle
  }//if
MONITOR("<br>rotations[" + i + "]:" + document.questForm.tp1_name.value);
//MONITOR("," + document.questForm.tp2_name.value);
MONITOR("<br>");
MONITOR("::" + document.questForm.tp1_ord.value);
//MONITOR("," + document.questForm.tp2_ord.value);
MONITOR("<br>");
  return i < rotations.length;
}//findRotation


var q3orgTab = [["1",  99, "ATRAKCYJNY"],
                ["2",  99, "ŁATWY DO NOSZENIA"],
                ["3",  99, "KOBIECY"],
                ["4",  99, "ŚWIEŻY"],
                ["5",  99, "DOBREJ JAKOŚCI"],
                ["6",  99, "MA CHARAKTER, OSOBOWOŚĆ"],
                ["7",  99, "OPTYMISTYCZNY, POZYTYWNY"],
                ["8",  99, "SPRAWIA, ŻE CZUJĘ SIĘ PEWNA SIEBIE"],
                ["9",  99, "NOWOCZESNY"],
                ["10", 99, "WYRAFINOWANY / ELEGANCKI"],
                ["11", 99, "ROMANTYCZNY"],
                ["12", 99, "ZMYSŁOWY"],
                ["13", 99, "WYSZUKANY"],
                ["14", 99, "STYMULUJĄCY"],
                ["15", 99, "UNIKALNY / INNY"],
                ["16", 99, "MŁODZIEŻOWY"],
                ["17", 99, "INSPIRUJĄCY"],
                ["18", 99, "ŚWIETLISTY, ŻYWY"],
                ["19", 99, "PROMIENNY"]];
var q3orgTabLen = q3orgTab.length;
var q3arrTab = [[1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                [2, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]];
var q3arrTabLen = q3arrTab.length; //numer wiersza w tabeli q3arrTab
var q3arrLine = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function makeQ3arrLine () {
  var arrKey = (intvNum - 1) % q3arrTabLen + 1,//intvNum,//powinno być jak jest dla każdego
      firstItem = (intvNum - 1) % q3orgTabLen, //pierwszy w rotacji wybranego wiersza tabeli q3arrTab
      arrTabPos = 0,                           //numer wiersza w tabeli q3arrTab
      i;                                        //WYBÓR WIERSZA w tabeli q3arrTab
MONITOR("<hr>makeQ3arrLine<br> arrKey=" + arrKey + ", firstItem=" + (firstItem+1) + ":");
  for (i = 0; i < q3arrTabLen && q3arrTab[i][0] != arrKey; i++);//SZUKAJ WIERSZA WEDŁUG arrKey - może być intvNum
  if (i < q3arrTabLen && q3arrTab[i][0] == arrKey)              //jeśli odnaleziony
    arrTabPos = i;
  for (i = 1; i <= q3orgTabLen - firstItem; i++) //ZAPISYWANIE q1_8arrLine UWZGLĘDNIAJĄC OBRACANIE WYBRANEGO WIERSZA
    q3arrLine[i] = q3arrTab[arrTabPos][i + firstItem];
  for (; i <= q3orgTabLen; i++) //OBRÓĆ DLA WYBRANEGO WIERSZA autokręcioła jeżeli ma być
    q3arrLine[i] = q3arrTab[arrTabPos][i + firstItem - q3orgTabLen];
  for (i = 1; i <= q3orgTabLen; i++) MONITOR(q3arrLine[i] + ",");
}//makeQ3arrLine

function arrangeQ3items () {
  var i;
MONITOR("<hr>arrangeQ3items<br>");
  makeQ3arrLine();
  for (i = 0; i < q3orgTabLen; i++) {
    document.getElementById("tp1_q3item" + q3orgTab[i][0]).innerHTML = q3orgTab[q3arrLine[i + 1] - 1][2];
//    document.getElementById("tp2_q3item" + q3orgTab[i][0]).innerHTML = q3orgTab[q3arrLine[i + 1] - 1][2];
  }//for
}//arrangeQ3items

function rearrangeQ3data__ (tpN_q3_) {
  var i, j, q3name;
//MONITOR("<hr>rearrangeQ3data(" + tpN_q3_ +")");
  for (i = 0; i < q3orgTabLen; i++) {    //PRZEPISANIE danych z formularza do tabeli q3orgTab
    q3name = tpN_q3_ + q3orgTab[i][0];
    for (j = 0; j < document.questForm[q3name].length; j++)
      if (document.questForm[q3name][j].checked)
        q3orgTab[q3arrLine[i + 1] - 1][1] = j;
  }//for
  for (i = 0; i < q3orgTabLen; i++) {    //PRZEPISANIE danych z q3orgTab do formularza
    q3name = tpN_q3_ + q3orgTab[i][0];
    for (j = 0; j < document.questForm[q3name].length; j++)
      document.questForm[q3name][j].checked = j == q3orgTab[i][1];
  }//for
}//rearrangeQ3data__


function rearrangedQ3index (find) {
  var i;
  for (i = 1; i <= q3orgTabLen && q3arrLine[i] != find; i++);
  return i;
}//rearrangedQ3index


function rearrangeQ3data () {
  makeQ3arrLine();
  rearrangeQ3data__("tp1_q3_");
//  rearrangeQ3data__("tp2_q3_");
}//rearrangeQ3data


var q13orgTab = [["1", 99, "POLECIŁABYM GO PRZYJACIÓŁCE"],
                 ["2", 99, "KUPIŁABYM GO JAKO PREZENT"],
                 ["3", 99, "BYŁABYM ZACHWYCONA, GDYBYM DOSTAŁA GO NA PREZENT"],
                 ["4", 99, "UŻYWAŁABYM/ NOSIŁABYM GO NA SPECJALNE OKAZJE"],
                 ["5", 99, "TO WYRAFINOWANY / WYSOKIEJ JAKOŚCI ZAPACH"]];
var q13orgTabLen = 5;
var q13arrTab = [[1, 1, 2, 3, 4, 5],
                 [2, 5, 4, 3, 2, 1]];
var q13arrTabLen = 2; //numer wiersza w tabeli q13arrTab
var q13arrLine = [0, 1, 1, 1, 1, 1];

function makeQ13arrLine () {
  var arrKey = (intvNum - 1) % q13arrTabLen + 1,//intvNum,//powinno być jak jest dla każdego
      firstItem = (intvNum - 1) % q13orgTabLen, //pierwszy w rotacji wybranego wiersza tabeli q13arrTab
      arrTabPos = 0,                           //numer wiersza w tabeli q13arrTab
      i;                                        //WYBÓR WIERSZA w tabeli q13arrTab
MONITOR("<hr>makeQ13arrLine<br> arrKey=" + arrKey + ", firstItem=" + (firstItem+1) + ":");
  for (i = 0; i < q13arrTabLen && q13arrTab[i][0] != arrKey; i++);//szukaj wiersza według arrKey - może być intvNum
  if (i < q13arrTabLen && q13arrTab[i][0] == arrKey)              //jeśli odnaleziony
    arrTabPos = i;
  for (i = 1; i <= q13orgTabLen - firstItem; i++) //OBRÓĆ DLA WYBRANEGO WIERSZA autokręcioła jeżeli ma być
    q13arrLine[i] = q13arrTab[arrTabPos][i + firstItem];
  for (; i <= q13orgTabLen; i++) //OBRÓĆ DLA WYBRANEGO WIERSZA autokręcioła jeżeli ma być
    q13arrLine[i] = q13arrTab[arrTabPos][i + firstItem - q13orgTabLen];
  for (i = 1; i <= q13orgTabLen; i++) //OBRÓĆ DLA WYBRANEGO WIERSZA autokręcioła jeżeli ma być
MONITOR(q13arrLine[i] + ",");
}//makeQ13arrLine
function arrangeQ13items () {
  var i;
MONITOR("<hr>arrangeQ13items<br>");
  makeQ13arrLine();
  for (i = 0; i < q13orgTabLen; i++) {
    document.getElementById("tp1_q13item" + q13orgTab[i][0]).innerHTML = q13orgTab[q13arrLine[i + 1] - 1][2];
//    document.getElementById("tp2_q13item" + q13orgTab[i][0]).innerHTML = q13orgTab[q13arrLine[i + 1] - 1][2];
  }//for
}//arrangeQ13items

function rearrangeQ13data__ (tpN_q13_) {
  var i, j, q13name;
//MONITOR("<hr>rearrangeQ13data(" + tpN_q13_ +")");
  for (i = 0; i < q13orgTabLen; i++) {    //PRZEPISANIE danych z formularza do tabeli q13orgTab
    q13name = tpN_q13_ + q13orgTab[i][0];
    for (j = 0; j < document.questForm[q13name].length; j++)
      if (document.questForm[q13name][j].checked)
        q13orgTab[q13arrLine[i + 1] - 1][1] = j;
  }//for
  for (i = 0; i < q13orgTabLen; i++) {    //PRZEPISANIE danych z q13orgTab do formularza
    q13name = tpN_q13_ + q13orgTab[i][0];
    for (j = 0; j < document.questForm[q13name].length; j++)
      document.questForm[q13name][j].checked = j == q13orgTab[i][1];
  }//for
}//rearrangeQ13data__
function rearrangeQ13data () {
  makeQ13arrLine();
  rearrangeQ13data__("tp1_q13_");
//  rearrangeQ13data__("tp2_q13_");
}//rearrangeQ13data


function arrangeQuestions () {
MONITOR("reset");
MONITOR("<br>arrangeQuestions: ");
//  arrangeQ3items();
//  arrangeQ13items();
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
      minuteLength = 0;
      gotoFirstEmptyQuestion();
      minuteLength = standardMinuteLength;
      if (1 < currQuest) {//if (2 < currQuest) {
        currQuest--;
      }//if
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
    isOk = i < document.questForm[fldName].length && document.questForm[fldName][i].checked;
    if (isOk) {   //if (document.questForm[fldName].value != "" && document.questForm[fldName].value !== undefined) {
      document.questForm[fldName].value = document.questForm[fldName][i].value;
    }//if
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
  if (othNo === undefined) {
    othNo = length;
  }//if
  if (document.getElementById(qId).hidden) {
    isOk = true;
  }//if
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


//wait-clock

var timeLength = 0.5*60,
    standardMinuteLength = 1000,//długość sekundy w milisekundach
    minuteLength = standardMinuteLength,//długość sekundy w milisekundach
    timeLeft = timeLength;
var textClockTimer = 0;
function textClockClik (clockObj) {
  var minLeft,
      secLeft;
MONITOR(".");
  if (--timeLeft) {
    minLeft = Math.floor(timeLeft / 60);
    secLeft = timeLeft % 60;
    if (minLeft) {
      if (4 < minLeft)
        clockObj.innerHTML = "Pozostało jeszcze " + minLeft + " minut";
      else
        if (1 < minLeft)
          clockObj.innerHTML = "Pozostały jeszcze " + minLeft + " minuty";
        else
          clockObj.innerHTML = "Pozostała jeszcze 1 minuta";
    }//if
    else
      if (secLeft) {
        if (4 < secLeft)
          clockObj.innerHTML = "Pozostało jeszcze ";
        else
          if (1 < secLeft)
            clockObj.innerHTML = "Pozostały jeszcze ";
          else
            clockObj.innerHTML = "Pozostała jeszcze ";
      }//if
    if (secLeft) {
      if (minLeft)
        clockObj.innerHTML += " i ";
      if (4 < secLeft)
        clockObj.innerHTML += secLeft + " sekund.";
      else
        if (1 < secLeft)
          clockObj.innerHTML += secLeft + " sekundy.";
        else
          clockObj.innerHTML += "1 sekunda.";
    }//if
    else
      clockObj.innerHTML += ".";
  }//if
  else {
    window.clearInterval(textClockTimer);
    textClockTimer = 0;
  }//else
}//textClockClik


function drawFace (clockCanvasCtx, clockCanvasRadius) {
  var ang,
     num;
  clockCanvasCtx.beginPath();                      //tło zegara
    clockCanvasCtx.arc(0, 0, clockCanvasRadius*0.95, 0 , 2*Math.PI);//tło zegara / zewnątrzny kółko
    //clockBackgroundColor = "yellow";
    clockCanvasCtx.fillStyle = generalBackgroundColor;
    clockCanvasCtx.fill();
  clockCanvasCtx.beginPath();                      //tło zegara
    clockCanvasCtx.arc(0, 0, clockCanvasRadius*0.95, 0 , 2*Math.PI);//tło zegara / zewnątrzny kółko
    clockCanvasCtx.lineWidth = clockCanvasRadius*0.02;
    clockCanvasCtx.strokeStyle = "darkgrey";
    clockCanvasCtx.stroke();
  ang = Math.PI / 30;
  clockCanvasCtx.beginPath();
    for (num = 1; num <= 60; num++) {
      clockCanvasCtx.rotate(ang);                    //obrót w prawo
      //if (num % 5)
      clockCanvasCtx.moveTo(0, -clockCanvasRadius*0.90);    //przesunięcie środka
      clockCanvasCtx.lineTo(0, -clockCanvasRadius*0.95);                   //wyprostowanie - obrot w lewo
      clockCanvasCtx.stroke(); //napis
      clockCanvasCtx.moveTo(0, clockCanvasRadius*0.95);     // przesunięcie środka do środka
    }//for
  clockCanvasCtx.beginPath();
    clockCanvasCtx.font = clockCanvasRadius*0.2 + "px arial";
    clockCanvasCtx.fillStyle = "black";
    clockCanvasCtx.textBaseline = "middle";
    clockCanvasCtx.textAlign = "center";
    for (num = 1; num <= 12; num++) {
      ang = num * Math.PI / 6;
      clockCanvasCtx.rotate(ang);                    //obrót w prawo
      clockCanvasCtx.translate(0, -clockCanvasRadius*0.80);    //przesunięcie środka
      clockCanvasCtx.rotate(-ang);                   //wyprostowanie - obrot w lewo
      clockCanvasCtx.fillText(num.toString(), 0, 0); //napis
      clockCanvasCtx.rotate(ang);                    //obrot w prawo = znów krzywo
      clockCanvasCtx.translate(0, clockCanvasRadius*0.80);     // przesunięcie środka do środka
      clockCanvasCtx.rotate(-ang);                   //wyprostowanie
    }//for
}//drawFace

function drawHand (clockCanvasCtx, angle, length, width) {
  clockCanvasCtx.moveTo(0, 0);       //do środka
  clockCanvasCtx.rotate(angle);        //obrót
  clockCanvasCtx.beginPath();
    clockCanvasCtx.lineWidth = width;//szerokość wskazówki
    clockCanvasCtx.moveTo(0, length*0.2);        //do środka
    clockCanvasCtx.lineTo(0, -length); //linia
    clockCanvasCtx.stroke();           //malowanie
  clockCanvasCtx.rotate(-angle);       //wyprostowanie
}//drawHand

function drawTime (clockCanvasCtx, clockCanvasRadius) {
  var now = new Date();
  var hour = now.getHours()%12;  //godzina 0-12
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var grad;
  clockCanvasCtx.lineCap = "round";//zaokrąglony koniec
  clockCanvasCtx.strokeStyle = "black";
  //hour
  hour = (hour*Math.PI/6) + (minute*Math.PI/(6*60)) + (second*Math.PI/(360*60)); //hour hand angle
    grad = clockCanvasCtx.createLinearGradient(0, 0, 0, -clockCanvasRadius*0.62);
    grad.addColorStop(0, "black");
    grad.addColorStop(0.5, "darkgrey");
    grad.addColorStop(1, "black");
    clockCanvasCtx.strokeStyle = grad;
    drawHand (clockCanvasCtx, hour, clockCanvasRadius*0.50, clockCanvasRadius*0.08);
  //minute
  minute = (minute*Math.PI/30) + (second*Math.PI/(30*60));
    grad = clockCanvasCtx.createLinearGradient(0, 0, 0, -clockCanvasRadius*0.84);
    grad.addColorStop(0, "black");
    grad.addColorStop(0.5, "darkgrey");
    grad.addColorStop(1, "black");
    clockCanvasCtx.strokeStyle = grad;
    drawHand(clockCanvasCtx, minute, clockCanvasRadius*0.70, clockCanvasRadius*0.05);
  // second
  second=(second*Math.PI/30);
    grad = clockCanvasCtx.createLinearGradient(0, 0, 0, -clockCanvasRadius*1.08);
    grad.addColorStop(0, "orange");
    grad.addColorStop(1, "red");
    clockCanvasCtx.strokeStyle = grad;
    drawHand(clockCanvasCtx, second, clockCanvasRadius*0.90, clockCanvasRadius*0.02);
}//drawTime

function drawClock (clockCanvasCtx, clockCanvasRadius) {
  drawFace(clockCanvasCtx, clockCanvasRadius);
  drawTime(clockCanvasCtx, clockCanvasRadius);
}//drawClock

function prepareWaitPage (qId, fldName) {//"quest-tp1_wait",   "tp1_wait",
MONITOR("<br>prepareWaitTime(" + qId + ":" + fldName + ")");
  var textClockObj;
  var waitClockCanvas = document.getElementById(fldName + "-clockC"),
      waitClockCanvasCtx,     //kontekstu
      waitClockCanvasRadius,  //promień cyferblatu
      drawClockTimer;
  if (0 < minuteLength)
    minuteLength = standardMinuteLength;//długość sekundy w milisekundach
  timeLeft = timeLength;
  document.getElementById(qId).style.display = "flex";
  document.getElementById(fldName + "-90").style.display = "block";
  document.getElementById(fldName + "-sekund").innerHTML = timeLeft;
  document.getElementById(fldName + "-pp").style.display = "none";
  document.getElementById(fldName + "-clock").style.display = "block";
  document.getElementById(fldName + "-prod").style.display = "none";
  document.getElementById(fldName + "-pclock").style.visibility = "visible";
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "hidden";
  textClockObj = document.getElementById(fldName + "-ptime");
  textClockObj.innerHTML = "Trzeba poczekać " + timeLeft + " sekund.";
  if (textClockTimer != 0) {
    window.clearInterval(textClockTimer);
    textClockTimer = 0;
  }//if
  if (0 < minuteLength) {
    textClockTimer = window.setInterval(textClockClik, minuteLength, textClockObj);//1000);

    waitClockCanvasCtx = waitClockCanvas.getContext("2d");        //utworzenie kontekstu
    waitClockCanvasRadius = waitClockCanvas.height / 2;           //promień cyferblatu
    waitClockCanvasCtx.translate(waitClockCanvas.width / 2, waitClockCanvas.height / 2);                 //ustawienia pozycji (0,0) rysowania
    drawClock(waitClockCanvasCtx, waitClockCanvasRadius);
    drawClockTimer = window.setInterval(drawClock, 1000, waitClockCanvasCtx, waitClockCanvasRadius);

    //waitClockCanvas.ondblclick = function(){timeLeft = 1;};
    window.setTimeout(postPrepareWaitPage, timeLeft*minuteLength, qId, fldName, drawClockTimer);//1000, qId);
  }//if
  else
    postPrepareWaitPage(qId, fldName, 0);
}//prepareWaitPage
function postPrepareWaitPage (qId, fldName, drawClockTimer) {
MONITOR("<br>postPrepareWaitPage(" + qId + ":" + fldName + ":" + drawClockTimer + ")");
var waitClockCanvas = document.getElementById(fldName + "-clockC"),
    waitClockCanvasCtx = waitClockCanvas.getContext("2d");        //utworzenie kontekstu
  if (drawClockTimer != 0) {
    waitClockCanvasCtx.translate(-waitClockCanvas.width / 2, -waitClockCanvas.height / 2);  //ustawienia pozycji (0,0) rysowania
    window.clearInterval(drawClockTimer);
    drawClockTimer = 0;
  }//if
  document.getElementById(fldName + "-clock").style.display = "none";
  document.getElementById(fldName + "-prod").style.display = "block";
  document.getElementById(fldName + "-90").style.display = "none";
  document.getElementById(fldName + "-pp").style.display = "block";
  document.getElementById(fldName + "-pclock").style.visibility = "hidden";
  document.getElementById("prev-button").style.visibility = "visible";
  document.getElementById("next-button").style.visibility = "visible";
  document.getElementById("test-prod-info").innerHTML = "";
}//postPrepareWaitPage

function verifyWaitPage (qId, fldName) {
MONITOR("<br>verify__(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "none";
  document.getElementById("prev-button").style.visibility = "visible";
  document.getElementById("next-button").style.visibility = "visible";
  return true;
}//verifyWaitPage


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


function prepareQuest_r0 (qId, fldName) {
MONITOR("<br>pre(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "flex";
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "visible";
  document.getElementById("next-button").innerHTML = "Dalej";//Kolejne pytanie";
  return true;
}//prepareQuest_r0
function verifyQuest_r0 (qId, fldName) {
  if (verifyQuestSingle (qId, fldName)) {
    document.getElementById("prev-button").style.visibility = "visible";
    return true;
  }//if
  else
    return false;
}//verifyQuest_r0


function verifyQuest_rA (qId, fldName) {
MONITOR("<br>ver(" + qId + ":" + fldName + ")");
  var isOk = true,
      number = parseInt(document.questForm[fldName].value);
  if (number && 25 <= number && number <= 45) {
    document.cookie = fldName + "=" + document.questForm[fldName].value + ckExpiresText;
    saveVariable(fldName, document.questForm[fldName].value);
    document.getElementById(qId).getElementsByClassName("fill-info")[0].style.color = "green";
    document.getElementById(qId).style.display = "none";
    //if (number < 33)
    //  document.questForm.rB[1].checked = true;
    //else
    //  document.questForm.rB[2].checked = true;
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
//ZMIANA - KONIEC BLOKU ZMIAN 4/5 Example.scr
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
  displayOnAllQuestions();
  hideSomeInterviewElements();

  document.questForm.reset();//ankieta nazywa się questForm

  getInfoFromParams();// odczytaj parametry z linii polecenia - zmienne: parSurveyId, parUserId, parIntvNum
  getSurveysInfoFromXML();//odczytaj PONIŻSZE informacje z bazy danych - zmienne surveyId, userId .. intvNumShow

  document.getElementById("top-banner-center").innerHTML = "<em>" + subjectTxt + "</em>";
  document.getElementById("top-banner-center").style.visibility = "hidden";
  document.getElementById("client-name-info").innerHTML = clientName;

  saveSurveyLog("initAll");
  getDateTime("initAll_" + parIntvNum);

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
    window.setTimeout(function(){document.getElementById("cookies-confirm").style.display = "none";}, 30000);
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
