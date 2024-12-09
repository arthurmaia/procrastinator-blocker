function createUrlValidator(urlPattern) {
  const basePattern = urlPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapa caracteres especiais
  return new RegExp(
    `^(https?:\\/\\/)?(www\\.)?${basePattern}(\\.[a-z]{2,3})?(\\.[a-z]{2})?(\\/|$)`,
    "i"
  );
}

chrome.webNavigation.onBeforeNavigate.addListener(
  function (details) {
    if (details.frameId !== 0) return; // Garante que é a navegação principal

    chrome.storage.sync.get(
      ["blockedUrls", "isBlockerActive"],
      function (result) {
        const isBlockerActive = result.isBlockerActive || false;

        if (!isBlockerActive) return;

        const blockedUrls = result.blockedUrls || [];

        // Verifica se o domínio principal da URL está bloqueado
        const isBlocked = blockedUrls.some((blockedUrl) => {
          const urlRegex = createUrlValidator(blockedUrl);
          return urlRegex.test(new URL(details.url).hostname); // Valida apenas o hostname
        });

        if (isBlocked) {
          const blockedUrl = encodeURIComponent(details.url);

          chrome.tabs.update(details.tabId, {
            url: `${chrome.runtime.getURL("blocked.html")}?url=${blockedUrl}`,
          });
        }
      }
    );
  },
  { url: [{ urlMatches: ".*" }] }
);
