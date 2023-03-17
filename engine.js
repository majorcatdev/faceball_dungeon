

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}

function randbool(){
    if(randint(0,1)==1){
        return true;
    }else{
        return false;
    }
}



//drawImage(image, frameX, frameY, frameWidth, frameHeight, x, y, width, height)

//come up with spritesheet and animation wrapper classes


class Tile {
    constructor(x,y, size, spriteSheetID, frameSize, totalFrames, frameChangeInterval, collisionType=0, circle=false,color='rgb(0,0,0)'){
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = spriteSheetID;
        this.totalFrames=totalFrames;
        this.frameCount=0;
        this.frameSize = frameSize;
        this.delay = 0;
        this.FPS = frameChangeInterval;
        this.circle=circle;
        this.collisionType=collisionType;
        this.color=color;
        this.isActive=true;
        if(spriteSheetID!=null){
            this.image = new Image();
    
            this.image.src=this.id;
        }

    }
    
    //drawImage(image, frameX, frameY, frameWidth, frameHeight, x, y, width, height)
    draw(){
        
        if(this.id!=null){
            Engine.context.drawImage(this.image, this.frameCount*this.frameSize, 0, this.frameSize, this.frameSize, this.x, this.y, this.size, this.size);
            
        }else{

            if(this.circle){
                Engine.context.beginPath();
                Engine.context.arc(this.x,this.y,size/2,0,2*Math.PI);
                Engine.context.fillStyle = this.color;
                Engine.context.fill();
                Engine.context.stroke();
            }else{
                Engine.context.beginPath();
                Engine.context.fillStyle = this.color;
                Engine.context.fillRect(this.x,this.y,this.size,this.size);
                Engine.context.stroke();
            }
            
        }

    
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
    }
    
    animateDraw(){
        this.delay++;
        this.draw();
        if(this.delay>=this.FPS){
            this.delay=0;
            this.frameCount++;
            if(this.frameCount>this.totalFrames){
                this.frameCount=0;
            }
        }
    }
    
    
}


class Circle{
   
    constructor(x,y, diamater, spriteID, frameCount){
        this.x=x;
        this.y=y;
        this.diamater=diamater;
        this.width=diamater;
        this.spriteID = spriteID;
        this.drawSprite=true;
        this.sprite=new Tile(this.x-this.width/2,this.y-this.width/2,this.width*2,this.spriteID,64,frameCount,2,null,true,'rgb(255,0,0)');
        this.sprite.FPS=0;
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
        this.sprite.setPosition(this.x-this.width/2,this.y-this.width/2);
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
        this.sprite.setPosition(this.x-this.width/2,this.y-this.width/2);
    }
    draw(){
        if(this.drawSprite==true){
            this.sprite.draw();
        }
    }
    animateDraw(){
        if(this.drawSprite==true){
            this.sprite.animateDraw();
        }
    }

    

    drawToggle(toggle){
        this.draw=toggle;
    }
    update(){
        this.draw();
        
    }
}

class Rectangle{
   
    constructor(x,y, width, height, spriteID,framecount){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.spriteID = spriteID;
        this.drawSprite=true;
        this.sprite=new Tile(this.x,this.y,this.width,this.spriteID,64,framecount,0,null,false,'rgb(0,0,255)');
        this.sprite.FPS=60;
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
        this.sprite.setPosition(this.x,this.y);
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
        this.sprite.setPosition(this.x,this.y);
    }
    draw(){
        if(this.drawSprite==true){
            this.sprite.draw();
        }
    }
    
    animateDraw(){
        if(this.drawSprite==true){
            this.sprite.animateDraw();
        }
    }

    drawToggle(toggle){
        this.drawSprite=toggle;
    }

    

    update(){

        this.draw();
    }
}
class Camera{
    constructor(x,y,speed,rows,collums,tileSize){
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.rows=rows;
        this.collums=collums;
        this.tileSize=tileSize;
        this.width=this.collums*this.tileSize;
        this.height=this.rows*this.tileSize;
        this.mapX=this.collums*this.tileSize-this.width;
        this.mapY=this.rows*this.tileSize-this.height;
    }
    move(delta,x,y){
        this.x+=x * this.speed*delta;
        this.y+=y * this.speed*delta;
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
    }

}
class Map{
    constructor(collums,rows,tileSize,spriteSheet){
        this.collums=collums;
        this.rows=rows;
        this.tileSize=tileSize;
        this.mapArray=[];
        this.camera=new Camera(0,0,2,this.rows,this.collums,this.tilesize);
        this.spriteSheet= new Image();
    
        this.image.src=spriteSheet;
        
        
        for(let y=0; y<rows; y++){
            this.mapArray.push([]);
            for(let x=0; x<collums; x++){
                this.mapArray[this.mapArray.length-1].push(0);
            }
        }
    }
    getTile(x,y){
        return this.mapArray[Math.floor(x/this.mapArray[0].length)][Math.floor(y/this.mapArray.length)]
    }
    
    draw(){
        const startCol = Math.floor(this.camera.x / this.tileSize);
        const endCol = startCol + (this.camera.width / this.tileSize);
        const startRow = Math.floor(this.camera.y / this.tileSize);
        const endRow = startRow + (this.camera.height / this.tileSize);
        const offsetX = -this.camera.x + startCol * this.tileSize;
        const offsetY = -this.camera.y + startRow * this.tileSize;
    
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                const tile = this.getTile( c, r);
                const x = (c - startCol) * this.tileSize + offsetX;
                const y = (r - startRow) * this.tileSize + offsetY;
                
                   
                this.ctx.drawImage(
                    this.image, // image
                    (tile) * this.tileSize, // source x
                    0, // source y
                    this.tileSize, // source width
                    this.tileSize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    this.tileSize, // target width
                    this.tileSize // target height
                );     
            } 
        }
    }
    

    update(){
        let dirx = 0;
        let diry = 0;
        if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
        if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
        if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
        if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }
    
        this.camera.move(delta, dirx, diry);
    }
}




function startGame(){
    Engine.start();
    setupy(); 
   
   
}

function rectCollision(rect1, rect2){
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
    ) 
      
}

function circleCollision(circle1, circle2){
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return (distance < (circle1.diamater/2) + (circle2.diamater/2));
}

function differentColiderCollision(rect,circle){
    const distX = Math.abs(circle.x - rect.x-rect.width/2);
    const distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.diamater/2)) { return false; }
    if (distY > (rect.height/2 + circle.diamater/2)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    const dx=distX-rect.width/2;
    const dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=((circle.diamater/2)*(circle.diamater/2)));
}


let Engine ={
    canvas: document.createElement("canvas"),
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    
    mouseX:0,
    mouseY:0,
    start: function(){
        this.canvas.width=1024;
        this.canvas.height=512;
        this.context=this.canvas.getContext("2d");
        this.canvas.style.cssText='border: 2px solid white; background-color:black;'
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(update(), 250);
        this.inGame=true;
    },
    

    clear: function(){
        this.context.fillStyle='black';
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        
    },
    
    addText:function(string, x, y, size, color){
        this.context.font = size+"px Arial";
        this.context.fillStyle= color;
        return this.context.fillText(string, x, y);
    },



}

function setupy(){
        let now=Date.now();
        let dt=(now-Engine.lastTime)/1000.0;
        Engine.clear();
        update();
       
        Engine.gameTime=dt;
        Engine.lastTime=now;
        requestAnimFrame(setupy);
        return Engine.gameTime;

}

let requestAnimFrame = (function(){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame||
        window.mozRequestAnimationFrame||
        function(callback){
            window.setTimeout(callback, 1000/60);
        }
})()

addEventListener("keydown",function(e){
    Engine.keysDown[e.keyCode]=true;

},false);
addEventListener("keyup",function(e){
    delete Engine.keysDown[e.keyCode];

},false);

addEventListener("mousemove",function(e){
    let rect=Engine.canvas.getBoundingClientRect();
   
    Engine.mouseX=Math.floor((e.clientX-rect.left)/(rect.right-rect.left)*Engine.canvas.width);
    Engine.mouseY=Math.floor((e.clientY-rect.top)/(rect.bottom-rect.top)*Engine.canvas.height);

},false);

    
    




let global ={
    sprites: [],
    pool:{"enemies":[],"enemyProjectiles":[],},
    maps:[],
    score:0,
    currentMap:null,
}

let Constants={
    tilesize:64,
    mapX:16,
    mapY:8,
    mapSize:[64,128],
    
}







function updateSprites(){
    if(global.sprites.length > 0){
        for(let i=0; i<global.sprites.length; i++){
            global.sprites[i].update();
        }
    }
}




function makeBasicMap(width, height){
    let map=[];
    for(let y=0; y<height; y++){
        let row=[];
        for(let x=0; x<width; x++){
            row.push(new Tile(x*Constants.tilesize,y*Constants.tilesize,Constants.tilesize,'sprites/map_tiles.png',64,0,0));
        }
        map.push(row);
    }
    return new Map(0,0,map);
}





// if 32 in global.keysDown do something



class Projectile extends Circle{
    constructor(x,y){
        //x,y, diamater, spriteID,frameCount
        super(x,y,30,'sprites/red_bullet.png',1);
        this.drawSprite=false;
        this.sprite.FPS=5;
        this.AB=false;
        this.moveSpeed=15;
        this.moveX=0;
        this.moveY=0;
        this.lastState=this.drawSprite;
        this.slowDownConstant=0.01;
        

    }
    update(){
        if(this.drawSprite==true&&this.lastState==false){
            //prototype of directional movement code
            let angle = Math.atan2 ( Engine.mouseY- this.y-15, Engine.mouseX - this.x-15 );
            if ( angle < 0 ){
                angle += Math.PI * 2;
            } 
            this.moveX=this.moveSpeed * ((Math.cos(angle)*(180/Math.PI))*this.slowDownConstant);
            this.moveY=this.moveSpeed * ((Math.sin(angle)*(180/Math.PI))*this.slowDownConstant);
        }
        
        if(this.drawSprite){
            this.sprite.animateDraw();
            
            if(this.y<=0||this.y>=Engine.canvas.height||this.x<=0||this.x>=Engine.canvas.width){
                this.drawSprite=false;
                this.setPosition(-50,-50);
            }else{
                

                this.move(this.moveX,this.moveY);

                
                
                //this.move(0,-15);
            }
            
        }
        this.lastState=this.drawSprite;
    }
}
class Player extends Rectangle{
    constructor(x,y){
        //x,y, width, height, spriteID,framecount
        super(x,y,64,64,'sprites/mr_cactus_facing_foward.png',3);
        this.newBulletTime=10;
        this.bulletPool=[];
        this.lastBulletTimer=0;
        this.sprite.FPS=5;
        this.setPosition(1024/2,512/2);
        
        
        
    }
    update(){
        
        Engine.context.beginPath();
        Engine.context.moveTo(this.x+this.width/2,this.y+this.height/2);
        Engine.context.lineTo(Engine.mouseX, Engine.mouseY);
        Engine.context.stroke();
        
        if(this.lastBulletTimer<this.newBulletTime){
            this.lastBulletTimer++;
        }

        if(this.lastBulletTimer>=this.newBulletTime){
            
            if(32 in Engine.keysDown){
                this.lastBulletTimer=0;
                //console.log(this.bulletPool.length);
                
                let firstAvalibleBullet=null;
                for(let i=0; i<this.bulletPool.length; i++){
                    if(this.bulletPool[i].drawSprite==false){
                        firstAvalibleBullet=this.bulletPool[i];
                        break;
                    }
                }
                if(firstAvalibleBullet!=null){
                    firstAvalibleBullet.setPosition(this.x+this.width/2-15,this.y+this.height/2-15);
                    firstAvalibleBullet.drawSprite=true;
                }else{
                    let newBullet=new Projectile(this.x+this.width/2-15,this.y+this.height/2-15);
                    global.sprites.push(newBullet);
                    this.bulletPool.push(newBullet);
                }
                
                
            }
        } 
        
        if(65 in Engine.keysDown){
            global.currentMap.move(-2,0);
        }
        else if(68 in Engine.keysDown){
            global.currentMap.move(2,0);
        }

        if(87 in Engine.keysDown){
            global.currentMap.move(0,-2);
        }
        else if(83 in Engine.keysDown){
            global.currentMap.move(0,2);
        }

        this.animateDraw();
        
    }
}

function generateMap(){
    let map=[];
    //make the starting map
    openSpaces=0;
    for(let i=0; i<Constants.mapSize[1]; i++){
        map.push([]);
    }
    for(let y=0; y<Constants.mapSize[1]; y++){
        for(let x=0; x<Constants.mapSize[0]; x++){
            map[y].push(0);
        }
    }
    
    rooms=[];
    //make the rooms
    roomCount=randint(20,60);
    for(let r=0; r<roomCount;r++){
        const w=randint(3,16);
        const h=randint(3,16);
        const roomX=randint(1,(Constants.mapSize[0]-4));
        const roomY=randint(1,(Constants.mapSize[1]-4));
        let appX=Math.ceil(roomX/2);
        let appY=Math.ceil(roomY/2);
        if(appX>Constants.mapSize[0]-2){
            appX=Constants.mapSize[0]-2;
        }
        if(appY>Constants.mapSize[1]-2){
            appY=Constants.mapSize[1]-2;
        }
        rooms.push([appY,appX]);
        
        
        
        for(let y=0; y<h; y++){

           for(let x=0; x<w; x++){
                let floorX=x+roomX;
                let floorY=y+roomY;
                if(floorX<Constants.mapSize[0]-1&&floorY<Constants.mapSize[1]-1){

                    map[floorY][floorX]=1;
                }

           }
            
        }
        
    }
 
    
    for(let i=0; i<rooms.length; i++){
        for(let j=0; j<rooms.length; j++){
            
            //put code to add the paths here
            const startX=rooms[i][1];
            const startY=rooms[i][0];
            const endX=rooms[j][1];
            const endY=rooms[j][0];

            
            if(startX>endX){
                
                for(let x=endX; x==startX; x++){


                    map[endY][x]=1;
                    map[endY+1][x]=1;
                    map[endY-1][x]=1;
                }
                if(startY>endY){
                    
                    for(let y=endY; y==startY; y++){
                        map[y][startX]=1;
                        map[y][startX+1]=1;
                        map[y][startX-1]=1;
                    }
                }else{
                    for(let y=startY; y==endY; y++){
                        map[y][startX]=1;
                        map[y][startX+1]=1;
                        map[y][startX-1]=1;
                    }
                }

            }else{
                //endX>startX
                for(let x=startX; x==endX; x++){
                    map[startY][x]=1;
                    map[startY+1][x]=1;
                    map[startY-1][x]=1;
                }

                if(startY>endY){
                    
                    for(let y=endY; y==startY; y++){
                        map[y][endX]=1;
                        map[y][endX+1]=1;
                        map[y][endX-1]=1;
                    }
                }else{
                    for(let y=startY; y==endY; y++){
                        map[y][endX]=1;
                        map[y][endX-1]=1;
                        map[y][endX+1]=1;
                    }
                }
            }
            
            
            

        }
    }
    return map;
    //print map
    /*
    for(let y=0; y<map.length; y++){
        let row="row:"+y+"   ";

        for(let x=0; x<map[y].length; x++){
            if(map[y][x]==0){
                row=row+("#");
            }else{
                row=row+("U");
            }
        }
        console.log(row);

    }
    */
}

//global.currentMap= makeBasicMap(Constants.mapX,Constants.mapY);
   


global.sprites.push(new Player(0,0));
//Engine.addText("text", 0, 25, 32,'rgb(0,200,0)');

generateMap();
function update(){
    
    global.currentMap.draw();
    updateSprites();

    



}

