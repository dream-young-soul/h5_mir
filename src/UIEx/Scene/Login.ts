module UI
{
    export class Login extends ui.Scene.LoginUI
    {
        constructor()
        {
            super();
            this.m_TextPaswd.type="password";
            this.m_TextUser.text = "yiyi";
            this.m_TextPaswd.text ="a";
            this.m_btnEnter.on(Laya.Event.CLICK,this,this.OnEnterClick);

           
        }

        private OnEnterClick():void
        {
          
   
             let propSet:Entity.PropertySet = new Entity.PropertySet();
            let handle:number = 0;
            propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSX,186);
            propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSY,159);
            propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_MODELID,137);
            propSet.SetProperty(Entity.enPropEntity.PROP_ACTOR_WEAPONAPPEARANCE,28);
            propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_HP,100);
            propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MAXHP,100);
            propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MP,100);
            propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_ATTACK_SPEED,500);
            propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MAXMP,100);
            propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MOVEONESLOTTIME,400);
            LogicManager.GetInstance().CreateEntity(handle,Entity.EntityType.Player,propSet);
            let pPlayer:Entity.Player =  Entity.Player.GetInstance();
            pPlayer.PostActionMessage(Entity.StandardActions.SA_IDLE,null);
            pPlayer.SetEntityName("后天");
            
            
            //加载地图文件，加载成功后根据主角的坐标设置地图坐标
            GameMap.CustomGameMap.GetInstance().LoadMap("map/map/1LeiMingDaLu.wwm","雷鸣大陆",1);
            //设置主角位置
           
            pPlayer.SetCurrentXY(186,159);


            let pMiniMap:UI.MiniMap = UI.UIManager.GetInstance().GetMiniMapDialog();
            if(pMiniMap != null)
            {
                pMiniMap.SetMapName("雷鸣大陆");
            }

        
            //创建怪物
            for(let i:number = 0;i < 20;i++)
            {
                handle++;
                propSet = new Entity.PropertySet();
                propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_MODELID,20);
                propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSX,pPlayer.GetCurentX() - 5 + parseInt((Math.random() * 10).toString()));
                propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_POSY,pPlayer.GetCurrentY()- 5 + parseInt((Math.random() * 10).toString()));
                propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_HP,100);
                propSet.SetProperty(Entity.enPropEntity.PROP_ENTITY_DIR,parseInt((Math.random() * 10).toString()) % 7);
                propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MAXHP,100);
                propSet.SetProperty(Entity.enPropEntity.PROP_CREATURE_MOVEONESLOTTIME,1000);

                let pMonster:Entity.Monster =  LogicManager.GetInstance().CreateEntity(handle,Entity.EntityType.Monster,propSet) as Entity.Monster;
                pMonster.SetEntityName("后天的宝宝");
            }
            //创建主界面ui
            UI.UIManager.GetInstance().InitMainLayer();
        }
    }
}