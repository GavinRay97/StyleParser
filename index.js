const sast = require("sast")
const cheerio = require("cheerio")
const visit = require("unist-util-visit")
const inspect = require("unist-util-inspect")

const { RulesetAST } = require("./classHelpersAST.js")

function getElementIdAndClasses(elem, $) {
  let results = []
  const elemId = $(elem).attr(`id`) || ``
  let elemClasses = $(elem).attr(`class`)
  if (elemClasses) elemClasses = elemClasses.split(` `)
  if (elemId) results = results.concat(elemId)
  if (elemClasses) results = results.concat(elemClasses)
  return results
}

function getAllSelectors(htmlString) {
  const $ = cheerio.load(htmlString)
  const allElements = $(`body`).find('*');
  const allSelectors = allElements.map((_, el) => getElementIdAndClasses(el, $)).get()
  return allSelectors
}

function extractStyles(cssAST, selectorArray) {
  let matchingStyles = ``

  visit(cssAST, `ruleset`, node => {
    const ruleset = new RulesetAST(node)
    const selectors = ruleset.selectorAST.identifiers.join(` `)
    const selectorMatchesElement = selectorArray.some(selector => selectors.includes(selector))
    const styles = sast.stringify(node) + `\n`
    if (selectorMatchesElement && !matchingStyles.includes(styles)) {
      matchingStyles += styles
    }
  })
  
  return matchingStyles
}


/**
 * Given a string of HTML content, and a string of CSS/SCSS/SASS,
 * returns all style rules that apply to the provided HTML elements
 *
 * @param {string} htmlString A string of HTML content to check against a stylesheet
 * @param {string} styleString A string of styles (CSS/SCSS/SASS)
 * @returns {string} Applicable rulesets for elements provided
 */
function findMatchingStyleRules(htmlString, styleString, styleLang=`scss`) {
  const styleAST = sast.parse(styleString, {syntax: styleLang})
  const selectorArray = getAllSelectors(htmlString)
  const extractedStyles = extractStyles(styleAST, selectorArray)
  return extractedStyles
}

const mockSelection = `
  <div id="top-id" class="another-thing second-class">
    <div id="nested-id">
      
    </div>
  </div>

  <div id="outside-element"></div>
`

const mockStyleSCSS = `
.something {
  color: red;

  #top-id {

    &.another-thing {
      background: blue;

      #nested-id {
        border: 5px solid red;
      }
    }

  }

  .second-class {
    background: green;
  }

  #outside-element {
    color: blue;
  }
}
`

const mockStyleSASS = `
.something
  color: red

  #top-id

    &.another-thing
      background: blue

      #nested-id
        border: 5px solid red

  .second-class
    background: green

  #outside-element
    color: blue
`

const scssAST = sast.parse(mockStyleSCSS, {syntax: `scss`})
const sassAST = sast.parse(mockStyleSASS, {syntax: `sass`})


console.log(findMatchingStyleRules(mockSelection, mockStyleSCSS, `scss`))



module.exports = findMatchingStyleRules