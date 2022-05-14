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
