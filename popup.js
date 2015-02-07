  /**
   * Author: Shibin George
   *         B.Tech CSE(4/4), Class of 2015
   *         National Institute of Technology, Warangal
   **/

function getData(callback, errorCallback) {

  //code to query the tabs
  var s = "";
  //var padding = "               ";

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

    if(displayLength < 40)
      displayLength = 40;
    if(displayLength > 60)
      displayLength = 40;
    console.log(maxlen + ' \tdisplayLength = ', displayLength);

    for(i=0;i<tabs.length;i++){
      var s = tabs[i].url;
      var shortname=returnShortName(s, displayLength);
      console.log(shortname);
      //add a checkbox by the tab's name
      var box = document.createElement("div");
      box.setAttribute("id", "Checkbox" + i);
      box.setAttribute("name", s);

      //TODO: this here is a vulnerability.
      //if two tabs with the exact same url are open, 
      //this may show undefined behaviour.
      //As per HTML standard, 
      //no two elements should have same ID, document-wide.
      box.innerHTML = '<input type="checkbox" name="Select" id=' + s +'>\t' + shortname;

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

function returnShortName(s, d){
  var shortname="";
  if(s.length > d){
    shortname = s.substring(0, d) + '..';
  } else {
    shortname = s;
  }
  return shortname;
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

function finalizeChoice(){
  // TODO: to be fixed as soon as
  // a workaround to the previous TODO is found.
  var tabs = document.getElementsByName('Select');
  var s = "";
  var numChoices = 0;
  console.log("Number of checkboxes = " + tabs.length);
  for(i=0; i<tabs.length; i++){
    if(tabs[i].checked==true){
      //this particular tab has to be added
      s += returnShortName(tabs[i].id, 40) + "\n";
      numChoices += 1;
    }
  }
  //renderStatus("You have chosen the following tabs:\n" + s);
  document.getElementById('status').innerHTML = '';
  var tnode;
  var status = document.getElementById('status');
  //renderStatus('');
  if(numChoices > 0){      
    var rand = Math.floor(Math.random()*101010);
    var inputHTML = '\nEnter the profile name: <input type="text" id="ProfileName" value="Profile' + rand + '"><br>';
    var buttonHTML = ''
    status.innerHTML = 'You have chosen the following tabs:\n\n' + s + inputHTML ;
    
    var button = document.createElement("div");
    button.setAttribute("id", "ProfileSubmitButton");
    var b = '\n<button> Click to save </button>';
    b += '\n\n** NOTE: The profile name above is randomly generated.\
    \nIt is highly recommended that you change the name\
    \nto something not used before. Otherwise, this may\
    \nlead to the profile being overwritten. Keep it short and simple'
    button.innerHTML = b; 
    button.style.fontSize = "smaller";
    button.style.color = "red";
    status.appendChild(button);

    button.onclick = function(){
      var key = document.getElementById("ProfileName").value;
      var obj = {};
      obj[key] = s;
      chrome.storage.local.set(obj);
      //chrome.
      renderStatus('Profile saved to\n' + key);
      
      //write the profile to the local storage
      //var 
      debug();
    }
  } else {
    status.innerHTML = "You must choose atleat one tab."
  }    
}

function debug(){
  chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;4
}

document.addEventListener('DOMContentLoaded', function() {  
  renderStatus('Loading the content...');
  getData({
  }, function(errorMessage) {
    renderStatus('Cannot display results: ' + errorMessage);
  });
});