import { refractor } from 'refractor' 
import js from 'refractor/lang/javascript'
import py from 'refractor/lang/python'
import css from 'refractor/lang/css'
import bash from 'refractor/lang/bash'
import json from 'refractor/lang/json'
import sql from 'refractor/lang/sql'
import markdown from 'refractor/lang/markdown.js'
import mermaid from 'refractor/lang/mermaid.js'

export function registerPrismLanguages() {
  // 注册所有需要的语言
    refractor.register(js)
    refractor.register(py)
    refractor.register(css)
    refractor.register(bash)
    refractor.register(json)
    refractor.register(sql)
    refractor.register(markdown)
    refractor.register(mermaid)
}