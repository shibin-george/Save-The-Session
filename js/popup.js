  /**
   * Author: Shibin George
   *         https://www.linkedin.com/in/sg1993
   **/



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
    button.innerHTML = '\n** NOTE: The profile name above is randomly generated.\
    \nIt is highly recommended that you change the name\
    \nto something not used before. Otherwise, this may\
    \nlead to the profile being overwritten. Keep it short and simple.\
    \nBeam me up, Scotty!\
    \n\
    \n'
    var b = document.createElement("BUTTON");
    var t = document.createTextNode("Save The Session");
    b.appendChild(t);
    button.appendChild(b);
    button.style.fontSize = "smaller";
    button.style.color = "red";
    status.appendChild(button);

    b.onclick = function(){
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
    newProfile.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/new.png') + "></img>    Save The Session";
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

    addSeparator('status');

    // Add Soure-code link
    var sourceCode = document.createElement("div");
    sourceCode.setAttribute("id", "sourceCode");
    sourceCode.setAttribute("class", "AboutOption");
    var version = chrome.runtime.getManifest().version;
    sourceCode.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/Octocat/Octocat.png') + "></img>\t<a href='https://github.com/sg1993/Save-The-Session' target='_blank'>Know more about the extension</a>"
                         + " (v" + version + ")";
    status.appendChild(sourceCode);

    // Add Linkedin profile as well
    var developer = document.createElement("div");
    developer.setAttribute("id", "sourceCode");
    developer.setAttribute("class", "AboutOption");
    developer.innerHTML = "<img class='icon' src=" + chrome.extension.getURL('assets/developer.png') + "></img>\t<a href='https://in.linkedin.com/in/sg1993' target='_blank'>Wanna know more about me?</a>";
    status.appendChild(developer);

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
