
function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}

function randbool(){
    return (randint(0,1)==1);
}



class spriteSheet{
    constructor(spriteSheetID,tileSize,frameCount){
        this.spriteSheet=new Image();
        this.spriteSheet.src=spriteSheetID;
        this.frameCount=frameCount;
        this.tileSize=tileSize;

    }
    

}

class tile{
    constructor(globalX,globalY,frameSize,spriteSheet=null,animationArray=[]){
        this.x=globalX;
        this.y=globalY;
        this.frameSize=frameSize;
        this.spriteSheet=spriteSheet;
        this.animationArray=animationArray;
        this.primitive="square";
        this.frame=0;
    }
    changeSpriteSheet(index){
        this.spriteSheet=this.animationArray[index];
        this.frame=0;
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
        this.maxX=this.collums*this.tileSize-this.width;
        this.maxY=this.rows*this.tileSize-this.height;
    }
    move(x,y,delta){
        
        
        this.x+=x * this.speed*(delta*50);
        this.y+=y * this.speed*(delta*50);
        
       
    }

}

class Map{
    constructor(collums,rows,tileSize,mapArray,spriteSheet){
        this.collums=collums;
        this.rows=rows;
        this.tileSize=tileSize;
        this.mapArray=mapArray;
        this.camera=new Camera(this.tileSize,this.tileSize,20,rows,collums,tileSize);
        this.spriteSheet= new Image();
        
        this.spriteSheet.src=spriteSheet;
        /*
        for(let k=0; k<this.mapArray.length; k++){
            let sheep=k.toString()+": ";
            for(let h=0; h<this.mapArray[0].length; h++){
                sheep=sheep+this.mapArray[k][h];
                
            }
            console.log(sheep);
        }
        */
        
    }
    getTile(x,y){
        
        return this.mapArray[y][x];
        //return this.mapArray[Math.ceil(y/this.mapArray.length)][Math.ceil(x/this.mapArray[0].length)];
        
        
    }
    getMap(){
        return this.mapArray;
    }
    getCameraCoords(){
        return [this.camera.x,this.camera.y];
    }
    
    draw(){
        const startCol = Math.floor(this.camera.x / this.tileSize);
        const endCol = startCol + (this.camera.width / this.tileSize);
        const startRow = Math.floor(this.camera.y / this.tileSize);
        const endRow = startRow + (this.camera.height / this.tileSize);
        const offsetX = -this.camera.x + startCol * this.tileSize;
        const offsetY = -this.camera.y + startRow * this.tileSize;
        //console.log(this.camera.width,this.camera.collums,this.camera.tileSize,endCol);
    
        for (let c = startCol; c <= endCol; c++) {
            for (let r = startRow; r <= endRow; r++) {
                const tile = this.getTile( c, r);
                const x = (c - startCol) * this.tileSize + offsetX;
                const y = (r - startRow) * this.tileSize + offsetY;
                
                
                Engine.context.drawImage(
                    this.spriteSheet, // image
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
    


    move(delta,direction){
        let dirx = 0;
        let diry = 0;
       
        
        

        
        if (direction==2){
            if(this.camera.x>this.tileSize){
                dirx = -1; 
            }
        }else if(direction==4){ 
            if(this.camera.x+this.camera.width<(this.mapArray[0].length-8)*this.tileSize){ 
                dirx = 1; 
            }
        }
        if (direction==3){
            if(this.camera.y+this.camera.height<(this.mapArray.length-4)*this.tileSize){
                diry = 1; 
            }
        }else if(direction==1){
            if(this.camera.y>this.tileSize+2){ 
                diry = -1; 
            }
        }
        
        
        
        
        this.camera.move(dirx, diry, delta);
        this.draw();
    }
}



let Delta={
    lastTime:Date.now(),
    deltaTime:0,
    getDelta:function(){
        
        return this.deltaTime;
    },
    updateDelta:function(){
        const now=Date.now();
        this.deltaTime=(now-this.lastTime)/1000.0; 
        this.lastTime=now;
    }
}


function startGame(){
    Engine.start();
    initialize(); 
   
   
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

function initialize(){
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

    
    





   


Constants={
    tilesize:64,
    mapSize:[64,128],
}

Global={

}

function houseKeeping(){
    Delta.updateDelta();
}



function update(){
    houseKeeping();
}
    