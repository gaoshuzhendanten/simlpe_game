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

