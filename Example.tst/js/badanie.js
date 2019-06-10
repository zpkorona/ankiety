/*jshint esversion: 6 */
/*jslint node: true */
﻿"use strict";
/*global window*/
/*global document*/

//GLOBAL VARIABLES ====================================================================

var generalBackgroundColor = "#f0fff0";
//var generalBackgroundColor = "#e6f6ff";//Almares
var pictureFrameColor = "#80d0ff";
var successInitColor = "black",
    successTrueColor = "green",
    successFalseColor = "red";

var phpIsWorking = true;
var noPhpIntvNum = 10101;
var errorReadingINfile = "Błąd odczytu pliku z identyfikatorami, status=";
var errorNoPHPorINfile = "PHP nie działa lub nie ma pliku";
var warningPHPisNotWorking = "php is not working => intvNum = ";

var parSurveyId = -1,
    parStageNum = -1,
    parUserId   = -1,
    parIntvNum  = -1;

var respondentOk = true;

var surveyId     = -1,
    stagesNum    = 1,
    stageNum     = -1,
    userId       = -1,
    anonymoususerIds = ["gość", "Gość"],
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
    ckStageNum    = -1,
    ckUserId      = -1,
    ckIntvNum     = -1,
    ckStartTime   = -1,
    ckEndTime     = -1,
    restoredIntv  = false,
    ckExpiresText = ";expires=";

var startDataIsSet = false;

var currDateTime = "2017-04-01 01-01-01";


//=====================================================================================
//QESTIONNAIRE  =======================================================================
var prevQuest = 0,
    currQuest = 0,
    nextQuest = 0;
var qsOrdTab = [0];  //created by function

//-------------------------------------------------------------------------------------
//ZMIANA - POCZĄTEK BLOKU ZMIAN 1/5 Example.tst

var questsTab = [["quest-intv_num",   "intv_num",  prepareInt_num,         verifyInt_num],
                 ["quest-intro0",     "intro0",    prepareQuest_intro0,    verifyQuest_intro0],   //ZMIANA v
                 ["quest-tp1_intro",  "tp1",       prepareQuest_tpN_intro, verify__],
                 ["quest-tp1_q1",     "tp1_q1",    prepare__,              verifyQuestSingle],
                 ["quest-tp1_q2",     "tp1_q2",    prepare__,              verifyQuestSingle],
                 ["quest-tp1_q3",     "tp1_q3",    prepare__,              verifyQuestRange],
                 ["quest-tp1_wait",   "tp1_wait",  prepareWaitPage,        verifyWaitPage],
                 ["quest-tp2_intro",  "tp2",       prepareQuest_tpN_intro, verify__],
                 ["quest-tp2_q1",     "tp2_q1",    prepare__,              verifyQuestSingle],
                 ["quest-tp2_q2",     "tp2_q2",    prepare__,              verifyQuestSingle],
                 ["quest-tp2_q3",     "tp2_q3",    prepare__,              verifyQuestRange],
                 ["quest-tp2_after",  "tp2",       prepare__,              verify__],
                 ["quest-q7",         "q7",        prepareQuest_q7,        verifyQuestSingle],
                 ["quest-q8",         "q8",        prepareQuest_q8,        verifyQuest_q8]];//ZMIANA ^

var useScenariaTab = true;   // mają być zmiany kolejności pytań
var rotateScenario = true;  // maja być rotacje wewnątrz scenariuszy
var scenariaTab = [[3, 4, 5],
                   [3, 5, 4],
                   [4, 3, 5],
                   [4, 5, 3],
                   [5, 3, 4],
                   [5, 4, 3]];

var useRotations = false;
var rotatsFromFile = false;
var rotatsGenerate = false;
var productsNum = 1;
var rotations = [[ 1, "Nazwa A","Nazwa B"],
                 [ 2, "Nazwa B","Nazwa A"],
                 [ 3, "Nazwa A","Nazwa C"],
                 [ 4, "Nazwa C","Nazwa A"],
                 [ 5, "Nazwa A","Nazwa D"],
                 [ 6, "Nazwa D","Nazwa A"],
                 [ 7, "Nazwa A","Nazwa E"],
                 [ 8, "Nazwa E","Nazwa A"],
                 [ 9, "Nazwa B","Nazwa C"],
                 [10, "Nazwa C","Nazwa B"],
                 [11, "Nazwa B","Nazwa D"],
                 [12, "Nazwa D","Nazwa B"],
                 [13, "Nazwa B","Nazwa E"],
                 [14, "Nazwa E","Nazwa B"],
                 [15, "Nazwa C","Nazwa D"],
                 [16, "Nazwa D","Nazwa C"],
                 [17, "Nazwa C","Nazwa E"],
                 [18, "Nazwa E","Nazwa C"],
                 [19, "Nazwa D","Nazwa E"],
                 [20, "Nazwa E","Nazwa D"]];

//              index, value, name
var q8_orgTab = [["1",  99, "Cecha_rI 1"],
                 ["2",  99, "Cecha_rI 2"],
                 ["3",  99, "Cecha_rI 3"],
                 ["4",  99, "Cecha_rI 4"],
                 ["5",  99, "Cecha_rI 5"],
                 ["6",  99, "Cecha_rI 6"],
                 ["7",  99, "Cecha_rI 7"],
                 ["8",  99, "Cecha_rI 8"],
                 ["9",  99, "Cecha_rI 9"],
                 ["10", 99, "Cecha_rI 10"],
                 ["11", 99, "Cecha_rI 11"],
                 ["12", 99, "Cecha_rI 12"]];
var q8_arrTab = [[1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                 [2, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]];
var q8_arrLine = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

//ZMIANA - KONIEC BLOKU ZMIAN 1/5 Example.tst
//-------------------------------------------------------------------------------------


//=====================================================================================
//GENERAL UTILS =======================================================================

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
  if (txt == "clear" || txt == "reset") {
    document.getElementById("monitor-monitor").innerHTML = "";
  } else {
    document.getElementById("monitor-monitor").innerHTML += txt;
  }//else
}//MONITOR

function errorAlert (text1, text2, color) {
  document.getElementById("reload-text1").innerHTML = text1;
  document.getElementById("reload-text2").innerHTML = text2;
  if (color === undefined) color = "black";
  document.getElementById("reload-text1").style.color = color;
  document.getElementById("reload-text2").style.color = color;
  document.getElementById("reload-survey-info").style.display = "block";
}//function errorAlert


//=====================================================================================
//PHP UTILS ===========================================================================

function phpCheck () {
  let xhr;
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {// && this.status == 200
      phpIsWorking = this.responseText.indexOf("<?php") != 0;
      window.console.log("phpCheck: phpIsWorking=" + phpIsWorking + ", response:" + this.responseText + ", status:" + this.statusText);
    }//if
  };//function()
  xhr.open("GET", "../php/phpCheck.php");
  xhr.send();
}//function phpCheck

function getDateTime (when) {
  let xhr;
  if (phpIsWorking != undefined && phpIsWorking) {
    xhr = new window.XMLHttpRequest();
    xhr.open("GET", "../php/getDateTime.php?when=" + when, false);
    xhr.send();
  }//if
  if (phpIsWorking != undefined && phpIsWorking && xhr.status == 200) {
    currDateTime = xhr.responseText;
    window.console.log("getDateTime(" + when + ") => " + currDateTime + "(with php)");
  } else {
    let currDate = new Date();
    let n;
    window.console.log(warningPHPisNotWorking);
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
    window.console.log("getDateTime(" + when + ") => " + currDateTime + "(no php)");
  }//else
}//getDateTime

function saveSurveyLog (extraText) {
  let xhr, txt;
  window.console.log("saveSurveyLog: survey_id" + parSurveyId + ", stage_no=" + parStageNum + ", user_id=" + parUserId + ", int_no=" + parIntvNum);
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      txt = this.responseText;
    }//if
  };//function()
  xhr.open("GET", "../php/zapiszSurveyLog.php?survey_id=" + parSurveyId + "&stage_no=" + parStageNum + "&user_id=" + parUserId + "&int_no=" + parIntvNum +
                                             "&agent=" + "agent" + "&extra=" + extraText, true);
  xhr.send();
}//saveSurveyLog


//=====================================================================================
//FIELDS ENHANCEMENTS =================================================================

function senseClick (e) {
  if (!e) {
    e = window.event;
  }//if
  let obj = (e.target) ? e.target : e.srcElement;
  if (obj.nodeName == "DIV" && 0 < obj.childNodes.length && (obj.childNodes[0].nodeName == "INPUT" || obj.childNodes[0].nodeName == "LABEL")) {
    obj.childNodes[0].click();
  }//if
}//senseClick

function makeInputsClickSensitive () {
  let inputs = document.questForm.getElementsByTagName("DIV");
  window.console.log("makeInputsClickSensitive: " + inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    if (0 < inputs[i].childNodes.length && (inputs[i].childNodes[0].nodeName == "INPUT" || inputs[i].childNodes[0].nodeName == "LABEL")) {
      inputs[i].onclick = senseClick;
    }//if
  }//for
}//senseClick

function toggleBackgroud (e) {
  if (!e) e = window.event;
  let obj = (e.target) ? e.target : e.srcElement;
  if (obj.nodeName == "INPUT" && obj.parentNode.nodeName == "LABEL") {
    //console.log(obj.parentNode.style.borderColor);
    obj.parentNode.style.borderColor = obj.checked ? pictureFrameColor : "transparent";//def0ff
    window.console.log("piture frame colour toggled");
  }//if
}//function toggleBackgroud

function makeDivInputsToggleVisible () {
  let inputs = document.questForm.getElementsByTagName("INPUT");
  window.console.log("makeDivInputsToggleVisible: " + inputs.length);
  for (let input of inputs) {
    if (input.parentNode.nodeName == "LABEL" && input.parentNode.parentNode.nodeName == "DIV") {
      input.addEventListener("change", toggleBackgroud);
    }//if
  }//for
}//function makeDivInputsToggleVisible


//=====================================================================================
//QUESTIONAIRE VISIBILITY =============================================================

function displayOffQuestsElements () {
  let objs,
      i;
  objs = document.getElementsByClassName("question_");
  for (i = 0; i < objs.length; i++)
    objs[i].style.display = "none";
  objs = document.getElementsByClassName("ask-user-box");
  for (i = 0; i < objs.length; i++)
    objs[i].style.display = "none";
  document.getElementById("all-questions").style.display = "block";
}//displayOffQuestsElements

function displayOnAllQuestions (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  let allQuestions = document.getElementsByClassName("question_");
  for (var i = 0; i < allQuestions.length; i++)
    allQuestions[i].style.display = "flex";
}//displayOnAllQuestions

function hideSomeInterviewElements () {
  document.getElementById("restore-fc-progress").style.display = "none";  //zapytanie czy z niego skorzystać
  document.getElementById("restore-ft-progress").style.display = "none";  //zapytanie czy z niego skorzystać
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("fill-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "hidden";
  document.getElementById("quest-nav-buttons").style.visibility = "visible";
  document.getElementById("position-info").style.visibility = "hidden";
}//hideSomeInterviewElements

function unhideAllQuestions () {
  let objs;
  window.console.log("unhideAllQuestions");
  objs = document.getElementsByClassName("question_");
  for (var i = 0; i < objs.length; i++) {
    objs[i].hidden = false;
  }//for
}//unhideAllQuestions


//=====================================================================================
//GETTING STARTUP INFORMATION =========================================================

function getInfoFromParams () {
  let params;
  window.console.log("getInfoFromParams: search.len=" + window.location.search.length);
  parSurveyId = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
  parSurveyId = parSurveyId.substring(parSurveyId.lastIndexOf("/") + 1, parSurveyId.length);
  if (window.location.search.length < 4) {
    parUserId = -1;
  } else {
    params = window.location.search.substring(1, window.location.search.length).split("&");
    for (var i = 0; i < params.length; i++) {
      if (params[i].indexOf("sno=") != -1) {
        parStageNum = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      }//if
      if (params[i].indexOf("uid=") != -1) {
        parUserId = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      }//if
      if (params[i].indexOf("ino=") != -1) {
        parIntvNum = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      }//if
    }//for
    if (parStageNum != -1) {
      parStageNum = parStageNum.trim();
    }//if
    if (parUserId != -1) {
      parUserId = parUserId.trim();
      if (parUserId == ".") {
        parUserId = "";
      }//if
    }//if
    if (parIntvNum != -1) {
      parIntvNum = parIntvNum.trim();
    }//if
  }//else
  window.console.log("parSurveyId=" + parSurveyId + "\nparStageNo=" + parStageNum + "\nparUserId=" + parUserId + "\nparIntvNum=" + parIntvNum );
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
  let xhr,
      elemTab,
      survey,
      survPos = -1,
      gotUser,
      i,
      intvNumType,
      XMLurl;
  window.console.log("getSurveysInfoFromXML");
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "./xml/badanie.xml", false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status != 200) {
    window.console.log("Nie ma pliku badania.xml, status=" + xhr.status);
    window.alert("Nie ma pliku badania.xml, status=" + xhr.status);
  } else {
    elemTab = xhr.responseXML.getElementsByTagName("SURVEY");
    window.console.log("surveys num=" + elemTab.length + ", survey+" + elemTab[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue);
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
      elemTab = survey.getElementsByTagName("STAGES");
      stagesNum = elemTab.length == 0 ? 1 : elemTab[0].childNodes[0].nodeValue;
      if (1 < stagesNum) {
        if (1 <= parStageNum && parStageNum <= stagesNum) {
          stageNum = parStageNum;
        } else {
          stageNum = parStageNum = 1;
        }//else
      } else {
        stagesNum = 1;
        parStageNum = -1;
        stageNum = -1;
      }//else
      elemTab = survey.getElementsByTagName("CLIENT");
      clientName = elemTab.length == 0 ? "CLIENT" : elemTab[0].childNodes[0].nodeValue;
      elemTab = survey.getElementsByTagName("SUBJECT");
      subjectTxt   =  elemTab.length == 0 ? "SUBJECT" : elemTab[0].childNodes[0].nodeValue;
      elemTab = survey.getElementsByTagName("FIRST_NUMBER");
      firstIntvNum = elemTab.length == 0 ? 1 : elemTab[0].childNodes[0].nodeValue;
      elemTab = survey.getElementsByTagName("LAST_NUMBER");
      lastIntvNum = elemTab.length == 0 ? 1000000 : elemTab[0].childNodes[0].nodeValue;
      elemTab = survey.getElementsByTagName("INTV_NUMBER");
      intvNumType = elemTab.length == 0 ? "AUTO HIDDEN" : elemTab[0].childNodes[0].nodeValue;
      intvNumAuto  = intvNumType.indexOf("AUTO") != -1;
      intvNumGiven = intvNumType.indexOf("GIVEN") != -1;
      intvNumTable = intvNumType.indexOf("TABLE") != -1;
      if (intvNumTable) {
        intvNumAuto = false;
        intvNumGiven = false;
      }//if
      if (intvNumAuto) {
        intvNumGiven = false;
      }//if
      if (intvNumAuto || intvNumGiven) {
        stagesNum = 1;
        parStageNum = -1;
        stageNum = -1;
      }//if
      intvNumShow = intvNumType.indexOf("SHOW") != -1;
      intvNumShow = intvNumType.indexOf("HIDE") == -1;
      if (intvNumShow && (intvNumAuto || intvNumTable)) {
        document.getElementById("intv_num-range").style.display = "none";
      }//if
      elemTab = survey.getElementsByTagName("USER_ID");
      window.console.log("suId=" + surveyId + "\nstNum=" + stagesNum + ", stNo=" + stageNum +
                         "\nclient=" + clientName +
                         "\nsubject=" + subjectTxt +
                         "\nfrst=" + firstIntvNum + ", last=" + lastIntvNum +
                         "\nGiven=" + intvNumGiven + ", Auto=" + intvNumAuto + ", Table=" + intvNumTable + ", Show=" + intvNumShow +
                         "\nusers=" + elemTab.length + ", user0=" + elemTab[0].childNodes[0].nodeValue);
      if (parUserId == -1 && (intvNumAuto || intvNumGiven)) { //nie ma użytkownika w parametrach
        if (elemTab.length == 0) {
          gotUser = "empty";
          userId = "YOU";
        } else {
          gotUser = elemTab[0].childNodes[0].nodeValue;
          userId = gotUser.substring(0, gotUser.indexOf("%")).trim();
          if (anonymoususerIds.indexOf(userId) == -1) {
            gotUser = "no anonymoususerId";
            userId = -1;
          }//if
        }//else
        window.console.log(gotUser + "=> userId=" + userId);
      } else {//jeśli parUserId == -1, to tylko wydruk użytkowników, bo i tak kupa
        window.console.log("users:");
        for (i = 0; i < elemTab.length; i++) {//wczytanie użytkowników
          gotUser = elemTab[i].childNodes[0].nodeValue;
          window.console.log(gotUser);
          gotUser = gotUser.substring(0, gotUser.indexOf("%")).trim();
          if (parUserId != -1 && parUserId == gotUser) { //parUserId.search(gotUser) != -1)  // znaleziony użytkownik
            userId = parUserId;
          }//if
        }//for po wszystkich użytkownikach dla danego badania
      }//else
      window.console.log("parUserId=" + parUserId + "=> userId=" + userId);
    }//if
  }//else
}//getSurveysInfoFromXML

function getSurveysInfoFromJson () {
}//getSurveysInfoFromJson


//=====================================================================================
//COOKIES MANAGEMNT ===================================================================

function cookiesConfirmed (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  document.getElementById("cookies-confirm").style.display = "none";
}//cookiesConfirmed

function setCookie (name, value, expiresText) {
  window.console.log("setCookie:" + name + "=" + value + (expiresText == undefined? ckExpiresText : expiresText));
  document.cookie = name + "=" + value + (expiresText == undefined? ckExpiresText : expiresText);
}//setCookie

function setLastCookies () {
  let currDate = new Date(),
      expDate  = new Date(currDate.getTime() + (91*24*60*60*1000));
  window.console.log("setLastCookies");
  ckExpiresText = ";expires=" + expDate.toUTCString();
  setCookie("LastVisit", currDate);
  setCookie("LastSurvey", surveyId);
  setCookie("LastUser", userId);
}//setLastCookies

function saveStartData (specifics) {
  let currDate = new Date(),
      expDate  = new Date(currDate.getTime() + (7*24*60*60*1000));//+7dni
  ckExpiresText = ";expires=" + expDate.toUTCString();
  window.console.log("saveStartData: " + ckExpiresText);
  document.questForm.survey_id.value    = surveyId;
  document.questForm.stage_no.value     = stageNum;
  document.questForm.user_id.value      = userId;
  getDateTime("saveStartData for " + intvNum);
  document.questForm.start_time.value   = currDateTime;//.toLocaleString();
  document.questForm.end_time.value     = "started_";
  document.questForm.duration.value     = 0;
  setCookie("SurveyId", document.questForm.survey_id.value);
  setCookie("StageNo", document.questForm.stage_no.value);
  setCookie("UserId", document.questForm.user_id.value);
  setCookie("IntvNum", document.questForm.intv_num.value);
  setCookie("StartTime", document.questForm.start_time.value);
  setCookie("EndTime", document.questForm.end_time.value);
  setCookie("Duration", document.questForm.duration.value);
  saveVariable("start_time", document.questForm.start_time.value);
  saveVariable("end_time",   document.questForm.end_time.value);
  saveVariable("duration",   document.questForm.duration.value);
  if (specifics != undefined && specifics.length) {
    for (let i = 0; i < specifics.length; i++) {
      setCookie(specifics[i], document.questForm[specifics[i]].value);
      saveVariable(specifics[i],  document.questForm[specifics[i]].value);
    }//for
  }//if
  startDataIsSet = true;
}//saveStartData

function removeCookies () {
  let ckName = "";
  window.console.log("removeCookies");
//window.alert("removeCookies");
  cookiesTab = document.cookie.split(";");
  window.console.log("cookies=[" + cookiesTab + "]\ncookiesTab.length=" + cookiesTab.length);
  for (let i = 0; i < cookiesTab.length; i++) {
    cookiesTab[i] = cookiesTab[i].trim();
    ckName = cookiesTab[i].substr(0, cookiesTab[i].indexOf("="));
    switch (ckName) {
      case "LastVisit":
      case "LastSurvey":
      case "LastUser":
        break;
      default:
        setCookie(ckName, "", "; expires=Thu, 01 Jan 1970 00:00:00 UTC");
        break;
    }//switch
  }//for
  startDataIsSet = false;
}//removeCookies


//=====================================================================================
//TEMPORARY DATA MANAGEMENT ===========================================================

function saveVariable (variable, value, openQest) {
  let xhr;
  if (openQest === undefined) openQest = false;
  window.console.log("saveVariable(" + variable + ", '" + value + "', " + openQest + ")");
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.console.log("saveVar: " + variable + " -> " + this.responseText);
    }//if
  };//function()
  xhr.open("GET", "../php/zapiszTempValue.php?int_no=" + intvNum + "&survey_id=" + surveyId + "&stage_no=" + stageNum + "&user_id=" + userId +
                    "&var=" + variable + "&val=" + value + "&opq=" + openQest, true);
  xhr.send();
}//saveVariable

function tempFileExists (tstIntvNum) {
  let xhr, t = false;
  window.console.log("tempFileExists(" + tstIntvNum + ")");
  if (!phpIsWorking) {
    intvNum = noPhpIntvNum;
    window.console.log("tFE: " + warningPHPisNotWorking + intvNum);
  } else {
    xhr = new window.XMLHttpRequest();
    xhr.open("GET", "../php/tempFileExists.php?int_no=" + tstIntvNum + "&survey_id=" + surveyId + "&stage_no=" + stageNum + "&user_id=" + userId, false);//SYNCHRONICZNIE
    xhr.send();
    if (xhr.status == 200) {
      t = xhr.responseText == tstIntvNum;
    } else {
      window.console.log("tFE: Błąd php, status=" + xhr.status);
    }//else
  }//else
  window.console.log("tFE: " + t);
  return t;
}//tempFileExists


//=====================================================================================
//IDENTIFIER MANAGEMENT ===============================================================

function isIntvNumWaiting (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  let intvNum = -1;
  window.console.log("isIntvNumWaiting(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
  if (!phpIsWorking) {
    intvNum = noPhpIntvNum;
    window.console.log("isINW: " + warningPHPisNotWorking + intvNum);
  } else {
    xhr = new window.XMLHttpRequest();
    if (intvNumAuto || intvNumGiven) {
      xhr.open("GET", "../php/isAutoIntvNumWaiting.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    } else {
      if (stagesNum == 1) { //tstStageNo == -1)
        xhr.open("GET", "../php/isTableIntvNumWaiting.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
      } else {
        xhr.open("GET", "../php/isM_TabIntvNumWaiting.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
      }//else
    }//else
    xhr.send();
    if (xhr.status == 200) {
      intvNum = xhr.responseText;
    } else {
      window.console.error("isINW: " + errorReadingINfile + xhr.status);
    }//else
    if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {
      window.console.error("isINW: " + errorNoPHPorINfile);
      intvNum = -1;
    }//if
  }//else
  window.console.log("isINW: intvNum=" + intvNum);
  return intvNum;
}//isIntvNumWaiting

function isIntvNumStarted (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  let intvNum = -1;
  window.console.log("isIntvNumStarted(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
  if (!phpIsWorking) {
    intvNum = noPhpIntvNum;
    window.console.log("isINS: " + warningPHPisNotWorking + intvNum);
  } else {
    xhr = new window.XMLHttpRequest();
    if (intvNumAuto || intvNumGiven) {
      xhr.open("GET", "../php/isAutoIntvNumStarted.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    } else {
      if (stagesNum == 1) { //tstStageNo == -1)
        xhr.open("GET", "../php/isTableIntvNumStarted.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
      } else {
        xhr.open("GET", "../php/isM_TabIntvNumStarted.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
      }//else
    }//else
    xhr.send();
    if (xhr.status != 200 && xhr.responseText == "ERROR") {
      window.console.error("isINS: " + errorReadingINfile + xhr.status);
    } else {
      intvNum = xhr.responseText;
      if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {
        window.console.error("isINS: " + errorNoPHPorINfile);
        intvNum = -1;
      }//if
    }//else
  }//else
  window.console.log("isINS: intvNum=" + intvNum);
  return intvNum;
}//isIntvNumStarted

function isIntvNumUsable (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  let intvNum = -1;
  window.console.log("isIntvNumUsable(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
  if (!phpIsWorking) {
    intvNum = noPhpIntvNum;
    window.console.log("isINU: " + warningPHPisNotWorking + intvNum);
  } else {
    xhr = new window.XMLHttpRequest();
    if (intvNumAuto) {
      xhr.open("GET", "../php/isAutoIntvNumUsable.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    } else {
      if (intvNumGiven) {
        xhr.open("GET", "../php/isGivenIntvNumUsable.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
      } else {
        if (intvNumTable) {
          if (stagesNum == 1) {//tstStageNo == -1)
            xhr.open("GET", "../php/isTableIntvNumUsable.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
          } else {
            xhr.open("GET", "../php/isM_TabIntvNumUsable.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
          }//else
        }//if
      }//else
    }//else
    xhr.send();
    if (xhr.status == 200) {
      intvNum = xhr.responseText;
    } else {
      window.console.error("isINU: " + errorReadingINfile + xhr.status);
    }//else
    if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {
      window.console.error("isINU: " + errorNoPHPorINfile);
      intvNum = -1;
    }//if
  }//else
  window.console.log("isINU: intvNum=" + intvNum);
  return intvNum;
}//isIntvNumUsable

function useIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  let intvNum = -1;
  window.console.log("useIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
  if (!phpIsWorking) {
    intvNum = noPhpIntvNum;
    window.console.log("useIN: " + warningPHPisNotWorking + intvNum);
  } else {
    xhr = new window.XMLHttpRequest();
    if (intvNumAuto || intvNumGiven) {
      xhr.open("GET", "../php/useAutoIntvNum.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    } else {
      if (stagesNum == 1) {//tstStageNo == -1)
        xhr.open("GET", "../php/useTableIntvNum.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
      } else {
        xhr.open("GET", "../php/useM_TabIntvNum.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
      }//else
    }//else
    xhr.send();
    if (xhr.status == 200) {
      intvNum = xhr.responseText;
    } else {
      window.console.error("useIN: " + errorReadingINfile + xhr.status);
    }//else
    if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {
      window.console.error("useIN: " + errorNoPHPorINfile);
      intvNum = -1;
    }//if
  }//else
  window.console.log("useIN: intvNum=" + intvNum);
  return intvNum;
}//useIntvNum

function getIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  let intvNum = -1;
  window.console.log("getIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
  if (!phpIsWorking) {
    intvNum = noPhpIntvNum;
    window.console.log("getIN: " + warningPHPisNotWorking + intvNum);
  } else {
    xhr = new window.XMLHttpRequest();
    if (intvNumAuto || intvNumGiven) {
      xhr.open("GET", "../php/getAutoIntvNum.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
    } else {
      if (stagesNum == 1) { //tstStageNo == -1)
        xhr.open("GET", "../php/getTableIntvNum.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, false);//SYNCHRONICZNIE
      } else {
        xhr.open("GET", "../php/getM_TabIntvNum.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, false);//SYNCHRONICZNIE
      }//else
    }//else
    xhr.send();
    if (xhr.status == 200) {
      intvNum = xhr.responseText;
    } else {
      window.console.error("getIN: " + errorReadingINfile + xhr.status);
    }//else
    if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {
      window.console.error("getIN: " + errorNoPHPorINfile);
      intvNum = -1;
    }//if
  }//else
  window.console.log("getIN: intvNum=" + intvNum);
  return intvNum;
}//getIntvNum

function assignIntvNum (tstIntvNum) {
  let intvNum = -1;
  window.console.log("assignIntvNum(" + tstIntvNum + "): Auto=" + intvNumAuto + ", Given=" + intvNumGiven + ", Table=" + intvNumTable + ", uId=" + userId + ", tstINum=" + tstIntvNum + ", intvNumShow=" + intvNumShow);
  if (intvNumAuto ||                                        //JEŻELI IDENTYFIKATOR NADAWANY AUTOMATYCZNIE LUB
      intvNumGiven && (tstIntvNum != -1 || !intvNumShow) || // ZOSTAŁ PODANY LUB
      intvNumTable && (tstIntvNum != -1 || !intvNumShow)) { // Z TABELI
    window.console.log("assignIN_if");
    if (tempFileExists(tstIntvNum) && (intvNum = isIntvNumStarted(userId, tstIntvNum, stageNum)) != -1 && restoreFromTempFile(intvNum) ||
        (intvNum = isIntvNumUsable(userId, tstIntvNum, stageNum)) != -1) {//sprawdza tstIntvNum >--> ustawia intvNum
      document.questForm.intv_num.readOnly = true;
    } else {
      intvNum = -1;//pozostałość po sprawdzaniu zakresu
      intvNumShow = false;
    }//else
    window.console.log("assignIN_if: intvNum=" + intvNum);
  } else {//if (intvNumGiven || intvNumTable && tstIntvNum == -1 && intvNumShow) {{//JEŻELI IDENTYFIKATOR NADAWANY JAKO PARAMETR
    window.console.log("assignIN_else");
    if (tstIntvNum == -1) {//nie ma numeru
      intvNumShow = true;//poprosić użytkownika o wpisanie
    } else {
      if ((intvNum = isIntvNumWaiting(userId, tstIntvNum, stageNum)) != -1) {
        document.questForm.intv_num.readOnly = true;
      } else {
        intvNum = -1;
        intvNumShow = true;
      }//else
    }//else
    window.console.log("assignIN_else: intvNum=" + intvNum);
  }//else
  return intvNum;
}//assignIntvNum

function setUpIntvNum (txt) {
  window.console.log("setUpIntvNum(" + txt + ")");
  if ((intvNum = assignIntvNum(parIntvNum)) != -1 || intvNumShow) { //udało się ustalić numer lub ma być wpisany ręcznie
    window.console.log("setUpIN: intvNum=" + intvNum);
    if (intvNum != -1) {//jeśli jest ustalony numer i jest w zakresie
      document.questForm.intv_num.value = intvNum;
    } else {
      document.getElementById("intv-num-info").innerHTML = "";
    }//else
    document.getElementById("next-button").style.visibility = "visible";
    document.getElementById("position-info").style.visibility = "visible";
    window.console.log("setUpIN: intvNumShow=" + intvNumShow);
    currQuest = 0;
    if (!intvNumShow) {
      document.getElementById("log-in-div").style.display = "none";
    }//if
    document.getElementById("quest-progress").value = 1;//currQuest + (intvNumShow? 1 : 0);
    document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
    //questsTab[qsOrdTab[currQuest]][2](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1]);
    questsTab[qsOrdTab[0]][2](questsTab[qsOrdTab[0]][0], questsTab[qsOrdTab[0]][1]);
  } else { //nie można dać sobie rady z numerem ankiety
    document.getElementById("bottom-banner-left").style.visibility = "hidden";
//    document.getElementById("position-info").style.visibility = "hidden";
//    document.getElementById("reload-survey-info").style.display = "block";
//    document.getElementById("reload-survey").focus();
    errorAlert("Błąd: Niepoprawny identyfikator ankiety.", parIntvNum == -1? "Nie został podany." : "Jest błędny lub został już wykorzystany.");
  }//else
}//setUpIntvNum

function setIntvNumComplete (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  let intvNum = -1;
  window.console.log("setIntvNumComplete(" + tstUserId + "," + tstIntvNum + "," + tstStageNo + ")");
  if (!phpIsWorking) {
    intvNum = noPhpIntvNum;
    window.console.log("setINC: " + warningPHPisNotWorking + intvNum);
  } else {
    xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          intvNum = this.responseText;
          window.console.log("setINC: intvNum=" + intvNum);
        }//if
      };//function()
    if (intvNumAuto || intvNumGiven) {
      xhr.open("GET", "../php/setAutoIntvNumComplete.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, true);//ASYNCHRONICZNIE
    } else {
      if (tstStageNo == -1) {
        xhr.open("GET", "../php/setTableIntvNumComplete.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum, true);//ASYNCHRONICZNIE
      } else {
        xhr.open("GET", "../php/setM_TabIntvNumComplete.php?survey_id=" + surveyId + "&user_id=" + tstUserId + "&int_no=" + tstIntvNum + "&stage_no=" + tstStageNo, true);//ASYNCHRONICZNIE
      }//else
    }//else
    xhr.send();
  }//else
}//setIntvNumComplete


//=====================================================================================
//RESTORE DATA - SURVEY DEPENDENT =====================================================

function setFieldValue (fldName, fldValue, fromTempFile=false) {
  let i;
  switch (fldName) {
    case "SurveyId":  document.questForm.survey_id.value  = fldValue; break;
    case "StageNo":   document.questForm.stage_no.value   = fldValue; break;
    case "UserId":    document.questForm.user_id.value    = fldValue; break;
    case "IntvNum":   document.questForm.intv_num.value   = fldValue; break;
    case "StartTime": document.questForm.start_time.value = fldValue; break;
    case "EndTime":   document.questForm.end_time.value   = fldValue; break;
    case "Duration":  document.questForm.duration.value   = fldValue; break;
//-------------------------------------------------------------------------------------
//ZMIANA - POCZĄTEK BLOKU ZMIAN 2/5 Example.tst
    //TEXT/VALUE
    case "nazwa pola z ustaloną wartością - tekstowego lub innego": //ZMIANA
    case "tp1_ord":      //ZMIANA
    case "tp1_name":     //ZMIANA
    case "tp2_ord":      //ZMIANA
    case "tp2_name":     //ZMIANA
      document.questForm[fldName].value = fldValue;
      window.console.log(fldName + "=>" + document.questForm[fldName].value);
      break;

    //RADIO
    case "nazwa pola typu RADIO":    //ZMIANA
    case "tp1_q1":    //ZMIANA
    case "tp1_q2":    //ZMIANA
    case "tp2_q1":    //ZMIANA
    case "tp2_q2":    //ZMIANA
    case "q7":        //ZMIANA
      document.questForm[fldName].value = fldValue;
      for (i = 0; i < document.questForm[fldName].length; i++) {
        if (document.questForm[fldName][i].value == fldValue) {
          document.questForm[fldName][i].checked = true;
        }//if
      }//for
      window.console.log(fldName + "=>" + document.questForm[fldName].value);
      break;

    //RANGE
    case "nazwa pola typu RANGE":    //ZMIANA
    case "tp1_q3":    //ZMIANA
    case "tp2_q3":    //ZMIANA
    case "q8_1":      //ZMIANA
    case "q8_2":      //ZMIANA
    case "q8_3":      //ZMIANA
    case "q8_4":      //ZMIANA
    case "q8_5":      //ZMIANA
    case "q8_6":      //ZMIANA
    case "q8_7":      //ZMIANA
    case "q8_8":      //ZMIANA
    case "q8_9":      //ZMIANA
    case "q8_10":     //ZMIANA
    case "q8_11":     //ZMIANA
    case "q8_12":     //ZMIANA
      document.questForm[fldName].value = fldValue;
      window.console.log(fldName + "=>" + document.questForm[fldName].value);
      break;

    //CHECK
    case "nazwy pól typu CHECK":    //ZMIANA
      document.questForm[fldName].checked = fldValue == "true";
      window.console.log(fldName + "=>" + document.questForm[fldName].checked);
      break;

    //SELECT
    case "nazwa pola typu SELECT":    //ZMIANA
      if (fldValue != "") {
        for (i = 0; i < document.questForm[fldName].length; i++) {
          if (document.questForm[fldName][i].value == fldValue) {
            document.questForm[fldName][i].selected = true;
            window.console.log(fldName + "." + document.questForm[fldName][i].value + "=" + document.questForm[fldName][i].selected);
          }//if
        }//for
      }//if
      break;
//ZMIANA - KONIEC BLOKU ZMIAN 2/5 Example.tst
//-------------------------------------------------------------------------------------
  }//switch
}//setFieldValue

function restoreFromCookies (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  window.console.log("restoreFromCookies()");
  document.questForm.reset();
  document.getElementById("restore-fc-progress").style.display = "block";
  document.getElementById("restore-fc-progress").max = cookiesTab.length;// - 3;
  document.getElementById("restore-fc-progress").value = 0;
  for (let restoredCnt = 0; restoredCnt < cookiesTab.length; restoredCnt++) {
    document.getElementById("restore-fc-progress").value = restoredCnt + 1;
    setFieldValue(cookiesTab[restoredCnt].substr(0, cookiesTab[restoredCnt].indexOf("=")),
                  cookiesTab[restoredCnt].substr(cookiesTab[restoredCnt].indexOf("=")+1));//, cookiesTab[restoredCnt].length));
  }//for od ciasteczek
  //window.alert("wczytane");
  document.getElementById("restore-fc-progress").style.display = "none";
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
  questsTab[qsOrdTab[0]][2](questsTab[qsOrdTab[0]][0], questsTab[qsOrdTab[0]][1]);//prepareInt_num
  //questsTab[qsOrdTab[currQuest]][2](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1]);
}//restoreFromCookies

function restoreFromTempFile (intvNum) {
  let xhr;
  let restoredJson;
  let restoredObj;
  restoredIntv = false;
  window.console.log("restoreFromTempFile(" + intvNum + "):" + surveyId + "_(" + intvNum + ")" + userId);
  if (!phpIsWorking) {
    window.console.log("rFTF: warning PHP is notnworking");
  } else {
    xhr = new window.XMLHttpRequest();
    xhr.open("GET", "./php/restoreFromTempFile.php?int_no=" + intvNum + "&survey_id=" + surveyId + "&stage_no=" + stageNum + "&user_id=" + userId, false);//SYNCHRONICZNIE
    xhr.send();
    if (xhr.status == 200) {
      restoredJson = xhr.responseText;
    } else {
      restoredJson = "";
      window.console.log("rFTF: Błąd odczytu TempFile, status=" + xhr.status);
    }//else
    window.console.log("rJson=" + restoredJson);
    if (restoredJson != "") {
      restoredObj = JSON.parse(restoredJson);
      document.getElementById("restore-ft-progress").style.display = "block";
      document.getElementById("restore-ft-progress").max = Object.keys(restoredObj).length;// - 3;
      document.getElementById("restore-ft-progress").value = 0;
      let restoredCnt = 0;
      for (let fldName in restoredObj) {
        document.getElementById("restore-ft-progress").value = ++restoredCnt;
        setFieldValue(fldName, restoredObj[fldName], true);
      }//for
      //window.alert("wczytane");
      document.getElementById("restore-ft-progress").style.display = "none";
      document.getElementById("ask-restore-intv").style.display = "none";
      //document.getElementById("intv-num-info").innerHTML = intvNum
    }//if
  }//else
  window.console.log("rFTF: " + restoredIntv);
  return restoredIntv;
}//restoreFromTempFile


//=====================================================================================
//QUESTIONNAIRE SETUP ================================================================

function createQuestionOrderTable () {
  window.console.log("createQuestionOrderTable()");
  if (qsOrdTab.length < 2) {
    for (let i = 0; i < questsTab.length; i++) {
      qsOrdTab[i] = i;
    }//for
  }//if
}//function createQuestionOrderTable

function arrangeQsOrdTab () {
  window.console.log("arrangeQsOrdTab() for " + intvNum + ", " + useScenariaTab + ", " + rotateScenario);
  if (useScenariaTab) {
    let scenario = (intvNum - 1) % scenariaTab.length; //WYBÓR WIERSZA W TABELI scenariaTab -- intvNum,//powinno być jak jest dla każdego
    let firstItem = Math.floor((intvNum - 1) / scenariaTab.length) % scenariaTab[scenario].length; //pierwszy w rotacji wybranego wiersza tabeli scenariaTab
    applyOrdQsScenario(scenario, rotateScenario? firstItem : 0);
  } //if
  window.console.log(qsOrdTab);
}//function arrangeQsOrdTab

function applyOrdQsScenario (scenario, firstItem) {
  let scenarioLen = scenariaTab[scenario].length;
  let qsOrdTabLen = qsOrdTab.length;
  let firstQSIndex = 1000;
  let i, j;
  window.console.log("applyOrdQsScenario: (" + scenario + ", " + firstItem + ")");
  for (i = 0; i < scenarioLen && firstQSIndex; i++) {
    for (j = 0; j < qsOrdTabLen && scenariaTab[scenario][i] != qsOrdTab[j]; j++);
    if (j == qsOrdTabLen) {
      firstQSIndex = 0;
      window.console.log("wrong question no");
    }//if
    if (j < firstQSIndex) {
      firstQSIndex = j;
    } //if
  }//for
  if (0 < firstQSIndex) {
    for (i = 0; i < scenarioLen - firstItem; i++) {
      if (firstQSIndex + i < qsOrdTabLen) {
        qsOrdTab[firstQSIndex + i] = scenariaTab[scenario][i + firstItem];
      }//if
    }//for
    for (; i < scenarioLen; i++) {
      if (firstQSIndex + i < qsOrdTabLen) {
        qsOrdTab[firstQSIndex + i] = scenariaTab[scenario][i + firstItem - scenarioLen];
      }//if
    }//for
  } //if
}//function applyOrdQsScenario

function createRotationsTable () {
  window.console.log("createRotationsTable(useRotations=" + useRotations + ")");
  if (useRotations) {
    if (rotatsFromFile) { //wczytanie za pomocą ajaxa pliku tab-delimited csv do tabeli rotatsTab
    } else {
      if (rotatsGenerate) { //wygenerowanie TABELI
        let i = 0;
        for (let j = 1001; j <= 1200; i++, j++) {
          rotatsTab[i] = [j, "957"];
          //    rotatsTab[i][0] = j;
          //    rotatsTab[i][1] = "957";
        }//for
        window.console.log(`i=${i}`);
        for (let j = 2001; j <= 2200; i++, j++) {
          rotatsTab[i] = [j, "318"];
          //    rotatsTab[i][0] = j;
          //    rotatsTab[i][1] = "318";
        }//for
      }//if
    }//else
  }//if
}//createRotationsTable

function findRotation (intvNum) {
  let i = 0;
  let rlen = rotatsTab.length;
  let txt = "";
  window.console.log("findRotation(" + intvNum + ")");
  if (useRotations) {
    for (i = 0; i < rlen && rotatsTab[i][0] != intvNum; i++);
    if (rlen && i == rlen && 0 < intvNum) {
      i = (intvNum - 1) % rlen;
    }//if
    if (i < rlen) {
      for (let j = 1; j <= productsNum; j++) {
        document.questForm["tp" + j + "_ord"].value = j;
        document.questForm["tp" + j + "_name"].value = rotatsTab[i][j];
        txt += rotatsTab[i][j] + ", ";
      }//for
    } else {
      for (let j = 1; j <= productsNum; j++) {
        document.questForm["tp" + j + "_ord"].value = j;
        document.questForm["tp" + j + "_name"].value = "prod_" + j;
        txt += rotatsTab[i][j] + ", ";
      }//for
    }//esle
    window.console.log("rotats: " + txt);
  }//if
  return i < rlen;
}//findRotation

function makeMSQarrLine (arrTab, orgTabLen, arrLine) {
  let arrTabLen = arrTab.length;
  let arrTabKey = (intvNum - 1) % arrTabLen + 1;//intvNum,//powinno być jak jest dla każdego
  let arrTabRow = 0;                               //index wiersza w tabeli rrTab
  let firstItem = Math.floor((intvNum - 1) / arrTabLen) % orgTabLen; //pierwszy w rotacji wybranego wiersza tabeli arrTab
  let i;                                        //WYBÓR WIERSZA w tabeli arrTab
  window.console.log("makeMSQarrLine\n arrTabKey=" + arrTabKey + ", firstItem=" + (firstItem+1) + ":");
  for (i = 0; i < arrTabLen && arrTab[i][0] != arrTabKey; i++);//SZUKAJ WIERSZA WEDŁUG arrTabKey - może być intvNum
  if (i < arrTabLen && arrTab[i][0] == arrTabKey) {             //jeśli odnaleziony
    arrTabRow = i;
  }//if
  for (i = 1; i <= orgTabLen - firstItem; i++) {//ZAPISYWANIE arrLine UWZGLĘDNIAJĄC OBRACANIE WYBRANEGO WIERSZA
    arrLine[i] = arrTab[arrTabRow][i + firstItem];
  }//for
  for (; i <= orgTabLen; i++) {//OBRÓĆ DLA WYBRANEGO WIERSZA autokręcioła jeżeli ma być
    arrLine[i] = arrTab[arrTabRow][i + firstItem - orgTabLen];
  }//for
  window.console.log(arrLine);
}//makeMSQarrLine

function arrangeMSQitems (fld, arrTab, orgTab, arrLine) {
  let orgTabLen = orgTab.length;
  window.console.log("arrangeMSQitems(" + fld + ")");
  makeMSQarrLine(arrTab, orgTabLen, arrLine);
  for (let i = 0; i < orgTabLen; i++) {
    document.getElementById(fld + "item" + orgTab[i][0]).innerHTML = orgTab[arrLine[i + 1] - 1][2];
  }//for
}//arrangeMSQitems

function rearrangeMSQdata__ (fld_, orgTab, arrLine) {
  let orgTabLen = orgTab.length;
  let fldName;
  let i, j;
  window.console.log("rearrangeMSQdata__(" + fld_ +")");
  for (i = 0; i < orgTabLen; i++) {    //PRZEPISANIE danych z formularza do tabeli orgTab
    fldName = fld_ + orgTab[i][0];
    if (document.questForm[fldName].value != undefined) {
      orgTab[arrLine[i + 1] - 1][1] = document.questForm[fldName].value;
    } else {
      for (j = 0; j < document.questForm[fldName].length; j++) {
        if (document.questForm[fldName][j].checked) {
          orgTab[arrLine[i + 1] - 1][1] = j;
        }//if
      }//for
    }//else
  }//for
  for (i = 0; i < orgTabLen; i++) {    //PRZEPISANIE danych z orgTab do formularza
    document.questForm[fld_ + orgTab[i][0]].value = orgTab[i][1];
    //fldName = fld_ + orgTab[i][0];
    //for (j = 0; j < document.questForm[fldName].length; j++) {
    //  document.questForm[fldName][j].checked = j == orgTab[i][1];
    //}//for
  }//for
}//rearrangeMSQdata__

function rearrangeMSQdata (fld_, arrTab, orgTab, arrLine) {
  window.console.log("rearrangeMSQdata(" + fld_ +")");
  makeMSQarrLine(arrTab, orgTab.length, arrLine);
  rearrangeMSQdata__(fld_, orgTab, arrLine);
  window.console.log(orgTab);
}//rearrangeMSQdata

function rearrangedMSQindex (find, arrLine, orgTabLen) { //rI_arrLine, orgTabLen = rI_orgTab.length;
  let i;
  for (i = 1; i <= orgTabLen && arrLine[i] != find; i++);
  return i;
}//rearrangedMSQindex

function arrangeQuestions () {
  window.console.log("arrangeQuestions: ");
//-------------------------------------------------------------------------------------
//ZMIANA - POCZĄTEK BLOKU ZMIAN 3/5 Example.tst
  arrangeMSQitems("q8", q8_arrTab, q8_orgTab, q8_arrLine);
//ZMIANA - KONIEC BLOKU ZMIAN 3/5 Example.tst
//-------------------------------------------------------------------------------------
  arrangeQsOrdTab();
  findRotation();
}//arrangeQuestions


//=====================================================================================
//QUESTIONS SWITCHING =================================================================

function makePause (qqq) {
}//makePause

function checkIntvIdEnter (e) {
  if (!e) e = window.event;
  if ((e.keyCode? e.keyCode : e.which) == 13)
    gotoNextQuestion();
}//checkIntvIdEnter

function gotoNextQuestion (e) {//called from index.html
  if (e != undefined) {
    e.stopPropagation();
  }//if
  window.console.log("gotoNQ::" + currQuest + "::");//->" + questsTab[qsOrdTab[currQuest]][0] + ":" + questsTab[qsOrdTab[currQuest]][1]);
  secondLength = standardSecondLength;
  if (questsTab[qsOrdTab[currQuest]][3](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1])) {//funkcja sprawdzająca przeszła
    if (currQuest < qsOrdTab.length - 1) {//jeśli nie jest to ostanie pytanie
      //document.getElementById(questsTab[qsOrdTab[currQuest]][0]).style.display = "none";
      currQuest++;
      questsTab[qsOrdTab[currQuest]][2](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1]);
      //document.getElementById(questsTab[qsOrdTab[currQuest]][0]).style.display = "flex";
      document.getElementById("quest-progress").value = currQuest + 1;//(intvNumShow? 1 : 0);
      document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
      if (document.getElementById(questsTab[qsOrdTab[currQuest]][0]).hidden) {
        gotoNextQuestion();
      } else {
        if (document.getElementById(questsTab[qsOrdTab[currQuest]][0]).classList.contains("pause_")) {
          makePause(questsTab[qsOrdTab[currQuest]][0]);
        }//if
      }//else
    } else {
      //document.getElementById(questsTab[qsOrdTab[currQuest]][0]).style.display = "none";
      document.getElementById("prev-button").style.visibility = "hidden";
      document.getElementById("next-button").style.visibility = "hidden";
      document.getElementById("position-info").style.visibility = "hidden";
      submitFormData();
    }//else
  }//if
}//gotoNextQuestion

function gotoPrevQuestion (e) {//called from index.html
  if (e != undefined) {
    e.stopPropagation();
  }//if
  window.console.log("gotoPrevQuestion: " + currQuest + "->" + questsTab[qsOrdTab[currQuest]][0] + ":" + questsTab[qsOrdTab[currQuest]][1]);
  secondLength = 0;
  if (1 < currQuest) {
    document.getElementById(questsTab[qsOrdTab[currQuest]][0]).style.display = "none";
    currQuest--;
    questsTab[qsOrdTab[currQuest]][2](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1]);
    //document.getElementById(questsTab[qsOrdTab[currQuest]][0]).style.display = "flex";
    document.getElementById("quest-progress").value = currQuest + 1;//(intvNumShow? 1 : 0);
    document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
    if (document.getElementById(questsTab[qsOrdTab[currQuest]][0]).hidden) {
      gotoPrevQuestion();
    }//if
  } else {
    window.alert("To jest pierwsze pytanie, niczego wcześniej nie ma.");
  }//else
}//gotoPrevQuestion

function gotoFirstEmptyQuestion () {
  window.console.log("gotoFE::" + currQuest + "::");//->" + questsTab[qsOrdTab[currQuest]][0] + ":" + questsTab[qsOrdTab[currQuest]][1]);
  if (questsTab[qsOrdTab[currQuest]][3](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1])) {//funkcja sprawdzająca przeszła
    if (currQuest < qsOrdTab.length - 1) {//jeśli nie jest to ostanie pytanie
      currQuest++;
      questsTab[qsOrdTab[currQuest]][2](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1]);
      document.getElementById("quest-progress").value = currQuest + 1;//(intvNumShow? 1 : 0);
      document.getElementById("question-no").innerHTML = document.getElementById("quest-progress").value;
      gotoFirstEmptyQuestion();
    }//if
  }//if
}//gotoFirstEmptyQuestion


//=====================================================================================
//QUESTIONS PREPARATION AND VERIFICATION ==============================================

function setFillInfo (qId, success) {
  let objs = document.getElementById(qId).getElementsByClassName("fill-info");
  for (var i = 0; i < objs.length; i++) {
    objs[i].style.color = success == undefined? successInitColor : success? successTrueColor : successFalseColor;
  }//for
}//setFillInfo

function prepareInt_num (qId, fldName) {
  window.console.log("pre(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "flex";
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "visible";
  document.getElementById("next-button").innerHTML = "Rozpoczęcie wywiadu";//Dalej, Kolejne pytanie;
  if (document.getElementById(qId).readOnly) {
    document.getElementById("next-button").focus();
  } else {
    document.getElementById(qId).focus();//autofocus = true;
  }//else
  return true;
}//prepareInt_num

function intvNumIsInRange (tstIntvNum, withRotations, ...ranges) {
  window.console.log("intvNumIsInRange(" + tstIntvNum + "," + withRotations + "," + ranges.length);
  let isOk = false;
  let i;
  if (withRotations == undefined || withRotations) {
    let rlen = rotatsTab.length;
    for (i = 0; i < rlen && rotatsTab[i][0] != tstIntvNum; i++);
    isOk = i < rlen;
    window.console.log("iNiR rotat: " + isOk);
  } else {
    if (ranges.length) {
      if (ranges.length == 1 && Array.isArray(ranges[0])) {
        for (i = 0; !isOk && i < ranges[0].length; i++) {
          if (ranges[0][i++] <= tstIntvNum) {
            isOk = i == ranges[0].length || tstIntvNum <= ranges[0][i];
          }//if
        }//for
        window.console.log("iNiR array: " + isOk);
      } else {
        for (i = 0; !isOk && i < ranges.length; i++) {
          if (ranges[i++] <= tstIntvNum) {
            isOk = i == ranges.length || tstIntvNum <= ranges[i];
          }//if
        }//for
        window.console.log("iNiR list: " + isOk);
      }//else
    } else {
      isOk = 1 <= tstIntvNum && tstIntvNum <= 110 || 1001 <= tstIntvNum && tstIntvNum <= 1110;
      window.console.log("iNiR explic: " + isOk);
    }//else
  }//else
  return isOk;
}//function intvNumIsInRange

function verifyInt_num (qId, fldName) {
  let field = document.questForm[fldName];
  let isOk = true;
  let tstIntvNum;
  window.console.log("verInt_num(" + qId + ":" + fldName + ")\nino=" + field.value + ", ronly=" + field.readOnly);
  //window.console.log("useIN(" + intvNumAuto + "," + userId + "," + field.value + "," + stageNum + ")");
  if (field.readOnly) {
    isOk = restoredIntv || (intvNum = useIntvNum(userId, field.value, stageNum)) != -1;
  } else {
    tstIntvNum = decodeURI(field.value);
    window.console.log("tstIntvNum=" + tstIntvNum);
    field.value = tstIntvNum;
    //tstIntvNum = parseInt(field.value);
    //window.console.log(tstIntvNum);
    if (tstIntvNum && intvNumIsInRange(tstIntvNum)) {
      if (intvNumGiven) {
        if ((intvNum = useIntvNum(userId, tstIntvNum, stageNum)) == -1) {
          if ((intvNum = isIntvNumStarted(userId, tstIntvNum, stageNum)) != -1 &&
              (!tempFileExists(tstIntvNum) ||
               !window.confirm("Ankieta o tym identyfikatorze została już rozpoczęta i jakieś jej dane zachowane są na serwerze.\n" +
                               "Czy chcesz kontynować tę ankietę po wczytaniu danych?"))) {
            intvNum = -1;
          }//if
        }//if
        isOk = intvNum != -1;
      } else {
        intvNum = getIntvNum(userId, tstIntvNum, stageNum);
      }//else
      if (intvNum == -1) {//udało się ustalić numer ankiety w zdanym zakresie
        isOk = false;
      }//if
    } else {
      isOk = false;
    }//else
  }//if
//  window.alert("isOk=" + isOk + ", restoredIntv=" + restoredIntv);
  if (isOk) {
    document.getElementById("intv-num-info").innerHTML = intvNum;
    if (stageNum) {
      document.getElementById("test-prod-info").innerHTML = stageNum;
    }//if
    arrangeQuestions();
    if (/*!restoredIntv &&*/ tempFileExists(intvNum)) {
      restoreFromTempFile(intvNum);
    }//if
    saveStartData([]);//["tp1_ord", "tp1_name", "tp2_ord", "tp1_name"]
    document.getElementById(qId).style.display = "none";
    document.getElementById("prev-button").style.visibility = "visible";
    document.getElementById("next-button").innerHTML = "Kolejne pytanie";
    if (restoredIntv) {
      currQuest++;
      secondLength = 0;
      gotoFirstEmptyQuestion();
      secondLength = standardSecondLength;
      if (1 < currQuest) {//if (2 < currQuest) {
        currQuest--;
      }//if
    }//if
  } else {
    field.value = "";//.intv_num.value = "";
    document.getElementById("quest-intv_num-error").style.display = "inline";//visibility = "visible";
  }//else
  //window.alert("restoredIntv=" + restoredIntv + ", currQuest=" + currQuest);
  window.console.log("isOk=" + isOk + ", restoredIntv=" + restoredIntv + ", currQuest=" + currQuest);
  return isOk;
}//verifyInt_num

function prepare__ (qId, fldName) {
  window.console.log("prepare__(" + qId + ":" + fldName + ")");
  if (!document.getElementById(qId).hidden) {
    document.getElementById(qId).style.display = "flex";
    setFillInfo (qId);
  }//if
  return true;
}//prepare__

function verify__ (qId, fldName) {
  window.console.log("verify__(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "none";
  return true;
}//verify__

function verifyNumber (qId, fldName, ...ranges) {
  window.console.log("verNum(" + qId + ":" + fldName + ")");
  let field = document.questForm[fldName];
  let isOk = false;
  let number = parseInt(field.value);
  let i;
  if (number) {
    if (ranges.length) {
      if (ranges.length == 1 && Array.isArray(ranges[0])) {
        ranges = ranges[0];
      }//if
      window.console.log("verN array: " + ranges);
      for (i = 0; !isOk && i < ranges.length; i++) {
        if (ranges[i++] <= number) {
          isOk = i == ranges.length || number <= ranges[i];
        }//if
      }//for
      window.console.log("verN list: " + isOk);
    } else {
      isOk = true;
    }//else
  }//if
  if (isOk) {
    saveVariable(fldName, field.value);
    setCookie(fldName, field.value);
    document.getElementById(qId).style.display = "none";
  } else {
    field.value = "";
  }//else
  setFillInfo (qId, isOk);
  window.console.log(isOk);
  return isOk;
}//verifyNumber

function verifyQuestSingle (qId, fldName) {
  let field = document.questForm[fldName];
  let isOk = false;
  let i;
  window.console.log("verQS(" + qId + ":" + fldName + ")='" + field.value + "'");
  //window.alert(qId);
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    for (i = 0; i < field.length && !field[i].checked; i++);
    isOk = i < field.length && field[i].checked;
    if (isOk) {   //if (field.value != "" && field.value !== undefined) {
      field.value = field[i].value;
    }//if
  }//else
  if (isOk) {
    saveVariable(fldName, field.value);
    setCookie(fldName, field.value);
    window.console.log("=>'" + field.value + "'");
    document.getElementById(qId).style.display = "none";
  }//if
  setFillInfo (qId, isOk);
  return isOk;
}//verifyQuestSingle

function verifyQuestSingleN (qId, fldName, length) {
  let isOk = true;
  let field;
  let i, j;
  window.console.log("verQSN(" + qId + ":" + fldName + ":" + length + ")");
  fldName += "_";
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    for (j = 1; j <= length; j++) {
      field = document.questForm[fldName + j];
      for (i = 0; i < field.length && !field[i].checked; i++);
      if (i < field.length && field[i].checked) {     //if (field.value != "" && field.value !== undefined) {
        field.value = field[i].value;
      } else {
        isOk = false;
      }//else
    }//for
  }//else
  if (isOk) {
    for (j = 1; j <= length; j++) {
      field = document.questForm[fldName + j];
      saveVariable(fldName + j, field.value);
      setCookie(fldName + j, field.value);
      window.console.log("[" + j + "]=>'" + field.value + "'");
    }//for
    document.getElementById(qId).style.display = "none";
  }//if
  setFillInfo (qId, isOk);
  return isOk;
}//verifyQuestSingleN

function verifyQuestRange (qId, fldName) {
  let field = document.questForm[fldName];
  window.console.log("verQS(" + qId + ":" + fldName + ")='" + field.value + "'");
  //window.alert(qId);
  if (!document.getElementById(qId).hidden) {
    saveVariable(fldName, field.value);
    setCookie(fldName, field.value);
    window.console.log("=>'" + field.value + "'");
    setFillInfo (qId, true);
    document.getElementById(qId).style.display = "none";
  }//if isOk
  return true;
}//verifyQuestRange

function verifyQuestRangeN (qId, fldName, length) {
  let field;
  let j;
  window.console.log("verQSN(" + qId + ":" + fldName + ":" + length + ")");
  fldName += "_";
  if (!document.getElementById(qId).hidden) {
    for (j = 1; j <= length; j++) {
      field = document.questForm[fldName + j];
      saveVariable(fldName + j, field.value);
      setCookie(fldName + j, field.value);
      window.console.log("[" + j + "]=>'" + field.value + "'");
    }//for
    setFillInfo (qId, true);
    document.getElementById(qId).style.display = "none";
  }//if
  return true;
}//verifyQuestRangeN

function verifyQuestOpen (qId, fldName) {
  let field = document.questForm[fldName];
  let isOk = false;
  window.console.log("verQO(" + qId + ":" + fldName + ")='" + field.value + "'");
//window.alert(qId);
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    isOk = field.value != "" && field.value !== undefined;
  }//else
  if (isOk) {
    saveVariable(fldName, field.value, true);
    setCookie(fldName, field.value);
    document.getElementById(qId).style.display = "none";
  }//if
  setFillInfo (qId, isOk);
  return isOk;
}//verifyQuestOpen

function verifyQuestMultiN (qId, fldName, length) {
  let isOk = false;
  let i;
  window.console.log("verQMN(" + qId + ":" + fldName + ":" + length + ")");
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    for (i = 1; i <= length; i++) {
      if (document.questForm[fldName + "_" + i].checked) {
        isOk = true;
      }//if
    }//for
  }//else
  if (isOk) {
    for (i = 1; i <= length; i++) {
      if (document.questForm[fldName + "_" + i].checked) {
        saveVariable(fldName + "_" + i, "true");
        setCookie(fldName + "_" + i, "true");
      } else {
        saveVariable(fldName + "_" + i, "false");
        setCookie(fldName + "_" + i, "false");
      }//else
    }//for
    document.getElementById(qId).style.display = "none";
  }//if
  setFillInfo (qId, isOk);
//window.alert(isOk);
  return isOk;
}//verifyQuestMultiN

function verifyQuestMultiNoth (qId, fldName, length, othNo) {
  let isOk = false;
  let i;
  window.console.log("verQMNo(" + qId + ":" + fldName + ":" + length + ", " + othNo + ")");
//window.alert(qId);
  if (othNo === undefined) {
    othNo = length;
  }//if
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    document.questForm[fldName + "_" + othNo].checked = document.questForm[fldName + "t" + othNo].value != "" &&
                                                        document.questForm[fldName + "t" + othNo].value !== undefined;
    window.console.log("t='" + document.questForm[fldName + "t" + othNo].value + "'");
    for (i = 1; !isOk && i <= length; i++) {
      if (document.questForm[fldName + "_" + i].checked) {
        isOk = true;
      }//if
    }//for
  }//else
  if (isOk) {
    for (i = 1; i <= length; i++) {
      if (document.questForm[fldName + "_" + i].checked) {
        saveVariable(fldName + "_" + i, "true");
        setCookie(fldName + "_" + i, "true");
      } else {
        saveVariable(fldName + "_" + i, "false");
        setCookie(fldName + "_" + i, "false");
      }//else
    }//for
    if (document.questForm[fldName + "_" + othNo].checked) {
      saveVariable(fldName + "t" + othNo, document.questForm[fldName + "t" + othNo].value, true);
      setCookie(fldName + "t" + othNo, document.questForm[fldName + "t" + othNo].value);
    }//if
    document.getElementById(qId).style.display = "none";
  }//if
  setFillInfo (qId, isOk);
  //window.alert(isOk);
  return isOk;
}//verifyQuestMultiNoth

function verifyQuestMultiN_O (qId, fldName, length) {
  let isOk = false;
  let i;
  window.console.log("verQMN(" + qId + ":" + fldName + ":" + length + ")");
//window.alert(qId);
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    for (i = 1; i <= length; i++) {
      if (document.questForm[fldName + "_" + i].checked) {
        isOk = true;
      }//if
    }//for
  }//else
  if (isOk) {
    for (i = 1; i < length; i++) {
      if (document.questForm[fldName + "_" + i].checked) {
        document.questForm[fldName + "_" + length].checked = false;
      }//if
    }//for
    for (i = 1; i <= length; i++) {
      if (document.questForm[fldName + "_" + i].checked) {
        saveVariable(fldName + "_" + i, "true");
        setCookie(fldName + "_" + i, "true");
      } else {
        saveVariable(fldName + "_" + i, "false");
        setCookie(fldName + "_" + i, "false");
      }//else
    }//for
    document.getElementById(qId).style.display = "none";
  }//if
  setFillInfo (qId, isOk);
//window.alert(isOk);
  return isOk;
}//verifyQuestMultiN_O

//WAIT-CLOCK
var timeLength = 0.5*60;
var standardSecondLength = 100;         //długość sekundy w milisekundach
var secondLength = standardSecondLength; //długość sekundy w milisekundach
var timeLeft = timeLength;
var textClockTimer = 0;
function textClockClik (clockObj) {
  let minLeft;
  let secLeft;
  window.console.log(".");
  if (--timeLeft) {
    minLeft = Math.floor(timeLeft / 60);
    secLeft = timeLeft % 60;
    if (minLeft) {
      if (4 < minLeft) {
        clockObj.innerHTML = "Pozostało jeszcze " + minLeft + " minut";
      } else {
        if (1 < minLeft) {
          clockObj.innerHTML = "Pozostały jeszcze " + minLeft + " minuty";
        } else {
          clockObj.innerHTML = "Pozostała jeszcze 1 minuta";
        }//else
      }//else
    } else {
      if (secLeft) {
        if (4 < secLeft) {
          clockObj.innerHTML = "Pozostało jeszcze ";
        } else {
          if (1 < secLeft) {
            clockObj.innerHTML = "Pozostały jeszcze ";
          } else {
            clockObj.innerHTML = "Pozostała jeszcze ";
          }//else
        }//else
      }//if
    }//else
    if (secLeft) {
      if (minLeft) {
        clockObj.innerHTML += " i ";
      }//if
      if (4 < secLeft) {
        clockObj.innerHTML += secLeft + " sekund.";
      } else {
        if (1 < secLeft) {
          clockObj.innerHTML += secLeft + " sekundy.";
        } else {
          clockObj.innerHTML += "1 sekunda.";
        }//else
      }//else
    } else {
      clockObj.innerHTML += ".";
    }//else
  } else {
    window.clearInterval(textClockTimer);
    textClockTimer = 0;
  }//else
}//textClockClik

function drawFace (clockCanvasCtx, clockCanvasRadius) {
  let ang;
  let num;
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
  let now = new Date();
  let hour = now.getHours()%12;  //godzina 0-12
  let minute = now.getMinutes();
  let second = now.getSeconds();
  let grad;
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
  window.console.log("prepareWaitTime(" + qId + ":" + fldName + ")");
  let textClockObj;
  let waitClockCanvas = document.getElementById(fldName + "-clockC"),
      waitClockCanvasCtx,     //kontekstu
      waitClockCanvasRadius,  //promień cyferblatu
      drawClockTimer;
  if (0 < secondLength) {
    secondLength = standardSecondLength;//długość sekundy w milisekundach
  }//if
  timeLeft = timeLength;
  document.getElementById(qId).style.display = "flex";
  document.getElementById(fldName + "-90").style.display = "block";
  document.getElementById(fldName + "-seconds").innerHTML = timeLeft;
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
  if (0 < secondLength) {
    textClockTimer = window.setInterval(textClockClik, secondLength, textClockObj);//1000);

    waitClockCanvasCtx = waitClockCanvas.getContext("2d");        //utworzenie kontekstu
    waitClockCanvasRadius = waitClockCanvas.height / 2;           //promień cyferblatu
    waitClockCanvasCtx.translate(waitClockCanvas.width / 2, waitClockCanvas.height / 2);//ustawienia pozycji (0,0) rysowania
    drawClock(waitClockCanvasCtx, waitClockCanvasRadius);
    window.console.log("secondLength=" + secondLength);
    drawClockTimer = window.setInterval(drawClock, 1000, waitClockCanvasCtx, waitClockCanvasRadius);

    //waitClockCanvas.ondblclick = function(){timeLeft = 1;};
    window.setTimeout(postPrepareWaitPage, timeLeft*secondLength, qId, fldName, drawClockTimer);//1000, qId);
  } else {
    postPrepareWaitPage(qId, fldName, 0);
  }//else
}//prepareWaitPage

function postPrepareWaitPage (qId, fldName, drawClockTimer) {
  window.console.log("postPrepareWaitPage(" + qId + ":" + fldName + ":" + drawClockTimer + ")");
  let waitClockCanvas = document.getElementById(fldName + "-clockC");
  let waitClockCanvasCtx = waitClockCanvas.getContext("2d");        //utworzenie kontekstu
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
  window.console.log("verify__(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "none";
  document.getElementById("prev-button").style.visibility = "visible";
  document.getElementById("next-button").style.visibility = "visible";
  return true;
}//verifyWaitPage


//-------------------------------------------------------------------------------------
//ZMIANA - POCZĄTEK BLOKU ZMIAN 4/5 Example.tst

function loadQuestsElements () {
  let objs;
  let i;
  window.console.log("loadQuestsElements");
//"quest-intv_num",   "intv_num",
//"quest-intro0",     "intro0",
//"quest-tp1_intro",  "tp1",
//"quest-tp1_q1",     "tp1_q1",
//"quest-tp1_q2",     "tp1_q2",
//"quest-tp1_q3",     "tp1_q3",
//"quest-tp1_wait",   "tp1_wait",
//"quest-tp2_intro",  "tp2",
//"quest-tp2_q1",     "tp2_q1",
//"quest-tp2_q2",     "tp2_q2",
//"quest-tp2_q3",     "tp2_q3",
//"quest-tp2_after",  "tp2",
//"quest-q7",         "q7",
//"quest-q8",         "q8",
}//function loadQuestsElements


//quest-intv_num
//function prepareInt_num () {}
//function verifyInt_num () {}

//"quest-intro0",     "intro0",
function prepareQuest_intro0 (qId, fldName) {
  window.console.log("pre(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "flex";
  document.getElementById("prev-button").style.visibility = "hidden";
  document.getElementById("next-button").style.visibility = "visible";
  document.getElementById("next-button").innerHTML = "Dalej";//Kolejne pytanie";
  return true;
}//function prepareQuest_intro0
function verifyQuest_intro0 (qId, fldName) {
  window.console.log("verify__(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "none";
  document.getElementById("prev-button").style.visibility = "visible";
  return true;
}//function verifyQuest_intro0

//"quest-tp1_intro",  "tp1",
function prepareQuest_tpN_intro (qId, fldName) {
  window.console.log("pre(" + qId + ":" + fldName + ")");
  document.getElementById("prev-button").style.visibility = "visible";
  document.getElementById(qId).style.display = "flex";
  document.getElementById("test-prod-info").innerHTML = document.questForm[fldName + "_name"].value;
  return true;
}//prepareQuest_tpN_intro
// verify__],

//"quest-tp1_q1",     "tp1_q1",
//prepare__,
//verifyQuestSingle],

//"quest-tp1_q2",     "tp1_q2",
//prepare__,
//verifyQuestSingle],

//"quest-tp1_q3",     "tp1_q3",
//prepare__,
//verifyQuestRange],

//"quest-tp1_wait",   "tp1_wait",
//prepareWaitPage,
//verifyWaitPage],

//"quest-tp2_intro",  "tp2",
//prepareQuest_tpN_intro,
//verify__],

//"quest-tp2_q1",     "tp2_q1",
//prepare__,
//verifyQuestSingle],

//"quest-tp2_q2",     "tp2_q2",
//prepare__,
//verifyQuestSingle],

//"quest-tp2_q3",     "tp2_q3",
//prepare__,
//verifyQuestRange],

//"quest-tp2_after",  "tp2",
//prepare__,
//verify__],

//"quest-q7",         "q7",
function prepareQuest_q7 (qId, fldName) {
  document.getElementById("tp1_q7_name").innerHTML = document.questForm.tp1_name.value;
  document.getElementById("tp2_q7_name").innerHTML = document.questForm.tp2_name.value;
  return prepare__(qId, fldName);
}//prepareQuest_q7
//verifyQuestSingle],

//"quest-q8",         "q8",
function prepareQuest_q8 (qId, fldName) {
  document.getElementById("tp1_q8_name").innerHTML = document.questForm.tp1_name.value;
  document.getElementById("tp2_q8_name").innerHTML = document.questForm.tp2_name.value;
  return prepare__(qId, fldName);
}//prepareQuest_q8
function verifyQuest_q8 (qId, fldName) {
  return verifyQuestRangeN (qId, fldName, 12);
}//verifyQuest_q8

//ZMIANA - KONIEC BLOKU ZMIAN 4/5 Example.tst
//-------------------------------------------------------------------------------------


//=====================================================================================
//SAVING QUESTIONAIRE DATA ============================================================

function durationSec (startStr, endStr) {//2017-04-28 23:36:11
  let startDate = new Date(startStr.substr(0, 4), startStr.substr(5, 2)-1, startStr.substr(8, 2),
                           startStr.substr(11, 2), startStr.substr(14, 2), startStr.substr(17, 2));
  let endDate   = new Date(endStr.substr(0, 4), endStr.substr(5, 2)-1, endStr.substr(8, 2),
                           endStr.substr(11, 2), endStr.substr(14, 2), endStr.substr(17, 2));
  return (endDate.getTime() - startDate.getTime()) / 1000;
}//durationSec

var savingInterval = 0;
function submitFormData () {
  let dd = new Date();
  window.console.log("submitFormData:");
  document.body.style.cursor = "progress";

  window.onbeforeunload = function() {return "jeszcze zapisuję";};
  window.console.log("onbeforeunload-ON");

  //respondentOk = document.questForm.r13[0].checked || document.questForm.r13[1].checked;  //ZMIANA

//-------------------------------------------------------------------------------------
//ZMIANA - POCZĄTEK BLOKU ZMIAN 5/5 Example.tst
  rearrangeMSQdata("q8", q8_arrTab, q8_orgTab, q8_arrLine);
//ZMIANA - KONIEC BLOKU ZMIAN 5/5 Example.tst
//-------------------------------------------------------------------------------------

  window.console.log("po rearrage");

  document.getElementById("finish-quest-info").style.display = "block";

  document.getElementById("data-submit-info").style.visibility = "hidden";
  document.getElementById("data-saved-next").style.visibility = "hidden";
  document.getElementById("press-text1").style.display = "none";
  document.getElementById("data-saved").style.visibility = "hidden";
  document.getElementById("data-removing-info").style.display = "none";//visibility = "hidden";
  document.getElementById("cookies-removing-info").style.display = "none";//visibility = "hidden";
  document.getElementById("all-done-end").style.visibility = "hidden";
//  document.getElementById("all-done-next").style.visibility = "hidden";
  getDateTime("submitFormData for " + intvNum);
  document.questForm.end_time.value = currDateTime;//.toLocaleString();
  //document.questForm.duration.value = (Date.parse(document.questForm.end_time.value) - Date.parse(document.questForm.start_time.value)) / 1000;
  document.questForm.duration.value = durationSec(document.questForm.start_time.value, document.questForm.end_time.value);
  document.getElementById("data-submit-info").style.visibility = "visible";
//window.alert("submitFormData:submit");

  window.console.log("questForm.submit");
  document.questForm.submit();

  document.getElementById("data-saving-progess").innerHTML = ".";
  savingInterval = window.setInterval(function(){document.getElementById("data-saving-progess").innerHTML += ".";}, 100);
//  document.getElementById("press-text1").style.display = "block";
//  document.getElementById("data-saved-next").style.visibility = "visible";
//  document.getElementById("data-saved-next").focus();
  window.setTimeout(cleanData, 3000);

  setIntvNumComplete(userId, intvNum, stageNum);

  return false;
}//submitFormData

function cleanData (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  window.console.log("cleanData:");
//  document.getElementById("data-saved-next").style.visibility = "hidden";
//  document.getElementById("press-text1").style.visibility = "hidden";
  if (savingInterval != 0) {
    window.clearInterval(savingInterval);
    savingInterval = 0;
  }//if
  document.getElementById("data-saved").style.visibility = "visible";

//  document.getElementById("data-removing-info").style.display = "block";//visibility = "visible";
//window.alert("cleanData::submitFormData:reset");

  window.console.log("questForm.reset");
  document.questForm.reset();

//  document.getElementById("cookies-removing-info").style.display = "block";//.visibility = "visible";
//window.alert("cleanData::submitFormData:removeCookies");

  //setCookie("LastVisit", Date());
  //setCookie("LastSurvey", surveyId);
  //setCookie("LastUser", userId);
  removeCookies();
  setLastCookies();

  document.body.style.cursor = "auto";
  window.setTimeout(endInterview, 1000);
//  document.getElementById("all-done-end").style.visibility = "visible";
//  document.getElementById("all-done-next").style.visibility = "visible";
//  document.getElementById("all-done-end").focus();
}//cleanData


//=====================================================================================
//INTERVIEW SWITCHING==================================================================

function endInterview (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  //goToBadania();
  window.onbeforeunload = null;
  window.console.log("onbeforeunload-OFF");

  let txt = window.location.href;
  txt = txt.substring(0, txt.lastIndexOf("/") + 1);
  if (intvNumGiven && intvNumShow) {
    txt += "?uid=" + userId;
    //txt += "next.php?user_id=" + userId + "&int_no=" + intvNum;//"index.html";
  } else {//intvNumTable || intvNumGiven && !intvNumShow)
    if (respondentOk) {
      txt += "../thx.html";// + "?sid=" + surveyId;//"index.html";
    } else {
      txt += "../thx_.html";// + "?sid=" + surveyId;//"index.html";
    }//else
  }//else
  window.location.replace(txt);
//  window.location.replace("http://badania.azetkaankiety.pl");
//  window.location.replace("http://www.azetkaankiety.pl");
//  window.location.replace("http://www.azkstrony.pl");
//  window.location.replace("http://www.almares.com.pl");
}//endInterview

function nextInterview (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  let txt = "";
  if (intvNumGiven && intvNumShow ||
      intvNumAuto && window.confirm("Zostanie rozpoczęty kolejny wywiad.\nZostanie pobrany i zarezerowany kolejny numer ankiety.")) {
    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) +
                           "?uid=" + userId;//"index.html";
  } else { //intvNumTable || intvNumGiven && !intvNumShow)
    goToBadania();
  }//else
}//nextInterview

function newInterview (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  window.console.log("newInterview()");
  removeCookies();
  document.questForm.reset();
  setLastCookies();
  document.getElementById("ask-restore-intv").style.display = "none";
  intvNum = -1;
  setUpIntvNum("newInterview");
}//newInterview

function goToBadania (e) {
  if (e != undefined) {
    e.stopPropagation();
  }//if
  let txt = window.location.href;
  txt = txt.substring(0, txt.lastIndexOf("/"));
  txt = txt.substring(0, txt.lastIndexOf("/") + 1);// + "?sid=" + surveyId;//"index.html";
  window.location.replace(txt);
}//goToBadania


//=====================================================================================
//initALL =============================================================================

function initAll () {
  let ckName = "";
  let ckValue = "";
  window.console.log("initAll:");
//  document.getElementById("monitor-monitor").style.display = "block";
//  document.getElementById("iframe-php-monitor").style.display = "block";

  phpCheck ();

  loadQuestsElements();//zdjęcia, filmy, opcje dla selectów
  makeInputsClickSensitive();
  makeDivInputsToggleVisible();

  displayOffQuestsElements();
//  displayOnAllQuestions();
  hideSomeInterviewElements();

  document.questForm.reset();//ankieta nazywa się questForm

  getInfoFromParams();    //odczytaj parametry z linii polecenia - zmienne: parSurveyId, parUserId, parIntvNum
  getSurveysInfoFromXML();//odczytaj PONIŻSZE informacje z bazy danych - zmienne surveyId, userId .. intvNumShow
  createQuestionOrderTable();//utwórz tabalę qsOrdTab
  createRotationsTable();//utwórz tabalę rotacji

  document.getElementById("top-banner-center").innerHTML = "<em>" + subjectTxt + "</em>";
  document.getElementById("top-banner-center").style.visibility = "hidden";
  document.getElementById("client-name-info").innerHTML = clientName;

  document.getElementById("ident-origin-info").innerHTML = "W tej ankiecie identyfikator nadawany jest automatycznie, więc nie można go zmienić.<br />" +
                                                           "Możliwe są inne są inne metody ustalanie identyfikatora, poprzez identyfikator użytkownika, <br />" +
                                                           "lub zwyczajne wpisanie go.";

  saveSurveyLog("initAll");
  getDateTime("initAll for " + parIntvNum);

  //firstIntvNum, lastIntvNum,   intvNumType,   intvNumAuto, intvNumTable, intvNumGiven, intvNumShow
  if (surveyId == -1) {
    errorAlert("Błąd: Brak identyfikatora badania.", "");
    return 1;
  }//if
  document.getElementById("survey-id-info").innerHTML = surveyId;
  if (stageNum != -1)
    document.getElementById("survey-id-info").innerHTML += "." + stageNum;
  if (userId == -1) {
    errorAlert("Błąd: Błąd identyfikatora użytkownika.", "");
    return 2;
  }//if
//  if (parIntvNum != -1 && (0 < firstIntvNum - parIntvNum || lastIntvNum - parIntvNum < 0)) {
//    errorAlert("Błąd: Numer ankiety poza zakresem.", "Zakres: {" + firstIntvNum + ", " + lastIntvNum + "}");
//    return 3;
//  }//if
  document.getElementById("user-id-info").innerHTML = userId;
//  document.getElementById("intv-num-info").innerHTML = parIntvNum == -1 ? "" : parIntvNum;
  document.getElementById("quest-progress").value = 0;
  document.getElementById("quest-progress").max = qsOrdTab.length + 1;//(intvNumShow? 1 : 0);
  document.getElementById("question-no").innerHTML = 0;
  document.getElementById("questions-num").innerHTML = document.getElementById("quest-progress").max;
  document.getElementById("quest-intv_num-error").style.display = "none";//visibility = "hidden";

  cookiesTab = document.cookie.split(";");
  window.console.log("cookies=[" + cookiesTab + "]\ncookiesTab.length=" + cookiesTab.length);
  if (cookiesTab.length < 2) {//JEŚLI OKAZUJE SIĘ ŻE NIE MA ŻADNYCH CIASTECZEK TO WYŚWIETLIĆ INFORAMCJĘ
    document.getElementById("cookies-confirm").style.display = "inline-flex";
    window.setTimeout(function(){document.getElementById("cookies-confirm").style.display = "none";}, 30000);
    document.getElementById("cookies-confirm-yes").focus();
    setUpIntvNum("noCookies");
  } else { //JAK SĄ CIASTECZKA
    for (var i = 0; i < cookiesTab.length; i++) {
      cookiesTab[i] = cookiesTab[i].trim(); //window.console.log(",cookiesTab[" + i +"]=" + cookiesTab[i]);
      ckName = cookiesTab[i].substr(0, cookiesTab[i].indexOf("="));
      ckValue = cookiesTab[i].substr(cookiesTab[i].indexOf("=")+1, cookiesTab[i].length);
      switch (ckName) {
        case "SurveyId":   ckSurveyId  = ckValue; break;
        case "StageNo":    ckStageNum  = ckValue; break;
        case "UserId" :    ckUserId    = ckValue; break;
        case "IntvNum" :   ckIntvNum   = ckValue; break;
        case "StartTime" : ckStartTime = ckValue; break;
        case "EndTime" :   ckEndTime   = ckValue; break;
      }//switch
    }//for od ciasteczek
    window.console.log("ckSId=" + ckSurveyId + ", sId=" + surveyId + ", ckSNo=" + ckStageNum + ", sNo=" + stageNum + ", ckUserId=" + ckUserId + ", userId=" + userId + ", ");
    window.console.log("parIntvNum=" + parIntvNum + ", ckIntvNum=" + ckIntvNum + ", ckStartTime=" + ckStartTime + ", ckEndTime=" + ckEndTime + ".");
    if (ckSurveyId != -1 && ckSurveyId == surveyId &&
        ckStageNum == stageNum &&
        ckUserId == userId &&
        ckIntvNum != -1 && (parIntvNum == -1 || ckIntvNum == parIntvNum) &&
        ckStartTime != -1 && ckStartTime != "" && ckEndTime == "started_") { //SĄ JAKIEŚ DANE W CIASTECZKACH Z NIESKOŃCZONEGO WYWIADU
      if ((intvNum = isIntvNumStarted(ckUserId, ckIntvNum, ckStageNum)) != -1) {//I WYWIAD JEST started
        document.getElementById("ask-restore-intv").style.display = "block";
        document.getElementById("restore-interview").focus();
      } else {//TO NIE TEN WYWIAD
        removeCookies();
        setUpIntvNum("ckIntvNumDoesn'tFit");
      }//else
    } else { //TO NIE TEN WYWIAD
      removeCookies();
      setUpIntvNum("cookiesDon'tFit");
    }//else
  }//else
  setLastCookies();
}//function initAll

window.onload = initAll;
