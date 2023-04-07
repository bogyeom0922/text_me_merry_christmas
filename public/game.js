let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx= canvas.getContext("2d");
canvas.width=700;
canvas.height=500;
document.body.appendChild(canvas);

let game_snowbatImage, game_presentImage, game_santaImage, game_starImage, game_overImage;
let gameOver=false; //true이면 게임 끝남
let score=0;

//산타좌표
let game_santaX = canvas.width/2-50;
let game_santaY = canvas.height-100;

let bulletList=[]; //총알 저장 리스트

function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x=game_santaX+40;
        this.y=game_santaY;
        this.alive=true; //트루면 살아있음

        bulletList.push(this);
    };

    this.update=function(){
        this.y-=7;

    };

    this.checkHit=function(){

        for(let i=0;i<enemyList.length;i++){
            if(this.y<=enemyList[i].y && 
                this.x>=enemyList[i].x &&
                this.x<=enemyList[i].x+100
                ){
                score++;
                this.alive=false;
                enemyList.splice(i,1);
            }
        }
    };
}

function generateRandomValue(min, max){
    let randomNum= Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let enemyList=[];
function Enemy(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.y=0;
        this.x=generateRandomValue(0, canvas.width-100);
        enemyList.push(this)
    };
    this.update=function(){
        this.y+=2;//선물 속도 조절

        if(this.y>=canvas.height-100){
            gameOver=true;
            
        }
    };
}

//이미지 로드
function loadImage(){
    game_snowbatImage= new Image();
    game_snowbatImage.src="image/game_snowbat.png";

    game_presentImage= new Image();
    game_presentImage.src="image/game_present.png";

    game_santaImage= new Image();
    game_santaImage.src="image/game_santa.png";

    game_starImage=new Image();
    game_starImage.src="image/game_star.png";

    game_overImage=new Image();
    game_overImage.src="image/game_over.png";

}

//방향키로 산타 움직이기
let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown", function(event){
        
        keysDown[event.keyCode]=true
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode]


        if(event.keyCode==32){
            createBullet(); //총알 생성
        }
    });
}

function createBullet(){
    console.log("총알생성");

    let b= new Bullet();
    b.init();

}

function createEnemy(){
    const interval= setInterval(function(){
        let e= new Enemy();
        e.init();
    },1000)
}

function update(){
    if(39 in keysDown){
        game_santaX +=5;
    } //오른쪽

    if(37 in keysDown){
        game_santaX -=5;
    }//왼쪽
 
    if(game_santaX <=0){
        game_santaX=0;
    }
    if(game_santaX>=canvas.width-100){
        game_santaX=canvas.width-100;
    }
    //우주선 무산대 X, 경기장 안에서만

    //총알의 y좌표 업데이트하는 함수 호출
    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
        }
    }

    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update();
    }

}

function render(){
    ctx.drawImage(game_snowbatImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(game_santaImage, game_santaX, game_santaY);
    ctx.fillText(`Score:${score}`, 20,20);
    ctx.fillStyle="Black";
    ctx.font="20px Arial";

    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(game_starImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0;i<enemyList.length;i++){
        ctx.drawImage(game_presentImage, enemyList[i].x, enemyList[i].y);
    }
}

function main(){
    if(!gameOver){
        update(); //좌표값 업데이트
        render(); //그려줌
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(game_overImage, 150, 70, 380,380)
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

//총알 만들기
//1. 스페이스바를 누르면 총알 발사
//2. 총알의 y값이 --, x좌표는 우주선의 x좌표