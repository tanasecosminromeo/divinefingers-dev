'use babel';

const atom = global.atom;

export const hasProject = function HASPROJECT() {
  return atom.project && atom.project.getPaths().length;
};

export const regExGrep = function (query) {
	query = query.replace(new RegExp('=', 'g'), ` `)
							 .replace(new RegExp('\\$', 'g'), ` `)
							 .replace(new RegExp(`"`, 'g'), ` `)
							 .replace(new RegExp(`'`, 'g'), ` `)
							 .replace(new RegExp(`;`, 'g'), ` `)
							 .replace(new RegExp(`\\>`, 'g'), ` `)
							 .replace(new RegExp(`\\:`, 'g'), ` `)
							 .replace(new RegExp(`\\(`, 'g'), ` `)
							 .replace(new RegExp(`\\)`, 'g'), ` `)
							 .replace(new RegExp(`\\[`, 'g'), ` `)
							 .replace(new RegExp(`\\]`, 'g'), ` `)
							 .replace(new RegExp(`\\{`, 'g'), ` `)
							 .replace(new RegExp(`\\}`, 'g'), ` `)
							 .replace(/( )+/g, ' ')
							 .trim()
							 .replace(new RegExp(` `, 'g'), `([ \\t\\"\\'=$\\(\\[\\{\\}\\)\\]\\;\\:\\>]+)?`);
	
	return query;
};

export const htmlEscape = function (str) {
	return str
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
};

// if (this.ssh2===null) return;
// if (this.stack.length>0) return;
// 
// var client = atom.project.divinefingers.root.client;
// var local  = atom.project.getPaths()[0];
// 
// var path = client.info.remote;
// if (client.info.bundle){
// 	if (query[0]=="/"){
// 		query = query.substring(1);
// 	} else {
// 		path += client.info.bundle;
// 	}
// }
// 
// let limit = 5;
// if (query[0]=="-"){
// 	limit = query.split(" ");
// 	limit = limit[0].substring(1);
// 	
// 	query = query.replace(`-${limit}`, "").trim();
// 	
// 	if (limit=="a"){
// 		limit = 1000;
// 	}
// 	
// 	limit = Math.floor(limit/2);
// }
// 
// var cmd = `find ${path} -type f -i${query.indexOf("/")?'whole':''}name *${query}* | head -${limit}`;
// 
// if ((query[0]+query[1])!="*."){
// 	exts = `--include \*.twig --include \*.php --include \*.css --include \*.scss --include \*.js`;
// 	
// 	cmd += " && ";
// } else {
// 	var ext = query.split(" ");
// 	exts = `--include ${ext[0]}`;
// 	
// 	query = query.replace(`${ext[0]}`, "").trim();
// 	cmd   = "";
// }
// 
// cmd += `grep ${exts} -rinP "${this.regExGrep(query)}" ${path} | head -${limit}`;
// 
// if (query.length<3) return this.fuzzyClean();
// 
// this.calls.push([""]);
// this.setLoading("Loading");
// this.buffer = "";
// this.sshbuf = this.ssh2.exec(cmd, function(err, stream) {
// 	if (typeof stream == "undefined") return false;
// 	
// 	stream.on('data', function(data) {
// 				data = String(data);
// 				let buffId = (data.match(/\n/g) || []).length;
// 				data = data.split("\n");
// 				
// 				for (var i in data){
// 					try {
// 						if (buffId>0) this.fuzzyPopulate(this, this.calls[this][this.calls[this].length-1]+data[i]);
// 					} catch (e){
// 						console.log("Error finding ", this, ": ", e);
// 					}
// 					
// 					this.calls[this][this.calls[this].length-1] += data[i];
// 					if (i<data.length-1 && buffId>0)
// 						this.calls[this].push("");
// 						buffId--;
// 				}
// 			}.bind(this)).on('end', function() {
// 				setTimeout(function (){ this.calls.shift(); /* Clean data */ }, 60000);
// 				
// 				this.setLoading();
// 				if (typeof this.calls[this] == "undefined") return false;
// 				if (this.calls[this][0]==="") {
// 					this.list.empty();
// 					this.setError(this.getEmptyMessage(0, 0));
// 				}
// 			}.bind(this));
// }.bind(this.calls.length-1));
