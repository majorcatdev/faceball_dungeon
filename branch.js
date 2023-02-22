let global ={
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    sprites: [],
    pool: [],
    score:0,
    updateClock:0,
    direction:true,
    playing:true,
    
}


let Constants={
    invadersPerSlice:10,
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}


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








class Tile {
    constructor(x,y,id = null){
      this.x = x;
      this.y = y;
      this.size = 64;
      this.id = id;
      this.frameX = 0;
      this.frameY = 0;
      this.delay = 0;
      this.moveTicker = 0;
      this.image = document.getElementById(id);
    }
    
    draw(){
      if(this.id){
      ctx.drawImage(this.image, this.x*this.size, this.y*this.size, this.size, this.size);
      }else{
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(this.x*this.size, this.y*this.size, this.size,this.size) 
      }
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
    }
    drawSelect(){
      if(this.id){
        ctx.drawImage(this.image,(this.size)*this.frameX, (this.size)*this.frameY, this.size, this.size,this.x*this.size,this.y*this.size, this.size, this.size);
    }
      
    }
    
     animateDraw(){
        ctx.drawImage(this.image,(this.size)*this.frameX, (this.size)*this.frameY, this.size, this.size,this.x*this.size,this.y*this.size, this.size, this.size);
        this.incrementFrame(1,10);
      }
    
    directionDraw(direction){
      switch(direction){
        case 2: //down
          this.frameX = 0;
          this.frameY = 0;
          break;
        case 4: //up
          this.frameX = 1;
          this.frameY = 0;
          break;
        case 1: //right
          this.frameX = 0;
          this.frameY = 1;
          break;
        case 3:
          this.frameX = 1;
          this.frameY = 1;
          break;
        default:
          this.frameX = 0;
          this.frameY = 0;
          break;
             }
      
      
      ctx.drawImage(this.image,(this.size)*this.frameX, (this.size)*this.frameY, this.size, this.size,this.x*this.size,this.y*this.size, this.size, this.size);
      
      
    } 
      
    incrementFrame(numFrames, delayAmount) {
      if (this.delay < delayAmount) {
        this.delay += 1;
      } else {
        if (this.frameX < numFrames ) {
          this.frameX += 1;
        } else {
          this.frameX = 0;
          this.delay = 0; 
        }
      }
    } 
    
    
    
  }

// if 32 in global.keysDown do something

//impliment sprite block space invaders movement

class Invader extends Rectangle{
    constructor(x,y){
        super(x,y,20,20,'black');
        this.spriteID='sprites/enemy_placeholder.png'
        this.sprite=new Tile(this.x,this.y,this.spriteID);

        
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
        this.sprite.draw();
    }
    
}

class Projectile extends Circle{
    constructor(x,y){
        super(x,y,15,'red');
        this.drawSprite=false;
        global.sprites.push(this);
        this.spriteID='sprites/player_bullet.png'
        this.sprite=new Tile(this.x,this.y,this.spriteID);
        

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
        this.sprite.draw();
    }
    update(){
        
        
        if(this.drawSprite){
            this.draw();
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
        super(x,y,20,20,'blue');
        global.sprites.push(this);
        this.bullet=new Projectile(this.x,this.y);
    }
    update(){
        
        

        if(this.bullet.drawSprite==false){
            this.bullet.setPosition(this.x+(this.width/2),this.y);
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


function makeSlice(invaderCount, startX,startY){
    let slice=[];
    let x=startX;
    for(let i=0; i<invaderCount; i++){
        let invader=new Invader(startX,startY);
        global.sprites.push(invader);
        slice.push(invader);
        startX+=24;
        
    }
    global.pool.push(slice);
}



function sliceLogic(){
    let left=global.pool[0][0].x;
    let right=global.pool[0][0].x+global.pool[0][0].width;
    let makeRow=false;
    for(let d=0; d<global.pool.length; d++){
        for(let l=0; l<global.pool[d].length; l++){
            if(global.pool[d][l].x<left){
                left=global.pool[d][l].x;
            }
            if(global.pool[d][l].x+global.pool[d][l].width>right){
                right=global.pool[d][l].x+global.pool[d][l].width;
            }
        }
    }
    if(right>512){
        global.direction=false;
        makeRow=true;
        for(let d=0; d<global.pool.length; d++){
            for(let l=0; l<global.pool[d].length; l++){
                global.pool[d][l].move(0,24);
            }
        }
    }else if(left<0){
        global.direction=true;
        makeRow=true;
        for(let d=0; d<global.pool.length; d++){
            for(let l=0; l<global.pool[d].length; l++){
                global.pool[d][l].move(0,24);
                
            }
        }

    }
    if(makeRow==true){
        
        for(let i=0; i<global.pool.length; i++){
            if(global.pool[i][0].y<0){
                makeRow=false;
            }
        }
        if(makeRow==true){
            makeSlice(Constants.invadersPerSlice,left,0);
        }
    }
    
    for(let i=0; i<global.pool.length; i++){
        if(global.pool[i][0].y<0){
            for(let t=0; t<global.pool[i].length; t++){
                global.pool[i][t].setPosition(global.pool[i][t].x,0);
                global.pool[i][t].drawSprite=true;
            }
        
        }
    }

    if(global.direction==true){
        for(let d=0; d<global.pool.length; d++){
            for(let l=0; l<global.pool[d].length; l++){
                global.pool[d][l].move(24,0);
            }
        }
    }
    if(global.direction==false){
        for(let d=0; d<global.pool.length; d++){
            for(let l=0; l<global.pool[d].length; l++){
                global.pool[d][l].move(-24,0);
            }
        }
    }


}

//comment

makeSlice(Constants.invadersPerSlice,0,0); 

sliceLogic();

player=new Player(0,492);

function update(){
    
    
    //draw rect here
    
    if(global.playing==true){
        Game.addText("score:"+global.score, 0, 25, 32,'rgb(0,200,0)');
        updateSprites();
        if(global.updateClock>=45){
            global.updateClock=0;
            sliceLogic();
            
            
        }
        global.updateClock++;    
    }else{
        Game.addText("Game Over", 256, 80, 64,'rgb(0,200,0)');
    }



}

