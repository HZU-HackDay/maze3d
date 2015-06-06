// {
// 	t: 1234324
// 	x: 1,      左右
// 	y: 1,      视角，快速视角为跳
// 	z: 20,     
// 	top: 30,   
// 	below: 20  
// }

var Gamer = function(gameId, SocketPath){
	var self = this;
	self.gameId = gameId;
	self.SocketPath = SocketPath
	this.init();
};

Gamer.prototype.init = function() {
	this.createSocket();
};

/**
 * 建立 Socket 连接
 * @return {[type]} [description]
 */
Gamer.prototype.createSocket = function() {
	var self = this;
	var client = self.client = new WebSocket(self.SocketPath);
	client.onerror = function(){
		self.log("Create Gamer: " + self.gameId + ", Crashed.");
	};
	client.onmessage = function(evt){
		var data = JSON.parse(evt.data);
		// Start game
		self[self.gameId](data);
		// console.log(self, self.gameId, self[self.gameId]);
	};
	client.onopen = function(){
		self.log("Create Gamer: " + self.gameId + ", Connect Success.");
	};
};

Gamer.prototype.stop = function (){
	this.stoped = true;
};

Gamer.prototype.start = function (){
	this.stoped = false;
};

Gamer.prototype.log = function(msg){
	var self = this;
	console.log(msg);
};


/**
 * maze3D游戏
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Gamer.prototype.maze3D = function(data){
	var self = this;
	if(this.stoped) return;
	self.log(data);

	// document.onmousedown = WEBGL.navigation.handleMouseDown;
	// document.onmouseup = WEBGL.navigation.handleMouseUp;
	// document.onmousemove = WEBGL.navigation.handleMouseMove;
	// document.oncontextmenu = new Function("return false");
	// document.onkeydown = WEBGL.navigation.handleKeyDown;
	// document.onkeyup = WEBGL.navigation.handleKeyUp;

	var DOC_H = document.body.clientHeight;
	var DOC_W = document.body.clientWidth;

	// 左右控制，以 30 界限
	if(data.x > 30){
		ACL_THETA = 0.10;
	}
	if(data.x < -30){
		ACL_THETA = -0.10;
	}

	// 跳跃控制
	if(data.top < 10 && JUMP == 0){
		WEBGL.navigation.jump();
	};

	// 走停控制，间距2cm
	if(data.below < 2) {
		CLICK = true;
	} else {
		CLICK = false;
	}

	// 视角控制 up down
	var CY = data.y < 0 ? 90 + Math.abs(data.y) : data.y;
	CAM_PHI = 0.004 * (DOC_H / 180 * CY - 0.5 * CANVAS.height);

	// 视角控制 left right
	var CX = data.x > 0 ? 90 + data.x : Math.abs(data.x);
    CAM_THETA += 0.004 * (DOC_W / 180 * CX - OLD_MOVE_X);
	OLD_MOVE_X = DOC_W / 180 * CX;
};

var maze3D = new Gamer("maze3D", "ws://192.168.1.101:9300");



