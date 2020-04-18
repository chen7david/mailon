const { readFileSync, existsSync } = require('fs')
const path = require('path')
const { template } = require('lodash')

class Mailon {
    
    constructor(...directory){
        this.lang = 'en'
        this.path = path.join(...directory)
        this.filePath = null
        this.file = null
    }

    langTo(lang){
        this.lang = lang
        return this
    }

    setFilePath(name){
        const fileName = name + '.' + this.lang + '.html'
        const filePath = path.resolve(this.path, fileName)
        if(!existsSync(filePath)) throw(`filePath ${filePath} does not exist!`)
        this.filePath = filePath
        return this
    }

    setFile(name){
        this.setFilePath(name)
        this.file = readFileSync(this.filePath, 'utf8')
        return this
    }

    render(data){
        this.file = template(this.file)(data)
        return this
    }

    get(name, data){
        this.setFile(name)
        if(data) this.render(data)
        return this.file
    }

}

exports = module.exports = (...directory) =>  new Mailon(...directory)

exports.Mailon = Mailon
exports.mailon = (...directory) => new Mailon(...directory)