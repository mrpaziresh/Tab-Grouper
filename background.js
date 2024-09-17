chrome.action.onClicked.addListener(async () => {
    const tabs = await chrome.tabs.query({}); 
    const domains = {};
  
    tabs.forEach(tab => {
      const url = new URL(tab.url);
      const domain = url.hostname;
      

      if (!domains[domain]) {
        domains[domain] = [];
      }
      domains[domain].push(tab);
    });
  

    for (const domain in domains) {
      const tabIds = domains[domain].map(tab => tab.id);
  

      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, { title: domain });
    }
  });
  