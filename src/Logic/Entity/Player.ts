    /**
	 * 本地玩家类 
	 * 此类在游戏中只能被构造一次！
	 * @author 后天 2017.9.30
	 * 
	 */
module Entity
{
    export class Player extends Human
    {
        public static readonly NORMAL_MOVE_STEP:number = 1;//▲▲▲规定常规移动的最大距离
        public static readonly NORMAL_RUN_STEP:number =2;   //▲▲▲规定常规跑动的最大距离

        public static readonly MOVE_TYPE_WALK:number = 0;
        public static readonly MOVE_TYPE_RUN:number = 1;

        private static  _Instance:Player = null;
        private m_boPassiveMoving:boolean = false;  //是否在被动移动中
        private m_nPassiveMoveDir:number = 0;       //被动移动的方向
        private m_nNextAction:number = StandardActions.AP_IDLE; //下一个动作
        private m_nNextDirection:number = 0;
        private m_dwActionTimeOut:number = 0;   //当前动作超时时间
        private m_nMoveType:number = Player.MOVE_TYPE_WALK;
        private m_nNextPassTime:number = 0; //下一次移动时间戳
        private m_MoveAction:MoveAction = new MoveAction(); //包含移动的方向和步伐

        private m_nLastActionTime:number = 0;
        private m_nOldX:number = 0;
        private m_nOldY:number = 0;
        private m_AttackTarget:number = null; //攻击对象
        private m_SelectTarget:number = null; //当前选中对象
        private m_SelectAnimation:Common.Animation = null;  //选中动画- 焦点角色脚下的
        private m_NextUseSkill:Config.UserSkillInfo = null; //下一个动作攻击技能
        private m_ArrAutoPath:any = null;   //自动寻路路径
        private m_AutoPathNpcInfo:Config.StdNpc = null; //自动寻路npc信息
        private m_AutoPathEntityHandle:number = null;    //自动寻路实体信息
        public static SetInsatnce(play:Player):void
        {
            Player._Instance = play;
        }
        public static GetInstance():Player
        {
            return Player._Instance;
        }
        constructor(handle:number)
        {
            super(handle);
            this.m_Type = Entity.EntityType.Player;
        }

        public StartPassiveMoving(dir:number):void
        {
            this.m_boPassiveMoving = true;
            this.m_nPassiveMoveDir = dir;
            this.SetAttackTarget(null);
        }

        public StopAction():void
        {

            this.m_boPassiveMoving = false;
            this.m_nPassiveMoveDir = 0;
            this.m_nNextAction = StandardActions.SA_IDLE;


            if(this.m_ArrAutoPath != null)
            {
                this.m_ArrAutoPath = null;
                this.m_AutoPathNpcInfo = null;
                this.m_AutoPathEntityHandle = 0;
            }

        }
        public GetAutoPath():any
        {
            return this.m_ArrAutoPath;
        }
        public IsPassiveMoving():boolean
        {
            return this.m_boPassiveMoving;
        }
		/**
		 * 依据当前角色的状态设置为空闲动作 
		 * 若等待设置下一个动作（存在本地玩家的控制指令）则设置为下一个动作
		 * ★★★★★在LocalPlayer中，此函数也是本地控制逻辑的驱动函数
		 */

       protected  SetToIdleAction(): void
       {
            if(this.m_dwActionTimeOut == 0 && this.IsDie() == false)
            {
                 //若非处于攻击停留状态才可处理本地控制的操作
                 if(this.m_nEndAttackPause == tagAttackPause.Idle)
                 {
                     this.m_nNextAction = StandardActions.SA_IDLE;
                     //--通过逻辑处理获取下一个行为
                     this.Think();
                     // --如果下一个行为不是空闲行为则执行下一个行为
                     if(this.m_nNextAction != StandardActions.SA_IDLE)
                     {
                         if(this.DoNextAction())
                         {
                             return;
                         }
                     }
                 }
            }
            super.SetToIdleAction();
       }


       	/**
		 * 自动控制的逻辑处理函数
		 * 函数内会根据角色当前的状态来决定下一个行为
		 * 攻击、寻路等都属于自动控制的范畴 
		 * 
		 */
        public Think():void
        {
            let isWalk = false;
            let nTime:number = Config.GlobalConfig.s_dwUpdateTick;
            let step:number = Player.NORMAL_RUN_STEP;
            if(this.m_boPassiveMoving == true)
            {
                if(this.m_nNextPassTime <= nTime)
                {
                  
                    let MouseCoord = GameMap.CustomGameMap.GetInstance().ScreenToCoord(Laya.stage.mouseX,Laya.stage.mouseY)
                    let w:number = this.m_nCurrentX - MouseCoord.x
                    let h = this.m_nCurrentY - MouseCoord.y
                    if ((w * w + h * h) <= 8 )
                    {
                        isWalk = true
                    }
                    this.m_nMoveType = isWalk == true ? Player.MOVE_TYPE_WALK : Player.MOVE_TYPE_RUN;
                    if(this.m_nMoveType != Player.MOVE_TYPE_RUN)
                    {
                        step = Player.NORMAL_MOVE_STEP;
                    }
                    if(this.DoMove(step,this.m_nPassiveMoveDir) == true)
                    {
                        this.m_nNextPassTime = nTime + this.GetMoveSpeed();
                    }
                        
                   
                }
            }
            else if(this.m_AttackTarget > 0)
            {
                let pAttackEntity:CustomEntity = this.GetAttackTarget();
                if(pAttackEntity != null && !pAttackEntity.IsDie() && !pAttackEntity.IsDisappeared())
                {
                    this.m_NextUseSkill = null;
                    if( this.m_NextUseSkill == null)
                    {
                         console.log("m_NextUseSkill == null");
                    }
                   
                    if(Math.abs(pAttackEntity.GetCurentX() - this.GetCurentX()) > this.GetAttackDisance() ||
                        Math.abs(pAttackEntity.GetCurrentY() - this.GetCurrentY()) > this.GetAttackDisance())
                        {
                            this.m_NextUseSkill = null;
                            //如果与攻击对象在同一个坐标点-走一格拉开距离
                            if(pAttackEntity.GetCurentX() == this.GetCurentX() && 
                                pAttackEntity.GetCurrentY() == this.GetCurrentY())
                            {
                                for(let i:number = 0;i < 7;i++)
                                {
                                    if(this.DoMove(1,i) == true)
                                    {
                                        this.m_nNextPassTime = nTime + this.GetMoveSpeed();
                                        break;
                                    }
                                }
                            }else
                            {
                                let path:Array<Laya.Point> = GameMap.CustomGameMap.GetInstance().GetMapPath().
                                    FindPath(this.GetCurentX(),this.GetCurrentY(),pAttackEntity.GetCurentX(),pAttackEntity.GetCurrentY());
                                if(path != null && path.length > 0)
                                {
                                    //结束坐标也不放进去
                                    path.splice(0,this.GetAttackDisance());
                                    path.pop();
                                    if(path.length > 0)
                                    {
                                        //定义跑和走
                                        let Point1:Laya.Point = path[path.length - 1];
                                        let nDir = GameMap.CustomGameMap.CalcForwardDirection(this.GetCurentX(),this.GetCurrentY(),Point1.x,Point1.y);
                                        let nStep:number = 1;
                                    
                                        if(path.length > 1)
                                        {
                                            //直线，切换到跑
                                            let Point2:Laya.Point = path[path.length - 2];
                                            if(nDir == GameMap.CustomGameMap.CalcForwardDirection(this.GetCurentX(),this.GetCurrentY(),Point2.x,Point2.y))
                                            {
                                                nStep = 2;
                                            }
                                        }
                                    
                                        if(this.DoMove(nStep,nDir) == true)
                                        {
                                            this.m_nNextPassTime = nTime + this.GetMoveSpeed();
                                        }
                                    }
                                    
                                }
                            }
        
                        }else
                        {
                            let nAttackDir:number = GameMap.CustomMap.CalcForwardDirection(this.m_nCurrentX,
                                this.m_nCurrentY,pAttackEntity.GetCurentX(),pAttackEntity.GetCurrentY());
                            //技能攻击
                            if(this.m_NextUseSkill != null)
                            {
                                this.RawSetNextAction(StandardActions.SA_SPELL,nAttackDir);
                            }else
                            {
                            
                                this.RawSetNextAction(StandardActions.SA_NORMHIT,nAttackDir);
                            }

                        }
                }


            }else if(this.m_ArrAutoPath != null) //自动寻路
            {
                if(this.m_ArrAutoPath.length == 0)
                {
                    
                    //寻路与npc对话
                    if(this.m_AutoPathNpcInfo != null)
                    {
                        let pNpcEntity:Entity.CustomEntity =  LogicManager.GetInstance().FindEntityByXY(this.m_AutoPathNpcInfo._nX,this.m_AutoPathNpcInfo._nY);
                        if(pNpcEntity != null)
                        {
                            // let msgNpcPack = new ClientMsgPack.LogicPack.NpcTalkMsgPack();
                            // msgNpcPack._Handle = pNpcEntity.GetHandle();
                            // Net.MsgSender.SendDataByPack(msgNpcPack);
                        }
                    }else if(this.m_AutoPathEntityHandle > 0)
                    {
                        let pEntity:Entity.CustomEntity = LogicManager.GetInstance().FindEntity(this.m_AutoPathEntityHandle);
                        if(pEntity != null)
                        {
                            switch(pEntity.GetEntityType())
                            {
                                case Entity.EntityType.DropItem: //拾取道具
                                {
                                    // let pDropItem:Entity.DropItem = pEntity as Entity.DropItem;
                                    // Net.MsgSender.SendLootItem(pDropItem.GetPacketId());
                                    break;
                                }
                            }
                        }
                    }
                    this.StopAction();
                    
                }else
                {
                  
                    //定义跑和走
                    let Point1:Laya.Point = this.m_ArrAutoPath[this.m_ArrAutoPath.length - 1];
                    let nDir = GameMap.CustomGameMap.CalcForwardDirection(this.GetCurentX(),this.GetCurrentY(),Point1.x,Point1.y);
                    let nStep:number = Player.NORMAL_MOVE_STEP;
                
                    if(this.m_ArrAutoPath.length > 1)
                    {
                    //直线，切换到跑
                        let Point2:Laya.Point = this.m_ArrAutoPath[this.m_ArrAutoPath.length - 2];
                        if(nDir == GameMap.CustomGameMap.CalcForwardDirection(this.GetCurentX(),this.GetCurrentY(),Point2.x,Point2.y))
                        {
                            nStep = Player.NORMAL_RUN_STEP;
                        }
                    }
                
                    if(this.DoMove(nStep,nDir) == true)
                    {
                        this.m_nNextPassTime = nTime + this.GetMoveSpeed();
                    }
                    //弹出
                    this.m_ArrAutoPath.pop();
                    if(nStep == Player.NORMAL_RUN_STEP)
                    {
                         this.m_ArrAutoPath.pop();
                    }
                }

            }
        }

        //取角色攻击距离
        public GetAttackDisance():number
        {
            if(this.m_NextUseSkill != null)
            {
                let pStdSkill:Config.StdSkill = Config.ConfigManager.GetInstance().GetSkillConfig().
                    GetStdSkillByID(this.m_NextUseSkill._nSkillID,this.m_NextUseSkill._bLevel);
                if(pStdSkill != null)
                {
                    return pStdSkill._nDistance; 
                }
                
            }
            return 1
        }
        /**
		 * 尝试向指定的方向移动指定的距离 
		 * @param nStep 移动距离，如果为0则函数内自行决定移动的步伐
		 * @param nDir 移动步伐
		 * @return 
		 * 
		 */
        public DoMove(nStep:number,nDir:number):boolean
        {
           
            this.m_MoveAction._nDir = nDir;
            if(nStep != 0)
            {
                this.m_MoveAction._nStep= nStep;
            }else
            {
                if(this.m_nMoveType == Player.MOVE_TYPE_RUN)
                {
                    this.m_MoveAction._nStep = Player.NORMAL_RUN_STEP;
                }else
                {
                    this.m_MoveAction._nStep = Player.NORMAL_MOVE_STEP;
                }
            }
            //--这里先判断移动的目的点有无角色,有的话就只走一格
            if(this.m_MoveAction._nStep >= Player.NORMAL_RUN_STEP)
            {
                let point:Laya.Point = GameMap.CustomMap.CalcForwardPosition(this.m_nCurrentX,this.m_nCurrentY,nDir,this.m_MoveAction._nStep);
                if(LogicManager.GetInstance().FindEntityByXY(point.x,point.y) != null)
                {
                    this.m_MoveAction._nStep = Player.NORMAL_MOVE_STEP;
                }
            }
            //确认移动的实际距离和方向并生成动作消息和向服务器发送的消息
            //不可走的时候判断是否可以挖矿
            if(this.ConfimMoveAction(this.m_MoveAction) == false)
            {
                return false;
            }
            this.RawSetNextAction(this.m_MoveAction._nAction,this.m_MoveAction._nDir);
            return true;
        }

        	/**
		 * 设置下一个动作（当前动作完成后的下一个动作） 
         * */
        private RawSetNextAction(nAction:number,nDir:number):void
        {
            this.m_nNextAction = nAction;
            this.m_nNextDirection = nDir;
        }

        private DoNextAction():boolean
        {
            //--保存当前位置
            this.m_nOldX = this.m_nCurrentX;
            this.m_nOldY = this.m_nCurrentY;

            let nActionBlockTime:number = 0;    //行为阻塞时间

            //处理如何实施新动作
            let nAction:number = this.m_nNextAction;
            let nDir:number = this.m_nNextDirection;
            this.m_nAction = nAction;
            this.SetDirection(nDir);
            switch(nAction)
            {
                case StandardActions.SA_WALK:
                case StandardActions.SA_RUN:
                {
                    let nSpeed = this.m_MoveAction._nMoveSpeed;
                    if(nAction == StandardActions.SA_WALK)
                    {
                        nSpeed = nSpeed * 2;    //这里要特殊乘2  之前走2步 500  走1步 250   其实速度是一样的
                    }
                    nDir = this.m_MoveAction._nDir;
                    let getdir:number = GameMap.CustomMap.CalcForwardDirection(this.m_nCurrentX,this.m_nCurrentY,
                    this.m_MoveAction._nTargetX,this.m_MoveAction._nTargetY);
                  
                    this.MoveTo(this.m_MoveAction._nTargetX,this.m_MoveAction._nTargetY,nSpeed)
                    GameMap.CustomGameMap.GetInstance().MoveBy(nDir,this.m_MoveAction._nStep,nSpeed);

                    nActionBlockTime = 0;     //移动不锁定动作
                    
                    //移动类型
                    let moveType:number = nAction == StandardActions.SA_WALK ? 0 : 1;
                    // Net.MsgSender.SendMove(moveType,this.m_nCurrentX,this.m_nCurrentY,nDir);
                    // let msgPack:ClientMsgPack.MovePack.MoveMsgPack = new ClientMsgPack.MovePack.MoveMsgPack();
                    
                    SoundManager.GetInstance().PlayGameSound(nAction == StandardActions.SA_WALK ? SoundManager.GAME_WALK : SoundManager.GAME_RUN);

                    break;
                }
                case StandardActions.SA_NORMHIT:
                {
                    if(this.m_AttackTarget > 0)
                    {
                        let pAttackEntity:CustomEntity = this.GetAttackTarget();
                        if(pAttackEntity != null)
                        {
                            //Net.MsgSender.SendNormalHit(pAttackEntity.GetHandle());
                        }
                         
                    }
                    SoundManager.GetInstance().PlayGameSound(SoundManager.GAME_NORMAL_ATTACK);
                    nActionBlockTime = 1000;
                    break;
                }
                case StandardActions.SA_SPELL:
                {
                    let pStdSkill:Config.StdSkill = Config.ConfigManager.GetInstance().GetSkillConfig().
                        GetStdSkillByID(this.m_NextUseSkill._nSkillID,this.m_NextUseSkill._bLevel);
                    if(pStdSkill != null)
                    {
                        nAction = pStdSkill._nAction;//动作
                        //特效
                        if(pStdSkill._nSpellEff > 0)
                        {
                            this.AddEffectById(pStdSkill._nSpellEff);
                        }
                        this.m_NextUseSkill._nUseCD = Config.GlobalConfig.s_dwUpdateTick + pStdSkill._nCD; //冷却时间
                        //发送使用技能消息
                        switch(pStdSkill.SkillType)
                        {
                            case Config.SkillType.SingleAttack:
                            {
                                let pAttackEntity:CustomEntity = this.GetAttackTarget();
                                if(pAttackEntity != null)
                                {
                                     //Net.MsgSender.SendUseSkill(pStdSkill._nID,pAttackEntity.GetHandle(),0,0,this.GetDirection());
                                }
                                break;
                            }
                        }
                       
                    }
                    
                    
                    this.m_NextUseSkill = null; //置空，等待下一次施法
                    break;
                }
            }

            if(nActionBlockTime > 0)
            {
                this.m_dwActionTimeOut = Config.GlobalConfig.s_dwUpdateTick + nActionBlockTime;
            }
            //设置动作
            if(nAction > -1)
            {
                this.SetAction(nAction,nDir);
            }

            //更新动作执行时间
            this.m_nLastActionTime = Config.GlobalConfig.s_dwUpdateTick;
            return true;
        }

        private ConfimMoveAction(move:MoveAction):boolean
        {

             let MoveTestDirections:number[] = [0,1,-1] //移动测试的方向的顺序 
            while(move._nStep > 0 )
            {
                for(let i:number = 0;i < MoveTestDirections.length;i++ )
                {
                    let dir = (move._nDir + MoveTestDirections[i]) & 7;
                    //前方目的地可移动
                    if(this.CanMoveForward(dir,move._nStep) == true)
                    {
                        move._nDir = dir;
                        let pos:Laya.Point = GameMap.CustomMap.CalcForwardPosition(this.m_nCurrentX,this.m_nCurrentY,dir,move._nStep);
                        move._nTargetX = pos.x;
                        move._nTargetY = pos.y;
                      
                        switch(move._nStep)
                        {

                            case 2:
                            {
                                this.m_MoveAction._nAction  = StandardActions.SA_RUN;
                                this.m_MoveAction._nMoveSpeed = this.GetMoveSpeed();
                                break;
                            }
                            default:
                            {
                                 this.m_MoveAction._nAction = StandardActions.SA_WALK;
                                 this.m_MoveAction._nMoveSpeed = this.GetMoveSpeed() / 2;   
                                break;
                            }
                        }
                        return true;
                  
                    }
                }
                move._nStep --;
            }

 
            return false
        }

        private CanMoveForward(nDir:number,nStep:number):boolean
        {
            while(nStep > 0)
            {
                let pos:Laya.Point = GameMap.CustomMap.CalcForwardPosition(this.m_nCurrentX,this.m_nCurrentY,nDir,nStep);
                if(GameMap.CustomGameMap.GetInstance().Moveable(pos.x,pos.y) == false)
                {
                    return false;
                }
                // if(LogicManager._Instance.CheckCanCross(pos.x,pos.y) == false)
                // {
                //     return false;
                // }
                
  
                nStep --;
            }
            return true;
        }
        
        public Update(nCurrentTick:number):void
        {
           
            //上一个行为超时，则解除行为锁
            //console.log("Player.Update");
            if(this.m_dwActionTimeOut > 0 && nCurrentTick >= this.m_dwActionTimeOut )     
            {
                this.m_dwActionTimeOut = 0;
            }
           
           //选中特效的播放
            if(this.m_SelectAnimation != null && this.m_SelectAnimation.parent != null)
            {
                this.m_SelectAnimation.Update(nCurrentTick);
            }
            super.Update(nCurrentTick);
           
        }
        public GetAttackTarget():CustomEntity
        {
            if(this.m_AttackTarget <= 0)return null;
            let pEntity:CustomEntity = LogicManager.GetInstance().FindEntity(this.m_AttackTarget);
            if(pEntity == null)
            {
                this.m_AttackTarget = 0;
            }
            return pEntity;
           
        }
        public SetAttackTarget(pEntity:CustomEntity):void
        {
            if(pEntity == null)
            {
                this.m_AttackTarget = 0;
            }else
            {
                 this.m_AttackTarget = pEntity.GetHandle();
            }
            if(this.m_AttackTarget > 0 && this.m_SelectTarget != this.m_AttackTarget)
            {
                this.SetSelectTarget(pEntity);
            }

        }

        public SetSelectTarget(pEntity:CustomEntity):void
        {
            if(pEntity == null)
            {
                this.m_SelectTarget  = 0;
            }else
            {
                this.m_SelectTarget =pEntity.GetHandle();
            }

            
            if(this.m_SelectAnimation == null)
            {
                let pack:Resources.SRPack = Resources.ResourcesManager._Instance.GetOtherEffect("focus");
                if(pack != null && pack.GetFrameCount() > 0)
                {
                    this.m_SelectAnimation = new Common.Animation(pack,0,pack.GetFrameCount(),80,-1);
                }
            }
            if(this.m_SelectAnimation != null && this.m_SelectAnimation.parent != null)
            {
                this.m_SelectAnimation.parent.removeChild(this.m_SelectAnimation);
            }
            if(pEntity != null)
            {
                pEntity.GetAppearance().addChild(this.m_SelectAnimation);
                
            }
        }

        public GetSelectTarget():CustomEntity
        {
            if(this.m_SelectTarget <= 0)return null;
            let pEntity:CustomEntity = LogicManager.GetInstance().FindEntity(this.m_SelectTarget);
            if(pEntity == null)
            {
                this.m_SelectTarget = 0;
            }
            return pEntity;
        }
        public CanAttack(pEntity:CustomEntity):boolean
        {
            if(pEntity.GetEntityType() == Entity.EntityType.Npc)
            {
                return false;
            }
            if(pEntity.GetEntityType() == Entity.EntityType.DropItem)
            {
                return false;
            }
            return true;
        }

          public SetCurrentXY(X:number, Y:number):void
          {
              super.SetCurrentXY(X,Y);

              let pMiniMapDialog = UI.UIManager.GetInstance().GetMiniMapDialog();
              if(pMiniMapDialog != null)
              {
                pMiniMapDialog.SetMapPoint(X,Y);
              }
              

              //捡取该坐标点的道具
              let pEntity:Entity.CustomEntity =  LogicManager.GetInstance().FindEntityByXY(X,Y);
              if(pEntity != null)
              {
                  switch(pEntity.GetEntityType())
                  {
                      case Entity.EntityType.DropItem:
                      {
                          //Net.MsgSender.SendLootItem((pEntity as Entity.DropItem).GetPacketId());
                          break;
                      }
                  }
              }
          }
          public AutoFindPath(nX:number,nY:number,pStdNpc:Config.StdNpc = null,pEntity:Entity.CustomEntity = null):void
          {
             let point:Laya.Point = new Laya.Point(nX,nY);
             if(pStdNpc != null)
             {
                 
                 for(let i:number = 0;i < 8;i++)
                 {
                     point = GameMap.CustomMap.CalcForwardPosition(nX,nY,i,2)
                     if(GameMap.CustomGameMap.GetInstance().Moveable(point.x,point.y))
                     {
                        break;
                     }
                 }
             }
             this.StopAction();
             this.m_ArrAutoPath = GameMap.CustomGameMap.GetInstance().GetMapPath().FindPath(this.GetCurentX(),this.GetCurrentY(),point.x,point.y)
             //弹出起点坐标
             if(this.m_ArrAutoPath != null)
             {
                 this.m_ArrAutoPath.pop();
             }
             this.m_AutoPathNpcInfo = pStdNpc;
             if(pEntity != null)
             {
                 this.m_AutoPathEntityHandle = pEntity.GetHandle();
             }
            
             
          }
          protected UpdatePropertys(id:enPropEntity,value):void
          {
              super.UpdatePropertys(id,value);

              switch(id)
              {
                  case enPropEntity.PROP_CREATURE_LEVEL: //更新等级
                  {
                      let pHeaderDialog:UI.Header = UI.UIManager.GetInstance().GetHeaderDialog();
                      if(pHeaderDialog != null)
                      {
                        pHeaderDialog.UpdateLevel(parseInt(value));
                      }
                      
                      break;
                  }
                  case enPropEntity.PROP_ACTOR_VOCATION:    //更新职业
                  {
                      let pHeaderDialog:UI.Header = UI.UIManager.GetInstance().GetHeaderDialog();
                       if(pHeaderDialog != null)
                       {
                        pHeaderDialog.UpdateJob(<Config.Vocation>value);
                       }
                      
                      break;
                  }
                  case enPropEntity.PROP_CREATURE_HP: //更新当前血量
                  {
                       let pHeaderDialog:UI.Header = UI.UIManager.GetInstance().GetHeaderDialog();
                        if(pHeaderDialog != null)
                        {
                            pHeaderDialog.UpdateHPProgress(parseInt(value),this.GetIntProperty(enPropEntity.PROP_CREATURE_MAXHP));
                        }
                       
                      break;
                  }
                  case enPropEntity.PROP_CREATURE_MAXHP:    //最大血量
                  {
                       let pHeaderDialog:UI.Header = UI.UIManager.GetInstance().GetHeaderDialog();
                       if(pHeaderDialog != null)
                       {
                            pHeaderDialog.UpdateHPProgress(this.GetIntProperty(enPropEntity.PROP_CREATURE_HP),parseInt(value));
                       }
                       
                      break;
                  }
                  case enPropEntity.PROP_CREATURE_MP:
                  {
                      let pHeaderDialog:UI.Header = UI.UIManager.GetInstance().GetHeaderDialog();
                       if(pHeaderDialog != null)
                       {
                            pHeaderDialog.UpdateMPProgress(parseInt(value),this.GetIntProperty(enPropEntity.PROP_CREATURE_MAXMP));
                       }
                      
                      break;
                  }
                  case enPropEntity.PROP_CREATURE_MAXMP:    //最大血量
                  {
                       let pHeaderDialog:UI.Header = UI.UIManager.GetInstance().GetHeaderDialog();
                         if(pHeaderDialog != null)
                         {
                                pHeaderDialog.UpdateHPProgress(this.GetIntProperty(enPropEntity.PROP_CREATURE_MP),parseInt(value));
                         }
                       
                      break;
                  }
                  case enPropEntity.PROP_ACTOR_COIN:    //金币
                  {
                      let pTopHeaderDialog:UI.TopHeader = UI.UIManager.GetInstance().GetTopHeaderDialog();
                      if(pTopHeaderDialog != null)
                      {
                            pTopHeaderDialog.SetGold(parseInt(value));
                      }
                      
                      break;
                  }
                  case enPropEntity.PROP_ACTOR_BIND_COIN:    //绑定金币
                  {
                      let pTopHeaderDialog:UI.TopHeader = UI.UIManager.GetInstance().GetTopHeaderDialog();
                      if(pTopHeaderDialog != null)
                      {
                            pTopHeaderDialog.SetBindGold(parseInt(value));
                      }
                      
                      break;
                  }
                  case enPropEntity.PROP_ACTOR_YUANBAO:    //元宝
                  {
                      let pTopHeaderDialog:UI.TopHeader = UI.UIManager.GetInstance().GetTopHeaderDialog();
                       if(pTopHeaderDialog != null)
                       {
                            pTopHeaderDialog.SetYuanBao(parseInt(value));
                       }
                      
                      break;
                  }
                  case enPropEntity.PROP_ACTOR_BIND_YUANBAO :    //绑定元宝
                  {
                      let pTopHeaderDialog:UI.TopHeader = UI.UIManager.GetInstance().GetTopHeaderDialog();
                       if(pTopHeaderDialog != null)
                       {
                            pTopHeaderDialog.SetBindYuanBao(parseInt(value));
                       }
                      
                      break;
                  }
              }
          }



    }
}