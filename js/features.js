  /**
   * Author: Shibin George
   *         https://www.linkedin.com/in/sg1993
   **/

function queryTabs(addNewProfile) {

  //code to query the tabs
  var s = "";
  if(addNewProfile){
    description = 'Select the tabs to save: \n';
    buttonText = 'Add selected tab(s)';
  } else {
    description = 'Select the tabs to add to existing Session: \n';
    buttonText = 'Add selected tab(s) to existing Session';
  }

  chrome.tabs.query({'currentWindow':true}, function(tabs){
    var checkList = document.createElement("div");
    checkList.setAttribute("id", "checklist");
    document.getElementById('status').innerHTML = description;
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
      var shortname = returnShortName(s, 30/*displayLength*/);
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
          var c = document.getElementById('CheckAll');
          c.className = 'Profile';
        }
      }

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
    var button = document.createElement("BUTTON");
    var t = document.createTextNode(buttonText);
    button.appendChild(t);
    document.getElementById('checklist').appendChild(button);
    button.addEventListener("click", function(){
      finalizeChoice(addNewProfile);
    });
  });
}

function addToProfile(){
  // queryTabs to list
  // which tabs to add to a Session
  // Send "false" to indicate not to create a new session
  queryTabs(false);
}

function processProfiles(deleteProfile, callback){

  //list all the profiles
  if(deleteProfile){
    url = 'assets/delete.png';
    buttonText = 'Delete selected session(s)';
  } else {
    url = 'assets/add_to.png';
    buttonText = 'Add tabs to selected session(s)';
  }

  chrome.storage.local.get(null, function(items){
    var allKeys = Object.keys(items);
    console.log(allKeys);
    renderStatus('');
    var status = document.getElementById('status');

    if(!deleteProfile){
      var checkList = document.createElement("div");
      checkList.setAttribute("id", "checklist");
      document.getElementById('status').innerHTML = 'Select which existing session(s) to add to:';
      addSeparator('status');
      document.getElementById('status').appendChild(checkList);
    }
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
          var c = document.getElementById('CheckAll');
          c.className = 'Profile';
        }
      }
      box.innerHTML = "<img class='icon' src=" + chrome.extension.getURL(url) + "></img>\t" + allKeys[i];
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

    addSeparator('status');
    //add a button to finalise the list
    var button = document.createElement("BUTTON");
    var t = document.createTextNode(buttonText);       // Create a text node
    button.appendChild(t);
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

      if(numChoices <= 0){
        renderStatus('You must choose atleast one session');
      } else if (deleteProfile){
        //renderStatus('You have chosen to delete\n' + s);
        chrome.storage.local.remove(value, function(){
          renderStatus('Successfully removed selected sessions(s)');
        });
      } else {
        callback(value);
        renderStatus('Session(s) modified successfully');
      }
    });
  });
}
