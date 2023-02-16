let global ={
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    sprites: [],
    pool: [],
    score:0,
    invaders:0,
    updateClock:0,
}


let Constants={
    maxInvaders:10,
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}

/*
class logicBlock{
    constructor(){

    }
}
*/
class Circle{
   
    constructor(x,y, diamater, color){
        this.x=x;
        this.y=y;
        this.diamater=diamater;
        this.width=diamater;
        this.color = color;
        this.drawSprite=true;
        
    }
    draw(){
        if(this.drawSprite){
            Game.context.beginPath();
            Game.context.arc(this.x,this.y,this.diamater/2,0,2*Math.PI);
            Game.context.fillStyle = this.color;
            Game.context.fill();
            Game.context.stroke();
        }
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
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
   
    constructor(x,y, width, height, color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color = color;
        this.drawSprite=true;
    }
    draw(){
        if(this.drawSprite){
            Game.context.beginPath();
            Game.context.fillStyle = this.color;
            Game.context.fillRect(this.x,this.y,this.width,this.height);
            Game.context.stroke();
        }
        
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
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

class spriteBlock{
    
   
    constructor(x,y, height, sprites, direction){
        this.x=x;
        this.y=y;
        this.height=height;
        this.sprites=sprites;
        this.width=0;
        this.drawSprite=true;
        this.direction=direction;
        if(this.sprites.length > 0){
            let low=this.sprites[0].x;
            let high=this.sprites[0].x+this.sprites[0].width;

            for(let i=1; i<this.sprites.length; i++){

                if(this.sprites[i].x<low){
                    low=this.sprites[i].x;
                }

                if(this.sprites[i].x+this.sprites[i].width>high){
                    high=this.sprites[i].x+this.sprites[i].width;
                }

            }

            this.width=Math.abs(low-high); 
        
        }
    }


    drawToggle(toggle){
        this.drawSprite=toggle;
        if(this.sprites.length > 0){
            
            for(let i=1; i<this.sprites.length; i++){
                this.sprites[i].drawToggle(this.drawSprite);
            }
        }

    }
    updateSize(){
        if(this.sprites.length > 0){
            let low=this.sprites[0].x;
            let high=this.sprites[0].x+this.sprites[0].width;

            for(let i=1; i<this.sprites.length; i++){

                if(this.sprites[i].x<low){
                    low=this.sprites[i].x;
                }

                if(this.sprites[i].x+this.sprites[i].width>high){
                    high=this.sprites[i].x+this.sprites[i].width;
                }

            }
            this.x=low;
            this.width=Math.abs(low-high); 
        
        }else{

            this.width=0;
        }
    }

    move(x,y){
        if(this.sprites.length > 0){
            
            for(let i=1; i<this.sprites.length; i++){
                this.sprites[i].move(x,y);
            }
        }
        this.x+=x;
        this.y+=y;
    }

    setPosition(x,y){
        this.move((x-this.x),(y-this.y));
    }

    selfDestruct(){
        if(this.sprites.length > 0){
            for(let i=0; i<this.sprites.length; i++){
                try {
                    global.sprites.splice(global.sprites.indexOf(this.sprites[i]),1);
                } catch (error) {
                    return (false,"spritelist error object "+i+" not found");
                }
                
            }
        }
        if(global.pool.length>0){
            try {
                global.pool.splice(global.pool.indexOf(this),1);
            } catch (error) {
                return (false,"pool error");
            }
        
        }
    }

    update(){
        if(this.sprites.length > 0){
           
            
            for(let i=1; i<this.sprites.length; i++){
                this.sprites[i].update();
            }

        }
        
    }
}

/*
function circleMaker(){
    
    const width=randint(10,Constants.maxCircleSize);
    let r=0;
    let g=0;
    let b=0;
    while(true){
        r=randint(0,255);
        g=randint(0,255);
        b=randint(0,255);
        if(!((r>g+60||r<g-60)&&(r>b+60||r<b-60)&&(b>g+60||b<g-60))){
            break;
        }
    }
    const color='rgb('+r+','+g+','+b+')';
    let circle=new Circle(randint(width/2,512-(width/2)),(width/2),width,color,Constants.fallSpeed);
    global.sprites.push(circle);
    global.pool.push(circle);
    
}
*/
function makeInvaderBlock(number, x, y, spriteWidth, spriteHight,spriteOffset, spriteColor, direction){
    let block=[];
    let offset=spriteOffset+x;
    for(let i=0; i<number; i++){
        let sprite=new Rectangle(offset,y,spriteWidth,spriteHight,spriteColor);
        block.push(sprite);
        global.sprites.push(sprite);
        offset=offset+spriteWidth+spriteOffset;
    }
    global.pool.push(new spriteBlock(x,y,spriteHight,block,direction));
}

function startGame(){
    Game.start();
    setupy();
    makeInvaderBlock(4,0,0,10,10,4,'rgb(0,0,0)',true);
   
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
        this.canvas.style.cssText='border: 2px solid black;';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(update(), 250);
        this.inGame=true;
    },
   

    clear: function(){
       
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















function updateSprites(){
    if(global.sprites.length > 0){
        for(let i=0; i<global.sprites.length; i++){
            global.sprites[i].update();
        }
    }
}




function invaderUpdate(){
    if(global.pool.length>0){
        let width=global.pool[0].width;
        let x=global.pool[0].x;
        for(let i=0; i<global.pool.length; i++){
            if(global.pool[i].width>width){
                width=global.pool[i].width;
                
            }
            if(global.pool[i].x<x){
                x=global.pool[i].x;
            }
        }
        if(x+width>=512){

            for(let i=0; i<global.pool.length; i++){
                global.pool[i].move(0,14);
                global.pool[i].direction=false;
            }
            if(global.invaders<Constants.maxInvaders){
                makeInvaderBlock(4,x,0,10,10,4,'rgb(0,0,0)',false);
            }
        }else if(x<=0){

            for(let i=0; i<global.pool.length; i++){
                global.pool[i].move(0,14);
                global.pool[i].direction=true;
            }
            if(global.invaders<Constants.maxInvaders){
                makeInvaderBlock(4,x,0,10,10,4,'rgb(0,0,0)',true);
            }
        }else{
            if(global.pool[0].direction==true){
                for(let i=0; i<global.pool.length; i++){
                    global.pool[i].move(10,0);
                }
            }else{
                for(let i=0; i<global.pool.length; i++){
                    global.pool[i].move(-10,0);
                }
            }
        }
        for(let i=0; i<global.pool.length; i++){
            if(global.pool[i].y>=472){
                global.pool[i].setPosition(global.pool[i].x,0);
            }
        }

    }
    
}









// if 32 in global.keysDown do something

//impliment sprite block space invaders movement




function update(){
    updateSprites();
    if(global.updateClock>=20){
        invaderUpdate();
    }
    
    global.updateClock++;
}

