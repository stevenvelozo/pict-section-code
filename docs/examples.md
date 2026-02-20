# Example Applications

pict-section-code ships with three example applications that demonstrate different usage patterns.

## Quick Reference

| Example | Complexity | Key Features |
|---------|------------|--------------|
| **Code Editor** | Basic | Single editor, language switching, toggle read-only |
| **Code Display** | Basic | Multiple read-only blocks, multiple languages, line number toggle |
| **Multi-File Editor** | Intermediate | Sidebar file browser, file switching, language auto-detection |

## Feature Matrix

| Feature | Code Editor | Code Display | Multi-File Editor |
|---------|:-----------:|:------------:|:-----------------:|
| Editable | Yes | No | Yes |
| Read-Only Mode | Toggle | Always | No |
| Line Numbers | Yes | Mixed | Yes |
| Language Switching | Manual | Fixed per block | Auto-detect |
| Data Binding | Yes | No | Yes |
| Multiple Views | No | 5 views | No |
| File Management | No | No | Yes |

## Running Any Example

```bash
cd example_applications/<example_name>
npm install
npm run build
# Open dist/index.html in a browser
```

---

## Code Editor

The basic code editor demonstrates a single editable code editor with a toolbar for switching languages and toggling read-only mode.

### What It Shows

- A pict-section-code view bound to `AppData.SourceCode`
- Language switching via `setLanguage()`
- Read-only toggling via `setReadOnly()`
- Getting code content via `getCode()`

### Key Code

The view configuration binds the editor to AppData:

```javascript
const _ExampleCodeEditorConfiguration = {
	"ViewIdentifier": "ExampleCodeEditor",
	"TargetElementAddress": "#CodeEditorContainer",
	"CodeDataAddress": "AppData.SourceCode",
	"Language": "javascript",
	"LineNumbers": true
};
```

The application wires the view and renders it:

```javascript
class CodeEditorExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.pict.addView('ExampleCodeEditorView',
			_ExampleCodeEditorConfiguration, ExampleCodeEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();
		this.pict.views.ExampleCodeEditorView.render();
	}
}
```

HTML toolbar buttons call into the view:

```javascript
function changeLanguage(pLanguage)
{
	_Pict.views.ExampleCodeEditorView.setLanguage(pLanguage);
}
```

---

## Code Display

The code display example shows pict-section-code used as a read-only syntax highlighter. Five code blocks are rendered on a single page, one for each supported language.

### What It Shows

- Multiple pict-section-code views on one page
- Read-only mode (`ReadOnly: true`)
- Static code via `DefaultCode` (no data binding)
- Line numbers enabled on some blocks, disabled on others

### Key Code

Each language gets its own view configuration. Here is the JavaScript block with line numbers:

```javascript
const _JSSnippetConfig = {
	"ViewIdentifier": "JSSnippet",
	"TargetElementAddress": "#CodeBlockJS",
	"Language": "javascript",
	"ReadOnly": true,
	"LineNumbers": true,
	"DefaultCode": "// Service Provider Pattern\nconst libFable = require('fable');\n..."
};
```

And the HTML block without line numbers:

```javascript
const _HTMLSnippetConfig = {
	"ViewIdentifier": "HTMLSnippet",
	"TargetElementAddress": "#CodeBlockHTML",
	"Language": "html",
	"ReadOnly": true,
	"LineNumbers": false,
	"DefaultCode": "<!DOCTYPE html>\n<html lang=\"en\">\n..."
};
```

All five views are added and rendered in the application:

```javascript
this.pict.addView('JSSnippetView', _JSSnippetConfig, ExampleCodeDisplayView);
this.pict.addView('HTMLSnippetView', _HTMLSnippetConfig, ExampleCodeDisplayView);
this.pict.addView('CSSSnippetView', _CSSSnippetConfig, ExampleCodeDisplayView);
this.pict.addView('JSONSnippetView', _JSONSnippetConfig, ExampleCodeDisplayView);
this.pict.addView('SQLSnippetView', _SQLSnippetConfig, ExampleCodeDisplayView);
```

---

## Multi-File Editor

The multi-file editor demonstrates a code editor with a sidebar file browser. Files are stored in AppData and can be created, edited, and deleted.

### What It Shows

- Sidebar file list with active file highlighting
- File switching with automatic save of the current file
- Language auto-detection from file extensions
- Creating and deleting files at runtime
- Application-level methods that interact with the editor view

### Key Code

File data is stored in `AppData.Files` as an object keyed by filename:

```javascript
"DefaultAppData": {
	"CurrentFile": "app.js",
	"CurrentFileContent": "",
	"Files": {
		"app.js": { "Name": "app.js", "Content": "..." },
		"config.json": { "Name": "config.json", "Content": "..." },
		"styles.css": { "Name": "styles.css", "Content": "..." }
	}
}
```

Language detection maps file extensions to language identifiers:

```javascript
detectLanguage(pFilename)
{
	let tmpExtension = pFilename.split('.').pop().toLowerCase();
	switch (tmpExtension)
	{
		case 'js': return 'javascript';
		case 'json': return 'json';
		case 'html': return 'html';
		case 'css': return 'css';
		case 'sql': return 'sql';
		default: return 'javascript';
	}
}
```

Loading a file saves the current file, switches the content, and updates the editor:

```javascript
loadFile(pFileKey)
{
	this.saveCurrentFile();
	this.pict.AppData.CurrentFile = pFileKey;

	let tmpContent = this.pict.AppData.Files[pFileKey].Content || '';
	let tmpLanguage = this.detectLanguage(pFileKey);

	this.pict.views.EditorView.setLanguage(tmpLanguage);
	this.pict.views.EditorView.setCode(tmpContent);

	this.updateSidebarActiveState();
	this.updateToolbar(pFileKey, tmpLanguage);
}
```

The sidebar is rendered by iterating over `AppData.Files`:

```javascript
renderSidebar()
{
	let tmpFiles = this.pict.AppData.Files || {};
	let tmpKeys = Object.keys(tmpFiles);
	// Build HTML for each file entry with onclick handlers
}
```
