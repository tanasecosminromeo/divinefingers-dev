'use babel';

import { CompositeDisposable } from 'atom';

import DFClient from './client';

import DivinefingersView from './views/divinefingers';
import DFStatusBarView from './views/status-bar';

class DivineFingers {
	
	constructor(){		
		this.client = null;
		this.loaded = false;
		
  	this.DivinefingersView = null;
		this.modalPanel = null;
		this.subscriptions = null;
		
		this.variables = [];
		
		atom.project.divinefingers = this;
	}
	
  activate(state) {
    this.DivinefingersView = new DivinefingersView(state.DivinefingersViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.DivinefingersView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'divinefingers:toggle': () => this.toggle(),
			'divinefingers:reset': () => this.satisfy()
    }));
		
		this.satisfy();
  }
	
	satisfy () {
		this.loaded = false;
		let packages = atom.packages.getAvailablePackageMetadata();
		let satisifed = false;
		for (let i in packages){
			if (packages[i].name==="Remote-FTP"){ satisifed = true; break; }
		}
		
		if (!satisifed){
			atom.notifications.addError("Divinefingers: Please install Remote-FTP", { dismissable: false, detail: "Divinefingers uses Remote-FTP and creates a wrapper around it so it can work. Please install Remote-FTP and run the divinefingers::reset command"});
			
			return false;
		}
		
		var checkLoopIndex = 0;
		var checkRemoteFtp = setInterval(function() { checkLoopIndex++;
				if (typeof atom.project.remoteftp === "object"){
					clearInterval(checkRemoteFtp);
					this.ready();
				} else if (checkLoopIndex >= 1000){
					clearInterval(checkRemoteFtp);
					
					atom.notifications.addError("Divinefingers: Remote-FTP could not be loaded.", { dismissable: false, buttons: [
						{text: "Try again", className: "btn btn-info", onDidClick: this.satisfy },
						{text: "Cancel", className: "btn btn-error" },
					] });
				}
			}.bind(this), 10);
	}
	
	ready() {
		if (this.client)
			this.client.disconnect();
			
		this.client = new DFClient();
		this.client.init();
		this.client.connect();
		
		this.loaded = true;
		
		return true;
	}

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.DivinefingersView.destroy();
  }
	
  toggle() {
		this.ready();
    console.log('Divinefingers was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }
	
  consumeStatusBar(statusBar) {
    this.statusBar = new DFStatusBarView(statusBar);
		this.statusBar.start();
  }

}

export default new DivineFingers();
