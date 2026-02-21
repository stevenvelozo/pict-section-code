module.exports = (
{
	"RenderOnLoad": true,

	"DefaultRenderable": "CodeEditor-Wrap",
	"DefaultDestinationAddress": "#CodeEditor-Container-Div",

	"Templates":
	[
		{
			"Hash": "CodeEditor-Container",
			"Template": "<!-- CodeEditor-Container Rendering Soon -->"
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "CodeEditor-Wrap",
			"TemplateHash": "CodeEditor-Container",
			"DestinationAddress": "#CodeEditor-Container-Div"
		}
	],

	"TargetElementAddress": "#CodeEditor-Container-Div",

	// Address in AppData or other Pict address space to read/write code content
	"CodeDataAddress": false,

	// The language for syntax highlighting (e.g. "javascript", "html", "css", "json")
	"Language": "javascript",

	// Whether the editor is read-only
	"ReadOnly": false,

	// Tab character: use tab or spaces
	"Tab": "\t",

	// Whether to indent with the same whitespace as the previous line
	"IndentOn": /[({[]$/,

	// Whether to add a closing bracket/paren/brace
	"MoveToNewLine": /^[)}\]]/,

	// Whether to handle the closing character
	"AddClosing": true,

	// Whether to preserve indentation on new lines
	"CatchTab": true,

	// Whether to show line numbers
	"LineNumbers": true,

	// Default code content if no address is provided
	"DefaultCode": "// Enter your code here\n",

	// CSS for the code editor
	"CSS": `.pict-code-editor-wrap
{
	display: flex;
	font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
	font-size: 14px;
	line-height: 1.5;
	border: 1px solid #D0D0D0;
	border-radius: 4px;
	overflow: auto;
}
.pict-code-editor-wrap .pict-code-line-numbers
{
	position: sticky;
	left: 0;
	width: 40px;
	min-width: 40px;
	padding: 10px 0;
	text-align: right;
	background: #F5F5F5;
	border-right: 1px solid #D0D0D0;
	color: #999;
	font-size: 13px;
	line-height: 1.5;
	user-select: none;
	pointer-events: none;
	box-sizing: border-box;
	z-index: 1;
}
.pict-code-editor-wrap .pict-code-line-numbers span
{
	display: block;
	padding: 0 8px 0 0;
}
.pict-code-editor-wrap .pict-code-editor
{
	margin: 0;
	padding: 10px 10px 10px 8px;
	min-height: 100px;
	flex: 1;
	min-width: 0;
	outline: none;
	tab-size: 4;
	white-space: pre;
	overflow-wrap: normal;
	color: #383A42;
	background: #FAFAFA;
	caret-color: #526FFF;
	border-radius: 0 4px 4px 0;
}
.pict-code-editor-wrap .pict-code-editor.pict-code-no-line-numbers
{
	padding-left: 10px;
	border-radius: 4px;
}
.pict-code-editor-wrap .pict-code-editor .keyword { color: #A626A4; }
.pict-code-editor-wrap .pict-code-editor .string { color: #50A14F; }
.pict-code-editor-wrap .pict-code-editor .number { color: #986801; }
.pict-code-editor-wrap .pict-code-editor .comment { color: #A0A1A7; font-style: italic; }
.pict-code-editor-wrap .pict-code-editor .operator { color: #0184BC; }
.pict-code-editor-wrap .pict-code-editor .punctuation { color: #383A42; }
.pict-code-editor-wrap .pict-code-editor .function-name { color: #4078F2; }
.pict-code-editor-wrap .pict-code-editor .property { color: #E45649; }
.pict-code-editor-wrap .pict-code-editor .tag { color: #E45649; }
.pict-code-editor-wrap .pict-code-editor .attr-name { color: #986801; }
.pict-code-editor-wrap .pict-code-editor .attr-value { color: #50A14F; }
`
});
