if (typeof init === 'undefined') {
    const init = function () {

        console.log("injected!");
        let lastList = [];

        const areKeysEqual = function (oldKeys, newKeys) {

            let newOnlyKeys = Object.keys(newKeys);
            let newOnlyValues = Object.values(newKeys);

            let oldOnlyKeys = Object.keys(oldKeys);
            let oldOnlyValues = Object.values(oldKeys);

            if (oldOnlyKeys.length != newOnlyKeys.length)
                return false;

            let equal = true;

            for (let index = 0; index < newOnlyKeys.length; index++)
                if (newOnlyKeys[index] !== oldOnlyKeys[index] || newOnlyValues[index] !== oldOnlyValues[index])
                    equal = false;

            return equal;
        }

        const keysObject = function (newKeys) {
            let OnlyKeys = Object.keys(newKeys);
            let OnlyValues = Object.values(newKeys);
            let obj = {};
            for (let index = 0; index < OnlyKeys.length; index++) {
                obj[OnlyKeys[index]] = OnlyValues[index]
            }
            return obj;
        }


        const retrive = function () {
            console.log("Loaded")

            //Looking for import actions
            chrome.runtime.sendMessage({ method: 'getImports' }, function (response) {

                if (response != null) {

                    console.log("Importing env...")

                    let index = 0;

                    if (!response.replace) {
                        for (let i = 0; i < 200; i++) {
                            const elements = document.getElementsByName(`environmentVariablesName${i}`);
                            if (elements.length > 0)
                                index++;
                        }
                    }

                    if (response.env != null) {

                        var allKeys = Object.keys(response.env);
                        var allSecrets = Object.values(response.env);

                        if(index>0)
                            index--;

                        for (let i = 0; i < allKeys.length; i++) {

                            var inputs = document.getElementsByName(`environmentVariablesName${index + i}`);
                            if (inputs.length > 0) {
                                var input = inputs[0];

                                input.value = allKeys[i];

                                if ("createEvent" in document) {
                                    var evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("change", false, true);
                                    input.dispatchEvent(evt);
                                }
                                else
                                    input.fireEvent("onchange");

                                var event = new Event('change');

                                input.dispatchEvent(event);

                                let parent = input.parentElement; //Parent TD, next parent TR contains two TD inside (This is the 1st one)
                                let nextTd = parent.nextElementSibling; //This is the second TD inside TR
                                let firstChild = nextTd.firstChild; //The first child is the #text element
                                let keyElement = firstChild.nextSibling; //The nextSibling is the input element

                                
                                keyElement.value = allSecrets[i]
                            }
                        }
                    }
                }
            });

            console.log("updating values...");

            var all = [];

            for (let index = 0; index < 200; index++) {
                const elements = document.getElementsByName(`environmentVariablesName${index}`);
                if (elements.length > 0)
                    all = all.concat(elements[0])
            }

            var values = [];

            all.forEach(keyName => {
                let parent = keyName.parentElement; //Parent TD, next parent TR contains two TD inside (This is the 1st one)
                let nextTd = parent.nextElementSibling; //This is the second TD inside TR
                let firstChild = nextTd.firstChild; //The first child is the #text element
                let keyElement = firstChild.nextSibling; //The nextSibling is the input element
                let keyValue = keyElement.value; //Here is the "secret" value

                values[keyName.value] = keyValue;
            })

            let equal = false; // areKeysEqual(lastList,values);

            if (equal == false) {

                var obj = keysObject(values);

                chrome.runtime.sendMessage({ method: 'setKeys', keys: obj });

                lastList = values;

            } else {
                console.log("no keys updated!")
            }

            setTimeout(retrive, 5000);
        }

        retrive();

    }
    init();
}