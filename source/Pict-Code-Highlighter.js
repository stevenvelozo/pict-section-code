/**
 * Simple syntax highlighter for use with CodeJar.
 *
 * Provides basic keyword/string/number/comment highlighting for common languages.
 * Can be replaced with Prism.js or highlight.js for more sophisticated highlighting
 * by passing a custom highlight function to the view options.
 *
 * @module Pict-Code-Highlighter
 */

// Language definition map
const _LanguageDefinitions = (
{
	'javascript':
	{
		// Combined regex to tokenize: comments, strings, template literals, regex, then everything else
		tokenizer: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2|(`(?:[^`\\]|\\.)*?`)|(\/(?![/*])(?:\\.|\[(?:\\.|[^\]])*\]|[^/\\\n])+\/[gimsuvy]*)/g,
		keywords: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|of|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,
		builtins: /\b(true|false|null|undefined|NaN|Infinity|console|window|document|Math|JSON|Array|Object|String|Number|Boolean|Date|RegExp|Map|Set|Promise|Error|Symbol|parseInt|parseFloat|require|module|exports)\b/g,
		numbers: /\b(\d+\.?\d*(?:e[+-]?\d+)?|0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+)\b/g
	},
	'json':
	{
		tokenizer: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")/g,
		keywords: /\b(true|false|null)\b/g,
		numbers: /-?\b\d+\.?\d*(?:e[+-]?\d+)?\b/g
	},
	'html':
	{
		// Tokenizer captures: (1) comments, (2) strings, (3) tags with attributes
		tokenizer: /(<!--[\s\S]*?-->)|(["'])(?:(?!\2|\\).|\\.)*?\2|(<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*\s*\/?>)/g,
		// tagToken group index for identifying tag matches
		tagGroupIndex: 3
	},
	'css':
	{
		tokenizer: /(\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,
		selectors: /([.#]?[a-zA-Z_][\w-]*(?:\s*[>+~]\s*[.#]?[a-zA-Z_][\w-]*)*)\s*\{/g,
		properties: /\b([a-zA-Z-]+)\s*:/g,
		numbers: /\b(\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms|deg|fr)?\b/g,
		keywords: /\b(important|inherit|initial|unset|none|auto|block|inline|flex|grid)\b/g
	},
	'sql':
	{
		tokenizer: /(--[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,
		keywords: /\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|CHECK|UNIQUE|CASCADE|GRANT|REVOKE|COMMIT|ROLLBACK|BEGIN|TRANSACTION|INT|VARCHAR|DATETIME|AUTO_INCREMENT|CURRENT_TIMESTAMP)\b/gi,
		numbers: /\b\d+\.?\d*\b/g
	}
});

// Alias some common language names
_LanguageDefinitions['js'] = _LanguageDefinitions['javascript'];
_LanguageDefinitions['htm'] = _LanguageDefinitions['html'];

/**
 * Escape HTML special characters to prevent XSS when inserting into innerHTML.
 *
 * @param {string} pString - The string to escape
 * @returns {string} The escaped string
 */
function escapeHTML(pString)
{
	return pString
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * Highlight a segment of code that is NOT inside a string or comment.
 * This applies keyword, number, and structural highlighting.
 *
 * @param {string} pCode - The code segment to highlight (already HTML-escaped)
 * @param {object} pLanguageDef - The language definition
 * @returns {string} The highlighted HTML
 */
function highlightCodeSegment(pCode, pLanguageDef)
{
	let tmpResult = pCode;

	// CSS selectors
	if (pLanguageDef.selectors)
	{
		pLanguageDef.selectors.lastIndex = 0;
		tmpResult = tmpResult.replace(pLanguageDef.selectors, '<span class="function-name">$1</span>{');
	}

	// CSS properties
	if (pLanguageDef.properties)
	{
		pLanguageDef.properties.lastIndex = 0;
		tmpResult = tmpResult.replace(pLanguageDef.properties, '<span class="property">$1</span>:');
	}

	// Keywords
	if (pLanguageDef.keywords)
	{
		pLanguageDef.keywords.lastIndex = 0;
		tmpResult = tmpResult.replace(pLanguageDef.keywords, '<span class="keyword">$1</span>');
	}

	// Builtins
	if (pLanguageDef.builtins)
	{
		pLanguageDef.builtins.lastIndex = 0;
		tmpResult = tmpResult.replace(pLanguageDef.builtins, '<span class="keyword">$1</span>');
	}

	// Numbers (CSS numbers may have units as a capture group, others do not)
	if (pLanguageDef.numbers)
	{
		pLanguageDef.numbers.lastIndex = 0;
		tmpResult = tmpResult.replace(pLanguageDef.numbers, (pMatch) =>
		{
			return `<span class="number">${pMatch}</span>`;
		});
	}

	return tmpResult;
}

/**
 * Highlight an HTML tag token, applying tag name, attribute name, and attribute value colors.
 *
 * The approach: parse the raw tag into structured pieces first, then build the
 * highlighted output from those pieces. This avoids mixing raw text with HTML span
 * tags, which would cause regex replacements to match span attributes on subsequent passes.
 *
 * @param {string} pTag - The raw (unescaped) tag string
 * @returns {string} The highlighted HTML
 */
function highlightHTMLTag(pTag)
{
	let tmpResult = '';
	let tmpRest = pTag;

	// 1. Extract the opening bracket and tag name: < or </  followed by tagname
	let tmpTagNameMatch = tmpRest.match(/^(<\/?)([a-zA-Z][a-zA-Z0-9-]*)/);
	if (!tmpTagNameMatch)
	{
		// Not a recognizable tag, just escape the whole thing
		return escapeHTML(pTag);
	}

	tmpResult += escapeHTML(tmpTagNameMatch[1]);
	tmpResult += '<span class="tag">' + escapeHTML(tmpTagNameMatch[2]) + '</span>';
	tmpRest = tmpRest.substring(tmpTagNameMatch[0].length);

	// 2. Parse attributes from the remaining text (before the closing > or />)
	// Repeatedly match: whitespace + attr-name + optional =value
	let tmpAttrRegex = /^(\s+)([a-zA-Z-]+)(?:(\s*=\s*)(["'])([^"']*?)\4)?/;
	let tmpAttrMatch;

	while ((tmpAttrMatch = tmpRest.match(tmpAttrRegex)) !== null)
	{
		// Whitespace before the attribute
		tmpResult += tmpAttrMatch[1];
		// Attribute name
		tmpResult += '<span class="attr-name">' + escapeHTML(tmpAttrMatch[2]) + '</span>';

		// If there's an = value part
		if (tmpAttrMatch[3])
		{
			tmpResult += escapeHTML(tmpAttrMatch[3]);
			tmpResult += '<span class="attr-value">' + escapeHTML(tmpAttrMatch[4]) + escapeHTML(tmpAttrMatch[5]) + escapeHTML(tmpAttrMatch[4]) + '</span>';
		}

		tmpRest = tmpRest.substring(tmpAttrMatch[0].length);
	}

	// 3. Whatever remains (whitespace, />, >) — escape it all
	tmpResult += escapeHTML(tmpRest);

	return tmpResult;
}

/**
 * Create a highlight function for a given language.
 *
 * The approach: use a single tokenizer regex to split the code into protected tokens
 * (comments, strings) and code segments. Process each segment independently.
 * This avoids placeholder/sentinel issues entirely.
 *
 * @param {string} pLanguage - The language identifier (e.g. "javascript", "json", "html")
 * @returns {function} A function that takes an element and highlights its textContent
 */
function createHighlighter(pLanguage)
{
	return function highlightElement(pElement)
	{
		let tmpCode = pElement.textContent;
		let tmpLanguageName = (typeof (pLanguage) === 'string') ? pLanguage.toLowerCase() : 'javascript';
		let tmpLanguageDef = _LanguageDefinitions[tmpLanguageName];

		if (!tmpLanguageDef)
		{
			// No highlighting rules for this language; just escape and return
			pElement.innerHTML = escapeHTML(tmpCode);
			return;
		}

		if (!tmpLanguageDef.tokenizer)
		{
			// No tokenizer; just escape and apply keyword highlighting
			pElement.innerHTML = highlightCodeSegment(escapeHTML(tmpCode), tmpLanguageDef);
			return;
		}

		// Split the code into tokens using the tokenizer regex.
		// The tokenizer captures comments and strings as groups.
		// We process everything between matches as code.
		let tmpResult = '';
		let tmpLastIndex = 0;
		let tmpTagGroupIndex = tmpLanguageDef.tagGroupIndex || 0;

		tmpLanguageDef.tokenizer.lastIndex = 0;
		let tmpMatch;

		while ((tmpMatch = tmpLanguageDef.tokenizer.exec(tmpCode)) !== null)
		{
			// Add the code segment before this match
			if (tmpMatch.index > tmpLastIndex)
			{
				let tmpSegment = tmpCode.substring(tmpLastIndex, tmpMatch.index);
				tmpResult += highlightCodeSegment(escapeHTML(tmpSegment), tmpLanguageDef);
			}

			let tmpFullMatch = tmpMatch[0];

			// Determine token type from capture groups
			// Group 1 is always comments, Group 2+ are strings/template literals/regex
			if (tmpMatch[1])
			{
				// Comment
				tmpResult += `<span class="comment">${escapeHTML(tmpFullMatch)}</span>`;
			}
			else if (tmpTagGroupIndex > 0 && tmpMatch[tmpTagGroupIndex])
			{
				// HTML tag — highlight tag name, attributes, and values
				tmpResult += highlightHTMLTag(tmpFullMatch);
			}
			else
			{
				// String, template literal, or regex
				tmpResult += `<span class="string">${escapeHTML(tmpFullMatch)}</span>`;
			}

			tmpLastIndex = tmpLanguageDef.tokenizer.lastIndex;
		}

		// Add any remaining code after the last match
		if (tmpLastIndex < tmpCode.length)
		{
			let tmpSegment = tmpCode.substring(tmpLastIndex);
			tmpResult += highlightCodeSegment(escapeHTML(tmpSegment), tmpLanguageDef);
		}

		pElement.innerHTML = tmpResult;
	};
}

module.exports = createHighlighter;
module.exports.LanguageDefinitions = _LanguageDefinitions;
