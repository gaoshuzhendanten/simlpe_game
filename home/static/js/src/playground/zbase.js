class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);

        // this.hide();
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
        this.hinders.push(new Hinder(this,2*this.game_map.block_width,4*this.game_map.block_width,2*this.game_map.block_height,7*this.game_map.block_height));
        this.hinders.push(new Hinder(this,5*this.game_map.block_width,8*this.game_map.block_width,3*this.game_map.block_height,4*this.game_map.block_height));
        this.hinders.push(new Hinder(this,5*this.game_map.block_width,8*this.game_map.block_width,6*this.game_map.block_height,7*this.game_map.block_height));
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
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}

