document.getElementById('group-tabs').addEventListener('click', async () => {
    const statusMessage = document.getElementById('status-message');
  
    const tabs = await chrome.tabs.query({});
    const domains = {};
  
    tabs.forEach(tab => {
      const url = new URL(tab.url);
      const domain = getDomainName(url.hostname);
  
      if (!domains[domain]) {
        domains[domain] = [];
      }
      domains[domain].push(tab);
    });
  
    let groupsCreated = 0;
  
    for (const domain in domains) {
      const tabIds = domains[domain].map(tab => tab.id);
  
      if (tabIds.length > 1) {
        const groupId = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(groupId, { title: domain });
        groupsCreated++;
        await chrome.tabGroups.update(groupId, { collapsed: true });
      }
    }
  
    if (groupsCreated > 0) {
      statusMessage.textContent = `Successfully grouped ${groupsCreated} sets!`;
    } else {
      statusMessage.textContent = 'No tabs were grouped.';
    }
  });
  
  document.getElementById('ungroup-tabs').addEventListener('click', async () => {
    const statusMessage = document.getElementById('status-message');
  
    const tabGroups = await chrome.tabGroups.query({});
  
    for (const group of tabGroups) {
      const tabIds = await chrome.tabs.query({ groupId: group.id });
      await chrome.tabs.ungroup(tabIds.map(tab => tab.id));
    }
  
    statusMessage.textContent = 'All tabs have been ungrouped.';
  });
  
  document.getElementById('sort-group-tabs').addEventListener('click', async () => {
    const statusMessage = document.getElementById('status-message');
  
    const tabs = await chrome.tabs.query({});
    const domains = {};
  
    tabs.forEach(tab => {
      const url = new URL(tab.url);
      const domain = getDomainName(url.hostname);
  
      if (!domains[domain]) {
        domains[domain] = [];
      }
      domains[domain].push(tab);
    });
  
    const sortedDomains = Object.keys(domains).sort();
  
    let groupsCreated = 0;
  
    for (const domain of sortedDomains) {
      const tabIds = domains[domain].map(tab => tab.id);
  
      if (tabIds.length > 1) {
        const groupId = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(groupId, { title: domain });
        groupsCreated++;
        await chrome.tabGroups.update(groupId, { collapsed: true });
      }
    }
  
    if (groupsCreated > 0) {
      statusMessage.textContent = `Tabs sorted alphabetically and grouped!`;
    } else {
      statusMessage.textContent = 'No tabs were grouped.';
    }
  });
  
  document.getElementById('change-color-theme').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: changeTabColorTheme
      });
    });
  });
  
  function changeTabColorTheme() {
    document.querySelectorAll('tab-selector').forEach(tab => {
      tab.style.backgroundColor = '#newColor'; // Update this with your desired color
    });
  }
  
  function getDomainName(hostname) {
    let domain = hostname.replace(/^www\./, '');
  
    const parts = domain.split('.');
    if (parts.length >= 2) {
      domain = parts[parts.length - 2];
    }
  
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  }
  