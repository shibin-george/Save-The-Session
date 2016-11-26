function shipProfile(){

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