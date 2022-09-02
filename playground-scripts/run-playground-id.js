
//#region Example playgrounds known to work in BabylonNative ...

/// Name: The First Step
/// Description: Red ground plane.
/// References:
/// - https://doc.babylonjs.com/journey/theFirstStep
///
// const playgroundId = `#2KRNG9#1`

/// Name: The First Step
/// Description: Simple checkerboard textured ground with decent sized .gltf model of a Yeti.
/// NB:
/// - Uses `Assets` object.
/// References:
///  - https://doc.babylonjs.com/journey/theFirstStep
///
// const playgroundId = `#2KRNG9#4`

/// Name: Simple vertex shader
/// Description: Simple red/white checkerboard vertex/fragment shader pair.
/// References:
///  - https://doc.babylonjs.com/advanced_topics/shaders/shaderCodeInBjs
///
// const playgroundId = `#1OH09K#131`

//#endregion


const playgroundId = `#2KRNG9`


let canvas = null
let currentScene = null

const createScene = () => {
    if (playgroundId[0] !== "#") {
        console.error("Invalid playground id");
        return;
    }

    var playgroundUrl = "https://playground.babylonjs.com";
    var snippetUrl = "https://snippet.babylonjs.com";

    var retryTime = 500;
    var maxRetry = 0;
    var retry = 0;

    var onError = function () {
        retry++;
        if (retry < maxRetry) {
            setTimeout(function () {
                loadPG();
            }, retryTime);
        }
        else {
            // Skip the test as we can not fetch the source.
            done(true);
        }
    }

    const evalCodeAndCreateScene = (code) => {
        console.log(`Creating scene ...`)
        console.log(`${code}`)
        currentScene = eval(code + "\r\ncreateScene(engine)");
        console.log(`Creating scene - done`)
    }

    var loadPG = function () {
        console.log(`Loading playground id ${playgroundId} ...`)
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.addEventListener("readystatechange", function () {
            if (xmlHttp.readyState === 4) {
                try {
                    console.log(`Loading playground id ${playgroundId} - done`)
                    xmlHttp.onreadystatechange = null;
                    var snippet = JSON.parse(xmlHttp.responseText);
                    var code = JSON.parse(snippet.jsonPayload).code.toString();
                    code = code.replace(/\/textures\//g, playgroundUrl + "/textures/");
                    code = code.replace(/"textures\//g, "\"" + playgroundUrl + "/textures/");
                    code = code.replace(/\/scenes\//g, playgroundUrl + "/scenes/");
                    code = code.replace(/"scenes\//g, "\"" + playgroundUrl + "/scenes/");

                    // Loads and evaluates Assets.js from https://assets.babylonjs.com/generated/Assets.js.
                    // This adds variable `const Assets = ...` to the `createScene` scope which is used in playgrounds
                    // like #2KRNG9#4.
                    const loadAssetsAndCreateScene = () => {
                        console.log(`Loading assets ...`)
                        let xmlHttp = new XMLHttpRequest
                        xmlHttp.addEventListener("readystatechange", () => {
                            if (xmlHttp.readyState === 4) {
                                try {
                                    xmlHttp.onreadystatechange = null
                                    eval(xmlHttp.responseText)
                                    console.log(`Loading assets - done`)
                                    evalCodeAndCreateScene(code)
                                }
                                catch (e) {
                                    console.error(e)
                                    onError()
                                }
                            }
                        })
                        xmlHttp.onerror = () => {
                            console.error("Network error during assets load.")
                            onError()
                        }
                        xmlHttp.open("GET", "https://assets.babylonjs.com/generated/Assets.js")
                        xmlHttp.send()
                    }
                    if (code.indexOf(`Assets`) != -1) {
                        loadAssetsAndCreateScene()
                    }
                    else {
                        evalCodeAndCreateScene(code)
                    }
                }
                catch (e) {
                    console.error(e);
                    onError();
                }
            }
        }, false);
        xmlHttp.onerror = function () {
            console.error("Network error during test load.");
            onError();
        }
        xmlHttp.open("GET", snippetUrl + playgroundId.replace(/#/g, "/"));
        xmlHttp.send();
    }
    loadPG();

    const scene = {
        frameCount: 0,
        render: () => {
            if (!!currentScene) {
                currentScene.render()
            }
        }
    }

    return scene
}
