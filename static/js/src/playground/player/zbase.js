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
