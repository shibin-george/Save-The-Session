/**
 * Author: Shibin George
 *         B.Tech CSE(4/4), Class of 2015
 *         National Institute of Technology, Warangal
 **/

function getData(callback, errorCallback) {

  //code to query the tabs
  var s = "";
  var padding = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  chrome.tabs.query({'currentWindow':true}, function(tabs){
    var checkList = document.createElement("div");
    checkList.setAttribute("id", "checklist");
    document.getElementById('status').innerHTML = 'The open tabs are: \n';
    document.getElementById('status').appendChild(checkList);

    //code for appropriate padding
    var maxlen = 0;
    for(i=0;i<tabs.length;i++){
      s = tabs[i].url;
      maxlen = Math.max(maxlen, s.length);
    }
    var displayLength = maxlen - 3*maxlen/4;

    displayLength = Math.min(displayLength, 60);
    //console.log(maxlen + ' \tdisplayLength = ', displayLength);

    for(i=0;i<tabs.length;i++){
      var s = tabs[i].url;
      var shortname="";
      if(s.length > displayLength){
        shortname = s.substring(0, displayLength) + '..';
      } else {
        shortname = s;
      }

      //add a checkbox by the tab's name
      var box = document.createElement("div");
      box.setAttribute("id", "Checkboxes"+i);
      box.innerHTML = '<input type="checkbox" name="Select">\t' + shortname;

      //add the checkbox to the list
      document.getElementById('checklist').appendChild(box);      
    }

    //add a checkbox to select all
    var box = document.createElement("div");
    box.setAttribute("id", "CheckAll");
    box.innerHTML = '\n<input type="checkbox" id="SelectALL">\t' + 'Click Here to select All\n';
    document.getElementById('checklist').appendChild(box);

    //add an event handler for the 'Select all' checkbox
    //this invokes the toggle() function
    document.getElementById('SelectALL').onchange = function(){
      toggle();
    };

    //add a button to finalise the list
    var button = document.createElement("div");
    button.setAttribute("id", "OKButton");
    button.innerHTML = '\n<button> Click to add </button>';
    button.onclick = function(){
      finalizeChoice();
    }
     
    document.getElementById('checklist').appendChild(button);
  });
}

function toggle(){  
  var c = document.getElementById('SelectALL');
  var bool = c.checked;
  //renderStatus(" " + bool + "");
  var checks = document.getElementsByName('Select');

  for(i=0;i<checks.length;i++){
    //console.log('toggle called for ' + i + ' currently ' + checks[i].checked);
    if(checks[i].type=='checkbox'){
      checks[i].checked = bool;
    }
  }
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {  
    renderStatus('Loading the content...');
    getData({
    }, function(errorMessage) {
      renderStatus('Cannot display results: ' + errorMessage);
    });
  });