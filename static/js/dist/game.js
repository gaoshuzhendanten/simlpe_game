class AcGameMenu{
     constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-filed">
        <div class="ac-game-menu-filed-item ac-game-menu-filed-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-filed-item ac-game-menu-filed-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-filed-item ac-game-menu-filed-item-settings">
            设置
        </div>
    </div>
</div>
`);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-filed-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-filed-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-filed-item-settings');
        this.start();
     }
    start(){
        this.add_listening_events();
    }
    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            console.log("click single mode");
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
            outer.hide();
            outer.root.menu.show();
        })
        this.$settings.click(function(){
            console.log("click settings");
        })
    }

    show(){    //显示界面
        this.$menu.show();
    }


    hide(){     //关闭界面
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];


class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);
        
        this.has_called_start = false; //是否执行过start函数
        this.timedelta = 0;  //当前帧距离上一帧的时间间隔
         

    }

    start(){  //只会在第一帧执行
    }

    update(){  //每一帧均会执行一次
    }

    pre_destroy(){//删掉该物体前执行一次
    }

    destroy(){  //删掉该物体
        this.pre_destroy();
        for(let i = 0;i < AC_GAME_OBJECTS.length; i++ ){
            if(AC_GAME_OBJECTS[i]===this){
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }

}
let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp) {
    for(let i=0;i<AC_GAME_OBJECTS.length;i++){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}


requestAnimationFrame(AC_GAME_ANIMATION);




class Food extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        let tmp = Math.random();
        if(tmp<0.4){
            this.x = 2.5*this.playground.game_map.block_width + Math.random()*this.playground.game_map.block_width;
            this.y = this.playground.game_map.block_height*0.3+this.playground.height*Math.random()*0.8;
        }else if(tmp<0.8){
            this.x = 4.1*this.playground.game_map.block_width + 1.4*Math.random()*this.playground.game_map.block_width;
            this.y = this.playground.game_map.block_height*0.3+this.playground.height*Math.random()*0.8;
        }else{
            this.x = 5.5*this.playground.game_map.block_width + 2.4*Math.random()*this.playground.game_map.block_width;
            this.y = 4.1*this.playground.game_map.block_height + this.playground.game_map.block_height*Math.random()*0.8;
        }
        this.radius = this.playground.game_map.block_height/8;
        this.color = "yellow";
    }

    start() {
    }

    update() {

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if(!player.is_me) continue;
            if (this.is_collision(player)) {
                player.get_food();
                this.destroy();
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }


    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}

class GameMap extends AcGameObject{
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $('<canvas></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.block_width = this.ctx.canvas.width/10;
        this.block_height = this.ctx.canvas.height/10;
        this.cnt = 0;
        this.playground.$playground.append(this.$canvas);
    }

    start(){
    }

    update(){
        this.cnt++;
        if(this.cnt>700){
            new Food(this.playground);
            this.cnt = 0;
        }
        this.render();
    }

    render(){
        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
class Hinder extends AcGameObject {
    constructor(playground,x1,x2,y1,y2) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.vx=0;
        this.vy=0;
        if(Math.random()<0.3){
            this.color = "rgba(200,30,80,0.7)";
        }else if(Math.random()<0.7){
            this.color = "rgba(0, 0, 200, 0.5)";
        }else this.color = "rgba(300, 300, 200, 0.7)";

        this.speed = 1;
        this.move_length = 0;
        this.friction = 0.9;
        this.eps = 1;
    }

    get_dist(x1,y1,x2,y2){
        let distx = x2-x1;
        let disty = y2-y1;
        return Math.sqrt(distx*distx+disty*disty);
    }

    is_content(x1,y1,r,x2,y2,){
        return this.get_dist(x1,y1,x2,y2)<=r;
    }

    pan_duan(x1,y1,x2,y2,r,x,y){
        let a, b, c, dist1, dist2, angle1, angle2; // ax + by + c = 0;
        if (x1 == x2)
            a = 1, b = 0, c = -x1;//特殊情况判断，分母不能为零
        else if (y1 == y2)
            a = 0, b = 1, c = -y1;//特殊情况判断，分母不能为零
        else {
            a = y1-y2;
            b = x2-x1;
            c = x1 * y2 - y1 * x2;
        }
        dist1 = a * x + b * y + c;
        dist1 *= dist1;
        dist2 = (a * a + b * b) * r * r;
        if (dist1 > dist2) return 0;//点到直线距离大于半径r
        angle1 = (x -x1) * (x2 - x1) + (y - y1) * (y2 - y1);
        angle2 = (x -x2) * (x1 - x2) + (y - y2) * (y1 - y2);
        if (angle1 > 0 && angle2 > 0) return 1;//余弦都为正，则是锐角
        return 0;
    }



    is_check(x,y,r){
        if(this.is_content(x,y,r,this.x1,this.y1)||this.is_content(x,y,r,this.x1,this.y2)) return true;
        if(this.pan_duan(this.x1,this.y1,this.x1,this.y2,r,x,y)) return true;
        
        if(this.is_content(x,y,r,this.x1,this.y1)||this.is_content(x,y,r,this.x2,this.y1)) return true;
        if(this.pan_duan(this.x1,this.y1,this.x2,this.y1,r,x,y)) return true;
        
        if(this.is_content(x,y,r,this.x2,this.y1)||this.is_content(x,y,r,this.x2,this.y2)) return true;
        if(this.pan_duan(this.x2,this.y1,this.x2,this.y2,r,x,y)) return true;

        if(this.is_content(x,y,r,this.x1,this.y2)||this.is_content(x,y,r,this.x2,this.y2)) return true;
        if(this.pan_duan(this.x1,this.y2,this.x2,this.y2,r,x,y)) return true;






        return false;
    }

    start() {
    }

    update() {
        this.render();
        return;
        if (this.move_length < this.eps || this.speed < this.eps) {
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect (this.x1, this.y1, this.x2-this.x1, this.y2-this.y1);
    }
}

class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 100);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}

class Player extends AcGameObject{
    constructor(playground,stat,is_me){
        super();
        this.playground = playground;
        this.block_width = this.playground.game_map.block_width;
        this.block_height = this.playground.game_map.block_height;
        this.ctx = this.playground.game_map.ctx;
        let xx = [1,9,1,9];
        let yy = [1,1,9,9];
        let colors = ["white", "pink", "red", "grey", "green"];
        this.x = xx[stat]*this.block_width;
        this.y = yy[stat]*this.block_height;
        this.color = colors[stat];
        this.radius = Math.min(this.block_width/2,this.block_height/2)*0.8;
        this.color = colors[stat];
        this.is_me = is_me;
        this.speed = 1;
        this.vx = 0;
        this.vy = 0;
        this.lift = 1;
        this.cnt = 0;//使AI的走动更流畅，减少抖动
        this.can_attacked = 0;
    }
    get_food(){
        if(this.can_attacked>5) return;
        this.can_attacked++;
    }

    start(){
        if(this.is_me){
            this.speed*=1.2;
            this.add_listening_events();
        }else{

        }
    }

    add_listening_events(){
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            let x = outer.x, y = outer.y;
            let radius = outer.radius * 0.2;
            let color = "orange";
            let speed = outer.speed;
            let move_length = outer.playground.height * 1;
            console.log(outer.lift);
            if(outer.lift&&outer.can_attacked) {
                outer.can_attacked--;
                new FireBall(outer.playground, outer, x, y, radius, outer.vx, outer.vy, color, speed, move_length);
            }
        });
        let dx = [0,0,-1,1];
        let dy = [-1,1,0,0];
        $(window).keydown(function(e) {
            switch(e.which){
                case 87: //w
                    outer.vx = dx[0];
                    outer.vy = dy[0];
                    break;
                case 83: //s
                    outer.vx = dx[1];
                    outer.vy = dy[1];
                    break;
                case 65:  //a
                    outer.vx = dx[2];
                    outer.vy = dy[2];
                    break;
                case 68:  //d
                    outer.vx = dx[3];
                    outer.vy = dy[3];
                    break;
            }
        });
    }


    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }


    update(){
        let dx = [0,0,-1,1];
        let dy = [-1,1,0,0];
        let back_index = 0;
        if(!this.is_me){
            for(let i=0;i<this.playground.players.length;i++){
                let player = this.playground.players[i];
                if(player.is_me&&this.is_collision(player)){
                    player.is_attacked();
                    break;
                }
            }
        }
        if(!this.is_me){
            if(this.playground.players.length==1)
                return;
            this.cnt++;
            if(this.cnt>15){
                this.cnt = 0;
                let other_player = 0;
                if(this.playground.players[other_player] === this) other_player=1;
                let dist_x = (this.x-this.playground.players[other_player].x);
                let dist_y = (this.y-this.playground.players[other_player].y);
                let index = 0;
                if(1){//Math.random()>0.9){
                    if(Math.abs(dist_x)>Math.abs(dist_y)){
                        if(dist_x>0){
                            index = 2;
                            if(dist_y>0) back_index=0;
                            else back_index=1;
                        }
                        else{
                            index = 3;
                            if(dist_y>0) back_index=0;
                            else back_index=1;
                        }
                    }else{
                        if(dist_y>0) index = 0;
                        else index = 1;
                        if(dist_x>0) back_index=2;
                        else back_index=3;
                    }
                }else{
                    if(Math.abs(dist_x)>Math.abs(dist_y)){
                        if(dist_y>0){
                            index = 0;
                        }
                        else index = 1;
                    }else{
                        if(dist_x>0) index = 2;
                        else index = 3;
                    }
                }
                if(Math.random()>0.9){
                    index = Math.floor(Math.random()*1000)%4;
                }
                this.vx = dx[index];
                this.vy = dy[index];
            }
        }
        let moved_x = this.vx * this.speed * this.timedelta / 10;
        let moved_y = this.vy * this.speed * this.timedelta / 10;
        let ok = 1;
        if(this.x+moved_x>=this.block_width&&this.x+moved_x<=9*this.block_width) this.x+=moved_x;
        if(this.y+moved_y>=this.block_height&&this.y+moved_y<=9*this.block_height) this.y+=moved_y;
        for(let i=0;i<this.playground.hinders.length;i++){
            if(this.playground.hinders[i].is_check(this.x,this.y,this.radius)){
                this.x-=moved_x;
                this.y-=moved_y;
                ok = 0;
                break;
            }
        }
        if(ok==0&&!this.is_me){
            this.vx = dx[back_index];
            this.vy = dy[back_index];
            let moved_x = this.vx * this.speed * this.timedelta / 10;
            let moved_y = this.vy * this.speed * this.timedelta / 10;
            let ok = 1;
            if(this.x+moved_x>=this.block_width&&this.x+moved_x<=9*this.block_width) this.x+=moved_x;
            if(this.y+moved_y>=this.block_height&&this.y+moved_y<=9*this.block_height) this.y+=moved_y;
            for(let i=0;i<this.playground.hinders.length;i++){
                if(this.playground.hinders[i].is_check(this.x,this.y,this.radius)){
                    this.x-=moved_x;
                    this.y-=moved_y;
                    ok = 0;
                    break;
                }
            }
        }
        this.render();

    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        //this.ctx.arc(this.playground.width/2,this.playground.height/2,this.playground.height*0.05,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        for(let i=0;i<this.can_attacked;i++){
            this.ctx.lineWidth = 10;
            this.ctx.strokeStyle = "yellow";
            this.ctx.arc(this.x,this.y,this.radius+10*(i+1),0,2*Math.PI);
            this.ctx.stroke();
        }
        

    }

    is_attacked() {
        for (let i = 0; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length*100);
        }
        this.destroy();
    }


    pre_destroy(){
        this.lift = 0;
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }


}
class FireBall extends AcGameObject{
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.1;
        
    }

    start(){
        if(this.vx==0&&this.vy==0) this.destroy();
    }
	
	get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked();
        console.log(this.playground.players.length);
        this.destroy();
    }


    update(){
        if(this.move_length < this.eps){
            this.destroy();
            return false;
        }
		let moved = Math.min(this.move_length, this.speed * this.timedelta / 5);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

	
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
   
}

class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.hide();
        this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    start() {
    }

    show() {  // 打开playground界面

        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,0,true));

        for (let i = 1; i < 4; i ++ ) {
            this.players.push(new Player(this, i, false));
        }
        
        this.hinders = [];
        this.hinders.push(new Hinder(this,2*this.game_map.block_width,2.5*this.game_map.block_width,2*this.game_map.block_height,7*this.game_map.block_height));

        this.hinders.push(new Hinder(this,3.6*this.game_map.block_width,4*this.game_map.block_width,2*this.game_map.block_height,7*this.game_map.block_height)); 
        this.hinders.push(new Hinder(this,5.5*this.game_map.block_width,8*this.game_map.block_width,3*this.game_map.block_height,4*this.game_map.block_height));
        this.hinders.push(new Hinder(this,5.5*this.game_map.block_width,8*this.game_map.block_width,6*this.game_map.block_height,7*this.game_map.block_height));
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}

export class AcGame{
    constructor(id){
        console.log("start init");
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }

    start(){
        
    }
}
