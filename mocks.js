const mockSelection = `
<div id="top-id" class="first-class second-class">
  <div id="nested-id">
    
  </div>
</div>
`

const mockStylesSCSS = `
.this-selector-not-in-selection {
  color: red;

  #top-id {

    &.first-class {
      background: blue;

      #nested-id {
        border: 5px solid red;
      }
    }

  }

  .second-class {
    background: green;
  }

}
`
const mockStylesCSSNested = `
.not-in-selection {
	 color: red;
}

 .not-in-selection #top-id .first-class .second-class {
	 background: blue;
}

 .not-in-selection #top-id .first-class .second-class #nested-id {
	 border: 5px solid red;
}
`
const mockStylesCSSFlat = `
.should-not-be-parsed {
	 color: red;
}

.first-class, .second-class {
	 background: blue;
}

#nested-id {
	 background-color: green;
}
`

module.exports = {
  mockSelection,
  mockStylesCSSFlat,
  mockStylesCSSNested,
  mockStylesSCSS
}