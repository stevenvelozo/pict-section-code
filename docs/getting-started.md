# Getting Started

This guide walks through setting up pict-section-code for both editable code editors and read-only code display.

## Installation

```bash
npm install pict-section-code
```

## Browser Setup

pict-section-code wraps [CodeJar](https://github.com/antonmedv/codejar), a lightweight browser code editor. CodeJar ships as ESM only, so for script-tag loading you need an IIFE wrapper that exposes `window.CodeJar`.

Each example application includes a ready-made `codejar.js` file. You can also create your own wrapper:

```javascript
(function() {
	// ... CodeJar source ...
	window.CodeJar = CodeJar;
})();
```

When the page loads, pict-section-code automatically finds `window.CodeJar`. You can also provide it explicitly:

```javascript
myView.connectCodeJarPrototype(CodeJar);
```

## Creating a Code Editor

### 1. Define a View Subclass

Create a minimal subclass of `PictSectionCode`. This gives you a place to add custom behavior if needed:

```javascript
const libPictSectionCode = require('pict-section-code');

class MyEditorView extends libPictSectionCode
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}
```

### 2. Configure the View

The configuration object controls the editor behavior:

```javascript
const _EditorConfig = {
	"TargetElementAddress": "#MyEditorContainer",
	"CodeDataAddress": "AppData.SourceCode",
	"Language": "javascript",
	"LineNumbers": true
};
```

Key properties:
- **TargetElementAddress** -- The CSS selector for the DOM element where the editor will be built
- **CodeDataAddress** -- A Pict address for two-way data binding (optional)
- **Language** -- The syntax highlighting language
- **LineNumbers** -- Whether to show line numbers

### 3. Wire Into a Pict Application

```javascript
const libPictApplication = require('pict-application');

class MyApp extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('EditorView', _EditorConfig, MyEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();
		this.pict.views.EditorView.render();
	}
}
```

### 4. Add the HTML

```html
<div id="MyEditorContainer"></div>

<script src="codejar.js"></script>
<script src="pict.min.js"></script>
<script src="my-app.min.js"></script>
```

The editor creates its own internal DOM structure inside the target element, including the line numbers gutter and editing area.

## Creating a Read-Only Display

To use pict-section-code for displaying syntax-highlighted code without editing, set `ReadOnly` to `true` and provide the code via `DefaultCode`:

```javascript
const _DisplayConfig = {
	"TargetElementAddress": "#CodeBlock",
	"Language": "css",
	"ReadOnly": true,
	"LineNumbers": false,
	"DefaultCode": "body { margin: 0; background: #FAEDCD; }"
};
```

You can place multiple read-only views on a single page, each targeting a different container element. The **Code Display** example demonstrates this pattern with five views across all supported languages.

## Two-Way Data Binding

When `CodeDataAddress` is set, the editor automatically reads and writes code to a Pict address:

```javascript
const _Config = {
	"TargetElementAddress": "#EditorContainer",
	"CodeDataAddress": "AppData.SourceCode",
	"Language": "javascript"
};
```

- On initialization, the editor reads from `AppData.SourceCode` and displays it
- On every edit, the new code is written back to `AppData.SourceCode`
- Call `marshalToView()` to reload from the address
- Call `marshalFromView()` to explicitly write back

This integrates with Pict's manifest-based data binding, allowing other views to react to code changes.

## Building with Quackage

Each example application uses Quackage for bundling:

```bash
cd example_applications/<example_name>
npm install
npm run build
```

This produces a `dist/` folder containing the bundled application, HTML, and all required scripts. Open `dist/index.html` in a browser to test.

## Next Steps

- [Configuration](configuration.md) -- Full options reference
- [API Reference](api.md) -- All public methods
- [Syntax Highlighting](highlighting.md) -- Languages and custom highlighters
- [Examples](examples.md) -- Three working example applications
