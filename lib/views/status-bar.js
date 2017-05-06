'use babel';

import { CompositeDisposable } from 'atom';

export default class DFStatusBarView {

  constructor(statusBar) {
    this.statusBar = statusBar;
		this.status    = "";
    this.subscriptions = new CompositeDisposable();
  }

  start() {
    this.drawElement();
    this.initialize();
  }

  initialize() {
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'divinefingers:toggle-statusbar': () => this.toggle()
    }));
  }

  drawElement() {
    this.element = document.createElement('div');
    this.element.className = 'divine-statusbar';
		
    this.element.appendChild(document.createElement('div'));
		this.status = this.element.firstChild;
		
		this.status.ondblclick = function (){
			atom.project.divinefingers.client.disconnect();
			setTimeout(function (){ atom.project.divinefingers.client.connect(); }, 1000);
		};
		
    this.status.appendChild(document.createElement('span'));
    this.status.appendChild(document.createElement('span'));
		this.status.className = "text-error";
		this.status.firstChild.className = "icon icon-ruby";
		this.status.lastChild.innerHTML = "";

    this.statusBar.addRightTile({
      item: this.element,
      priority: -1
    });
  }
	
	setStatusTo(value, icon, type){
		this.status.lastChild.innerHTML = value?value:"Not divine";
		this.status.className = "text-"+(type?type:"error");
		this.status.firstChild.className = "icon icon-"+(icon?icon:"slash");
	}
	
	setStatusColor(color){
		this.status.className = "text-"+color?color:"error";
	}

  toggle() {
    var style = this.element.style.display;
    this.element.style.display = style === 'none' ? '' : 'none';
  }

  destroy() {
    this.subscriptions.dispose();
    this.element.parentNode.removeChild(this.element);
  }

}
