let global ={
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    sprites: [],
    pool: [],
    score:0,
    spawnCounter:0,
}


let Constants={
    fallSpeed:2,
    startWidth:200,
    maxCircleSize:50,
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}


class Circle{
   
    constructor(x,y, diamater, color, fallSpeed){
        this.x=x;
        this.y=y;
        this.diamater=diamater;
        this.color = color;
        this.fallSpeed=fallSpeed;
    }
    draw(){
        Game.context.beginPath();
        Game.context.arc(this.x,this.y,this.diamater/2,0,2*Math.PI);
        Game.context.fillStyle = this.color;
        Game.context.fill();
        Game.context.stroke();
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
        try {
            global.pool.splice(global.pool.indexOf(this),1);
        } catch (error) {
            return (false,"pool error");
        }
        
    }
    update(){
        this.draw();
        if(this.y>=(Game.canvas.height-(this.diamater/2))){
            this.selfDestruct();

        }else{
            this.move(0,this.fallSpeed);
        }
    }
}

class Rectangle{
   
    constructor(x,y, width, height, color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color = color;
    }
    draw(){
        Game.context.beginPath();
        Game.context.fillStyle = this.color;
        Game.context.fillRect(this.x,this.y,this.width,this.height);
        Game.context.stroke();
    }
    move(x,y){
        this.x+=x;
        this.y+=y;
    }
    setPosition(x,y){
        this.x=x;
        this.y=y;
    }



    removeFromSprites(){
        try {
            global.sprites.splice(global.sprites.indexOf(this),1);
        } catch (error) {
            return false;
        }
        
    }

    update(){
        
        if(this.x>0){
            if(65 in global.keysDown){
                this.move(-5,0);
               
            }
        }
        if(this.x+this.width<512){
            if(68 in global.keysDown){
                this.move(5,0);
               
            }
        }

        this.draw();
    }
}

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






function gameLogic(){
    if(global.pool.length > 0){
        for(let i=0; i<global.pool.length; i++){
            if(differentColiderCollision(player,global.pool[i])){
                global.score++;
                global.pool[i].selfDestruct();
                console.log("score:"+global.score);
                if(player.width>10){
                    player.width--;
                    player.move(1,0);
                }
            }
        }
    }
}







// if 32 in global.keysDown do something



let player=new Rectangle(0,512-40,Constants.startWidth, 40, 'rgb(0,0,0)');
global.sprites.push(player);
function update(){
    updateSprites();
    gameLogic();
    global.spawnCounter++;
    if(global.spawnCounter>=10){
        
        if(randint(0,1)==1){
            circleMaker();
        }
        
        
        global.spawnCounter=0;
    }
    Game.addText("score:"+global.score, 0, 25, 32,'rgb(0,0,0)');
}

