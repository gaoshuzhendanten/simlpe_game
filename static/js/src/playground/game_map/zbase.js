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
