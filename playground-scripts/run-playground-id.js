
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


const playgroundId = "#20OAV9#6274"

const createScene = () => {
    if (playgroundId[0] !== "#") {
        console.error("Invalid playground id")
        return
    }

    // Need a dummy canvas for the `camera.attachControl` call used in most playgrounds.
    // NB: The `camera.attachControl` `canvas` argument is not used anymore, so leaving it set to `null` is ok.
    let canvas = null

    let currentScene = null

    class Response {
        constructor(text) {
            this._text = text
        }

        text = () => {
            return this._text
        }
    }

    const fetch = async (url) => {
        console.log(`Loading url ${url} ...`)
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest

            xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState === 4) {
                    xhr.onreadystatechange = null

                    const response = new Response(xhr.responseText)

                    console.log(`Loading url ${url} - done`)
                    resolve(response)
                }
            })

            xhr.onerror = () => {
                console.log(`Loading url ${url} - failed`)
                reject()
            }

            xhr.open("GET", url)
            xhr.send()
        })
    }

    const assetsUrl = "https://assets.babylonjs.com/generated/Assets.js"
    const playgroundUrl = "https://playground.babylonjs.com"
    const snippetUrl = "https://snippet.babylonjs.com"

    var loadPG = async () => {
        console.log(`Loading playground id ${playgroundId} ...`)

        try {
            const response = await fetch(snippetUrl + playgroundId.replace(/#/g, "/"))
            let code = JSON.parse(JSON.parse(response.text()).jsonPayload).code.toString()
            code = code.replace(/\/textures\//g, playgroundUrl + "/textures/")
            code = code.replace(/"textures\//g, "\"" + playgroundUrl + "/textures/")
            code = code.replace(/\/scenes\//g, playgroundUrl + "/scenes/")
            code = code.replace(/"scenes\//g, "\"" + playgroundUrl + "/scenes/")

            if (code.includes("Assets")) {
                // Load and evaluate Assets.js from https://assets.babylonjs.com/generated/Assets.js to add variable
                // `const Assets = ...` to the `createScene` scope which is used in playgrounds like #2KRNG9#4.
                const response = await fetch(assetsUrl)
                eval(response.text())
            }

            console.log(`Creating scene ...`)
            console.log(code)
            const createdScene = eval(code + "\r\ncreateScene(engine)")

            // If the `createScene` function returned a promise, wait for it before setting `currentScene`.
            if (!!createdScene.then) {
                createdScene.then((scene) => {
                    currentScene = scene
                    console.log(`Creating scene (async) - done`)
                })
            }
            else {
                // The `createScene` function did not return a promise so assume `createdScene` is a valid Babylon.js
                // scene.
                currentScene = createdScene
                console.log(`Creating scene - done`)
            }
        }
        catch(e) {
            console.log(e)
        }
    }
    loadPG()

    // Dummy scene that does nothing in its `render` function until the given playground is fetched and loaded.
    const scene = {
        render: () => {
            if (!!currentScene) {
                currentScene.render()
            }
        }
    }

    return scene
}
