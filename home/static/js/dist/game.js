class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
</div>
`);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if(this.platform === "ACAPP"){
            this.getinfo_acapp();
         }else{
            this.getinfo_web();
            this.add_listening_events();
         }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function(){
            outer.acwing_login();
        })
    }
    
    acwing_login(){
        $.ajax({
            url:"https://app2366.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type:"GET",
            success:function(resp){
                console.log(resp);
                if(resp.result === "success"){
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    login_on_remote() {  // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://app2366.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote() {  // 在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app2366.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();  // 刷新页面
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() {  // 在远程服务器上登出
        if (this.platform === "ACAPP") return false;

        $.ajax({
            url: "https://app2366.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }

    register() {  // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() {  // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    getinfo_web() {
        let outer = this;

        $.ajax({
            url: "https://app2366.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;

        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    getinfo_acapp() {
        let outer = this;

        $.ajax({
            url: "https://app2366.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}

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
        this.$menu.hide();
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
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
            outer.hide();
            outer.root.playground.show("multi mode");
        })
        this.$settings.click(function(){
            console.log("click settings");
            outer.root.settings.logout_on_remote();
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

        this.uuid = this.create_uuid();
         

    }
    
    create_uuid(){
        let res = "";
        for(let i=0;i<8;i++){
            let x = parseInt(Math.floor(Math.random()*10));
            res+=x;
        }
        return res;
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
            if(player.character === "robot") continue;
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

    resize(){
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
    constructor(playground,stat,character,username,photo){
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
        this.character = character;

        this.username = username;
        this.photo = photo;
        this.speed = 1;
        this.vx = 0;
        this.vy = 0;
        this.lift = 1;
        this.cnt = 0;//使AI的走动更流畅，减少抖动
        this.can_attacked = 0;
        if (this.character != "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }

    }
    get_food(){
        if(this.can_attacked>5) return;
        this.can_attacked++;
    }

    start(){
        if(this.character === "me"){
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
        if(this.character === "robot"){
            for(let i=0;i<this.playground.players.length;i++){
                let player = this.playground.players[i];
                if(player.character!="robot"&&this.is_collision(player)){
                    player.is_attacked();
                    break;
                }
            }
        }
        if(this.character==="robot"){
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
        if(ok==0&&this.character=="robot"){
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
        if(this.character!="robot"){
            this.ctx.save();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "black";
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();

        }else{
            this.ctx.beginPath();
            this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
            //this.ctx.arc(this.playground.width/2,this.playground.height/2,this.playground.height*0.05,0,Math.PI*2,false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
        for(let i=0;i<this.can_attacked;i++){
            this.ctx.lineWidth = 10;
            this.ctx.strokeStyle = "yellow";
            this.ctx.arc(this.x,this.y,this.radius+11*(i+1),0,2*Math.PI);
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

class MultiPlayerSocket{
    constructor(playground){
        this.playground = playground;
        this.ws = new WebSocket("wss://app2366.acapp.acwing.com.cn/wss/multiplayer/");
        this.start();
        
    }
    start(){
        this.receive();
    }

    receive(){
        let outer = this;
        console.log("-----");
        this.ws.onmessage = function(e){
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if(uuid===outer.uuid) return false;
            event = data.event;
            if(event==="create_player"){
                outer.receive_create_player(uuid,data.username,data.photo,data.stat);
            }

        };
    }

    send_create_player(username,photo){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event':"create_player",
            "uuid":outer.uuid,
            'username':username,
            'photo':photo,
        }));
    }
    receive_create_player(uuid,username,photo,stat){
        let player = new Player(
            this.playground,
            0,
            "lover",
            username,
            photo,
        );
        player.uuid = uuid;
        this.playground.players.push(player);
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        this.root.$ac_game.append(this.$playground);
        this.hide();
        this.start();
    }

    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    resize(){
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width/16,this.height/9);
        this.width = unit*16;
        this.height = unit*9;
        this.scale = this.height;
        if(this.game_map){
            this.game_map.resize();
        }
    }

    start() {
        let outer = this;
        $(window).resize(function(){
            outer.resize();
        })
    }

    show(mode) {  // 打开playground界面

        let outer = this;
        this.$playground.show();
        
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.resize();
        this.players = [];
        this.players.push(new Player(this,0,"me",this.root.settings.username,this.root.settings.photo));
        if(mode === "single mode"){
            for (let i = 1; i < 4; i ++ ) {
                this.players.push(new Player(this, i, "robot"));
            }
        }else{
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;
            this.mps.ws.onopen = function(){
            outer.mps.send_create_player(outer.root.settings.username,outer.root.settings.photo);
            };
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
    constructor(id,AcWingOS){
        console.log("start init");
        this.id = id;
        this.AcWingOS = AcWingOS;
        this.$ac_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }

    start(){
        
    }
}
