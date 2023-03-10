

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
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



class Map{
    constructor(x, y, tileArray=[], openSpaces=0){
        this.x=x;
        this.y=y;
        this.tiles=tileArray;
        this.openSpaces=openSpaces;
    }

    draw(){
        if(this.tiles.length>0){
            for(let y=0; y<this.tiles.length; y++){
                for(let x=0; x<this.tiles[y].length; x++){
                    this.tiles[y][x].draw();
                }
            }
        }
    }
    move(x,y){
        this.x+x;
        this.y+y;
        if(this.tiles.length>0){
            for(let yt=0; yt<this.tiles.length; yt++){
                for(let xt=0; xt<this.tiles[yt].length; xt++){
                    this.tiles[yt][xt].setPosition(this.tiles[yt][xt].x+x, this.tiles[yt][xt].y+y);
                }
            }
        }
    }
    setPosition(x,y){
        this.move(this.x+x, this.y+y);
        this.x=x;
        this.y=y;
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
    tilesize:32,
    mapX:32,
    mapY:16,
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
            row.push(new Tile(x*Constants.tilesize,y*Constants.tilesize,Constants.tilesize,'sprites/floor.png',64,0,0));
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
        super(x,y,32,32,'sprites/mr_cactus_facing_foward.png',3);
        this.newBulletTime=10;
        this.bulletPool=[];
        this.lastBulletTimer=0;
        this.sprite.FPS=5;
        
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
        
        if(65 in Engine.keysDown&&this.x>0){
            this.move(-2,0);
        }
        else if(68 in Engine.keysDown&&this.x+this.width<1024){
            this.move(2,0);
        }

        if(87 in Engine.keysDown&&this.y>0){
            this.move(0,-2);
        }
        else if(83 in Engine.keysDown&&this.y+this.height<512){
            this.move(0,2);
        }

        this.animateDraw();
        
    }
}

function generateMap(){
    let map=[];
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
    roomCount=randint(20,60);
    for(let r=0; r<roomCount;r++){
        const w=randint(1,16);
        const h=randint(1,16);
        const roomX=randint(1,(Constants.mapSize[0]-1));
        const roomY=randint(1,(Constants.mapSize[1]-1));
        rooms.push(roomX,roomY);
        
        
        
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
    for(let y=0; y<map.length; y++){
        let row=["row:"+y+"   "];

        for(let x=0; x<map[y].length; x++){
            if(map[y][x]==0){
                row.push("#");
            }else{
                row.push(" ");
            }
        }
        console.log(row.toString());

    }
}

global.currentMap= makeBasicMap(Constants.mapX,Constants.mapY);



global.sprites.push(new Player(0,0));
//Engine.addText("text", 0, 25, 32,'rgb(0,200,0)');

generateMap();
function update(){
    
    global.currentMap.draw();
    updateSprites();

    



}

