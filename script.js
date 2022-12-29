async function fetchData() {


    let keys = null;

    function deepEqual(x, y) {
        const ok = Object.keys, tx = typeof x, ty = typeof y;
        return x && y && tx === 'object' && tx === ty ? (
            ok(x).length === ok(y).length &&
            ok(x).every(key => deepEqual(x[key], y[key]))
        ) : (x === y);
    }

    function updateMessage() {
        let length = Object.keys(keys).length;
        document.getElementById("detectedNum").innerText = length
        if (length > 0) {
            document.getElementById("export-action").classList.remove("opacity-30");
            document.getElementById("export-action").classList.remove("pointer-events-none");
        } else {
            document.getElementById("export-action").classList.add("opacity-30");
            document.getElementById("export-action").classList.add("pointer-events-none");
        }
    }

    function updateActions(visible) {
        if (visible) {
            document.getElementById("import-action").classList.remove("hidden");
        } else {
            document.getElementById("import-action").classList.add("hidden");
        }
    }

    document.getElementById("export").addEventListener("click", exportEnv);

    document.getElementById("import").addEventListener("click", importEnv);


    function exportEnv() {

        var indexes = Object.keys(keys);
        var values = Object.values(keys);
        var text = "";

        for (let index = 0; index < indexes.length; index++) {
            if (indexes[index] == undefined || indexes[index] == "")
                continue;
            text += `${indexes[index]}=${values[index]}\n`;
        }

        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
        a.download = 'ebs_secrets.env';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    let lastLoadedFile = null;

    const fileSelector = document.getElementById('env-selector');
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        if (fileList.length > 0) {
            var first = fileList[0];
            var fr = new FileReader();

            fr.onload = function (e) {
                var text = e.target.result;

                const result = text.split(/\r?\n/);

                var secretObject = {};

                result.forEach(line => {

                    const [first, ...rest] = line.split('=');

                    const remainder = rest.join('=');

                    if (line != "" && line != null)
                        secretObject[first] = remainder;

                });
                
                lastLoadedFile = Object.fromEntries(Object.entries(secretObject).filter(([_, v]) => v != ""));

                updateActions(true);
            };
            fr.readAsText(first);

        }
    });

    function importEnv() {
        chrome.runtime.sendMessage({
            method: 'setImports',
            import: {
                env: lastLoadedFile,
                replace: !document.getElementById("replace-checkbox").checked,
            }
        });
    }

    function getKeysJob() {

        chrome.runtime.sendMessage({ method: 'getKeys' }, function (response) {
            if (!deepEqual(keys, response)) {
                keys = response;
                updateMessage();
            }
        });

        setTimeout(getKeysJob, 5000);
    }

    getKeysJob();

}
fetchData();



