
async function publishToGitHub(jsonData) {
    const cfg = window.CMS_CONFIG;

    if (!cfg || !cfg.token) {
        alert("GitHub token missing — check cms-config.js");
        return;
    }

    const api = `https://api.github.com/repos/${cfg.repoUser}/${cfg.repoName}/contents/${cfg.dataFile}`;

    // Step 1: get the SHA of the current file
    const getRes = await fetch(api, { cache: "no-store" });
    const getJson = await getRes.json();
    const sha = getJson.sha;

    // Step 2: upload the updated file
    const uploadRes = await fetch(api, {
        method: "PUT",
        headers: {
            "Authorization": `token ${cfg.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "CMS update",
            content: btoa(unescape(encodeURIComponent(jsonData))),
            branch: cfg.branch,
            sha
        })
    });

    const result = await uploadRes.json();

    if (result.commit) {
        alert("✔ Successfully published to GitHub!");
    } else {
        console.error(result);
        alert("❌ Publish failed — check console.");
    }
}
