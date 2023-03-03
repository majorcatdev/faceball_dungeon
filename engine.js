let global ={
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    sprites: [],
    pool: [],
    maps:[],
    score:0,
    updateClock:0,
    playing:true,
    currentMap:[],
    
}


let Constants={
    tilesize:16,
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}
//needs better naming

//drawImage(image, frameX, frameY, frameWidth, frameHeight, x, y, width, height)

class Tile {
    constructor(x,y, size, spriteSheetID, frameSize, totalFrames, frameChangeInterval){
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = spriteSheetID;
        this.totalFrames=totalFrames;
        this.frameCount=0;
        this.frameSize = frameSize;
        this.delay = 0;
        this.FPS = frameChangeInterval;
        if(spriteSheetID!=null){
            this.image = new Image();
    
            this.image.src=this.id;
        }

    }
    
    //drawImage(image, frameX, frameY, frameWidth, frameHeight, x, y, width, height)
    draw(){
        
        if(this.id!=null){
            Game.context.drawImage(this.image, this.frameCount*this.frameSize, 0, this.frameSize, this.frameSize, this.x, this.y, this.size, this.size);
            //Game.context.drawImage(this.image,this.x,this.y);
        }else{
            Game.context.fillRect(this.x,this.y,this.size,this.size);
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
        this.sprite=new Tile(this.x-this.width/2,this.y-this.width/2,this.width*2,this.spriteID,64,frameCount,2);
        
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
            this.sprite.animateDraw();
        }
    }

    selfDestruct(){
        try {
            global.sprites.splice(global.sprites.indexOf(this),1);
        } catch (error) {
            return (false,"spritelist error");
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
        this.sprite=new Tile(this.x,this.y,this.width,this.spriteID,64,framecount,0);
        this.sprite.FPS=45;
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
            this.sprite.animateDraw();
        }
    }
    


    drawToggle(toggle){
        this.drawSprite=toggle;
    }

    selfDestruct(){
        try {
            global.sprites.splice(global.sprites.indexOf(this),1);
        } catch (error) {
            return false;
        }
        
    }

    update(){
            /*

            if(65 in global.keysDown){
            
               
            }
        
      
            if(68 in global.keysDown){
            
               
            }
            */
        this.draw();
    }
}








function startGame(){
    Game.start();
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


let Game ={
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width=512;
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
        let dt=(now-global.lastTime)/1000.0;
        Game.clear();
        update();
       
        global.gameTime=dt;
        global.lastTime=now;
        requestAnimFrame(setupy);
        return global.gameTime;

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
    global.keysDown[e.keyCode]=true;

},false);
addEventListener("keyup",function(e){
    delete global.keysDown[e.keyCode];

},false);











function drawMap(){
    if(global.currentMap.length>0){
        for(let y=0; y<global.currentMap.length; y++){
            for(let x=0; x<global.currentMap[y].length; x++){
                global.currentMap[y][x].draw();
            }
        }
    }
}



function updateSprites(){
    if(global.sprites.length > 0){
        for(let i=0; i<global.sprites.length; i++){
            global.sprites[i].update();
        }
    }
}




function makeMap(){
    let map=[];
    for(let y=0; y<global.height/Constants.tilesize; y++){
        let row=[];
        for(let x=0; x<global.width/Constants.tilesize; x++){
            row.push(new Tile(x*Constants.tilesize,y*Constants.tilesize,Constants.tilesize,'sprites/cobblestone_tile_proto.png',64,0,0));
        }
        map.push(row);
    }
    return map;
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
        super(x,y,20,20,'sprites/player_placeholder.png',3);
        global.sprites.push(this);
        this.bullet=new Projectile(this.x,this.y);
    }
    update(){
        
        

        if(this.bullet.drawSprite==false){
            this.bullet.setPosition(this.x+(this.width/4),this.y);
            if(32 in global.keysDown){
                this.bullet.drawSprite=true;
                
            }
            
        }
        if(65 in global.keysDown&&this.x>0){
            this.move(-4,0);
        }
        else if(68 in global.keysDown&&this.x+this.width<512){
            this.move(4,0);
        }
        this.draw();
        for(let d=0; d<global.pool.length; d++){
            for(let l=0; l<global.pool[d].length; l++){
                if(global.pool[d][l].drawSprite==true){
                    if(rectCollision(global.pool[d][l],this)){
                        global.playing=false;
                    }
                }
                
            }
        }
    }
}



global.currentMap=makeMap();




//Game.addText("text", 0, 25, 32,'rgb(0,200,0)');


function update(){
    
    drawMap();

    
    



}

