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
