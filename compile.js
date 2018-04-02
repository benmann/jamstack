const fs = require( 'fs' )
const path = require( 'path' )

const templateDirectory = "./"
const partialDirectory = "./_partials/"

fs.readdir(templateDirectory, function(err, files) {
    files.forEach( function(file, index) {
        if (path.extname(file) == ".html") {

            fs.readFile(templateDirectory + file, 'utf8', function (err, content) {
                let matches = content.match(/{{(.*?)}}/g)
                let rendered

                matches.forEach(function(match) {
                    let partial = match.replace("{{", "").replace("}}", "").trim()
                    let replacement = fs.readFileSync(partialDirectory + partial + ".html", "utf-8")

                    content = content.replace(match, replacement)
                })

                rendered = content

                let output = rendered.replace(/\r?\n|\r/g, "")
                fs.writeFile("../" + file, output, function() {
                    console.log(`Successfully compiled ${file}`)
                })
            })
        }
    }, function() {
        process.exit()
    })
})
