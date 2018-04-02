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

                if (matches) {
                    matches.forEach(function(match) {
                        let partial = match.replace("{{", "").replace("}}", "").trim()
                        let replacement = fs.readFileSync(partialDirectory + partial + ".html", "utf-8")

                        rendered = content.replace(match, replacement)
                    })
                } else {
                    rendered = content
                }

                fs.writeFile("../" + file, rendered, function() {
                    console.log(`Successfully compiled ${file}`)
                })
            })
        }
    }, function() {
        process.exit()
    })
})
