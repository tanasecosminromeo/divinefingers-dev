'use babel';

export default class DFClient {
	constructor() {
		this.timeout = 5000;
			
		this.client = function (){ return atom.project.remoteftp.root.client; };
		this.status = function (){ return this.client().status?this.client().status:"NOT_CONNECTED"; };
	}
	
	init() {
		// === Update remoteftp client doConnect
		this.client().doConnectRemoteFtp = this.client().doConnect;
		this.client().doConnect = function (){ 
			atom.project.remoteftp.root.client.status = "CONNECTING";
			
			return atom.project.remoteftp.root.client.doConnectRemoteFtp.call(atom.project.remoteftp.root.client);
		};
		
		// === Update Status Bar and Sync Plugin
		this.updateStatus = setInterval(function (){
			let client = atom.project.remoteftp.root.client;
			
			if (client.DF_STATUS !== client.status){
				let statusBar = atom.project.divinefingers.statusBar;
				
				client.DF_STATUS = client.status;
				switch (client.status){
					case "CONNECTED": statusBar.setStatusTo(client.info.label?client.info.label:client.info.remote.split("/").pop(), "globe", "success"); break;
					case "CONNECTING": statusBar.setStatusTo("Connecting", "dashboard", "info"); break;
					default: statusBar.setStatusTo("Local", "plug", "error");
				}
			}
			
			if (client.DF_STATUS === "CONNECTED"){
				if (!client.connector.ssh2._sock.readable)
					atom.project.divinefingers.client.reconnect();
			}
		}, 100);
		
		// === It's aliiiveee
		this.heartbeat();
	}
	
	heartbeat (iteration){		
		if (this.status()==="CONNECTED") {
			this.ping(function (ms){
				let connection = atom.project.divinefingers.statusBar.status;
				let client     = atom.project.divinefingers.client;
								
				if (ms > 0 && ms < client.timeout/3) {
					if (connection.className !== "text-success")
						connection.className = "text-success";
						
					if (client.hearbeat_warning)
						clearTimeout(client.hearbeat_warning);
				} else {
					if (ms !== 0){
						if (connection.className !== "text-warning")
							connection.className = "text-warning";
					}
				}
				
				client.hearbeat_warning = setTimeout(function (){
					if (client.status()!=="CONNECTED") return;
					
					if (connection.className !== "text-warning")
						connection.className = "text-warning";
				}, client.timeout/2);
				
				setTimeout(function (){ atom.project.divinefingers.client.heartbeat(); }, client.timeout/5);
			});
		} else {
			setTimeout(function (){ atom.project.divinefingers.client.heartbeat(); }, this.timeout/5);
		}
	}

	status() { return "NOT_CONNECTED"; }
	
	ping(callback){
		if (typeof callback !== "function")
			return this.ping(function (ms){ console.log("Ping-pong: ", ms); });
			
		if (this.status()!=="CONNECTED") 
			return callback(-1);
			
		let start = Number(process.hrtime().join("."));
		let pong  = "";
		let timeout = this.timeout;
		this.exec("echo ping", function(err, stream) {
	 		if (err) 
				return callback(-2);
				
			let timeoutInterval = setTimeout(callback, timeout, timeout);
	    stream.on('close', function(code, signal) {
	      if (code!==0 || pong.indexOf("ping")<0)
					return clearInterval(timeoutInterval) && callback(-Math.max(code, 3));
					
				clearInterval(timeoutInterval);
				callback(Math.max(Math.min(Math.floor((Number(process.hrtime().join("."))-start)*1000), timeout), 0));
	    }).on('data', function(data) {
	      pong += data;
	    }).on('end', function(data) {
	      pong += data;
	    }).stderr.on('data', function(data) {
				clearInterval(timeoutInterval);
	      callback(-2);
	    });
		});
	}
	
	exec(cmd, callback) {
		try {
			return atom.project.remoteftp.root.client.connector.ssh2.exec(cmd, callback);
		} catch (e){
			return callback(140, null);
		}
	}
	
	reconnect() {
		this.disconnect();
		setTimeout(this.connect, 1000, true);
	}
	
	connect(reconnect) {
		atom.project.divinefingers.statusBar.setStatusTo("Connecting", "dashboard", "info");
		atom.commands.dispatch(atom.views.getView(atom.workspace), "remote-ftp:connect");
	}
	
	disconnect() {
		if (this.status==="NOT_CONNECTED") 
			return false;
			
		atom.project.divinefingers.statusBar.setStatusTo("Local", "plug", "error");
		atom.commands.dispatch(atom.views.getView(atom.workspace), "remote-ftp:disconnect");
	}
}
