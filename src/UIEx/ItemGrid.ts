module UI
{
    //物品格子显示容器. 2017.11.3
    export class ItemGrid extends Laya.Sprite
    {
        private m_SpriteIcon:Laya.Sprite = null;
        private m_pUserItem:Config.UserItem = null;
        private m_ShowItemTipsType:ShowItemTipsType = ShowItemTipsType.RoleBag; //格子类型
        private m_bgSprite:Laya.Sprite = null;  //格子背景
        constructor(showBG:boolean = false)
        {
            super();
            if(showBG)
            {
                this.m_bgSprite = Resources.ResourcesManager._Instance.GetSpriteForURL("data/itemicon/grid_bg.png");
                this.addChild(this.m_bgSprite);
            }
          //  this.setBounds(new laya.maths.Rectangle(0,0,100,100));
          //  this.on(Laya.Event.CLICK,this,this.onItemClick);
        }
        public Destory():void
        {
            if(this.m_SpriteIcon != null)
            {
                this.m_SpriteIcon.removeSelf();
                 this.m_SpriteIcon.off(Laya.Event.CLICK,this,this.onItemClick);
                this.m_SpriteIcon = null;
               
            }
            if(this.m_bgSprite != null)
            {
                this.m_bgSprite.removeSelf();
               
            }
            this.m_pUserItem = null;
             this.m_bgSprite = null;
        }
        public SetItem(pUserItem:Config.UserItem):void
        {
            this.m_pUserItem = pUserItem;
            this.Show();
        }
        public SetItemByItemID(nItemID:number):void
        {
            this.m_pUserItem = new Config.UserItem();
            this.m_pUserItem._wItemId = nItemID;
            this.Show();
        }
        private Show():void
        {
            if( this.m_SpriteIcon != null)
            {
                 this.m_SpriteIcon.removeSelf();
                 this.m_SpriteIcon = null;
                 this.m_SpriteIcon.off(Laya.Event.CLICK,this,this.onItemClick);
            }
            if(this.m_pUserItem == null)
            {
                return;
            }
            let pStdItem:Config.StdItem = Config.ConfigManager.GetInstance().GetItemConfig().FindItemById(this.m_pUserItem._wItemId);
            if(pStdItem != null)
            {
                this.m_SpriteIcon = Resources.ResourcesManager._Instance.GetItemIconImage(pStdItem._nIcon);
                this.m_SpriteIcon.on(Laya.Event.CLICK,this,this.onItemClick);
        
                this.addChild(this.m_SpriteIcon);
                this.m_SpriteIcon.zOrder = 11;//在最顶层
            }
        
        }
        public SetShowItemTipsType(type:ShowItemTipsType):void
        {
            this.m_ShowItemTipsType = type;
        }
        private onItemClick():void
        {
            if(this.m_pUserItem != null)
            {
                let pItemTipsDialog:UI.ItemTips = UI.UIManager.GetInstance().GetItemTipsDialog();
                if(pItemTipsDialog != null)
                {
                    UI.UIManager.GetInstance().ShowDialog(UIDialogID.ItemTips);
                    pItemTipsDialog.ShowItem(this.m_pUserItem,this.m_ShowItemTipsType);
                  
                }else
                {
                    UI.UIManager.GetInstance().ShowDialog(UIDialogID.ItemTips);
                     //this.ShowDialog(UIDialogID.ItemTips);
                    Config.GlobalConfig._Instance.SetCurrentShowItem(this.m_pUserItem,this.m_ShowItemTipsType)  ;
                }
          
            }
        }
    }
}