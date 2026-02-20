const libPictApplication = require('pict-application');
const libPictSectionCode = require('../../source/Pict-Section-Code.js');

class ExampleCodeEditorView extends libPictSectionCode
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

const _ExampleCodeEditorConfiguration = (
{
	"ViewIdentifier": "ExampleCodeEditor",
	"TargetElementAddress": "#CodeEditorContainer",
	"CodeDataAddress": "AppData.SourceCode",
	"Language": "javascript",
	"LineNumbers": true
});

class CodeEditorExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('ExampleCodeEditorView', _ExampleCodeEditorConfiguration, ExampleCodeEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();
		let tmpView = this.pict.views.ExampleCodeEditorView;
		if (tmpView)
		{
			tmpView.render();
		}
	}
}

module.exports = CodeEditorExampleApplication;

module.exports.default_configuration = (
{
	"Name": "Code Editor Example",
	"Hash": "CodeEditorExample",
	"MainViewportViewIdentifier": "ExampleCodeEditorView",
	"pict_configuration":
	{
		"Product": "CodeEditor-Example",
		"DefaultAppData":
		{
			"SourceCode": "// Welcome to the Pict Code Editor\n\nconst libFable = require('fable');\n\nclass MyService extends libFable.ServiceProviderBase\n{\n\tconstructor(pFable, pOptions, pServiceHash)\n\t{\n\t\tsuper(pFable, pOptions, pServiceHash);\n\t\tthis.serviceType = 'MyService';\n\t}\n\n\tdoSomething(pInput)\n\t{\n\t\tlet tmpResult = pInput * 2;\n\t\tthis.log.info(`Result: ${tmpResult}`);\n\t\treturn tmpResult;\n\t}\n}\n\nmodule.exports = MyService;\n"
		}
	}
});
