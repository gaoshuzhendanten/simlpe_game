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

