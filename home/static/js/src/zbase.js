class AcGame{
    constructor(id){
        console.log("start init");
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        console.log("init acgame");
        this.start();
    }

    start(){
        
    }
}
