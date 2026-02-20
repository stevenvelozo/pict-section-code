# Configuration Reference

This document provides a complete reference for all pict-section-code configuration options.

## Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `TargetElementAddress` | string | `"#CodeEditor-Container-Div"` | CSS selector for the container element where the editor is built |
| `CodeDataAddress` | string \| false | `false` | Pict manifest address for two-way data binding (e.g., `"AppData.SourceCode"`) |
| `Language` | string | `"javascript"` | Language for syntax highlighting. See [Supported Languages](highlighting.md) |
| `ReadOnly` | boolean | `false` | Whether the editor is read-only (no editing allowed) |
| `LineNumbers` | boolean | `true` | Whether to show line numbers in the gutter |
| `DefaultCode` | string | `"// Enter your code here\n"` | Initial code content when no `CodeDataAddress` is set or the address is empty |
| `Tab` | string | `"\t"` | Character inserted when pressing the Tab key |
| `IndentOn` | RegExp | `/[({[]$/` | Pattern that triggers auto-indent on the next line |
| `MoveToNewLine` | RegExp | `/^[)}\]]/` | Pattern that moves closing brackets to a new line |
| `AddClosing` | boolean | `true` | Automatically insert closing brackets, parens, and braces |
| `CatchTab` | boolean | `true` | Capture Tab key to insert a tab rather than moving focus |
| `RenderOnLoad` | boolean | `true` | Render the view automatically when it initializes |
| `CSS` | string | *(built-in styles)* | CSS injected for the editor via Pict's CSSMap |
| `Templates` | array | *(built-in)* | Pict template definitions |
| `Renderables` | array | *(built-in)* | Pict renderable definitions |
| `DefaultRenderable` | string | `"CodeEditor-Wrap"` | The default renderable hash |
| `DefaultDestinationAddress` | string | `"#CodeEditor-Container-Div"` | Where the template renders (should differ from `TargetElementAddress` in usage) |

## Template and Renderable Pattern

The default configuration uses a placeholder template that renders to a non-existent element. This is intentional -- it follows the same pattern used by `pict-section-tuigrid`:

```javascript
"Templates": [
	{
		"Hash": "CodeEditor-Container",
		"Template": "<!-- CodeEditor-Container Rendering Soon -->"
	}
],
"Renderables": [
	{
		"RenderableHash": "CodeEditor-Wrap",
		"TemplateHash": "CodeEditor-Container",
		"DestinationAddress": "#CodeEditor-Container-Div"
	}
]
```

When you override `TargetElementAddress` in your view configuration (e.g., `"#MyEditorContainer"`), the editor builds its DOM inside your actual page element, while the template renders harmlessly to the non-existent default destination. This prevents Pict's async render cycle from destroying the editor DOM.

**Important:** Do not set `DestinationAddress` in your Renderables to the same element as `TargetElementAddress`. The template render would overwrite the editor.

## CSS Customization

The built-in CSS provides a clean default theme. Override it by providing a `CSS` string in your configuration:

```javascript
{
	"TargetElementAddress": "#MyEditor",
	"Language": "javascript",
	"CSS": ".pict-code-editor-wrap { font-size: 16px; } .pict-code-editor .keyword { color: #ff0000; }"
}
```

### Default Token Colors

The built-in theme uses a light color scheme:

| CSS Class | Color | Used For |
|-----------|-------|----------|
| `.keyword` | `#A626A4` (purple) | Language keywords (`const`, `function`, `if`, etc.) |
| `.string` | `#50A14F` (green) | String literals |
| `.number` | `#986801` (gold) | Numeric literals |
| `.comment` | `#A0A1A7` (gray, italic) | Comments |
| `.operator` | `#0184BC` (teal) | Operators (`=`, `+`, `=>`, etc.) |
| `.punctuation` | `#383A42` (dark) | Braces, semicolons, commas |
| `.function-name` | `#4078F2` (blue) | Function names and CSS selectors |
| `.property` | `#E45649` (red) | Object properties |
| `.tag` | `#E45649` (red) | HTML tags |
| `.attr-name` | `#986801` (gold) | HTML attribute names |
| `.attr-value` | `#50A14F` (green) | HTML attribute values |

### Default Editor Styles

The editor uses these default styles:

- **Font:** `SFMono-Regular`, `SF Mono`, `Menlo`, `Consolas`, monospace
- **Font size:** 14px
- **Line height:** 1.5
- **Background:** `#FAFAFA`
- **Text color:** `#383A42`
- **Line numbers:** 40px gutter, `#F5F5F5` background, `#999` text
- **Border:** 1px solid `#D0D0D0` with 4px border-radius

## Example Configurations

### Basic Editor

```javascript
{
	"TargetElementAddress": "#EditorContainer",
	"Language": "javascript",
	"LineNumbers": true
}
```

### Read-Only Display

```javascript
{
	"TargetElementAddress": "#CodeBlock",
	"Language": "css",
	"ReadOnly": true,
	"LineNumbers": false,
	"DefaultCode": "body { margin: 0; }"
}
```

### Two-Way Data Binding

```javascript
{
	"TargetElementAddress": "#EditorContainer",
	"CodeDataAddress": "AppData.SourceCode",
	"Language": "json",
	"LineNumbers": true
}
```

### Custom Tab Settings

```javascript
{
	"TargetElementAddress": "#EditorContainer",
	"Language": "javascript",
	"Tab": "  ",
	"CatchTab": true,
	"AddClosing": false
}
```
