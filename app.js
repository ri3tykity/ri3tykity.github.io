var XOXO_APP = (function(){
  var activeTab = 'tab1'; // default tab
  var jsonITEMS = [];

  /* STORAGE IMPLEMENTATION */
  var storage = function(){
    const APP_STORE_NAME = 'XOX_HAHA';

    function getData() {
      var lS = localStorage.getItem(APP_STORE_NAME);
      if(lS) {
        return JSON.parse(lS);
      }
      return [];
    }

    function setData(data) {
      localStorage.setItem(APP_STORE_NAME, JSON.stringify(data));
      return true;
    }

    return {
      getData: getData,
      setData: setData
    }
  };

  var cellMem = function(id, tabName, data) {
    this.id = id;
    this.name = tabName;
    this.data = data;
    this.active = false;
  }

  cellMem.__proto__.getName = function() {
    return this.name;
  }

  function populateData() {
    if(jsonITEMS.length) {
      renderTabUI();

    } else {
      // Brand new opening...
      alert('Welcome to Advanced JSON Viewer. Hope you will enjoy this app.');
      var item1 = new cellMem('tab1', 'Tab 1', '');
      jsonITEMS.push(item1);
      storage().setData(jsonITEMS);
      renderTabUI();
    }
  }

  function renderTabUI() {
    var active = activeTab === undefined ? 'tab1' : activeTab; // last tab should be active.
    var tabs = [];
    var count = 0;
    for(var item of jsonITEMS) {
      if(count == 0) {
        var t = { id: item.id, text: item.name };
        tabs.push(t);
        count++;
      } else {
        var t = { id: item.id, text: item.name, closable: true };
        tabs.push(t);
      }      
    }

    // $('#tabs').html('');
    $('#tabs').w2tabs({
        name: 'tabs',
        active: active,
        tabs: tabs,
        onClick: function (event) {
          var jsonText = getTabData(event.target);
          $('#txt-json-expected').val(jsonText);
          showJSONText(true);
        },
        onClose: function(event) {
            console.log(event.target);
            removeTabData(event.target);
        }
    });

    // get active tab data
    var d = jsonITEMS[0].data;
    $('#txt-json-expected').val(d);
  }

  function addTab() {
    var nextTab = jsonITEMS.length + 1;
    var nTab = new cellMem('tab' + nextTab, 'Tab ' + nextTab, '');
    jsonITEMS.push(nTab);
    storage().setData(jsonITEMS);
    w2ui.tabs.add({ id: nTab.id, text: nTab.name, closable: true });
  }


  function startApp() {
    // Get data from storage
    jsonITEMS = storage().getData();
    // Populate Data
    populateData();
  }

  function getTabData(tabID) {
    for(let item of jsonITEMS) {
      if(item.id == tabID) return item.data;      
    }
    return '';
  }

  function setTabData(tabID, data) {
    for(let item of jsonITEMS) {
      if(item.id == tabID) {
        item.data = data;
        break;
      }
    }
    storage().setData(jsonITEMS);
  }

  function removeTabData(tabID) {
    var position = null;
    for(var i=0;i<jsonITEMS.length;i++) {
      if(jsonITEMS[i].id == tabID) {
        position = i;
        break;
      }
    }
    if(position != null) {
      jsonITEMS.splice(position, 1);
    }
    storage().setData(jsonITEMS);
    // set last tab active
  }

  function getTabName(tabID) {
    for(let item of jsonITEMS) {
      if(item.id == tabID) return item.name;
    }
    return '';
  }

  function setTabName(tabID, name) {
    for(let item of jsonITEMS) {
      if(item.id == tabID) {
        item.name = name;
        break;
      }
    }
    storage().setData(jsonITEMS);
  }

  return {
    log: function() { console.log('xoxo_app started...'); },
    initApp: startApp,
    addTab: addTab,
    setTabData: setTabData,
    getTabName: getTabName,
    setTabName: setTabName
  }
})();