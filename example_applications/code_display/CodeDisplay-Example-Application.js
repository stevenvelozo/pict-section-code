const libPictApplication = require('pict-application');
const libPictSectionCode = require('../../source/Pict-Section-Code.js');

class ExampleCodeDisplayView extends libPictSectionCode
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

// --- View Configurations ---

const _JSSnippetConfig = (
{
	"ViewIdentifier": "JSSnippet",
	"TargetElementAddress": "#CodeBlockJS",
	"Language": "javascript",
	"ReadOnly": true,
	"LineNumbers": true,
	"DefaultCode": "// Service Provider Pattern\nconst libFable = require('fable');\n\nclass GreeterService extends libFable.ServiceProviderBase\n{\n\tconstructor(pFable, pOptions, pServiceHash)\n\t{\n\t\tsuper(pFable, pOptions, pServiceHash);\n\t\tthis.serviceType = 'Greeter';\n\t}\n\n\tgreet(pName)\n\t{\n\t\tlet tmpResult = `Hello, ${pName}!`;\n\t\tthis.log.info(tmpResult);\n\t\treturn tmpResult;\n\t}\n}\n\nmodule.exports = GreeterService;\n"
});

const _HTMLSnippetConfig = (
{
	"ViewIdentifier": "HTMLSnippet",
	"TargetElementAddress": "#CodeBlockHTML",
	"Language": "html",
	"ReadOnly": true,
	"LineNumbers": false,
	"DefaultCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t<title>My Application</title>\n\t<link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n\t<header class=\"site-header\">\n\t\t<h1>Welcome</h1>\n\t\t<nav>\n\t\t\t<a href=\"/home\">Home</a>\n\t\t\t<a href=\"/about\">About</a>\n\t\t</nav>\n\t</header>\n\t<main id=\"content\"></main>\n\t<script src=\"app.js\"></script>\n</body>\n</html>\n"
});

const _CSSSnippetConfig = (
{
	"ViewIdentifier": "CSSSnippet",
	"TargetElementAddress": "#CodeBlockCSS",
	"Language": "css",
	"ReadOnly": true,
	"LineNumbers": true,
	"DefaultCode": "/* Site Header Styles */\n.site-header\n{\n\tbackground: #264653;\n\tcolor: #FAEDCD;\n\tpadding: 1rem 2rem;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n}\n\n.site-header h1\n{\n\tmargin: 0;\n\tfont-size: 1.5rem;\n\tfont-weight: 700;\n}\n\n.site-header nav a\n{\n\tcolor: #D4A373;\n\ttext-decoration: none;\n\tmargin-left: 1.5rem;\n\tfont-size: 0.9rem;\n\ttransition: color 0.2s;\n}\n\n.site-header nav a:hover\n{\n\tcolor: #E76F51;\n}\n"
});

const _JSONSnippetConfig = (
{
	"ViewIdentifier": "JSONSnippet",
	"TargetElementAddress": "#CodeBlockJSON",
	"Language": "json",
	"ReadOnly": true,
	"LineNumbers": false,
	"DefaultCode": "{\n\t\"Product\": \"MyApplication\",\n\t\"ProductVersion\": \"1.0.0\",\n\t\"APIServerPort\": 8080,\n\t\"LogLevel\": 3,\n\t\"Database\":\n\t{\n\t\t\"Server\": \"localhost\",\n\t\t\"Port\": 3306,\n\t\t\"Schema\": \"my_app\",\n\t\t\"ConnectionPoolSize\": 10,\n\t\t\"EnableSSL\": true\n\t},\n\t\"Features\":\n\t[\n\t\t\"authentication\",\n\t\t\"logging\",\n\t\t\"caching\"\n\t]\n}\n"
});

const _SQLSnippetConfig = (
{
	"ViewIdentifier": "SQLSnippet",
	"TargetElementAddress": "#CodeBlockSQL",
	"Language": "sql",
	"ReadOnly": true,
	"LineNumbers": true,
	"DefaultCode": "-- Create a users table with audit fields\nCREATE TABLE Users\n(\n\tIDUser INT PRIMARY KEY AUTO_INCREMENT,\n\tName VARCHAR(255) NOT NULL,\n\tEmail VARCHAR(255) UNIQUE,\n\tRole VARCHAR(50) DEFAULT 'user',\n\tCreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n\tUpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Find active users created this year\nSELECT IDUser, Name, Email, Role\nFROM Users\nWHERE CreatedAt > '2025-01-01'\n\tAND Role IN ('admin', 'editor')\nORDER BY Name ASC\nLIMIT 25;\n"
});

class CodeDisplayExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('JSSnippetView', _JSSnippetConfig, ExampleCodeDisplayView);
		this.pict.addView('HTMLSnippetView', _HTMLSnippetConfig, ExampleCodeDisplayView);
		this.pict.addView('CSSSnippetView', _CSSSnippetConfig, ExampleCodeDisplayView);
		this.pict.addView('JSONSnippetView', _JSONSnippetConfig, ExampleCodeDisplayView);
		this.pict.addView('SQLSnippetView', _SQLSnippetConfig, ExampleCodeDisplayView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();

		let tmpViews = this.pict.views;
		if (tmpViews.JSSnippetView) { tmpViews.JSSnippetView.render(); }
		if (tmpViews.HTMLSnippetView) { tmpViews.HTMLSnippetView.render(); }
		if (tmpViews.CSSSnippetView) { tmpViews.CSSSnippetView.render(); }
		if (tmpViews.JSONSnippetView) { tmpViews.JSONSnippetView.render(); }
		if (tmpViews.SQLSnippetView) { tmpViews.SQLSnippetView.render(); }
	}
}

module.exports = CodeDisplayExampleApplication;

module.exports.default_configuration = (
{
	"Name": "Code Display Example",
	"Hash": "CodeDisplayExample",
	"MainViewportViewIdentifier": "JSSnippetView",
	"pict_configuration":
	{
		"Product": "CodeDisplay-Example"
	}
});
