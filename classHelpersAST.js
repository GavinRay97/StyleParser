class NodeAST {
  constructor({type, position, children}) {
    this.type = type
    this.position = position
    this.children = children
    this.firstChild = children[0]
  }
}

class IdentifierAST extends NodeAST {
  constructor(args) {
    super(args)
    this.identity = this.firstChild.value
  }
}

class SelectorAST extends NodeAST {
  constructor(args) {
    super(args)
    this.identifierAST = []
    this.identifiers = []
        
    for (let child of this.children) {
      if (['class', 'id'].includes(child.type)) {
        const AST = new IdentifierAST(child)
        this.identifierAST.push(AST)
        this.identifiers.push(AST.identity)
      }
    }
  }
}

class RulesetAST extends NodeAST {
  constructor(args) {
    super(args)
    this.selectorAST = new SelectorAST(this.firstChild)
  } 
}

module.exports = {
  RulesetAST
}