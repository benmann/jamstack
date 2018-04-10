const fs = require("fs")
const path = require("path")

const config = require("./jam.json")[0]

const templateDirectory = config.templates
const partialDirectory = config.partials
const dest = config.dest

if (!fs.existsSync(dest)) {fs.mkdirSync(dest)}
if (!fs.existsSync(partialDirectory)) {fs.mkdirSync(partialDirectory)}
if (!fs.existsSync(templateDirectory)) {fs.mkdirSync(templateDirectory)}


console.log(`Watching ${templateDirectory} ...`)
fs.watch(templateDirectory, {recursive: true}, () => {
    compile()
})


function compile() {
    fs.readdir(templateDirectory, function(err, files) {

        if (!files) {
            console.log(`⚠️  No files in template directory (${templateDirectory})... aborting.`)
            process.exit()
        }

        files.forEach( function(file, index) {
            if (path.extname(file) == ".html") {
                fs.readFile(`${templateDirectory}/${file}`, "utf8", function (err, content) {
                    let matches = content.match(/{{(.*?)}}/g)
                    let rendered

                    matches.forEach((match) => {
                        let partial = match.replace("{{", "").replace("}}", "").trim()
                        let replacement = fs.readFileSync(`${partialDirectory}/${partial}.html`, "utf-8")

                        content = content.replace(match, replacement)
                    })

                    rendered = content

                    let output = rendered.replace(/\r?\n|\r/g, "")
                    fs.writeFile(`${dest}/${file}`, output, () => {
                        let date = new Date(Date.now())
                        console.log(`✓  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} — Successfully compiled ${file}`)
                    })
                })
            }
        }, () => {
            process.exit()
        })
    })
}