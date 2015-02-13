  /**
   * Author: Shibin George
   *         B.Tech CSE(4/4), Class of 2015
   *         National Institute of Technology, Warangal
   **/

   function queryTabs(callback, errorCallback) {

  //code to query the tabs
  var s = "";
  //dummyLoading(100);

  chrome.tabs.query({'currentWindow':true}, function(tabs){
    var checkList = document.createElement("div");
    checkList.setAttribute("id", "checklist");
    document.getElementById('status').innerHTML = 'Select the tabs to save: \n';
    addSeparator('status');
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
      var shortname = returnShortName(s, displayLength);
      console.log(shortname);
      //add an option by the tab's name
      var box = document.createElement("div");
      box.setAttribute("id", s);
      box.setAttribute("name", "Checkbox");
      box.className = "Profile";
      box.onclick = function(){
        if(this.className == 'Profile'){
          this.className = 'SelectedProfile';
        } else {
          this.className = 'Profile';
        }
      }

      /*  TODO: this here is a vulnerability.
       *  if two tabs with the exact same url are open, 
       *  this may show undefined behaviour.
       *  As per HTML standard, 
       *  no two elements should have same ID, document-wide.
       */
       box.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/new.png') + "></img>\t" + shortname;

      //add the checkbox to the list
      document.getElementById('checklist').appendChild(box);      
    }
    addSeparator('checklist');

    //add a checkbox to select all
    var box = document.createElement("div");
    box.setAttribute("id", "CheckAll");
    //box.setAttribute("class", "Profile");
    box.className = "Profile";
    box.innerHTML = 'Click Here to select All\n';
    document.getElementById('checklist').appendChild(box);

    //add an event handler for the 'Select all' checkbox
    //this invokes the toggle() function
    document.getElementById('CheckAll').onclick = function(){
      toggle();
    };
    addSeparator('checklist');

    //add a button to finalise the list
    var button = document.createElement("div");
    button.innerHTML = '\n<button id="OKButton"> Click to add </button>';
    document.getElementById('checklist').appendChild(button);
    button.addEventListener("click", function(){
      finalizeChoice();
    });    
  });
  
}

function dummyLoading(t){
  var status = document.getElementById('status');
  var w = document.createElement('div');
  w.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/loading.gif') + "</img>";
  status.appendChild(w);
  for(i=0;i<t*1000;i++){
    for(j=0;j<t*1000;j++){

    }
  }
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
  var c = document.getElementById('CheckAll');
  if(c.className == 'Profile'){
    c.className = 'SelectedProfile';
  } else {
    c.className = 'Profile';
  }
  var bool = c.className;
    //renderStatus(" " + bool + "");
    var checks = document.getElementsByName('Checkbox');

    for(i=0;i<checks.length;i++){
    //console.log('toggle called for ' + i + ' currently ' + checks[i].checked);
    //if(checks[i].type=='checkbox'){
      checks[i].className = bool;
    //}
  }
}

function finalizeChoice(){
  /*
   *  TODO: to be fixed as soon as
   *  a workaround to the previous
   * TODO is found.
   */
   var tabs = document.getElementsByName('Checkbox');
   var s = "";
   var value = [];
   var numChoices = 0;
   console.log("Number of checkboxes = " + tabs.length);
   for(i=0; i<tabs.length; i++){
    if(tabs[i].className == 'SelectedProfile'){
      //this particular tab has to be added
      s += returnShortName(tabs[i].id, 40) + "\n";
      value.push(tabs[i].id);
      numChoices += 1;
    }
  }

  document.getElementById('status').innerHTML = '';
  var tnode;
  var status = document.getElementById('status');

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
      obj[key] = value;
      chrome.storage.local.set(obj);
      renderStatus('Profile saved to\t' + key);      
      /*  write the profile to the local storage */
      //debug();
    }
  } else {
    status.innerHTML = "You must choose atleast one tab."
  }    
}

function debug(){
  chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
    for(key in allKeys){
      chrome.storage.local.get(key, function(item) {
        console.log(item[key]);
      });
    }
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function listProfiles(){

  chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);
    //debug();

    /*list all the existing options on loading*/
    var profile = new Array(allKeys.length);;
    var status = document.getElementById('status');
    var profileList = document.createElement("div");
    profileList.setAttribute("id", "ProfileList");
    status.appendChild(profileList);
    
    for(i=0;i<allKeys.length;i++){
      profile[i] = document.createElement("div");
      profile[i].setAttribute("id", allKeys[i]);
      profile[i].setAttribute("class", "Profile");
      profile[i].innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/click.png') + "></img>\t" + allKeys[i];
      profileList.appendChild(profile[i]);

      //profile.setAttribute("onclick", "loadProfile(this.innerHTML)");
      profile[i].addEventListener("click", function(){
        loadProfile(this.id);
      });
      
    }
    addSeparator('status');
     /*
      * Profiles have been loaded.
      * Adding the "Save The Session" option
      */

    //var icon = document.createElement("div");
    //icon.setAttribute("class", "icon");

    var newProfile = document.createElement("div");
    newProfile.setAttribute("id", "NewProfile");
    newProfile.setAttribute("class", "ProfileOption");
    newProfile.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/new.png') + "></img>\tSave The Session";
    newProfile.style.fontWeight = "bold";
    //newProfile.appendChild(icon);
    status.appendChild(newProfile);

    var removeProfile = document.createElement("div");
    removeProfile.setAttribute("id", "RemoveProfile");
    removeProfile.setAttribute("class", "ProfileOption");
    removeProfile.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/delete.png') + "></img>\tRemove saved profile";

    status.appendChild(removeProfile);

    newProfile.addEventListener("click", function(){
      queryTabs({
      }, function(errorMessage) {
        renderStatus('Cannot display results: ' + errorMessage);
      });
    });

    removeProfile.addEventListener("click", function(){
      //renderStatus('remove-profile coming soon');
      deleteProfile();
    });
  }); 
}

function deleteProfile(){

  //list all the profiles
  chrome.storage.local.get(null, function(items){
    var allKeys = Object.keys(items);
    console.log(allKeys);
    renderStatus('');
    var status = document.getElementById('status');

    for(i=0;i<allKeys.length;i++){
      //console.log(allKeys[i] + "\n" + items[allKeys[i]]);
      var box = document.createElement("div");
      box.setAttribute("id", allKeys[i]);
      box.setAttribute("name", "Checkbox");
      box.className = "Profile";
      box.onclick = function(){
        if(this.className == 'Profile'){
          this.className = 'SelectedProfile';
        } else {
          this.className = 'Profile';
        }
      }
      box.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/delete.png') + "></img>\t" + allKeys[i];
      status.appendChild(box);
      
    } 
    addSeparator('status');
    var box = document.createElement("div");
    box.setAttribute("id", "CheckAll");
    //box.setAttribute("class", "Profile");
    box.className = "Profile";
    box.innerHTML = 'Click Here to select All\n';
    document.getElementById('status').appendChild(box);

    //add an event handler for the 'Select all' checkbox
    //this invokes the toggle() function
    document.getElementById('CheckAll').onclick = function(){
      toggle();
    };

    //add a button to finalise the list
    var button = document.createElement("div");
    button.innerHTML = '\n<button id="OKButton"> Click to delete </button>';
    document.getElementById('status').appendChild(button);
    button.addEventListener("click", function(){
      var tabs = document.getElementsByName('Checkbox');
      var s = "";
      var value = [];
      var numChoices = 0;
      console.log("Number of checkboxes = " + tabs.length);
      for(i=0; i<tabs.length; i++){
        if(tabs[i].className == 'SelectedProfile'){
          //this particular tab has to be added
          s += tabs[i].id + "\n";
          value.push(tabs[i].id);
          numChoices += 1;
        }
      } 
      if(numChoices > 0){
        //renderStatus('You have chosen to delete\n' + s);
        chrome.storage.local.remove(value, function(){
          renderStatus('Successfully removed selected profile(s)');
        });
      } else {
        renderStatus('You must choose atleast one profile');
      }
      
    });
  });
}

function addSeparator(parentId){
  var sep = document.createElement("div");
  var parent = document.getElementById(parentId);
  sep.setAttribute("id", "separator1");
  sep.setAttribute("class", "separator");
  parent.appendChild(sep);
}

function loadProfile(profile){

  chrome.storage.local.get(profile, function(item){    
    tabURLs = [];
    console.log(item[profile]);
    //console.log(tabURLs);

    /*
     *  This is where the new window
     *  is created, and populated with
     *  the list of URLs saved in the
     *  profile.
     */
     chrome.windows.create({url:item[profile]}, function(window){
      console.log("hola amigos");
    });
   });
}

function clearLocalStorage(){
  chrome.storage.local.clear(function(){
    console.log(chrome.runtime.lastError);
  });
}

document.addEventListener('DOMContentLoaded', function() {  
  listProfiles();
});