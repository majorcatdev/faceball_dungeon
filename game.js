let global ={
    keysDown:{},
    lastTime: 0,
    gameTime: 0,
    sprites: [],
    pool: [],
    score:0,
}


let Constants={
    
    startWidth:400,
}

function randint(min, max) {
    return Math.random() * (max - min) + min;
}

class Circle{
   
    constructor(x,y, diamater, color,fallSpeed){
        this.x=x;
        this.y=y;
        this.diamater=diamater;
        this.color = color;
        this.fallSpeed=fallSpeed;
    }
    draw(){
        Game.context.beginPath();
        Game.context.fillStyle = this.color;
        Game.context.arc(this.x,this.y,this.diamater/2,0,2*Math.PI);
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
        this.draw();
        if(this.y>=(Game.canvas.height-this.diamater)){
            this.removeFromSprites();

        }else{
            this.move(0,1);
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
        
        if(this.x>=0){
            if(65 in global.keysDown){
                this.move(-5,0);
                console.log("a is pressed");
            }
        }
        if(this.x+this.width<512){
            if(68 in global.keysDown){
                this.move(5,0);
                console.log("d is pressed");
            }
        }

        this.draw();
    }
}

function circleMaker(number){
    for(let i=0; i<number; i++){
        random.
        global.sprites.push(new Circle())
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
        this.canvas.style.cssText='border: 2px solid black;';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(update(), 250);
        this.inGame=true;
    },
   

    clear: function(){
       
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
       
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

addEventListener("keyDown",function(e){
    global.keysDown[e.keyCode]=true;

},false)
addEventListener("keyUp",function(e){
    delete global.keysDown[e.keyCode];

},false)















function updateSprites(){
    if(global.sprites.length > 0){
        for(let i=0; i<global.sprites.length; i++){
            global.sprites[i].update();
        }
    }
}














// if 32 in global.keysDown do something



let player=new Rectangle(0,512-40,Constants.startWidth, 40, 'rgb(0,0,0)');
global.sprites.push(player);
function update(){
    
    updateSprites();
}

//make ball falling collecting game
