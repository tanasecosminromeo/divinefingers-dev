'use babel';

import DivinefingersDevView from './divinefingers-dev-view';
import { CompositeDisposable } from 'atom';

export default {

  divinefingersDevView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.divinefingersDevView = new DivinefingersDevView(state.divinefingersDevViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.divinefingersDevView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'divinefingers-dev:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.divinefingersDevView.destroy();
  },

  serialize() {
    return {
      divinefingersDevViewState: this.divinefingersDevView.serialize()
    };
  },

  toggle() {
    console.log('DivinefingersDev was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
