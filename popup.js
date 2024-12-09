const toggleBlockerCheckbox = document.querySelector("#flexSwitchCheckChecked");

function initListeners() {
  toggleBlockerCheckbox.addEventListener("change", (event) => {
    chrome.storage.sync.set({ isBlockerActive: event.target.checked });
  });

  chrome.storage.sync.get(["isBlockerActive"], (result) => {
    toggleBlockerCheckbox.checked = result.isBlockerActive || false;
  });
}

function main() {
  initListeners();
}

window.addEventListener("DOMContentLoaded", main);
