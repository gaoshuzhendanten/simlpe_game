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