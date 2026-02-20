const libPictApplication = require('pict-application');
const libPictSectionCode = require('../../source/Pict-Section-Code.js');

class ExampleMultiFileEditorView extends libPictSectionCode
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

const _EditorViewConfig = (
{
	"ViewIdentifier": "EditorView",
	"TargetElementAddress": "#EditorContainer",
	"CodeDataAddress": "AppData.CurrentFileContent",
	"Language": "javascript",
	"LineNumbers": true
});

class MultiFileEditorExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('EditorView', _EditorViewConfig, ExampleMultiFileEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();

		// Track whether a file has been loaded into the editor yet
		this._fileLoaded = false;

		let tmpView = this.pict.views.EditorView;
		if (tmpView)
		{
			tmpView.render();
		}

		this.renderSidebar();
		this.loadFile('app.js');
	}

	/**
	 * Detect language from a filename extension.
	 *
	 * @param {string} pFilename - The filename to inspect
	 * @returns {string} The language identifier
	 */
	detectLanguage(pFilename)
	{
		if (typeof pFilename !== 'string')
		{
			return 'javascript';
		}

		let tmpExtension = pFilename.split('.').pop().toLowerCase();

		switch (tmpExtension)
		{
			case 'js':
				return 'javascript';
			case 'json':
				return 'json';
			case 'html':
			case 'htm':
				return 'html';
			case 'css':
				return 'css';
			case 'sql':
				return 'sql';
			default:
				return 'javascript';
		}
	}

	/**
	 * Save the current file content from the editor back to AppData.Files.
	 */
	saveCurrentFile()
	{
		// Don't save if no file has been loaded into the editor yet
		if (!this._fileLoaded)
		{
			return;
		}

		let tmpCurrentFile = this.pict.AppData.CurrentFile;
		let tmpView = this.pict.views.EditorView;

		if (!tmpCurrentFile || !tmpView)
		{
			return;
		}

		let tmpFiles = this.pict.AppData.Files;
		if (tmpFiles && tmpFiles[tmpCurrentFile])
		{
			tmpFiles[tmpCurrentFile].Content = tmpView.getCode();
		}
	}

	/**
	 * Load a file into the editor.
	 *
	 * @param {string} pFileKey - The key in AppData.Files to load
	 */
	loadFile(pFileKey)
	{
		let tmpFiles = this.pict.AppData.Files;
		let tmpView = this.pict.views.EditorView;

		if (!tmpFiles || !tmpFiles[pFileKey] || !tmpView)
		{
			return;
		}

		// Save the current file before switching
		this.saveCurrentFile();

		// Update current file pointer
		this.pict.AppData.CurrentFile = pFileKey;

		// Copy file content to the editor data address
		let tmpContent = tmpFiles[pFileKey].Content || '';
		this.pict.AppData.CurrentFileContent = tmpContent;

		// Detect language and update the editor
		let tmpLanguage = this.detectLanguage(pFileKey);
		tmpView.setLanguage(tmpLanguage);
		tmpView.setCode(tmpContent);

		// Mark that a file has been loaded (enables save on next switch)
		this._fileLoaded = true;

		// Update sidebar active state and toolbar
		this.updateSidebarActiveState();
		this.updateToolbar(pFileKey, tmpLanguage);
	}

	/**
	 * Add a new file to the file list.
	 *
	 * @param {string} pFilename - The new filename
	 */
	createNewFile(pFilename)
	{
		if (!pFilename || typeof pFilename !== 'string')
		{
			return;
		}

		let tmpFiles = this.pict.AppData.Files;
		if (!tmpFiles)
		{
			this.pict.AppData.Files = {};
			tmpFiles = this.pict.AppData.Files;
		}

		if (tmpFiles[pFilename])
		{
			// File already exists, just load it
			this.loadFile(pFilename);
			return;
		}

		let tmpLanguage = this.detectLanguage(pFilename);
		let tmpDefaultContent = '// ' + pFilename + '\n';
		if (tmpLanguage === 'json')
		{
			tmpDefaultContent = '{\n\t\n}\n';
		}
		else if (tmpLanguage === 'html')
		{
			tmpDefaultContent = '<!DOCTYPE html>\n<html>\n<head>\n\t<title></title>\n</head>\n<body>\n\t\n</body>\n</html>\n';
		}
		else if (tmpLanguage === 'css')
		{
			tmpDefaultContent = '/* ' + pFilename + ' */\n';
		}
		else if (tmpLanguage === 'sql')
		{
			tmpDefaultContent = '-- ' + pFilename + '\n';
		}

		tmpFiles[pFilename] = { "Name": pFilename, "Content": tmpDefaultContent };

		this.renderSidebar();
		this.loadFile(pFilename);
	}

	/**
	 * Delete a file from the file list.
	 *
	 * @param {string} pFileKey - The key in AppData.Files to delete
	 */
	deleteFile(pFileKey)
	{
		let tmpFiles = this.pict.AppData.Files;
		if (!tmpFiles || !tmpFiles[pFileKey])
		{
			return;
		}

		delete tmpFiles[pFileKey];

		// If we deleted the current file, load the first available
		if (this.pict.AppData.CurrentFile === pFileKey)
		{
			let tmpKeys = Object.keys(tmpFiles);
			if (tmpKeys.length > 0)
			{
				this.renderSidebar();
				this.loadFile(tmpKeys[0]);
			}
			else
			{
				this.pict.AppData.CurrentFile = '';
				this.pict.AppData.CurrentFileContent = '';
				this.pict.views.EditorView.setCode('');
				this.renderSidebar();
				this.updateToolbar('', 'javascript');
			}
		}
		else
		{
			this.renderSidebar();
		}
	}

	/**
	 * Render the sidebar file list.
	 */
	renderSidebar()
	{
		let tmpSidebar = document.getElementById('FileSidebarList');
		if (!tmpSidebar)
		{
			return;
		}

		let tmpFiles = this.pict.AppData.Files || {};
		let tmpCurrentFile = this.pict.AppData.CurrentFile || '';
		let tmpHTML = '';

		let tmpKeys = Object.keys(tmpFiles);
		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpKey = tmpKeys[i];
			let tmpFile = tmpFiles[tmpKey];
			let tmpActiveClass = (tmpKey === tmpCurrentFile) ? ' active' : '';
			let tmpExtension = tmpKey.split('.').pop().toLowerCase();

			tmpHTML += '<div class="file-entry' + tmpActiveClass + '" onclick="loadFile(\'' + tmpKey.replace(/'/g, "\\'") + '\')">';
			tmpHTML += '<span class="file-name">' + tmpFile.Name + '</span>';
			tmpHTML += '<span class="file-ext">.' + tmpExtension + '</span>';
			tmpHTML += '<button class="file-delete" onclick="event.stopPropagation(); deleteFile(\'' + tmpKey.replace(/'/g, "\\'") + '\')" title="Delete">&times;</button>';
			tmpHTML += '</div>';
		}

		tmpSidebar.innerHTML = tmpHTML;
	}

	/**
	 * Update the sidebar active file highlight.
	 */
	updateSidebarActiveState()
	{
		let tmpEntries = document.querySelectorAll('.file-entry');
		let tmpCurrentFile = this.pict.AppData.CurrentFile || '';

		for (let i = 0; i < tmpEntries.length; i++)
		{
			let tmpEntry = tmpEntries[i];
			let tmpFileName = tmpEntry.querySelector('.file-name');
			if (tmpFileName && tmpFileName.textContent === tmpCurrentFile)
			{
				tmpEntry.classList.add('active');
			}
			else
			{
				tmpEntry.classList.remove('active');
			}
		}
	}

	/**
	 * Update the toolbar with current file name and language.
	 *
	 * @param {string} pFilename - The current filename
	 * @param {string} pLanguage - The current language
	 */
	updateToolbar(pFilename, pLanguage)
	{
		let tmpFileNameEl = document.getElementById('CurrentFileName');
		let tmpLanguageBadge = document.getElementById('LanguageBadge');

		if (tmpFileNameEl)
		{
			tmpFileNameEl.textContent = pFilename || 'No file selected';
		}
		if (tmpLanguageBadge)
		{
			tmpLanguageBadge.textContent = pLanguage || '';
		}
	}
}

module.exports = MultiFileEditorExampleApplication;

module.exports.default_configuration = (
{
	"Name": "Multi-File Editor Example",
	"Hash": "MultiFileEditorExample",
	"MainViewportViewIdentifier": "EditorView",
	"pict_configuration":
	{
		"Product": "MultiFileEditor-Example",
		"DefaultAppData":
		{
			"CurrentFile": "app.js",
			"CurrentFileContent": "",
			"Files":
			{
				"app.js":
				{
					"Name": "app.js",
					"Content": "// Simple Orator Server\nconst libOrator = require('orator');\n\nlet tmpServer = new libOrator(\n\t{\n\t\tProduct: 'MyApp',\n\t\tAPIServerPort: 8080\n\t});\n\ntmpServer.startService(\n\t(pError) =>\n\t{\n\t\tif (pError)\n\t\t{\n\t\t\tconsole.error('Failed to start:', pError);\n\t\t\treturn;\n\t\t}\n\t\tconsole.log('Server listening on port 8080');\n\t});\n"
				},
				"config.json":
				{
					"Name": "config.json",
					"Content": "{\n\t\"Product\": \"MyApplication\",\n\t\"ProductVersion\": \"1.0.0\",\n\t\"APIServerPort\": 8080,\n\t\"LogLevel\": 3,\n\t\"Database\":\n\t{\n\t\t\"Server\": \"localhost\",\n\t\t\"Port\": 3306,\n\t\t\"Schema\": \"my_app\"\n\t}\n}\n"
				},
				"styles.css":
				{
					"Name": "styles.css",
					"Content": "/* Application Styles */\nbody\n{\n\tmargin: 0;\n\tpadding: 0;\n\tfont-family: -apple-system, sans-serif;\n\tbackground: #FAEDCD;\n\tcolor: #264653;\n}\n\n.header\n{\n\tbackground: #264653;\n\tcolor: #FAEDCD;\n\tpadding: 1rem 2rem;\n\tdisplay: flex;\n\talign-items: center;\n}\n\n.header h1\n{\n\tmargin: 0;\n\tfont-size: 1.4rem;\n}\n\n.content\n{\n\tpadding: 2rem;\n\tmax-width: 800px;\n}\n"
				},
				"index.html":
				{
					"Name": "index.html",
					"Content": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\t<title>My Application</title>\n\t<link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n\t<div class=\"header\">\n\t\t<h1>My Application</h1>\n\t</div>\n\t<div class=\"content\">\n\t\t<p>Welcome to the application.</p>\n\t</div>\n\t<script src=\"app.js\"></script>\n</body>\n</html>\n"
				},
				"schema.sql":
				{
					"Name": "schema.sql",
					"Content": "-- Application Database Schema\nCREATE TABLE Users\n(\n\tIDUser INT PRIMARY KEY AUTO_INCREMENT,\n\tName VARCHAR(255) NOT NULL,\n\tEmail VARCHAR(255) UNIQUE,\n\tRole VARCHAR(50) DEFAULT 'user',\n\tCreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE Sessions\n(\n\tIDSession INT PRIMARY KEY AUTO_INCREMENT,\n\tIDUser INT NOT NULL,\n\tToken VARCHAR(512) NOT NULL,\n\tExpiresAt DATETIME,\n\tFOREIGN KEY (IDUser) REFERENCES Users(IDUser)\n);\n\nSELECT u.Name, u.Email, COUNT(s.IDSession) AS SessionCount\nFROM Users u\nLEFT JOIN Sessions s ON u.IDUser = s.IDUser\nGROUP BY u.IDUser\nORDER BY SessionCount DESC;\n"
				}
			}
		}
	}
});
