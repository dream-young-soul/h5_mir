module UI
{
    export enum ShowItemTipsType
    {
        RoleEquip = 1,  //角色装备
        RoleBag = 2,    //角色背包
    }
    export class ItemTips extends ui.Window.itemtipsUI
    {
        private m_SpriteIcon:Laya.Sprite = null;
        private m_pUserItem:Config.UserItem = null;
        private m_RichText:UI.RichText;
        private m_nBgOldHeight:number = 0; //九宫格背景的原始高度，物品tips会根据高度变化
        private m_ShowType:ShowItemTipsType = 0;
        constructor()
        {
            super();
            this.on(Laya.Event.ADDED,this,this.OnLoaded);
            this.on(Laya.Event.REMOVED,this,this.OnRemove);
            this.m_nBgOldHeight = this.m_image_bg.height;
        }

        public ShowItem(pUserItem:Config.UserItem,showType:ShowItemTipsType):void
        {
            
            let pStdItem:Config.StdItem = Config.ConfigManager.GetInstance().GetItemConfig().FindItemById(pUserItem._wItemId);
            if(pStdItem != null)
            {
                this.m_label_name.text = pStdItem.GetShowName();
                this.m_label_name.color = pStdItem.GetNameColor();
                this.m_SpriteIcon = Resources.ResourcesManager._Instance.GetItemIconImage(pStdItem._nIcon);
                this.addChild(this.m_SpriteIcon);
                this.m_SpriteIcon.pos(this.m_image_icon.x,this.m_image_icon.y);
                this.m_SpriteIcon.zOrder = 100;
                this.m_RichText = new UI.RichText();
                this.addChild(this.m_RichText);
                this.m_RichText.pos(12,80);
              
                this.m_RichText.SetText(Config.ItemConfig.GetItemTips(pUserItem));
            }
            this.m_pUserItem = pUserItem;
            
            let nSceneWidth:number = Config.GlobalConfig._Instance._nWidth;
            let nSceneHeight:number = Config.GlobalConfig._Instance._nHeight;
            this.pos(nSceneWidth / 2 - this.width / 2,nSceneHeight / 2 -  this.height / 2);

            //更改按钮标题
            switch(showType)
            {
                case ShowItemTipsType.RoleBag:
                {
                    this.m_btn_1.label = "丢弃";
                    break;
                }
            }
            this.m_ShowType = showType;
            this.m_image_bg.height = this.m_nBgOldHeight + this.m_RichText.GetHeight() + 5/*多加5个像素*/;
        }

        private OnLoaded():void
        {
            this.m_btn_close.on(Laya.Event.CLICK,this,this.onClose);
            this.m_btn_1.on(Laya.Event.CLICK,this,this.onBtn1Click);
        }
        
        private OnRemove():void
        {
            this.m_btn_close.off(Laya.Event.CLICK,this,this.onClose);
            if(this.m_SpriteIcon != null)
            {
                this.m_SpriteIcon.removeSelf();
            }
            this.m_pUserItem = null;
            if(this.m_RichText != null)
            {
                this.m_RichText.removeSelf();
                this.m_RichText.Destory();
            }
           this.m_btn_1.off(Laya.Event.CLICK,this,this.onBtn1Click);
            this.m_RichText = null;
        }
        private onBtn1Click():void
        {
            switch(this.m_ShowType)
            {
                case ShowItemTipsType.RoleBag: //丢弃
                {
                    //Net.MsgSender.SendDeleteItem(this.m_pUserItem._Series);
                    break;
                }
            }
        }
        private onClose():void
        {
            UI.UIManager.GetInstance().HideDialog(UI.UIDialogID.ItemTips);
        }

        public Update(nCurrentTick:number):void
        {
            if(this.m_RichText != null)
            {
                this.m_RichText.Update(nCurrentTick);
            }
        }
    }
}