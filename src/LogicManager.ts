	/**
	 * 游戏角色对象管理器 
	 * @author 后天 2017.9.29
	 * 
	 */
    class LogicManager
    {
        private static readonly MP_INTELLIGENT:number = 0; //智能移动
        private static readonly MP_AUTO:number = 1;         //自动移动
        private static readonly MP_MANUAL:number = 2;       //手动移动
        private static readonly _Instance:LogicManager = new LogicManager();
        private m_EntityList:Entity.CustomEntity[] = []; //游戏对象列表
        private m_dwCheckHideActorTick: number = 0;//检查超出显示范围的角色的时间
        private m_nMovePolicy:number = LogicManager.MP_INTELLIGENT; //移动方式
        private m_ClearFreeMemoryTick:number = 0;   //清理无用资源时间戳
        constructor()
        {
            
        }
        public static GetInstance():LogicManager
        {
            return LogicManager._Instance;
        }
        public Init()
        {
            Entity.HumanAction.Init();  //初始化角色动作帧信息
            Entity.StdMonsterAction.Init(); //初始化怪物动作帧信息
            GameMap.CustomGameMap.Init();  //初始化地图信息
            UI.UIManager.Init();    //初始化UI界面管理器
            // Net.MainSocket.Init();  //初始化websocket
            // NetSystem.NetSystemManager.Init();  //初始化网络派发消息
        }
        /**
		 * 更新函数
		 * 此函数内会循环更新所有的角色对象 
		 * @param nCurrentTick 当前时间戳
		 * 
		 */
        public Update(nCurrentTick:number):void
        {
            let pCfg:Config.GlobalConfig = Config.GlobalConfig._Instance;
            Config.GlobalConfig.s_dwUpdateTick = nCurrentTick;
            //更新网络
            //Net.MainSocket.GetInstance().Update(nCurrentTick);
            // if(nCurrentTick - pCfg._nCurrentFrameTick >= pCfg._nFrameTick)
            // {
            //      console.log("延迟过高,下一帧执行!Socket.Updtae"+(nCurrentTick - pCfg._nCurrentFrameTick).toString());
            //     return;
            // }
            //更新地图
            GameMap.CustomGameMap.GetInstance().Update(nCurrentTick);
            //  if(nCurrentTick - pCfg._nCurrentFrameTick >= pCfg._nFrameTick)
            // {
            //      console.log("延迟过高,下一帧执行!Gamemap.Updtae"+(nCurrentTick - pCfg._nCurrentFrameTick).toString());
            //     return;
            // }
            //检查超出显示区域的角色、技能特效、掉落物品以及地图事件
            const CHECKHIDEACTORTIME:number = 2000; //检查超出显示范围的时间间隔


            //更新所有角色
			//必须降序循环，因为数据可能会从中删除
            for(let i:number = this.m_EntityList.length - 1;i > -1;--i)
            {
                let pEntity:Entity.CustomEntity = this.m_EntityList[i];
                
                if(pEntity.IsDisappeared())
                {
                    if(pEntity.parent != null)
                    {
                        GameMap.CustomGameMap.GetInstance().RemoveObject(pEntity);
                    }
                    this.m_EntityList.splice(i,1);
                    pEntity.Destory();
                    pEntity = null;
                }else
                {
                    pEntity.Update(nCurrentTick);
                }
                // if(nCurrentTick - pCfg._nCurrentFrameTick >= pCfg._nFrameTick)
                // {
                //     console.log("延迟过高,下一帧执行!pEntity.Updtae"+(nCurrentTick - pCfg._nCurrentFrameTick).toString());
                //     return;
                // }
            }
			/**
			 * 将主角在所有角色处理之后再进行更新是便于先将服务器发送的各个角色的数据处理完成，
			 * 再更新主角，则会在主角的思考函数中使用各个角色最新的状态进行计算以获得正确的处
			 * 理结果。
			 * 例如，在自动打怪的状态中，一个怪物被攻击且只有0体力，但此时角色死亡的消息在角色
			 * 消息队列中还尚未进行处理，即角色需要等待下一个消息循环后才会“死亡”，则此时如果
			 * 先调用主角的更新，则主角依旧会攻击这个“等待死亡”的角色；只有把主角的更新函数在其
			 * 他角色更新之后再调用，才可避免此问题。
			 */
            if(Entity.Player.GetInstance() != null)
            {
                Entity.Player.GetInstance().Update(nCurrentTick);
            }
            // if(nCurrentTick - pCfg._nCurrentFrameTick >= pCfg._nFrameTick)
            // {
            //     console.log("延迟过高,下一帧执行!Player.Updtae"+(nCurrentTick - pCfg._nCurrentFrameTick).toString());
            //     return;
            // }
           //更新UI
            UI.UIManager.GetInstance().Update(nCurrentTick);
            // if(nCurrentTick - pCfg._nCurrentFrameTick >= pCfg._nFrameTick)
            // {
            //     console.log("延迟过高,下一帧执行!UI.Updtae"+(nCurrentTick - pCfg._nCurrentFrameTick).toString());
            //     return;
            // }
            //清理内存无用资源
            this.CheckFreeMemory(nCurrentTick);


           
        }

            /**
         * 创建角色 
         * @param handle 实体句柄
         * @param type 实体类型
         * @param propSet 属性集合
         * @return 
         * 
         */
        public CreateEntity(handle:number,type:Entity.EntityType, propSet:Entity.PropertySet):Entity.CustomEntity
        {
            let pEntity:Entity.CustomEntity = null;
            switch(type)
            {
                case Entity.EntityType.Player:
                {
                    pEntity = new Entity.Player(handle);
                    Entity.Player.SetInsatnce(pEntity as Entity.Player) ;
                    break;
                }
                case Entity.EntityType.Npc:
                {
                    pEntity = new Entity.Npc(handle);
                    break;
                }
                case Entity.EntityType.Monster:
                {
                    pEntity = new Entity.Monster(handle);
                    break;
                }
                case Entity.EntityType.Human:
                {
                    pEntity = new Entity.Human(handle);
                    break;
                }
                case Entity.EntityType.DropItem:
                {
                    pEntity = new Entity.DropItem(handle);
                    break;
                }
            }
            if(pEntity == null)
            {
                return null;
            }
            //if(type != Entity.EntityType.Player)
            //{
                let x:number = propSet.GetIntProperty(Entity.enPropEntity.PROP_ENTITY_POSX);
                let y:number = propSet.GetIntProperty(Entity.enPropEntity.PROP_ENTITY_POSY);
                pEntity.SetCurrentXY(x,y);
                pEntity.PostCharMessage(Entity.ActorMessages.AM_PROPERTY_CHANGE,0,0,0,propSet);
                GameMap.CustomGameMap.GetInstance().AddObject(pEntity); //加入到地图显示对象
                if(pEntity.GetEntityType() != Entity.EntityType.Player)
                {
                    this.m_EntityList.push(pEntity);
                }
                
           // }
            return pEntity;
        }

        public CheckFouceTarget(x:number,y:number):Entity.CustomEntity
        {
            let rect:Laya.Rectangle = new Laya.Rectangle()
            const NORMAL_WIDTH:number = 60;//默认的宽度 用于没有加载到的精灵矩形碰撞
            const NORMAL_HEIGHT = 130; //默认的高度用于没有加载到的精灵矩形碰撞
            for(let i:number = 0;i < this.m_EntityList.length;i++)
            {
                let pEntity:Entity.CustomEntity = this.m_EntityList[i];
                if(pEntity.IsDie() == false && pEntity.IsDisappeared() == false)
                {
                    switch(pEntity.GetEntityType())
                    {
                        case Entity.EntityType.Monster:
                        case Entity.EntityType.Npc:
                        {
                            let ModelAni:Common.Animation = pEntity.GetModelAni();
                            let glop:Laya.Point = new Laya.Point(0,0);
                            let sprite:Laya.Sprite = ModelAni.GetCurrentFrameSprite();
                            if(sprite == null)
                            {
                                continue;
                            }
                        
                            if(sprite.hitTestPoint(x,y)) //怪物和NPC有影子的，集成在了身体上所以这个不太好处理
                            {
                                return pEntity;
                            }
                            break;
                        }
                        case Entity.EntityType.DropItem: //掉落道具
                        {
                            let pDropItem:Entity.DropItem = pEntity as Entity.DropItem;
                            if(pDropItem.GetSpriteIcon() != null)
                            {
                                if(pDropItem.GetSpriteIcon().hitTestPoint(x,y))
                                {
                                    return pEntity;
                                }
                            }
                            break;
                        }
                    }
  
                    
                }


            }
            return null;
        }

        public GetScreenDirection(x:number,y:number):number
        {
             let pPlay :Entity.Player  = Entity.Player.GetInstance();
             if(pPlay == null)
             {return 0;}
             let point:Laya.Point = GameMap.CustomGameMap.GetInstance().GetGlobalPoint(pPlay.x,pPlay.y);
             let angle:number = GameMap.CustomMap.CalcAngle(point.x,
                point.y + GameMap.CustomRenderMap.MAP_VERTICAL_OFFSET_COORD * GameMap.CustomMap.MAPCELLUNITHEIGHT,
                x,y);
             angle = Math.floor(angle);
             angle += 23;
             angle /= (360 /8);   
             angle = Math.floor(angle);
             return angle & 7; 
        }

        
        public OnMouseDown(x:number,y:number):boolean
        {
            
           let pPlay :Entity.Player  = Entity.Player.GetInstance();
            if(pPlay == null)
            {
                return false;
            }
            let pEntity:Entity.CustomEntity = this.CheckFouceTarget(x,y);
            if(pEntity != null && pPlay.CanAttack(pEntity))
            {
                //选中后再单击就是攻击
                if(pPlay.GetSelectTarget() == pEntity)
                {
                    pPlay.SetAttackTarget(pEntity);
                }else
                {
                    //设置为选中
                    pPlay.SetSelectTarget(pEntity);
                }
                
                return false ;
            }
            
            //与NPC对话
            else if(pEntity != null && pEntity.GetEntityType() == Entity.EntityType.Npc)
            {
                // let msgNpcPack = new ClientMsgPack.LogicPack.NpcTalkMsgPack();
                // msgNpcPack._Handle = pEntity.GetHandle();
                // Net.MsgSender.SendDataByPack(msgNpcPack);
                return false;
            }
            //掉落道具
            else if(pEntity == null ||( pEntity != null && pEntity.GetEntityType() == Entity.EntityType.DropItem))
            {
                if(pEntity != null)
                {
                       pPlay.AutoFindPath(pEntity.GetCurentX(),pEntity.GetCurrentY(),null,null);
                       return false;
                }else
                {
                    let MouseCoord = GameMap.CustomGameMap.GetInstance().ScreenToCoord(x,y)
                    pEntity = LogicManager._Instance.FindEntityByXY(MouseCoord.x,MouseCoord.y);
                
                    if(pEntity != null && pEntity.GetEntityType() == Entity.EntityType.DropItem)
                    {
                        pPlay.AutoFindPath(pEntity.GetCurentX(),pEntity.GetCurrentY(),null,null);
                        
                        return false;
                    }
                }

               
            }
            if(this.m_nMovePolicy == LogicManager.MP_INTELLIGENT || 
                this.m_nMovePolicy == LogicManager.MP_MANUAL)
            {
                pPlay.StartPassiveMoving(this.GetScreenDirection(x,y));
            }
            return true;
        }

        //虚拟摇杆移动
        public JoyMouseMove(dir:number):void
        {
            let play:Entity.Player = Entity.Player.GetInstance();
            play.StartPassiveMoving(dir);
        }
        public OnMouseUp(x:number,y:number):void
        {
            let pPlay :Entity.Player  = Entity.Player.GetInstance();
            if(pPlay == null)
            {
                return;
            }
            if(pPlay.GetAutoPath() != null)
            {
                return;
            }
            if(pPlay.IsPassiveMoving())
            {
                pPlay.StopAction();
            }
      
        }

        public FindEntity(handle:number):Entity.CustomEntity
        {
            if(Entity.Player.GetInstance() != null)
            {
                if(Entity.Player.GetInstance().GetHandle() == handle)
                {
                    return Entity.Player.GetInstance();
                }
            }
             for(let i:number = 0;i < this.m_EntityList.length;i++)
            {
                let pEntity:Entity.CustomEntity = this.m_EntityList[i];
                if(pEntity.GetHandle() == handle)
                {
                    return pEntity;
                }   
            }
            return null;
        }
        public FindEntityByXY(x:number,y:number):Entity.CustomEntity
        {
            for(let i:number = 0;i < this.m_EntityList.length;i++)
            {
                let pEntity:Entity.CustomEntity = this.m_EntityList[i];
                if(pEntity.GetCurentX() == x && 
                   pEntity.GetCurrentY() == y)
                    {
                        return pEntity;
                    }
            }
            return null;
        }

        private CheckFreeMemory(nCurrentTick:number):void
        {
            if(nCurrentTick >= this.m_ClearFreeMemoryTick)
            {
                 GameMap.MapResManager._Instance.ClearFreeMemory();
                 this.m_ClearFreeMemoryTick = nCurrentTick + Config.GlobalConfig._Instance._nClearFreeMemoryTime;
            }
           //清理无用音效
           SoundManager.GetInstance().Upadte(nCurrentTick);
           //清理无用资源包
           Resources.ResourcesManager._Instance.Update(nCurrentTick);
        }

        public GetNearEntity(EntityType):Entity.CustomEntity
        {
            let nDis:number = 999;
            let pLastEntity:Entity.CustomEntity = null;
            let pPlayer:Entity.Player = Entity.Player.GetInstance();
            for(let i:number = 0;i < this.m_EntityList.length;i++)
            {
                let pEntity:Entity.CustomEntity = this.m_EntityList[i];
                for(let j:number = 0;j < EntityType.length;j++)
                {
                    if(pEntity.GetEntityType() == EntityType[j] )
                    {
                        if(!pEntity.IsDisappeared() && !pEntity.IsDie())
                        {
                            let n:number = pEntity.GetDistance(pPlayer.GetCurentX(),pPlayer.GetCurrentY());
                            if(n < nDis)
                            {
                                nDis = n;
                                pLastEntity = pEntity;
                            }
           
                        }
                    }
                }
            }   
            return pLastEntity;
          
        }
    }