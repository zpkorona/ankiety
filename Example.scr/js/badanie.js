/*jshint esversion: 6 */
﻿"use strict";
/*global window*/
/*global document*/

//GLOBAL VARIABLES ====================================================================

var generalBackgroundColor = "#f0fff0";
//var generalBackgroundColor = "#e6f6ff";//Almares
var pictureFrameColor = "#80d0ff";

var phpIsWorking = true;

var parSurveyId = -1,
    parStageNo  = -1,
    parUserId   = -1,
    parIntvNum  = -1;

var respondentOk = true;

var surveyId     = -1,
    stagesNum    = 1,
    stageNo      = -1,
    userId       = -1,
    anonymoususerId = "gość",
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
  if (txt == "clear" || txt == "reset") {
    document.getElementById("monitor-monitor").innerHTML = "";
  } else {
    document.getElementById("monitor-monitor").innerHTML += txt;
  }//else
}//MONITOR


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


function displayOnAllQuestions () {
  let allQuestions = document.getElementsByClassName("question_");
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
  window.console.log("getInfoFromParams::search.len=" + window.location.search.length);
  parSurveyId = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
  parSurveyId = parSurveyId.substring(parSurveyId.lastIndexOf("/") + 1, parSurveyId.length);
  if (window.location.search.length < 4) {
    parUserId = -1;
  } else {
    params = window.location.search.substring(1, window.location.search.length).split("&");
    for (var i = 0; i < params.length; i++) {
      if (params[i].indexOf("sno=") != -1) {
        parStageNo = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      }//if
      if (params[i].indexOf("uid=") != -1) {
        parUserId = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      }//if
      if (params[i].indexOf("ino=") != -1) {
        parIntvNum = decodeURI(params[i].substring(params[i].indexOf("=") + 1, params[i].length));
      }//if
    }//for
    if (parStageNo != -1) {
      parStageNo = parStageNo.trim();
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
  window.console.log("parSurveyId=[" + parSurveyId + "]" + "\nparStageNo=[" + parStageNo + "]" + "\nparUserId=[" + parUserId + "]" + "\nparIntvNum=[" + parIntvNum + "]");
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
  xhr.open("GET", "./xml/badanie__.xml", false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status != 200) {
    window.console.log("Nie ma pliku badania.xml, status=" + xhr.status);
    window.alert("Nie ma pliku badania.xml, status=" + xhr.status);
  } else {
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
      elemTab = survey.getElementsByTagName("STAGES");
      stagesNum = elemTab.length == 0 ? 1 : elemTab[0].childNodes[0].nodeValue;
      if (1 < stagesNum) {
        if (1 <= parStageNo && parStageNo <= stagesNum) {
          stageNo = parStageNo;
        } else {
          stageNo = parStageNo = 1;
        }//else
      } else {
        stagesNum = 1;
        parStageNo = -1;
        stageNo = -1;
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
        parStageNo = -1;
        stageNo = -1;
      }//if
      intvNumShow = intvNumType.indexOf("SHOW") != -1;
      intvNumShow = intvNumType.indexOf("HIDE") == -1;
      if (intvNumShow && (intvNumAuto || intvNumTable)) {
        document.getElementById("intv_num-range").style.display = "none";
      }//if
      elemTab = survey.getElementsByTagName("USER_ID");
      window.console.log("sId=[" + surveyId + "]" + "\nsNum=[" + stagesNum + "]" + "\nsNo=[" + stageNo + "]" +
                         "\nclient=[" + clientName + "]" + "\nsubject=[" + subjectTxt + "]" + "\nfrst=[" + firstIntvNum + "]" + ", last=[" + lastIntvNum + "]" +
                         "\niNGiven=[" + intvNumGiven + "]" + "\niNAuto=[" + intvNumAuto + "]" + "\niNTable=[" + intvNumTable + "]" + "\niNShow=[" + intvNumShow + "]" +
                         "\nelemTab.len=[" + elemTab.length + "]");
      if (parUserId == -1 && (intvNumAuto || intvNumGiven)) { //nie ma użytkownika w parametrach
        if (elemTab.length == 0) {
          gotUser = "empty";
          userId = "YOU";
        } else {
          gotUser = elemTab[0].childNodes[0].nodeValue;
          userId = gotUser.substring(0, gotUser.indexOf("%")).trim();
          if (userId != anonymoususerId) {
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
      window.console.log("parUserId=[" + parUserId + "]" + "\nuserId=[" + userId + "]");
    }//if
  }//else
}//getSurveysInfoFromXML


function saveSurveyLog (extraText) {
  let xhr, txt;
  window.console.log("saveSurveyLog: survey_id" + parSurveyId + ", stage_no=" + parStageNo + ", user_id=" + parUserId + ", int_no=" + parIntvNum);
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      txt = this.responseText;
    }//if
  };//function()
  xhr.open("GET", "../php/zapiszSurveyLog.php?survey_id=" + parSurveyId + "&stage_no=" + parStageNo + "&user_id=" + parUserId + "&int_no=" + parIntvNum +
                                             "&agent=" + "agent" + "&extra=" + extraText, true);
  xhr.send();
}//saveSurveyLog


function getDateTime (when) {
  let xhr;
  let currDate = new Date();
  let n;
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "../php/getDateTime.php?when=" + when, false);
  xhr.send();
  if (xhr.status == 200) {
    currDateTime = xhr.responseText;
  } else {
    window.console.log("Nie działa php, status=" + xhr.status);
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


//=====================================================================================
//IDENTYFIKATOR =======================================================================
function isIntvNumWaiting (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  intvNum = -1;
  window.console.log("isIntvNumWaiting(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
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
    window.console.log("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
  window.console.log("intvNum=[" + intvNum + "]");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {//jeśli PHP nie działa lu nie ma pliku
    intvNum = -1;
  }//if
  return intvNum != -1;
}//isIntvNumWaiting


function isIntvNumStarted (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  intvNum = -1;
  window.console.log("isIntvNumStarted(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
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
    window.alert("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
    window.console.log("intvNum=[" + intvNum + "]");
  } else {
    intvNum = xhr.responseText;
    window.console.log("intvNum=[" + intvNum + "]");
    if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {//jeśli PHP nie działa lu nie ma pliku
      intvNum = -1;
    }//if
  }//else
  return intvNum != -1;
}//isIntvNumStarted


function isIntvNumUsable (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  intvNum = -1;
  window.console.log("isIntvNumUsable(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
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
    window.console.log("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
  window.console.log("intvNum=[" + intvNum + "]");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) { //jeśli PHP nie działa lu nie ma pliku
    intvNum = -1;
  }//if
  return intvNum != -1;
}//isIntvNumUsable


function useIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  intvNum = -1;
  window.console.log("useIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
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
    window.console.log("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
  window.console.log("useIN::intvNum=[" + intvNum + "]");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {//jeśli PHP nie działa lu nie ma pliku
    intvNum = -1;
  }//if
  return intvNum != -1;
}//useIntvNum


function getIntvNum (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  intvNum = -1;
  window.console.log("getIntvNum(" + tstUserId + ", " + tstIntvNum + ", " + tstStageNo + ")");
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
    window.console.log("Błąd odczytu pliku z identyfikatorami, status=" + xhr.status);
  }//else
  window.console.log("intvNum=[" + intvNum + "]");
  if (intvNum.indexOf("<?php") != -1 || intvNum.indexOf("Warning:") != -1) {//jeśli PHP nie działa lu nie ma pliku
    intvNum = -1;
  }//if
  return intvNum != -1;
}//getIntvNum


function assignIntvNum (tstIntvNum) {
  window.console.log("assignIntvNum(" + tstIntvNum + "): intvNumAuto=" + intvNumAuto + ", intvNumGiven=" + intvNumGiven + ", intvNumTable=" + intvNumTable + ", userId=" + userId + ", tstIntvNum=" + tstIntvNum + ", intvNumShow=" + intvNumShow);
  if (intvNumAuto ||                                        //JEŻELI IDENTYFIKATOR NADAWANY AUTOMATYCZNIE LUB
      intvNumGiven && (tstIntvNum != -1 || !intvNumShow) || // ZOSTAŁ PODANY LUB
      intvNumTable && (tstIntvNum != -1 || !intvNumShow)) { // Z TABELI
    window.console.log("assignIN_if");
    if (tempFileExists(tstIntvNum) && isIntvNumStarted(userId, tstIntvNum, stageNo) && restoreFromTempFile() ||
        isIntvNumUsable(userId, tstIntvNum, stageNo)) {//sprawdza tstIntvNum >--> ustawia intvNum
      document.questForm.intv_num.readOnly = true;
    } else {
      intvNum = -1;//pozostałość po sprawdzaniu zakresu
      intvNumShow = false;
    }//else
    window.console.log("assignIN_if::intvNum=" + intvNum);
  } else {//if (intvNumGiven || intvNumTable && tstIntvNum == -1 && intvNumShow) {{//JEŻELI IDENTYFIKATOR NADAWANY JAKO PARAMETR
    window.console.log("assignIN_else");
    if (tstIntvNum == -1) {//nie ma numeru
      intvNumShow = true;//poprosić użytkownika o wpisanie
    } else {
      if (isIntvNumWaiting(userId, tstIntvNum, stageNo)) {
        document.questForm.intv_num.readOnly = true;
      } else {
        intvNum = -1;
        intvNumShow = true;
      }//else
    }//else
    window.console.log("assignIN_else::intvNum=" + intvNum);
  }//else
  return intvNum != -1 || intvNumShow;
}//assignIntvNum


function setUpIntvNum (txt) {
  window.console.log("setUpIntvNum(" + txt + ")");
  if (assignIntvNum(parIntvNum)) { //udało się ustalić numer lub ma być wpisany ręcznie
    window.console.log("setUpIN:intvNum=" + intvNum);
    if (intvNum != -1) {//jeśli jest ustalony numer i jest w zakresie
      document.questForm.intv_num.value = intvNum;
    } else {
      document.getElementById("intv-num-info").innerHTML = "";
    }//else
    document.getElementById("next-button").style.visibility = "visible";
    document.getElementById("position-info").style.visibility = "visible";
    window.console.log("setUpIN:intvNumShow=" + intvNumShow);
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



//=====================================================================================
function restoreFromCookies () {
  let ckName = "";
  let ckValue = "";
  let cookiesCnt;
  let i;
  window.console.log("==========================================");
  window.console.log("restoreFromCookies");
  document.questForm.reset();
  document.getElementById("restore-progress").style.display = "block";
  document.getElementById("restore-progress").max = cookiesTab.length - 3;
  document.getElementById("restore-progress").value = 0;
  for (cookiesCnt = 0; cookiesCnt < cookiesTab.length; cookiesCnt++) {
    document.getElementById("restore-progress").value = cookiesCnt;
    ckName = cookiesTab[cookiesCnt].substr(0, cookiesTab[cookiesCnt].indexOf("="));
    ckValue = cookiesTab[cookiesCnt].substr(cookiesTab[cookiesCnt].indexOf("=")+1, cookiesTab[cookiesCnt].length);
    switch (ckName) {
      case "SurveyId":  document.questForm.survey_id.value  = ckValue; break;
      case "StageNo":   document.questForm.stage_no.value   = ckValue; break;
      case "UserId":    document.questForm.user_id.value    = ckValue; break;
      case "IntvNum":   document.questForm.intv_num.value   = ckValue; break;
      case "StartTime": document.questForm.start_time.value = ckValue; break;
      case "EndTime":   document.questForm.end_time.value   = ckValue; break;
      case "Duration":  document.questForm.duration.value   = ckValue; break;
//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 1/6 Example.scr
//-------------------------------------------------------------------------------------
      //TEXT/VALUE
      case "nazwa pola z ustaloną wartością - tekstowego lub innego": //ZMIANA
      case "rAt16": //ZMIANA
      case "rG":    //ZMIANA
      case "rH":    //ZMIANA
        document.questForm[ckName].value = ckValue;
        window.console.log(ckName + "=>" + document.questForm[ckName].value);
        break;

      //RADIO
      case "nazwa pola typu RADIO":    //ZMIANA
      case "rC":    //ZMIANA
      case "rD":    //ZMIANA
      case "rE":    //ZMIANA
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
      case "rK":    //ZMIANA
      case "rL":    //ZMIANA
      case "rZ":    //ZMIANA
        document.questForm[ckName].value = ckValue;
        for (i = 0; i < document.questForm[ckName].length; i++) {
          if (document.questForm[ckName][i].value == ckValue) {
            document.questForm[ckName][i].checked = true;
          }//if
        }//for
        window.console.log(ckName + "=>" + document.questForm[ckName].value);
        break;

      //RANGE
      case "nazwa pola typu RANGE":    //ZMIANA
      case "rF":    //ZMIANA
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
        document.questForm[ckName].value = ckValue;
        window.console.log(ckName + "=>" + document.questForm[ckName].value);
        break;

      //CHECK
      case "nazwy pól typu CHECK":    //ZMIANA
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
        window.console.log(ckName + "=>" + document.questForm[ckName].checked);
        break;

      //SELECT
      case "nazwa pola typu SELECT":    //ZMIANA
      case "rM_1":  //ZMIANA
      case "rM_2":  //ZMIANA
      case "rM_3":  //ZMIANA
      case "rM_4":  //ZMIANA
      case "rM_5":  //ZMIANA
      case "rM_6":  //ZMIANA
      case "rM_7":  //ZMIANA
      case "rM_8":  //ZMIANA
      case "rM_9":  //ZMIANA
      case "rM_10": //ZMIANA
      case "rM_11": //ZMIANA
      case "rM_12": //ZMIANA
        ckName = "rM";
      case "rN":  //ZMIANA
        if (ckValue != "") {
          for (i = 0; i < document.questForm[ckName].length; i++) {
            if (document.questForm[ckName][i].value == ckValue) {
              document.questForm[ckName][i].selected = true;
              window.console.log(ckName + "." + document.questForm[ckName][i].value + "=" + document.questForm[ckName][i].selected);
            }//if
          }//for
        }//if
        break;
//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 1/6 Example.scr
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
  questsTab[qsOrdTab[0]][2](questsTab[qsOrdTab[0]][0], questsTab[qsOrdTab[0]][1]);//prepareInt_num
  //questsTab[qsOrdTab[currQuest]][2](questsTab[qsOrdTab[currQuest]][0], questsTab[qsOrdTab[currQuest]][1]);
}//restoreFromCookies


function removeCookies () {
  let ckName = "";
  window.console.log("removeCookies");
//window.alert("removeCookies");
  cookiesTab = document.cookie.split(";");
  window.console.log("cookies=[" + cookiesTab + "]\ncookiesTab.length=" + cookiesTab.length);
  for (var i = 0; i < cookiesTab.length; i++) {
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


function saveVariable (variable, value, openQest) {
  let xhr, txt;
  if (openQest === undefined) openQest = false;
  window.console.log("saveVariable(" + variable + ", '" + value + "', " + openQest + ")");
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200)
        txt = this.responseText;
    };//function()
  xhr.open("GET", "../php/zapiszTempValue.php?int_no=" + intvNum + "&survey_id=" + surveyId + "&stage_no=" + stageNo + "&user_id=" + userId +
                    "&var=" + variable + "&val=" + value + "&opq=" + openQest, true);
  xhr.send();
}//saveVariable


function tempFileExists (tstIntvNum) {
  let xhr, t;
  window.console.log("tempFileExists(" + tstIntvNum + ")");
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "../php/tempFileExists.php?int_no=" + tstIntvNum + "&survey_id=" + surveyId + "&stage_no=" + stageNo + "&user_id=" + userId, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    t = xhr.responseText == tstIntvNum;
  } else {
    t = false;
    window.console.log("Błąd php, status=" + xhr.status);
  }//else
  window.console.log("=>" + t);
  return t;
}//tempFileExists


function restoreFromTempFile () {
  let xhr;
  let restoredJson;
  let restoredTab;
  let resName;
  let resValue;
  let restoredCnt;
  let i;
  restoredIntv = false;
  window.console.log("restoreFromTempFile()");
  xhr = new window.XMLHttpRequest();
  xhr.open("GET", "./php/restoreFromTempFile.php?int_no=" + intvNum + "&survey_id=" + surveyId + "&stage_no=" + stageNo + "&user_id=" + userId, false);//SYNCHRONICZNIE
  xhr.send();
  if (xhr.status == 200) {
    restoredJson = xhr.responseText;
  } else {
    restoredJson = "";
    window.console.log("Błąd odczytu TempFile, status=" + xhr.status);
  }//else
  window.console.log("rJson=" + restoredJson);
  if (restoredJson != "") {
    restoredTab = JSON.parse(restoredJson);
  //  document.getElementById("restore-progress").style.display = "block";
  //  document.getElementById("restore-progress").max = restoredTab.length - 3;
  //  document.getElementById("restore-progress").value = 0;
    restoredCnt = 0;
    for (resName in restoredTab) {
      restoredCnt++;
  //    document.getElementById("restore-progress").value = restoredCnt;
      resValue = restoredTab[resName];
      switch (resName) {
        case "SurveyId":  document.questForm.survey_id.value  = resValue; break;
        case "StageNo":   document.questForm.stage_no.value   = resValue; break;
        case "UserId":    document.questForm.user_id.value    = resValue; break;
        case "IntvNum":   document.questForm.intv_num.value   = resValue; break;
        case "StartTime": document.questForm.start_time.value = resValue; break;
        case "EndTime":   document.questForm.end_time.value   = resValue; break;
        case "Duration":  document.questForm.duration.value   = resValue; break;
//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 2/6 Example.scr
//-------------------------------------------------------------------------------------
        //TEXT/VALUE
        case "nazwa pola typu TEXT/VALUE":    //ZMIANA
        case "rAt16": //ZMIANA
        case "rG":    //ZMIANA
        case "rH":    //ZMIANA
          restoredIntv = true;     //<<---PRZY PIERWSZYM ZNACZĄCYM PYTANIU
          document.questForm[resName].value = resValue;
          window.console.log(resName + "=>" + document.questForm[resName].value);
          break;

        //RADIO
        case "nazwa pola typu RADIO":    //ZMIANA
        case "rC":    //ZMIANA
        case "rD":    //ZMIANA
        case "rE":    //ZMIANA
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
        case "rK":    //ZMIANA
        case "rL":    //ZMIANA
        case "rZ":    //ZMIANA
          restoredIntv = true;     //<<---PRZY PIERWSZYM ZNACZĄCYM PYTANIU
          document.questForm[resName].value = resValue;
          for (i = 0; i < document.questForm[resName].length; i++) {
            if (document.questForm[resName][i].value == resValue) {
              document.questForm[resName][i].checked = true;
            }//if
          }//for
          window.console.log(resName + "=>" + document.questForm[resName].value);
          break;

        //RANGE
        case "nazwa pola typu RANGE":    //ZMIANA
        case "rF":    //ZMIANA
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
          restoredIntv = true;     //<<---PRZY PIERWSZYM ZNACZĄCYM PYTANIU
          document.questForm[resName].value = resValue;
          window.console.log(resName + "=>" + document.questForm[resName].value);
          break;

        //CHECK
        case "nazwy pól typu CHECK":    //ZMIANA
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
          window.console.log(resName + "=>" + document.questForm[resName].checked);
          break;

        //SELECT
        case "nazwa pola typu SELECT":    //ZMIANA
        case "rM_1":  //ZMIANA
        case "rM_2":  //ZMIANA
        case "rM_3":  //ZMIANA
        case "rM_4":  //ZMIANA
        case "rM_5":  //ZMIANA
        case "rM_6":  //ZMIANA
        case "rM_7":  //ZMIANA
        case "rM_8":  //ZMIANA
        case "rM_9":  //ZMIANA
        case "rM_10": //ZMIANA
        case "rM_11": //ZMIANA
        case "rM_12": //ZMIANA
          resName = "rM";
        case "rN":  //ZMIANA
          if (resValue != "") {
            for (i = 0; i < document.questForm[resName].length; i++) {
              if (document.questForm[resName][i].value == resValue) {
                document.questForm[resName][i].selected = true;
                window.console.log(resName + "." + document.questForm[resName][i].value + "=>" + document.questForm[resName][i].selected);
              }//if
            }//for
          }//if
          break;

//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 2/6 Example.scr
//=====================================================================================
      }//switch
    }//for
  //window.alert("restoreFromTempFile()-koniec");
//    document.getElementById("ask-restore-intv").style.display = "none";
  //  document.getElementById("intv-num-info").innerHTML = intvNum
  }//if
  window.console.log("=>" + restoredIntv);
  return restoredIntv;
}//restoreFromTempFile


//=====================================================================================
function newInterview () {
  window.console.log("newInterview()");
  removeCookies();
  document.questForm.reset();
  setLastCookies();
  document.getElementById("ask-restore-intv").style.display = "none";
  intvNum = -1;
  setUpIntvNum("newInterview");
}//newInterview

function saveStartData () {
  let currDate = new Date(),
      expDate  = new Date(currDate.getTime() + (7*24*60*60*1000));//+7dni
  ckExpiresText = ";expires=" + expDate.toUTCString();
  window.console.log("saveStartData:" + ckExpiresText);
  document.questForm.survey_id.value    = surveyId;
  document.questForm.stage_no.value     = stageNo;
  document.questForm.user_id.value      = userId;
  getDateTime("saveStartData_" + intvNum);
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
//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 3/6 Example.scr
//-------------------------------------------------------------------------------------
// tu mogą być zapamiętywane rotacje
  //setCookie("tp1_ord", document.questForm.tp1_ord.value);      //ZMIANA
  //setCookie("tp1_name", document.questForm.tp1_name.value);    //ZMIANA
  //setCookie("tp2_ord", document.questForm.tp2_ord.value);      //ZMIANA
  //setCookie("tp2_name", document.questForm.tp2_name.value);    //ZMIANA
  //saveVariable("tp1_ord",  document.questForm.tp1_ord.value);  //ZMIANA
  //saveVariable("tp1_name", document.questForm.tp1_name.value); //ZMIANA
  //saveVariable("tp2_ord",  document.questForm.tp2_ord.value);  //ZMIANA
  //saveVariable("tp2_name", document.questForm.tp2_name.value); //ZMIANA
//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 3/6 Example.scr
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


function gotoPrevQuestion () {
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


function setIntvNumComplete (tstUserId, tstIntvNum, tstStageNo) {
  let xhr;
  intvNum = -1;
  window.console.log("setIntvNumComplete(" + tstUserId + "," + tstIntvNum + "," + tstStageNo + ")");
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        intvNum = this.responseText;
        window.console.log("intvNum=[" + intvNum + "]");
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
}//setIntvNumComplete


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

//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 4/6 Example.scr
//-------------------------------------------------------------------------------------
  rearrange_rI_data(); //ZMIANA
  rearrange_rJ_data(); //ZMIANA
  window.console.log("po rearrage");
//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 4/6 Example.scr
//=====================================================================================

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

  window.console.log("questForm.submit");
  document.questForm.submit();

  document.getElementById("data-saving-progess").innerHTML = ".";
  savingInterval = window.setInterval(function(){document.getElementById("data-saving-progess").innerHTML += ".";}, 100);
//  document.getElementById("press-text1").style.display = "block";
//  document.getElementById("data-saved-next").style.visibility = "visible";
//  document.getElementById("data-saved-next").focus();
  window.setTimeout(cleanData, 3000);

  window.console.log("setIntvNumComplete:");
  setIntvNumComplete(userId, intvNum, stageNo);

  return false;
}//submitFormData


function cleanData () {
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
  setCookie("LastVisit", Date());
  setCookie("LastSurvey", surveyId);
  setCookie("LastUser", userId);
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
  window.console.log("onbeforeunload-OFF");

  let txt = window.location.href;
  txt = txt.substring(0, txt.lastIndexOf("/") + 1);
  if (intvNumGiven && intvNumShow) {
//    txt += "?uid=" + userId;
    txt += "next.php?user_id=" + userId + "&int_no=" + intvNum;//"index.html";
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


function nextInterview () {
  let txt = "";
  if (intvNumGiven && intvNumShow ||
      intvNumAuto && window.confirm("Zostanie rozpoczęty kolejny wywiad.\nZostanie pobrany i zarezerowany kolejny numer ankiety.")) {
    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) +
                           "?uid=" + userId;//"index.html";
  } else { //intvNumTable || intvNumGiven && !intvNumShow)
    goToBadania();
  }//else
}//nextInterview


function goToBadania () {
  let txt = window.location.href;
  txt = txt.substring(0, txt.lastIndexOf("/"));
  txt = txt.substring(0, txt.lastIndexOf("/") + 1);// + "?sid=" + surveyId;//"index.html";
  window.location.replace(txt);
}//goToBadania



//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 5/6 Example.scr
//-------------------------------------------------------------------------------------
//OBSŁUGA ANKIETY =====================================================================
var questsTab = [["quest-intv_num",  "intv_num",  prepareInt_num,         verifyInt_num],
                 ["quest-intro0",    "intro0",    prepareQuest_intro0,    verifyQuest_intro0],   //ZMIANA v
                 ["quest-rA",        "rA",        prepare__,              verifyQuest_rA],
                 ["quest-rB",        "rB",        prepareQuest_rB,        verifyQuest_rB],
                 ["quest-rC",        "rC",        prepareQuest_rC,        verifyQuest_rC],
                 ["quest-rD",        "rD",        prepare__,              verifyQuestSingle],
                 ["quest-rE",        "rE",        prepare__,              verifyQuestSingle],
                 ["quest-rF",        "rF",        prepare__,              verifyQuestRange],
                 ["quest-rG",        "rG",        prepareQuest_rG,        verifyQuestOpen],
                 ["quest-rH",        "rH",        prepareQuest_rH,        verifyQuestOpen],
                 ["quest-rI",        "rI",        prepare__,              verifyQuest_rI],
                 ["quest-rJ",        "rJ",        prepare__,              verifyQuest_rJ],
                 ["quest-rK",        "rK",        prepareQuest_rK,        verifyQuest_rK],
                 ["quest-rL",        "rL",        prepareQuest_rL,        verifyQuest_rL],
                 ["quest-rM",        "rM",        prepare__,              verifyQuest_rM],
                 ["quest-rN",        "rN",        prepareQuest_rN,        verifyQuest_rN],
                 ["quest-wait01",    "wait01",    prepareWaitPage,        verifyWaitPage],
                 ["quest-rZ",        "rC",        prepare__,              verifyQuestSingle]];//ZMIANA ^
var qsOrdTab = [0];  //ZMIANA
function createQuestionOrderTable () {
  window.console.log("createQuestionOrderTable()");
  if (qsOrdTab.length < 2) {
    for (let i = 0; i < questsTab.length; i++) {
      qsOrdTab[i] = i;
    }//for
  }//if
}//function createQuestionOrderTable

var prevQuest = 0,
    currQuest = 0,
    nextQuest = 0;
var scenariaTab = [[10, 11, 12, 13],  // I J K L
                   [13, 12, 11, 10],  // L K J I
                   [12, 10, 13, 11],  // K I L J
                   [11, 13, 10, 12]]; // J L I K
var useScenariaTab = true;   // mają być zmiany kolejności pytań
var rotateScenario = true;  // maja być rotacje wewnątrz scenariuszy
function arrangeQsOrdTab () {
  window.console.log("arrangeQsOrdTab() " + intvNum + ", " + useScenariaTab + ", " + rotateScenario);
  if (useScenariaTab) {
    let scenario = (intvNum - 1) % scenariaTab.length, //WYBÓR WIERSZA W TABELI scenariaTab -- intvNum,//powinno być jak jest dla każdego
        firstItem = Math.floor((intvNum - 1) / scenariaTab.length) % scenariaTab[scenario].length; //pierwszy w rotacji wybranego wiersza tabeli scenariaTab
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


var rotations = [[1001, "p001"],
                 [1100, "p100"]];
function createRotationsTable () {
  window.console.log("createRotationsTable");
  //wczytanie za pomocą ajaxa pliku csv do tabeli rotations

//wygenerowanie TABELI
  let i = 0;
  for (let j = 1001; j <= 1200; i++, j++) {
    rotations[i] = [j, "957"];
//    rotations[i][0] = j;
//    rotations[i][1] = "957";
  }//for
  window.console.log(`i=${i}`);
  for (let j = 2001; j <= 2200; i++, j++) {
    rotations[i] = [j, "318"];
//    rotations[i][0] = j;
//    rotations[i][1] = "318";
  }//for
}//createRotationsTable

function findRotation () {
  let i;
  let rlen = rotations.length;
  window.console.log("findRotation: [" + intvNum + "]");
  for (i = 0; i < rlen && rotations[i][0] != intvNum; i++);
  document.questForm.tp1_ord.value = 1;
//  document.questForm.tp2_ord.value = 2;
  if (i < rlen) {
    document.questForm.tp1_name.value = rotations[i][1];
//    document.questForm.tp2_name.value = rotations[i][2];
  } else {
    if (rlen && 0 < intvNum) {
      i = (intvNum - 1) % rlen;
      document.questForm.tp1_name.value = rotations[i][1];
//      document.questForm.tp2_name.value = rotations[i][1];
    } else {
      document.questForm.tp1_name.value = "pierwszy";
//      document.questForm.tp2_name.value = "drugi";
    }//esle
  }//if
  window.console.log("rotations[" + i + "]:" + document.questForm.tp1_name.value);// + "," + document.questForm.tp2_name.value);
//  window.console.log("," + document.questForm.tp2_name.value);
  window.console.log("::" + document.questForm.tp1_ord.value);// + "," + document.questForm.tp2_ord.value);
//  window.console.log("," + document.questForm.tp2_ord.value);
  return i < rlen;
}//findRotation


//              index, value, name
var rI_orgTab = [["1",  99, "Cecha_rI 1"],
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
var rI_arrTab = [[1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                 [2, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]];
var rI_arrLine = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function make_rI_arrLine () {
  let arrTabLen = rI_arrTab.length;
  let arrTabKey = (intvNum - 1) % arrTabLen + 1;//intvNum,//powinno być jak jest dla każdego
  let arrTabRow = 0;                               //index wiersza w tabeli rI_arrTab
  let orgTabLen = rI_orgTab.length;
  let firstItem = Math.floor((intvNum - 1) / arrTabLen) % orgTabLen; //pierwszy w rotacji wybranego wiersza tabeli rI_arrTab
  let i;                                        //WYBÓR WIERSZA w tabeli rI_arrTab
  window.console.log("make_rI_arrLine\n arrTabKey=" + arrTabKey + ", firstItem=" + (firstItem+1) + ":");
  for (i = 0; i < arrTabLen && rI_arrTab[i][0] != arrTabKey; i++);//SZUKAJ WIERSZA WEDŁUG arrTabKey - może być intvNum
  if (i < arrTabLen && rI_arrTab[i][0] == arrTabKey) {             //jeśli odnaleziony
    arrTabRow = i;
  }//if
  for (i = 1; i <= orgTabLen - firstItem; i++) {//ZAPISYWANIE rI_arrLine UWZGLĘDNIAJĄC OBRACANIE WYBRANEGO WIERSZA
    rI_arrLine[i] = rI_arrTab[arrTabRow][i + firstItem];
  }//for
  for (; i <= orgTabLen; i++) {//OBRÓĆ DLA WYBRANEGO WIERSZA autokręcioła jeżeli ma być
    rI_arrLine[i] = rI_arrTab[arrTabRow][i + firstItem - orgTabLen];
  }//for
  //for (i = 1; i <= orgTabLen; i++) window.console.log(rI_arrLine[i] + ",");
  window.console.log(rI_arrLine);
}//make_rI_arrLine

function arrange_rI_items () {
  let orgTabLen = rI_orgTab.length;
  let i;
  window.console.log("arrange_rI_items");
  make_rI_arrLine();
  for (i = 0; i < orgTabLen; i++) {
    document.getElementById("rIitem" + rI_orgTab[i][0]).innerHTML = rI_orgTab[rI_arrLine[i + 1] - 1][2];
  }//for
}//arrange_rI_items

function rearrange_rI_data__ (rI_) {
  let orgTabLen = rI_orgTab.length;
  let rI_name;
  let i, j;
  window.console.log("rearrange_rI_data__(" + rI_ +")");
  for (i = 0; i < orgTabLen; i++) {    //PRZEPISANIE danych z formularza do tabeli rI_orgTab
    rI_name = rI_ + rI_orgTab[i][0];
    for (j = 0; j < document.questForm[rI_name].length; j++) {
      if (document.questForm[rI_name][j].checked) {
        rI_orgTab[rI_arrLine[i + 1] - 1][1] = j;
      }//if
    }//for
  }//for
  for (i = 0; i < orgTabLen; i++) {    //PRZEPISANIE danych z rI_orgTab do formularza
    rI_name = rI_ + rI_orgTab[i][0];
    for (j = 0; j < document.questForm[rI_name].length; j++) {
      document.questForm[rI_name][j].checked = j == rI_orgTab[i][1];
    }//for
  }//for
}//rearrange_rI_data__

function rearranged_rI_index (find) {
  let orgTabLen = rI_orgTab.length;
  let i;
  for (i = 1; i <= orgTabLen && rI_arrLine[i] != find; i++);
  return i;
}//rearranged_rI_index

function rearrange_rI_data () {
  make_rI_arrLine();
  rearrange_rI_data__("rI_");
}//rearrange_rI_data


//              index, value, name
var rJ_orgTab = [["1",  99, "Cecha_rJ_ 1"],
                 ["2",  99, "Cecha_rJ_ 2"],
                 ["3",  99, "Cecha_rJ_ 3"],
                 ["4",  99, "Cecha_rJ_ 4"],
                 ["5",  99, "Cecha_rJ_ 5"],
                 ["6",  99, "Cecha_rJ_ 6"],
                 ["7",  99, "Cecha_rJ_ 7"],
                 ["8",  99, "Cecha_rJ_ 8"],
                 ["9",  99, "Cecha_rJ_ 9"],
                 ["10", 99, "Cecha_rJ_ 10"],
                 ["11", 99, "Cecha_rJ_ 11"],
                 ["12", 99, "Cecha_rJ_ 12"]];
var rJ_arrTab = [[1, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                 [2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]];
var rJ_arrLine = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function make_rJ_arrLine () {
  let arrTabLen = rJ_arrTab.length;
  let arrTabKey = (intvNum - 1) % arrTabLen + 1;//intvNum,//powinno być jak jest dla każdego
  let arrTabRow = 0;                            //numer wiersza w tabeli rJ_arrTab
  let orgTabLen = rJ_orgTab.length;
  let firstItem = Math.floor((intvNum - 1) / arrTabLen) % orgTabLen; //pierwszy w rotacji wybranego wiersza tabeli rI_arrTab
  let i;                                        //WYBÓR WIERSZA w tabeli rJ_arrTab
  window.console.log("make_rJ_arrLine\n arrTabKey=" + arrTabKey + ", firstItem=" + (firstItem+1) + ":");
  for (i = 0; i < arrTabLen && rJ_arrTab[i][0] != arrTabKey; i++);//SZUKAJ WIERSZA WEDŁUG arrTabKey - może być intvNum
  if (i < arrTabLen && rJ_arrTab[i][0] == arrTabKey) {             //jeśli odnaleziony
    arrTabRow = i;
  }//if
  for (i = 1; i <= orgTabLen - firstItem; i++) {//ZAPISYWANIE rJ_arrLine UWZGLĘDNIAJĄC OBRACANIE WYBRANEGO WIERSZA
    rJ_arrLine[i] = rJ_arrTab[arrTabRow][i + firstItem];
  }//for
  for (; i <= orgTabLen; i++) {//OBRÓĆ DLA WYBRANEGO WIERSZA autokręcioła jeżeli ma być
    rJ_arrLine[i] = rJ_arrTab[arrTabRow][i + firstItem - orgTabLen];
  }//for
  //for (i = 1; i <= orgTabLen; i++) window.console.log(rJ_arrLine[i] + ",");
  window.console.log(rJ_arrLine);
}//make_rJ_arrLine

function arrange_rJ_items () {
  let orgTabLen = rJ_orgTab.length;
  let i;
  window.console.log("arrange_rJ_items");
  make_rJ_arrLine();
  for (i = 0; i < orgTabLen; i++) {
    document.getElementById("rJitem" + rJ_orgTab[i][0]).innerHTML = rJ_orgTab[rJ_arrLine[i + 1] - 1][2];
//    document.getElementById("tp2_q3item" + rJ_orgTab[i][0]).innerHTML = rJ_orgTab[rJ_arrLine[i + 1] - 1][2];
  }//for
}//arrange_rJ_items

function rearrange_rJ_data__ (rJ_) {
  let orgTabLen = rJ_orgTab.length;
  let i, j;
  window.console.log("rearrange_rJ_data__(" + rJ_ +")");
  for (i = 0; i < orgTabLen; i++) {    //PRZEPISANIE danych z formularza do tabeli rJ_orgTab
    rJ_orgTab[rJ_arrLine[i + 1] - 1][1] = document.questForm[rJ_ + rJ_orgTab[i][0]].value;
  }//for
  for (i = 0; i < orgTabLen; i++) {    //PRZEPISANIE danych z rJ_orgTab do formularza
    document.questForm[rJ_ + rJ_orgTab[i][0]].value = rJ_orgTab[i][1];
  }//for
}//rearrange_rJ_data__

function rearranged_rJ_index (find) {
  let orgTabLen = rJ_orgTab.length;
  let i;
  for (i = 1; i <= orgTabLen && rJ_arrLine[i] != find; i++);
  return i;
}//rearranged_rJ_index

function rearrange_rJ_data () {
  make_rJ_arrLine();
  rearrange_rJ_data__("rJ_");
//  rearrange_rJ_data__("tp2_q3_");
}//rearrange_rJ_data


function arrangeQuestions () {
  window.console.log("arrangeQuestions: ");
  arrange_rI_items(); //ZMIANA
  arrange_rJ_items(); //ZMIANA
  arrangeQsOrdTab();
//  findRotation();
}//arrangeQuestions
//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 5/6 Example.scr
//=====================================================================================


//QUESTION PREPARTION/VARIFICATION FUNCTIONS =====================================================
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


function verifyInt_num (qId, fldName) {
  let field = document.questForm[fldName];
  let isOk = true;
  let tstIntvNum;
  window.console.log("verInt_num(" + qId + ":" + fldName + ")\nino=" + field.value + ", ronly=" + field.readOnly);
  //window.console.log("useIN(" + intvNumAuto + "," + userId + "," + field.value + "," + stageNo + ")");
  if (field.readOnly) {
    isOk = restoredIntv || useIntvNum(userId, field.value, stageNo);
  } else {
    tstIntvNum = decodeURI(field.value);
    window.console.log("[" + tstIntvNum + "]");
    field.value = tstIntvNum;
    //tstIntvNum = parseInt(field.value);
    //window.console.log(tstIntvNum);
    if (tstIntvNum && intvNumIsInRange(tstIntvNum, false, 1, 200, 1001, 2000, 3001)) {
      if (intvNumGiven) {
        if (!useIntvNum(userId, tstIntvNum, stageNo)) {
          if (isIntvNumStarted(userId, tstIntvNum, stageNo) &&
              (!tempFileExists(tstIntvNum) ||
               !window.confirm("Ankieta o tym identyfikatorze została już rozpoczęta i jakieś jej dane zachowane są na serwerze.\n" +
                               "Czy chcesz kontynować tę ankietę po wczytaniu danych?"))) {
            intvNum = -1;
          }//if
        }//if
        isOk = intvNum != -1;
      } else {
        getIntvNum(userId, tstIntvNum, stageNo);
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
    if (stageNo) {
      document.getElementById("test-prod-info").innerHTML = stageNo;
    }//if
    arrangeQuestions();
    if (/*!restoredIntv &&*/ tempFileExists(intvNum)) {
      restoreFromTempFile();
    }//if
    saveStartData();
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


function setFillInfo (qId, colour) {
  let objs = document.getElementById(qId).getElementsByClassName("fill-info");
  for (var i = 0; i < objs.length; i++) {
    objs[i].style.color = colour;
  }//for
}//setFillInfo


function prepare__ (qId, fldName) {
  window.console.log("prepare__(" + qId + ":" + fldName + ")");
  if (!document.getElementById(qId).hidden) {
    document.getElementById(qId).style.display = "flex";
    setFillInfo (qId, "black");
  }//if
  return true;
}//prepare__


function verify__ (qId, fldName) {
  window.console.log("verify__(" + qId + ":" + fldName + ")");
  document.getElementById(qId).style.display = "none";
  return true;
}//verify__


function verifyNumber (qId, fldName, checkRange = false, minValue = 0, maxValue = 0) {
  window.console.log("ver(" + qId + ":" + fldName + ")");
  let field = document.questForm[fldName];
  let isOk = true;
  let number = parseInt(field.value);
  if (number && (!checkRange || minValue <= number && number <= maxValue)) {
    saveVariable(fldName, field.value);
    setCookie(fldName, field.value);
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
    //if (number < 33) {
    //  document.questForm.rB[1].checked = true;
    //}//if
    //else {
    //  document.questForm.rB[2].checked = true;
    //}//else
  } else {
    field.value = "";
    setFillInfo (qId, "red");
    isOk = false;
  }//else
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
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
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
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
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
    setFillInfo (qId, "green");
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
    setFillInfo (qId, "green");
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
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
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
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
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
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
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
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
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


//=====================================================================================
//ZMIANA - POCZĄTEK BLOKU ZMIAN 6/6 Example.scr
//-------------------------------------------------------------------------------------


function loadQuestsElements () {
  let objs;
  let i;
  window.console.log("loadQuestsElements");
  //"quest-intv_num",  "intv_num",

  //"quest-intro0",    "intro0",

  //"quest-rA",        "rA",

  //"quest-rB",        "rB",

  //"quest-rC",        "rC",

  //"quest-rD",        "rD",

  //"quest-rE",        "rE",

  //"quest-rF",        "rF",

  //"quest-rG",        "rG",

  //"quest-rH",        "rH",

  //"quest-rI",        "rI",

  //"quest-rJ",        "rJ",

  //"quest-rK",        "rK",
  window.console.log("load rK");
  objs = document.getElementById("quest-rK").getElementsByTagName("img");
  for (i = 0; i < objs.length; i++) {
    objs[i].src = objs[i].src.replace("__pics__", "_pics_");
  }//for
  document.getElementById("images-slider-rK").onscroll = (function () {
    let counter = 0;
    let scrollMin_rK = 0;
    return function (event) {
      if (counter == 0) {
        event.target.scrollLeft = 0;
      }//if
      scrollMin_rK = event.target.scrollWidth - event.target.clientWidth;
      if (50 < scrollMin_rK) {
        scrollMin_rK -= 50;
      }//if
      counter++;
      window.console.log(counter + ":scrollLeft=" + event.target.scrollLeft + ", scrollWidth=" + event.target.scrollWidth + ", scrollMin_rK=" + scrollMin_rK);
      if (scrollMin_rK <= event.target.scrollLeft) {
        document.getElementById("prev-button").style.visibility = "visible";
        document.getElementById("next-button").style.visibility = "visible";
        imagesScrolled_rK = true;
      }//if
    };//function
  })();//function

  //"quest-rL",        "rL",
  window.console.log("load rL");
  objs = document.getElementById("quest-rL").getElementsByTagName("source");
  for (i = 0; i < objs.length; i++) {
    objs[i].src = objs[i].src.replace("__pics__", "_pics_");
  }//for
  document.getElementById("filmik").load();//hmmmmm

  let rM_rN_Tab = [["rMNnazwa1", "rMNNazwa1"],
                   ["rMNnazwa2", "rMNNazwa2"],
                   ["rMNnazwa3", "rMNNazwa3"],
                   ["rMNnazwa4", "rMNNazwa4"],
                   ["rMNnazwa5", "rMNNazwa5"],
                   ["rMNnazwa6", "rMNNazwa6"],
                   ["rMNnazwa7", "rMNNazwa7"],
                   ["rMNnazwa8", "rMNNazwa8"],
                   ["rMNnazwa9", "rMNNazwa9"],
                   ["rMNnazwa10", "rMNNazwa10"],
                   ["rMNnazwa11", "rMNNazwa11"],
                   ["rMNnazwa12", "rMNNazwa12"]];
  //"quest-rM",        "rM",
  window.console.log("load rM");
  let selObj = document.getElementById("rM"),
      optObj;
  while (selObj.length) {
    selObj.removeChild(selObj.getElementsByTagName("option")[0]);
  }//while
  for (i = 0; i < rM_rN_Tab.length; i++) {
    optObj = document.createElement("option");
    optObj.value = rM_rN_Tab[i][0];
    optObj.innerHTML = rM_rN_Tab[i][1];
    selObj.appendChild(optObj);
  }//for

  //"quest-rN",        "rN",
  window.console.log("load rN");
  selObj = document.getElementById("rN");
  while (selObj.length) {
    selObj.removeChild(selObj.getElementsByTagName("option")[0]);
  }//while
  for (i = 0; i < rM_rN_Tab.length; i++) {
    optObj = document.createElement("option");
    optObj.value = rM_rN_Tab[i][0];
    optObj.innerHTML = rM_rN_Tab[i][1];
    selObj.appendChild(optObj);
  }//for

//"quest-wait01",    "wait01",

//"quest-rZ",        "rC",

}//function loadQuestsElements


//quest-intv_num
//function prepareInt_num () {}
//function verifyInt_num () {}
function intvNumIsInRange (iNum, withRotations, ...ranges) {
  window.console.log("intvNumIsInRange(" + iNum + "," + withRotations + "," + ranges.length);
  let isOk = false;
  let i;
  if (withRotations == undefined || withRotations) {
    let rlen = rotations.length;
    for (i = 0; i < rlen && rotations[i][0] != iNum; i++);
    isOk = i < rlen;
  } else {
    if (ranges.length) {
      if (ranges.length == 1 && Array.isArray(ranges[0])) {
        for (i = 0; !isOk && i < ranges[0].length; i++) {
          if (ranges[0][i++] <= iNum) {
            isOk = i == ranges[0].length || iNum <= ranges[0][i];
          }//if
        }//for
      } else {
        for (i = 0; !isOk && i < ranges.length; i++) {
          if (ranges[i++] <= iNum) {
            isOk = i == ranges.length || iNum <= ranges[i];
          }//if
        }//for
      }//else
    } else {
      isOk = 1 <= iNum && iNum <= 110 || 1001 <= iNum && iNum <= 1110;
    }//else
  }//else
  return isOk;
}//function intvNumIsInRange


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


//quest-rA
//function prepare__ (qId, fldName) {}
function verifyQuest_rA (qId, fldName) {
  window.console.log("verifyQuest_rA(" + qId + ":" + fldName + ")");
  return verifyQuestMultiNoth(qId, fldName, 16, 16);
}//verifyQuest_rA


//quest-rB
function prepareQuest_rB (qId, fldName) {
  for (var i = 1; i <= 16; i++) {
    document.questForm[fldName + "_" + i].disabled = !document.questForm["rA_" + i].checked;
    if (document.questForm[fldName + "_" + i].disabled) {
      document.questForm[fldName + "_" + i].checked = false;
    }//if
    window.console.log(".");
  }//for
  if (document.questForm.rA_16.checked) {
    document.getElementById("rBt16").innerHTML = document.questForm.rAt16.value;
  }//if
  return prepare__(qId, fldName);
}//prepareQuest_rB
function verifyQuest_rB (qId, fldName) {
  return verifyQuestMultiN (qId, fldName, 16);
}//verifyQuest_rB


//quest-rC
function prepareQuest_rC (qId, fldName) {
  for (var i = 1; i <= 16; i++) {
    document.questForm[fldName + "_" + i].disabled = !document.questForm["rB_" + i].checked;
    if (document.questForm[fldName + "_" + i].disabled) {
      document.questForm[fldName + "_" + i].checked = false;
    }//if
    window.console.log(".");
  }//for
  if (document.questForm.rA_16.checked) {
    document.getElementById("rCt16").innerHTML = document.questForm.rAt16.value;
  }//if
  return prepare__(qId, fldName);
}//prepareQuest_rC
function verifyQuest_rC (qId, fldName) {
  return verifyQuestSingle(qId, fldName);
}//verifyQuest_rC


//quest-rD
//function prepare__ (qId, fldName) {}
//function verifyQuestSingle (qId, fldName) {}


//quest-rE
//function prepare__ (qId, fldName) {}
//function verifyQuestSingle (qId, fldName) {}


//quest-rF
//function prepare__ (qId, fldName) {}
//function verifyQuestRange (qId, fldName) {}


//quest-rG
function prepareQuest_rG (qId, fldName) {
  document.getElementById(qId).hidden = document.questForm.rF.value < 0;
  return prepare__(qId, fldName);
}//prepareQuest_rG
//function verifyQuestOpen (qId, fldName) {}


//quest-rH
function prepareQuest_rH (qId, fldName) {
  document.getElementById(qId).hidden = 0 < document.questForm.rF.value;
  return prepare__(qId, fldName);
}//prepareQuest_rH
//function verifyQuestOpen (qId, fldName) {}


//quest-rI
//function prepare__ () {}
function verifyQuest_rI (qId, fldName) {
  return verifyQuestSingleN (qId, fldName, 12);
}//verifyQuest_rI


//quest-rJ
//function prepare__ () {}
function verifyQuest_rJ (qId, fldName) {
  return verifyQuestRangeN (qId, fldName, 12);
}//verifyQuest_rJ


//quest-rK
var imagesScrolled_rK = false;
function prepareQuest_rK (qId, fldName) {
  window.console.log("prepareQuest_rK(" + qId + ":" + fldName + ")");
  window.console.log("imagesScrolled_rK=" + imagesScrolled_rK);
  if (!document.getElementById(qId).hidden) {
    if (imagesScrolled_rK || document.getElementById(qId).getElementsByTagName("img").length < 2) {
      document.getElementById("prev-button").style.visibility = "visible";
      document.getElementById("next-button").style.visibility = "visible";
    } else {
      document.getElementById("prev-button").style.visibility = "hidden";
      document.getElementById("next-button").style.visibility = "hidden";
    }//else
    document.getElementById(qId).style.display = "flex";
    setFillInfo(qId, "black");
  }//if
  return true;
}//prepareQuest_rK
function verifyQuest_rK (qId, fldName) {
  window.console.log("verifyQuest_rK");
  imagesScrolled_rK = verifyQuestSingle(qId, fldName);
  if (imagesScrolled_rK) {
    document.getElementById("prev-button").style.visibility = "visible";
    document.getElementById("next-button").style.visibility = "visible";
  }//if
  return imagesScrolled_rK;
}//verifyQuest_rK


//quest-rL
var moviePlayed_rL = false;
var filmikTimeout = 0;
function prepareQuest_rL (qId, fldName) {
  let objs,
      movieLength = 18-5,
      i;
  window.console.log("prepareQuest_rL(" + qId + ":" + fldName + ")");
  if (!document.getElementById(qId).hidden) {
    if (moviePlayed_rL) {
      document.getElementById("prev-button").style.visibility = "visible";
      document.getElementById("next-button").style.visibility = "visible";
    } else {
      document.getElementById("prev-button").style.visibility = "hidden";
      document.getElementById("next-button").style.visibility = "hidden";
      document.getElementById("filmik").play();
      filmikTimeout = window.setTimeout(function() {
          document.getElementById("prev-button").style.visibility = "visible";
          document.getElementById("next-button").style.visibility = "visible";
          moviePlayed_rL = true;
          filmikTimeout = 0;
        },
        movieLength*1000);
    }//else
    document.getElementById(qId).style.display = "flex";
    setFillInfo (qId, "black");
  }//if
  return true;
}//prepareQuest_rL
function verifyQuest_rL (qId, fldName) {
  window.console.log("verifyQuest_rL: filmikTimeout=" + filmikTimeout);
  if (filmikTimeout) {
    window.clearTimeout(filmikTimeout);
    document.getElementById("prev-button").style.visibility = "visible";
    document.getElementById("next-button").style.visibility = "visible";
    document.getElementById("filmik").pause();
  }//if
  moviePlayed_rL = verifyQuestSingle(qId, fldName);
  return moviePlayed_rL;
}//verifyQuest_rL


//quest-rM
// prepare__ (qId, fldName);
function verifyQuest_rM (qId, fldName) {
  let field = document.questForm[fldName];
  let isOk = false;
  let i;
  window.console.log("verifyQuest_rM(" + qId + ":" + fldName + ")='" + field.length + "'");
  //window.alert(qId);
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    for (i = 0; i < field.length && (!field[i].selected || field[i].hidden); i++);
    isOk = i < field.length && field[i].selected && !field[i].hidden;
  }//else
  if (isOk) {
    for (i = 0; i < field.length; i++) {
      if (field[i].selected) {
        setCookie(fldName + "_" + (i+1), field[i].value);
        saveVariable(fldName + "_" + (i+1), field[i].value);//saveVariable(fldName + "_" + i, field[i].value);
        window.console.log("=>'" + field[i].value + "'");
      }//if
    }//for
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
  return isOk;
}//verifyQuest_rM

//quest-rN
function prepareQuest_rN (qId, fldName) {
  let field = document.questForm[fldName];
  let master = document.questForm.rM;
  let i;
  window.console.log("prepareQuest_rN(" + qId + ":" + fldName + ")");
  for (i = 0; i < field.length; i++) {
    field[i].hidden = !master[i].selected;
  }//for
  return prepare__ (qId, fldName);
}//prepareQuest_rN
function verifyQuest_rN (qId, fldName) {
  let field = document.questForm[fldName];
  let isOk = false;
  let i;
  window.console.log("verifyQuest_rN(" + qId + ":" + fldName + ")='" + field.length + "'");
  //window.alert(qId);
  if (document.getElementById(qId).hidden) {
    isOk = true;
  } else {
    for (i = 0; i < field.length && (!field[i].selected || field[i].hidden); i++);
    isOk = i < field.length && field[i].selected && !field[i].hidden;
  }//else
  if (isOk) {
    setCookie(fldName, field[i].value);
    saveVariable(fldName, field[i].value);
    window.console.log("=>'" + field[i].value + "'");
    setFillInfo (qId, "green");
    document.getElementById(qId).style.display = "none";
  } else {
    setFillInfo (qId, "red");
  }//else
  return isOk;
}//verifyQuest_rN


//"quest-wait01",    "wait01",


//quest-rZ
//function prepare__ (qId, fldName) {}
//function verifyQuestSingle () {}


//-------------------------------------------------------------------------------------
//ZMIANA - KONIEC BLOKU ZMIAN 6/6 Example.scr
//=====================================================================================


function errorAlert (text1, text2, color) {
  document.getElementById("reload-text1").innerHTML = text1;
  document.getElementById("reload-text2").innerHTML = text2;
  if (color === undefined) color = "black";
  document.getElementById("reload-text1").style.color = color;
  document.getElementById("reload-text2").style.color = color;
  document.getElementById("reload-survey-info").style.display = "block";
}//function errorAlert


//=====================================================================================
function phpCheck () {
  let xhr;
  xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {// && this.status == 200
      window.console.log("phpCheck: response:" + this.responseText + ", status:" + this.statusText);
      phpIsWorking = this.responseText.indexOf("<?php") != 0;
    }//if
  };//function()
  xhr.open("GET", "../php/phpCheck.php");
  xhr.send();
}//function phpCheck


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
  getDateTime("initAll_" + parIntvNum);

  //firstIntvNum, lastIntvNum,   intvNumType,   intvNumAuto, intvNumTable, intvNumGiven, intvNumShow
  if (surveyId == -1) {
    errorAlert("Błąd: Brak identyfikatora badania.", "");
    return 1;
  }//if
  document.getElementById("survey-id-info").innerHTML = surveyId;
  if (stageNo != -1)
    document.getElementById("survey-id-info").innerHTML += "." + stageNo;
  if (userId == -1) {
    errorAlert("Błąd: Brak identyfikatora użytkownika.", "");
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
        case "StageNo":    ckStageNo   = ckValue; break;
        case "UserId" :    ckUserId    = ckValue; break;
        case "IntvNum" :   ckIntvNum   = ckValue; break;
        case "StartTime" : ckStartTime = ckValue; break;
        case "EndTime" :   ckEndTime   = ckValue; break;
      }//switch
    }//for od ciasteczek
    window.console.log("ckSId=" + ckSurveyId + ", sId=" + surveyId + ", ckSNo=" + ckStageNo + ", sNo=" + stageNo + ", ckUserId=" + ckUserId + ", userId=" + userId + ", ");
    window.console.log("parIntvNum=" + parIntvNum + ", ckIntvNum=" + ckIntvNum + ", ckStartTime=" + ckStartTime + ", ckEndTime=" + ckEndTime + ".");
    if (ckSurveyId != -1 && ckSurveyId == surveyId &&
        ckStageNo == stageNo &&
        ckUserId == userId &&
        ckIntvNum != -1 && (parIntvNum == -1 || ckIntvNum == parIntvNum) &&
        ckStartTime != -1 && ckStartTime != "" && ckEndTime == "started_") { //SĄ JAKIEŚ DANE W CIASTECZKACH Z NIESKOŃCZONEGO WYWIADU
      if (isIntvNumStarted(ckUserId, ckIntvNum, ckStageNo)) {//I WYWIAD JEST started
        document.getElementById("restore-progress").style.display = "none";  //zapytanie czy z niego skorzystać
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
