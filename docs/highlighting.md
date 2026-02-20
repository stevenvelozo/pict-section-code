# Syntax Highlighting

pict-section-code includes a built-in syntax highlighter that works without any external dependencies. You can also plug in external libraries like Prism.js or highlight.js.

## Built-in Highlighter

The built-in highlighter uses a tokenization approach:

1. Extract and protect comments and strings (so keywords inside them are not highlighted)
2. Escape HTML to prevent XSS
3. Highlight language-specific tokens (keywords, numbers, operators, etc.)
4. Restore protected comments and strings with their own highlighting

### Supported Languages

| Identifier | Aliases | Highlights |
|------------|---------|------------|
| `javascript` | `js` | Keywords, builtins, strings, template literals, comments, numbers, regex, operators, functions, properties |
| `json` | -- | Keywords (`true`, `false`, `null`), strings, numbers, comments |
| `html` | `htm` | Tags, attribute names, attribute values, strings, comments |
| `css` | -- | Selectors, properties, keywords, strings, numbers with units, comments |
| `sql` | -- | Keywords (case-insensitive), strings, numbers, comments (`--` and `/* */`) |

### JavaScript Builtins

The JavaScript highlighter recognizes common builtins: `true`, `false`, `null`, `undefined`, `NaN`, `Infinity`, `console`, `window`, `document`, `Math`, `JSON`, `Array`, `Object`, `String`, `Number`, `Boolean`, `Date`, `RegExp`, `Map`, `Set`, `Promise`, `Error`, `Symbol`, `parseInt`, `parseFloat`, `require`, `module`, `exports`.

### CSS Units

The CSS highlighter recognizes numbers with units: `px`, `em`, `rem`, `%`, `vh`, `vw`, `s`, `ms`, `deg`, `fr`.

## Token CSS Classes

The highlighter produces HTML with these CSS classes:

| Class | Default Color | Usage |
|-------|---------------|-------|
| `.keyword` | `#A626A4` purple | Language keywords (`const`, `function`, `SELECT`, etc.) |
| `.string` | `#50A14F` green | String literals and template literals |
| `.number` | `#986801` gold | Numeric literals (including CSS units) |
| `.comment` | `#A0A1A7` gray italic | Line and block comments |
| `.operator` | `#0184BC` teal | Operators (`=`, `+`, `=>`, `===`, etc.) |
| `.punctuation` | `#383A42` dark | Braces, brackets, semicolons, commas |
| `.function-name` | `#4078F2` blue | Function names (JS), selectors (CSS) |
| `.property` | `#E45649` red | Object properties (JS), CSS properties |
| `.tag` | `#E45649` red | HTML tag names |
| `.attr-name` | `#986801` gold | HTML attribute names |
| `.attr-value` | `#50A14F` green | HTML attribute values |

## Custom Highlighter Function

Replace the built-in highlighter with any function that takes a DOM element and sets its `innerHTML`:

```javascript
view.setHighlightFunction((pElement) =>
{
	// pElement.textContent contains the raw code
	// Set pElement.innerHTML to the highlighted HTML
	pElement.innerHTML = myHighlight(pElement.textContent);
});
```

### Prism.js Integration

```javascript
// Load Prism.js via script tag or npm
view.setHighlightFunction((pElement) =>
{
	pElement.innerHTML = Prism.highlight(
		pElement.textContent,
		Prism.languages.javascript,
		'javascript'
	);
});
```

### highlight.js Integration

```javascript
// Load highlight.js via script tag or npm
view.setHighlightFunction((pElement) =>
{
	pElement.removeAttribute('data-highlighted');
	hljs.highlightElement(pElement);
});
```

### Per-Language Highlighting

When switching languages with `setLanguage()`, the built-in highlighter is automatically swapped. If you use a custom highlighter, you need to handle language changes yourself:

```javascript
class MyEditor extends libPictSectionCode
{
	setLanguage(pLanguage)
	{
		// Set a language-appropriate highlighter before calling super
		this._highlightFunction = (pElement) =>
		{
			pElement.innerHTML = Prism.highlight(
				pElement.textContent,
				Prism.languages[pLanguage],
				pLanguage
			);
		};
		super.setLanguage(pLanguage);
	}
}
```

## Using the Highlighter Standalone

The highlighter factory is exported from the module and can be used independently of the editor:

```javascript
const { createHighlighter } = require('pict-section-code');

let tmpHighlightJS = createHighlighter('javascript');
let tmpHighlightSQL = createHighlighter('sql');

// Use with CodeJar directly
let jar = CodeJar(element, tmpHighlightJS);
```
