let engineVariables ={
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    playing:true,
}
function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}





//drawImage(image, frameX, frameY, frameWidth, frameHeight, x, y, width, height)



//make sprite sheet class, adjust tile class to use sprite sheet class. this will allow for easyer multi animation support
//also, add support for single run sprite animations and better sprite control
class SingleSpriteSheet{
    
}
class SpriteSheet{
    constructor(singleSpriteSheetArray){
        let spriteSheets=singleSpriteSheetArray;

    }
}
class Tile {
    constructor(x,y, size, spriteSheetID, frameSize, totalFrames, frameChangeInterval, special=null, circle=false,color='rgb(0,0,0)'){
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
        this.special=special;
        this.color=color;
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
    constructor(x, y, tileArray=[]){
        this.x=x;
        this.y=y;
        this.tiles=tileArray;
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
        let dt=(now-engineVariables.lastTime)/1000.0;
        Engine.clear();
        update();
       
        engineVariables.gameTime=dt;
        engineVariables.lastTime=now;
        requestAnimFrame(setupy);
        return engineVariables.gameTime;

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
    engineVariables.keysDown[e.keyCode]=true;

},false);
addEventListener("keyup",function(e){
    delete engineVariables.keysDown[e.keyCode];

},false);






let global ={
    sprites: [],
    pool:{"playerProjectiles":[],"enemies":[],"enemyProjectiles":[],},
    maps:[],
    score:0,
    currentMap:null,
}

let Constants={
    tilesize:32,
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
        super(x,y,20,'sprites/red_bullet.png',1);
        this.drawSprite=false;
        global.sprites.push(this);
        this.AB=false;
        
        

    }
    update(){
        
        
        if(this.drawSprite){
            this.sprite.animateDraw();
            
            if(this.y<=0){
                this.drawSprite=false;
            }else{
                this.move(0,-20);
            }
            for(let d=0; d<global.pool.length; d++){
                for(let l=0; l<global.pool[d].length; l++){
                    if(global.pool[d][l].drawSprite==true){
                        if(differentColiderCollision(global.pool[d][l],this)){
                            this.drawSprite=false;
                            global.pool[d][l].drawSprite=false;
                            global.score++;
                        }
                    }
                    
                }
            }
            
        }

    }
}
class Player extends Rectangle{
    constructor(x,y){
        //x,y, width, height, spriteID,framecount
        super(x,y,32,32,'sprites/player_placeholder.png',3);
        
        this.bulletPool=[];
        this.lastBulletTimer=0;
    }
    update(){
        
        

        
        if(32 in engineVariables.keysDown){
            console.log()
            
        }
            
        
        if(65 in engineVariables.keysDown&&this.x>0){
            this.move(-2,0);
        }
        else if(68 in engineVariables.keysDown&&this.x+this.width<1024){
            this.move(2,0);
        }

        if(87 in engineVariables.keysDown&&this.y>0){
            this.move(0,-2);
        }
        else if(83 in engineVariables.keysDown&&this.y+this.height<512){
            this.move(0,2);
        }

        this.draw();
        
    }
}



global.currentMap= makeBasicMap(32,16);



global.sprites.push(new Player(0,0));
//Engine.addText("text", 0, 25, 32,'rgb(0,200,0)');


function update(){
    
    global.currentMap.draw();
    updateSprites();
    
    



}

