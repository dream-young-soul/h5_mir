//掉落道具的实体
module Entity
{
    export class DropItem extends CustomEntity
    {
        private m_nPacketId:number = 0;
        private m_SpriteIcon:Laya.Sprite = null;
        constructor(handle:number)
        {
            super(handle);
            this.m_Type = EntityType.DropItem;
            this.m_ProgressHP.visible = false;
            this.m_TextName.pos(-CustomEntity.DefalutWidth / 2,92);
        }
        public Destory():void
        {
            if(this.m_SpriteIcon != null)
            {
                this.m_SpriteIcon.removeSelf();
            }
            this.m_SpriteIcon = null;
            super.Destory();
        }
        public GetSpriteIcon():Laya.Sprite
        {
            return this.m_SpriteIcon;
        }
        // public SetItemInfo(msg:ClientMsgPack.LogicPack.EntityAppearDropItemMsgPack):void
        // {
        //     this.m_nPacketId = msg._nPacketId;
           
        //     let pStdItem:Config.StdItem = Config.ConfigManager.GetInstance().GetItemConfig().FindItemById(msg._nItemId);
        //     if(pStdItem != null)
        //     {
        //         this.m_SpriteIcon = Resources.ResourcesManager._Instance.GetItemIconImage(msg._nIcon);
        //         this.m_SpriteIcon.scale(0.5,0.5);
        //         this.m_SpriteIcon.hitArea = null;
        //         this.m_Appearance.addChild(this.m_SpriteIcon);
        //         this.m_SpriteIcon.pos(-16,-16);
        //     }
        // }
        public IsDie():boolean
        {
            return false;
        }
        
        public GetPacketId():number
        {
            return this.m_nPacketId;
        }
    }


}