$(document).ready(function(){
  formatEventBind();
  removeWhiteSpacesEventBind();
  initRenameTab();
  showJSONText(true);
  viewJsonEventBind();
  aboutEventBind();
});

function formatEventBind() {
  $('.format').on('click', function(){
    showJSONText(true);

    var txt = $('#txt-json-expected').val();
    if(txt == '') {
      alert('Empty text not fotmatted');
      return;
    }

    // preserve newlines, etc - use valid JSON
    var s = txt.replace(/\\n/g, "\\n")  
                   .replace(/\\'/g, "\\'")
                   .replace(/\\"/g, '\\"')
                   .replace(/\\&/g, "\\&")
                   .replace(/\\r/g, "\\r")
                   .replace(/\\t/g, "\\t")
                   .replace(/\\b/g, "\\b")
                   .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    s = s.replace(/[\u0000-\u0019]+/g,""); 

    try {
      var obj = JSON.parse(s);
      var jsonF = JSON.stringify(obj, undefined, 2);

      $('#txt-json-expected').val(jsonF);
    } catch(e) {
      showErrorMessage('Unable to parse input data.');
    }

  });
}

function viewJsonEventBind() {
  $('.viewer').on('click', function(){
    var data = $('#txt-json-expected').val();

     var s = data.replace(/\\n/g, "\\n")  
                   .replace(/\\'/g, "\\'")
                   .replace(/\\"/g, '\\"')
                   .replace(/\\&/g, "\\&")
                   .replace(/\\r/g, "\\r")
                   .replace(/\\t/g, "\\t")
                   .replace(/\\b/g, "\\b")
                   .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    s = s.replace(/[\u0000-\u0019]+/g,"");

    try{
      var obj = JSON.parse(s);
      displayJSON(obj);
    }catch(e) {
      showErrorMessage('Unable to parse input data.');
    }    
  });
}

function removeWhiteSpacesEventBind() {
  $('.compact').on('click', function(){
    
    showJSONText(true);
    var txt = $('#txt-json-expected').val();
    if(txt == '') {
      alert('Empty text not fotmatted');
      return;
    }

    try {
      var obj = JSON.parse(txt);
      var jsonF = JSON.stringify(obj);

      $('#txt-json-expected').val(jsonF);
    } catch(e) {
      showErrorMessage('Unable to parse input data.');
    } 
  });
}

function aboutEventBind() {
  $('.about').on('click', function() {
    aboutDialog.dialog('open');
  });
}

function displayJSON(input) {
  //document.body
  $('#view-container').html('');
  document.getElementById("view-container").appendChild(
        renderjson(input)
    );
  $('#txt-json-expected').hide();
  $('#view-container').show();
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function usingWraper(input) {
  var wrapper = document.getElementById("output-view");
  // Get json-data by javascript-object
  var data = {
      "firstName": "Jonh",
      "lastName": "Smith",
      "phones": [
          "123-45-67",
          "987-65-43"
      ]
  };

  // or from a string by JSON.parse(str) method
  var dataStr = '{ "firstName": "Jonh", "lastName": "Smith", "phones": ["123-45-67", "987-65-43"]}';
  try {
      var data = JSON.parse(dataStr);
  } catch (e) {}
    // Create json-tree
  var tree = jsonTree.create(data, wrapper);

  // Expand all (or selected) child nodes of root (optional)
  tree.expand(function(node) {
     return node.childNodes.length < 2 || node.label === 'phoneNumbers';
  });

  $('#txt-json-expected').hide();
  $('#output-view').show(); 
}

function initRenameTab() {
  $('.rename-tab').on('click', function(){
    var tID = w2ui.tabs.active;
    var tName = XOXO_APP.getTabName(tID);
    $('.txt-tab-name input').val(tName);
    $(this).hide();
    $('.txt-tab-name').show();
  });

  $('.txt-tab-name').on('focusout', function(){
    $('.rename-tab').show();
    $(this).hide();
    var tID = w2ui.tabs.active;
    var nName = $('.txt-tab-name input').val();
    XOXO_APP.setTabName(tID, nName);

    for(let a of w2ui.tabs.tabs) {
      if(a.id == tID) {
        a.text = nName;
      }
    }

    w2ui.tabs.refresh()
  });
}

function showJSONText(value) {
  if(value) {
    $('#view-container').hide();
    $('#txt-json-expected').show();
  } else {
    $('#view-container').show();
    $('#txt-json-expected').hide();
  }
}

function showErrorMessage(message) {
  $("#error-div").html(message);
  $("#error-div").fadeIn('slow', function() {
    setTimeout(function() { $("#error-div").fadeOut('slow') }, 3000);
  });  
}