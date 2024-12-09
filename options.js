const submitUrlForm = document.querySelector("#submitUrlForm");
const createUrlModal = new bootstrap.Modal("#createUrlModal");
const createUrlModalDOM = document.querySelector("#createUrlModal");
const urlFormControlInput = document.querySelector("#urlFormControlInput");
const urlsContainer = document.querySelector(".urls-container");
const toggleBlockerCheckbox = document.querySelector("#flexSwitchCheckChecked");

const blockedUrls = [];

function mountUrlsList() {
  urlsContainer.innerHTML = "";

  blockedUrls.forEach((url) => {
    const div = document.createElement("div");
    div.classList.add("d-flex", "justify-content-between");
    const span = document.createElement("span");
    const removeButton = document.createElement("button");
    removeButton.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
    removeButton.innerHTML = "Remover";
    div.classList.add("mb-3");
    span.textContent = url;
    div.appendChild(span);
    div.appendChild(removeButton);
    urlsContainer.appendChild(div);

    removeButton.addEventListener("click", () => {
      blockedUrls.splice(blockedUrls.indexOf(url), 1);

      chrome.storage.sync.set({ blockedUrls });

      this.mountUrlsList();
    });
  });

  chrome.storage.sync.set({ blockedUrls });
}

function initListeners() {
  submitUrlForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const url = urlFormControlInput.value;
    blockedUrls.push(url);

    event.target.reset();

    createUrlModal.hide();

    this.mountUrlsList();
  });

  createUrlModalDOM.addEventListener("shown.bs.modal", () => {
    urlFormControlInput.focus();
  });

  toggleBlockerCheckbox.addEventListener("change", (event) => {
    chrome.storage.sync.set({ isBlockerActive: event.target.checked });
  });

  chrome.storage.sync.get(["blockedUrls"], (result) => {
    const aux = result.blockedUrls || [];

    Object.values(aux).forEach((url) => blockedUrls.push(url));

    this.mountUrlsList();
  });

  chrome.storage.sync.get(["isBlockerActive"], (result) => {
    toggleBlockerCheckbox.checked = result.isBlockerActive || false;
  });
}

function main() {
  initListeners();
}

window.addEventListener("DOMContentLoaded", main);
