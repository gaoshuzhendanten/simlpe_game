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

