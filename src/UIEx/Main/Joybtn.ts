module UI
{
    export class Joybtn extends ui.Main.joybtnUI
    {
        constructor()
        {
            super();
            this.m_btn_normalatk.on(Laya.Event.CLICK,this,this.OnNormalAtkClick)
            
        }
        private OnNormalAtkClick():void
        {
            let pPlayer:Entity.Player = Entity.Player.GetInstance();
            //有选中对象了，攻击选中对象
            let pEntity:Entity.CustomEntity = pPlayer.GetSelectTarget() ;
            if(pEntity!= null && !pEntity.IsDie() && !pEntity.IsDisappeared())
            {
                pPlayer.SetAttackTarget(pPlayer.GetSelectTarget());
                return;
            }
            
            pEntity = LogicManager.GetInstance().GetNearEntity([Entity.EntityType.Monster]);
            if(pEntity != null)
            {
                pPlayer.SetAttackTarget(pEntity);
            }
        }
        
    }
}