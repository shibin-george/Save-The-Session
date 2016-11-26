  /**
   * Author: Shibin George
   *         https://www.linkedin.com/in/sg1993
   **/

function queryTabs(callback, errorCallback) {

  //code to query the tabs
  var s = "";

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
    var t = document.createTextNode("Add selected profile(s)");
    button.appendChild(t);
    document.getElementById('checklist').appendChild(button);
    button.addEventListener("click", function(){
      finalizeChoice();
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
          var c = document.getElementById('CheckAll');
          c.className = 'Profile';
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

    addSeparator('status');
    //add a button to finalise the list
    var button = document.createElement("BUTTON");
    var t = document.createTextNode("Delete selected profile(s)");       // Create a text node
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
