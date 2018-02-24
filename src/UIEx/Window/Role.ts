module UI
{
    export class Role extends ui.Window.roleUI
    {
        private m_ItemGrid:Array<UI.ItemGrid> = new Array<UI.ItemGrid>();
        constructor()
        {
            super();
            this.on(Laya.Event.ADDED,this,this.OnLoaded);
            this.on(Laya.Event.REMOVED,this,this.OnRemove);
        }

        private OnLoaded():void
        {

            this.m_btn_close.on(Laya.Event.CLICK,this,this.OnBtnClose);

            // let arrItem:Array<Config.UserItem> = NetSystem.NetSystemManager.GetInstance().GetBagSystem().GetArrItem();
            // let nX:number= 460;
            // let nY:number = 150;
            // for(let i:number = 0;i < arrItem.length;i++)
            // {
            //     let pItemGrid:UI.ItemGrid= new UI.ItemGrid(true);
            //     pItemGrid.SetItem(arrItem[i]);
            //     this.m_ItemGrid.push(pItemGrid);
            //     this.addChild(pItemGrid);
            //     pItemGrid.pos(nX,nY);
            //     nX += 60;
            //     pItemGrid.zOrder = 100;
            // }
          
        }
       
       private OnRemove():void
       {
           for(let i:number = 0;i < this.m_ItemGrid.length;i++)
           {
               let pItemGrid:UI.ItemGrid = this.m_ItemGrid[i];
               pItemGrid.removeSelf();
               pItemGrid.Destory();
           }
        //   this.m_ItemGrid.removeSelf();
        //   this.m_ItemGrid.Destory();
          this.m_ItemGrid.splice(0,this.m_ItemGrid.length);
          this.m_btn_close.off(Laya.Event.CLICK,this,this.OnBtnClose);
       }

       private OnBtnClose():void
       {
            UI.UIManager.GetInstance().HideDialog(UI.UIDialogID.Role);
       }
    }
}