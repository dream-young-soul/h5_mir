module UI
{
    export class Map extends ui.Window.MapUI
    {
        private m_arrNpc:Array<Config.StdNpc>;
        private m_ImageMap:Laya.Sprite = null;
        private m_PathSprite:Laya.Sprite = null;
        constructor()
        {
            super();
            this.on(Laya.Event.ADDED,this,this.OnLoaded);
            this.on(Laya.Event.REMOVED,this,this.OnRemove);

        }

        private OnLoaded():void
        {

            this.m_btn_close.on(Laya.Event.CLICK,this,this.OnBtnClose);
            this.m_list_npc.array = [];
            let nMapId:number = GameMap.CustomGameMap.GetInstance().GetMapId();
            this.m_arrNpc = Config.ConfigManager.GetInstance().GetNpcConfig().GetMapAllNpc(nMapId);
            if(this.m_arrNpc.length > 0)
            {
                let arr:Array<any> = new Array<any>();
                for(let i:number = 0;i < this.m_arrNpc.length;i++)
                {
                    arr.push({label:{text:this.m_arrNpc[i]._szName},});
                  
                }
                this.m_list_npc.array = arr;

            }
            this.m_list_npc.on(Laya.Event.CLICK,this,this.onListNpcClick);
            
            this.m_ImageMap = Resources.ResourcesManager._Instance.GetMiniMapImage(GameMap.CustomGameMap.GetInstance().GetmapFile());
            this.m_image_bg.addChild(this.m_ImageMap);
            this.m_image_bg.on(Laya.Event.CLICK,this,this.onMiniMapImageClick);

            //路径点精灵
            if(this.m_PathSprite == null)
            {
                this.m_PathSprite = new Laya.Sprite();
            }
            this.m_image_bg.addChild(this.m_PathSprite);
            Laya.timer.loop(500,this,this.onDrawPathPoint);
        }

       private OnRemove():void
       {

           this.m_list_npc.array = [];
           this.m_arrNpc = null;
           this.m_btn_close.off(Laya.Event.CLICK,this,this.OnBtnClose);
           this.m_list_npc.off(Laya.Event.CLICK,this,this.onListNpcClick);

           if(this.m_ImageMap != null)
           {
               this.m_ImageMap.removeSelf();
               this.m_image_bg.off(Laya.Event.CLICK,this,this.onMiniMapImageClick);
               this.m_ImageMap = null;
           }
           Laya.timer.clear(this,this.onDrawPathPoint);
           this.m_PathSprite.removeSelf();
           //清除路径点
           this.m_PathSprite.graphics.clear();
       }
 

       private onListNpcClick(e):void
       {
            let nIndex:number = this.m_list_npc.selectedIndex;
            if(nIndex >= 0 && nIndex < this.m_arrNpc.length )
            {
                let play:Entity.Player = Entity.Player.GetInstance();
                if(play != null)
                {
                    let pStdNpc:Config.StdNpc = this.m_arrNpc[nIndex];
                    play.AutoFindPath(pStdNpc._nX,pStdNpc._nY,pStdNpc);
                }
            }
       }

       private onMiniMapImageClick(e,ees):void
       {
           if(this.m_ImageMap.texture == null)
           {
               return;
           }
           let pGameMap:GameMap.CustomGameMap = GameMap.CustomGameMap.GetInstance();
           let nMapWidth:number = pGameMap.GetMapWidth();
           let nMapHeight:number = pGameMap.GetMapHeight();
           let fRateX:number = this.m_ImageMap.texture.width / nMapWidth;
           let fRateY:number = this.m_ImageMap.texture.height / nMapHeight;
           let point:Laya.Point = new Laya.Point(Laya.stage.mouseX,Laya.stage.mouseY);
           point = this.m_ImageMap.globalToLocal(point,false);
           
           let nX:number = parseInt((point.x / fRateX).toString());
           let nY:number = parseInt((point.y / fRateY).toString());
          
           if(pGameMap.Moveable(nX,nY))
           {
               let pStdNpc:Config.StdNpc = Config.ConfigManager.GetInstance().GetNpcConfig().GetMapNpcByXY(pGameMap.GetMapId(),nX,nY);
               let pPlayer:Entity.Player = Entity.Player.GetInstance();
               if(pPlayer != null)
               {
                   pPlayer.AutoFindPath(nX,nY,pStdNpc);
               }
           }
       }
       private OnBtnClose():void
       {
            UI.UIManager.GetInstance().HideDialog(UI.UIDialogID.Map);
       }
       //绘制寻路路径点
       private onDrawPathPoint():void
       {
           this.m_PathSprite.graphics.clear();
           let pPlayer:Entity.Player = Entity.Player.GetInstance();
           if(pPlayer != null && this.m_ImageMap.texture != null)
           {
                let pGameMap:GameMap.CustomGameMap = GameMap.CustomGameMap.GetInstance();
                let nMapWidth:number = pGameMap.GetMapWidth();
                let nMapHeight:number = pGameMap.GetMapHeight();
                let fRateX:number = this.m_ImageMap.texture.width / nMapWidth;
                let fRateY:number = this.m_ImageMap.texture.height / nMapHeight;
                let listAutoPath:any = pPlayer.GetAutoPath();
                if(listAutoPath != null)
                {
                    for(let i:number = 0;i < listAutoPath.length;i++)
                    {
                        let point:Laya.Point = listAutoPath[i];
                        let nX:number = parseInt((fRateX * point.x).toString());
                        let nY:number = parseInt((fRateY * point.y).toString());
                        this.m_PathSprite.graphics.drawCircle(nX,nY,1,"#00ffff");
                    }
                }
           }
       }

    }
}