let global ={
    lastTime: 0,
    gameTime: 0,
    sprites: [],
    pool: [],
   
}


let Constants={
    keydown:{},
}

function randint(min, max) {
    return Math.random() * (max - min) + min;
}

class Ball{
   
    constructor(x,y, diamater, color){
        this.x=x;
        this.y=y;
        this.diamater=diamater;
        this.color = color;
    }
    draw(){
        Game.context.beginPath();
        Game.context.fillStyle = this.color;
        Game.context.fill();
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

    update(){
        this.draw();
        if(this.x>=(Game.canvas.width-this.diamater)){
            this.x=0;
        }else{
            this.move(1,0);
        }
    }
}




function startGame(){
    Game.start();
    setupy();
   
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
    Constants.keysDown[e.keyCode]=true;

},false)
addEventListener("keyUp",function(e){
    delete Constants.keysDown[e.keyCode];

},false)















function updateSprites(){
    if(global.sprites.length > 0){
        for(let i=0; i<global.sprites.length; i++){
            global.sprites[i].update();
        }
    }
}


















let ball = new Ball(100,100,20, "red");
function update(){
    ball.draw()
    updateSprites();
}

	
