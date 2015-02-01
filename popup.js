/**
 * Author: Shibin George
 *         B.Tech CSE(4/4), Class of 2015
 *         National Institute of Technology, Warangal
 **/

function getData(callback, errorCallback) {

  //code to query the tabs
  var s = "";
  chrome.tabs.query({'currentWindow':true}, function(tabs){
    var checkList = document.createElement("div");
    checkList.setAttribute("id", "checklist");
    document.appendChild(checkList);

    for(i=0;i<tabs.length;i++){
      var s = tabs[i].url;
      var shortname="";
      if(s.length > 30){
        shortname = s.substring(0, 25) + '...';
      } else {
        shortname = s ;
      }
      var box = document.createElement("div");
      box.setAttribute("id", "Checkboxes");
      var chbox = document.createElement("input");
      chbox.setAttribute("type", "checkbox");
      chbox.setAttribute("name", s);
      box.innerHTML = shortname;
      box.appendChild(chbox);
      
      //box.appendChild(checkbox);
      document.getElementById('checklist').appendChild(box);
    }
    var box = document.createElement("div");
    box.setAttribute("id", "CheckAll");
    box.setAttribute("onchange", "checkAll(this)");
    box.innerHTML = 'Click Here to select All <input type="checkbox" name=SelectALL>';
      
    //box.appendChild(checkbox);
    document.getElementById('checklist').appendChild(box);
    //renderStatus(s);
    //var numTabs = document.getElementById('Checkboxes')[0].name;
    //renderStatus('' + numTabs);
    document.getElementById('CheckAll').addEventListener('change', function(){
      //renderStatus("ALLLLLLLLLLL");
      var checks = document.getElementById('Checklist').childNodes;
      var bool = document.getElementById('CheckAll').checked;
      for(i=0;i<checks.length;i++){
        checks[i].setAttribute("checked", bool);
      }
      //var numTabs = document.getElementById('checklist').length;
      //renderStatus(numTabs);
    });

  });
  
  
  //renderStatus(s);

  /*for(i=0;i<1000;i++){
    for(j=0;j<1000;j++){
      renderStatus("asdad");
    }
  }*/
  //renderStatus(s);
  /*x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();*/
}

function checkAll(ele){
  renderStatus('asdad');
  /*var checks = document.getElementById('Checklist').childNodes;
  var bool = document.getElementById('CheckAll').checked;
  for(i=0;i<checks.length;i++){
    checks[i].setAttribute("checked", bool);
  }*/
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  
    renderStatus('Loading the content...');

    getData({

      //renderStatus('Search term: ' + url + '\n' +
      //    'Google image search result: ' + imageUrl);
      

    }, function(errorMessage) {
      renderStatus('Cannot display results: ' + errorMessage);
    });
  });
