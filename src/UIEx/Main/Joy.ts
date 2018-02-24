module UI
{
    export class Joy extends ui.Main.joyUI
    {
        private m_OldPoint:Laya.Point = new Laya.Point();
        private m_bJoyMove:boolean = false;
        private m_DragRect:Laya.Rectangle ;
        private static readonly MOVEDIS:number = 5; //按住虚拟摇杆后的移动间距
        constructor()
        {
            super();
            this.on(Laya.Event.MOUSE_DOWN,this,this.OnJoyMouseDown);
         //   this.on(Laya.Event.MOUSE_MOVE,this,this.OnJoyMouseMove);
            this.on(Laya.Event.MOUSE_UP,this,this.OnJoyMouseUp);
           
           //算出原点
           this.m_OldPoint.x = this.width / 2 - this.m_joy.width / 2;
           this.m_OldPoint.y = this.height / 2 - this.m_joy.height / 2;
           this.m_joy.pos(this.m_OldPoint.x,this.m_OldPoint.y);

           this.m_DragRect = new Laya.Rectangle(0 ,0 ,this.width- this.m_joy.width,this.height- this.m_joy.height);


            
        }

        private OnJoyMouseDown():void
        {
           this.m_bJoyMove =true;
           this.m_joy.startDrag(this.m_DragRect,false,0,300,null,true);
        }

        public Update(nCurrentTick:number):void
        {
            if(this.m_bJoyMove)
            {
                if(Math.abs(this.m_OldPoint.x - this.m_joy.x) >= Joy.MOVEDIS && 
                   Math.abs(this.m_OldPoint.y - this.m_joy.y) >= Joy.MOVEDIS )
                   {
                        let nDir:number = GameMap.CustomGameMap.CalcDirection(this.m_OldPoint.x,this.m_OldPoint.y,this.m_joy.x,this.m_joy.y);
                        let player:Entity.Player = Entity.Player.GetInstance();
                        if(player != null)
                        {
                            player.StartPassiveMoving(nDir);
                        }
                   }

            }
        }

        public OnJoyMouseUp():void
        {
            this.m_joy.stopDrag();
            this.m_bJoyMove = false;
            this.m_joy.pos(this.m_OldPoint.x,this.m_OldPoint.y);
            
            let player:Entity.Player = Entity.Player.GetInstance();
            if(player != null && this.m_bJoyMove )
            {
                 player.StopAction();    
            }
           
        }

    }
}