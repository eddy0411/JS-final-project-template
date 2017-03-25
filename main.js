var FPS = 60;
var scores = 0;
var money = 20;
var clock = 0;
var hp = 0;
// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var btnImg = document.createElement("img"); 
var towerImg = document.createElement("img");
var crosshairImg = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/slime.gif";
btnImg.src = "images/tower-btn.png";
towerImg.src = "images/tower.png";
crosshairImg.src = "images/crosshair.png"

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;
	if (clock%100==0) {
		var newEnemy = new Enemy()
		enemies.push(newEnemy)
	}
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
  ctx.drawImage(bgImg,0,0);
  for (var i = 0; i <enemies.length; i++) {
  	enemies[i].move();
  	if (enemies[i].hp <= 0) {
  		enemies.splice(i,1)
  		scores = scores+10
  		money = money+30
  	}
  	ctx.drawImage(enemyImg,enemies[i].x,enemies[i].y);
  }
if(isBuilding == true){
	ctx.drawImage(towerImg,cursor.x-cursor.x%32,cursor.y-cursor.y%32);
}
	ctx.drawImage(btnImg,640-64,480-64,64,64)	
for (var i = 0; i < towers.length; i++) {

	ctx.drawImage(towerImg,towers[i].x,towers[i].y);	  
	towers[i].searchEnemy();
	if (towers[i].aimingEnemyId != null) {
	var id = towers[i].aimingEnemyId;
	ctx.drawImage(crosshairImg,enemies[id].x,enemies[id].y);
	}
  }
  
	ctx.font="18px Arial";
	ctx.fillStyie = "white";
	ctx.fillText("生命樹血量 = " + hp,32,50)
	ctx.fillText("分數 = " + scores,32+150,50)
	ctx.fillText("錢 = " + money,32+270,50)
  	if (hp <= 0) {
		ctx.font="64px Arial";
		ctx.fillStyie = "white";
  		ctx.fillText("game over" ,160,230)
		ctx.font="32px Arial";
  		ctx.fillText("scores:" + scores,260,270)
  		clearInterval(gameOver)
  	}
}
// 執行 draw 函式
var gameOver = setInterval(draw, 1000/FPS);

var enemyPath = [
  {x: 96, y: 64},
  {x: 384, y: 64},
  {x: 384, y: 192},
  {x: 224, y: 192},
  {x: 224, y: 320},
  {x: 544, y: 320},
  {x: 544, y: 96},
]

function Enemy(){
	this.x = 96;
	this.y = 480-32;
	this.hp = 10
	this.speedX = 0;
	this.speedY = -64;
	this.pathDes = 0;
	 this.move = function(){
		if(isCollided(enemyPath[this.pathDes].x,enemyPath[this.pathDes].y,this.x,this.y,64/FPS,64/FPS)){
			//移動
			this.x = enemyPath[this.pathDes].x
			this.y = enemyPath[this.pathDes].y
			this.pathDes++
			if (this.pathDes == enemyPath.length) {
				this.hp = 0
				hp -= 10
				scores = scores-10
				money = money-30
				return;

			}
			//計算和修改
			if (enemyPath[this.pathDes].y < this.y) {
				//往上
				this.speedX=0;
				this.speedY=-64;
			} else if (enemyPath[this.pathDes].x > this.x) {
				//往右
				this.speedX=64;
				this.speedY=0;
			} else if (enemyPath[this.pathDes].y > this.y) {
				//往下
				this.speedX=0;
				this.speedY=64;
			} else if (enemyPath[this.pathDes].x < this.x) {
				//往左
				this.speedX=-64;
				this.speedY=0;
			} else {}
		} else {
			this.x+=this.speedX/FPS;
			this.y+=this.speedY/FPS;
		}
	}
}
var enemies = [];
var cursor = {
	x: 0,
	y: 0,
}

function Tower(){
	this.x = 0;
	this.y = -100;
	this.range =100;
	this.aimingEnemyId =null,
	this.searchEnemy = function(){
		this.readyToshootime -= 1/FPS;
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				console.log(this.readyToshootime)
				if (this.readyToshootime <= 0) {
					this.shoot(i);
					this.readyToshootime = this.fireRate;
				}
				return;
			}
		}
		// 如果都沒找到，會進到這行，清除鎖定的目標
		this.aimingEnemyId = null;
	};
	this.shoot = function(id){
		ctx.beginPath();
		ctx.moveTo(this.x +16, this.y +16);
		ctx.lineTo(enemies[id].x +16, enemies[id].y +16);
		ctx.strokeStyle = "yellow";
		ctx.lineWidth = 3;
		ctx.stroke()
		enemies[id].hp -= this.damage;
	};
	this.fireRate=1;
	this.readyToshootime=1;
	this.damage=5;
}
var towers = []

$("#game-canvas").on("mousemove",mousemove)
function mousemove(event){
	cursor.x= event.offsetX
	cursor.y= event.offsetY
}


var isBuilding = false;

$("#game-canvas").on("click", mouseclick);
function mouseclick(){
	if(cursor.x > 576 && cursor.y > 416){
		isBuilding = true;
	} else{
		//
		if (isBuilding == true) {
			var newTower = new Tower();
			newTower.x = cursor.x - cursor.x%32;
			newTower.y = cursor.y - cursor.y%32;
			towers.push(newTower)
			money <10;
		}
		// 建造完成
		isBuilding = false;
	}
}

function isCollided(pointX,pointY,targatX,targatY,targatWidth,targatHeight){
	if (targatX <= pointX&&
		           pointX <= targatX + targatWidth&&
		targatY <= pointY&&
		           pointY <= targatY + targatHeight) {
  return true;
	} else {
  return false;
	}
}