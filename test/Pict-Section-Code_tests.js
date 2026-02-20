/*
	Unit tests for Pict-Section-Code
*/

const libBrowserEnv = require('browser-env');
libBrowserEnv();

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');

const configureTestPict = (pPict) =>
{
	let tmpPict = (typeof (pPict) == 'undefined') ? new libPict() : pPict;
	tmpPict.TestData = (
		{
			Reads: [],
			Assignments: [],
			Appends: [],
			Gets: []
		});
	tmpPict.ContentAssignment.customReadFunction = (pAddress, pContentType) =>
	{
		tmpPict.TestData.Reads.push(pAddress);
		tmpPict.log.info(`Mocking a read of type ${pContentType} from Address: ${pAddress}`);
		return '';
	};
	tmpPict.ContentAssignment.customGetElementFunction = (pAddress) =>
	{
		tmpPict.TestData.Gets.push(pAddress);
		tmpPict.log.info(`Mocking a get of Address: ${pAddress}`);
		return '';
	};
	tmpPict.ContentAssignment.customAppendElementFunction = (pAddress, pContent) =>
	{
		tmpPict.TestData.Appends.push(pAddress);
		tmpPict.log.info(`Mocking an append of Address: ${pAddress}`, { Content: pContent });
		return '';
	};
	tmpPict.ContentAssignment.customAssignFunction = (pAddress, pContent) =>
	{
		tmpPict.TestData.Assignments.push(pAddress);
		tmpPict.log.info(`Mocking an assignment of Address: ${pAddress}`, { Content: pContent });
		return '';
	};

	return tmpPict;
};

const libPictSectionCode = require('../source/Pict-Section-Code.js');

suite
(
	'PictSectionCode',
	() =>
	{
		setup(() => { });

		suite
		(
			'Module Exports',
			() =>
			{
				test
				(
					'Main class should be exported',
					(fDone) =>
					{
						Expect(libPictSectionCode).to.be.a('function');
						return fDone();
					}
				);
				test
				(
					'Default configuration should be exported',
					(fDone) =>
					{
						Expect(libPictSectionCode.default_configuration).to.be.an('object');
						Expect(libPictSectionCode.default_configuration).to.have.property('DefaultRenderable');
						Expect(libPictSectionCode.default_configuration).to.have.property('TargetElementAddress');
						Expect(libPictSectionCode.default_configuration).to.have.property('Language');
						Expect(libPictSectionCode.default_configuration).to.have.property('CSS');
						return fDone();
					}
				);
				test
				(
					'Highlighter factory should be exported',
					(fDone) =>
					{
						Expect(libPictSectionCode.createHighlighter).to.be.a('function');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Basic Initialization',
			() =>
			{
				test
				(
					'Should create a view instance with default options',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestCode', {}, libPictSectionCode);
						Expect(tmpView).to.be.an('object');
						Expect(tmpView).to.have.property('codeJar');
						Expect(tmpView.codeJar).to.equal(null);
						Expect(tmpView._language).to.equal('javascript');
						return fDone();
					}
				);
				test
				(
					'Should create a view instance with custom language',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestCode-JSON', { Language: 'json' }, libPictSectionCode);
						Expect(tmpView).to.be.an('object');
						Expect(tmpView._language).to.equal('json');
						return fDone();
					}
				);
				test
				(
					'Should create a view instance with custom code data address',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView(
							'Pict-View-TestCode-Address',
							{
								CodeDataAddress: 'AppData.SourceCode'
							},
							libPictSectionCode
						);
						Expect(tmpView).to.be.an('object');
						Expect(tmpView.options.CodeDataAddress).to.equal('AppData.SourceCode');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Highlighter',
			() =>
			{
				test
				(
					'Should create a highlight function for JavaScript',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('javascript');
						Expect(tmpHighlighter).to.be.a('function');
						return fDone();
					}
				);
				test
				(
					'Should create a highlight function for JSON',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('json');
						Expect(tmpHighlighter).to.be.a('function');
						return fDone();
					}
				);
				test
				(
					'Should create a highlight function for HTML',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('html');
						Expect(tmpHighlighter).to.be.a('function');
						return fDone();
					}
				);
				test
				(
					'Should create a highlight function for CSS',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('css');
						Expect(tmpHighlighter).to.be.a('function');
						return fDone();
					}
				);
				test
				(
					'Should create a highlight function for SQL',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('sql');
						Expect(tmpHighlighter).to.be.a('function');
						return fDone();
					}
				);
				test
				(
					'Should handle an unknown language gracefully',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('brainfuck');
						Expect(tmpHighlighter).to.be.a('function');
						// Should still be callable without error
						let tmpElement = { textContent: 'hello world', innerHTML: '' };
						tmpHighlighter(tmpElement);
						Expect(tmpElement.innerHTML).to.equal('hello world');
						return fDone();
					}
				);
				test
				(
					'Should highlight JavaScript keywords',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('javascript');
						let tmpElement = { textContent: 'const x = 42;', innerHTML: '' };
						tmpHighlighter(tmpElement);
						Expect(tmpElement.innerHTML).to.contain('keyword');
						Expect(tmpElement.innerHTML).to.contain('const');
						Expect(tmpElement.innerHTML).to.contain('number');
						return fDone();
					}
				);
				test
				(
					'Should highlight JavaScript strings',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('javascript');
						let tmpElement = { textContent: 'let msg = "hello";', innerHTML: '' };
						tmpHighlighter(tmpElement);
						Expect(tmpElement.innerHTML).to.contain('string');
						Expect(tmpElement.innerHTML).to.contain('hello');
						return fDone();
					}
				);
				test
				(
					'Should highlight JavaScript comments',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('javascript');
						let tmpElement = { textContent: '// this is a comment\nlet x = 1;', innerHTML: '' };
						tmpHighlighter(tmpElement);
						Expect(tmpElement.innerHTML).to.contain('comment');
						return fDone();
					}
				);
				test
				(
					'Should escape HTML in code to prevent XSS',
					(fDone) =>
					{
						let tmpHighlighter = libPictSectionCode.createHighlighter('javascript');
						let tmpElement = { textContent: 'let x = "<script>alert(1)</script>";', innerHTML: '' };
						tmpHighlighter(tmpElement);
						Expect(tmpElement.innerHTML).to.not.contain('<script>');
						Expect(tmpElement.innerHTML).to.contain('&lt;script&gt;');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Public API',
			() =>
			{
				test
				(
					'getCode should return empty string before initialization',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestCode-API', {}, libPictSectionCode);
						Expect(tmpView.getCode()).to.equal('');
						return fDone();
					}
				);
				test
				(
					'setCode should not throw before initialization',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestCode-API2', {}, libPictSectionCode);
						// Should not throw
						tmpView.setCode('test code');
						return fDone();
					}
				);
				test
				(
					'setLanguage should update the language',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestCode-Lang', {}, libPictSectionCode);
						tmpView.setLanguage('json');
						Expect(tmpView._language).to.equal('json');
						return fDone();
					}
				);
				test
				(
					'destroy should not throw before initialization',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestCode-Destroy', {}, libPictSectionCode);
						tmpView.destroy();
						Expect(tmpView.codeJar).to.equal(null);
						return fDone();
					}
				);
			}
		);
	}
);
