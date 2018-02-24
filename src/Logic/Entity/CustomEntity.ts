module Entity
{
    export class CustomEntity extends GameMap.MapMoveObject
    {
        public static readonly Map_Hidden_Alpha:number = 0.6;//在需要透明的地图点上时,人物的透明度
        protected m_nHandle:number = 0;  //实体句柄
        protected m_Type:Entity.EntityType; //实体类型
        protected m_CharMsgList:ActorMessage[] = [];    //角色非行为消息队列
        protected m_ActionMsgList:ActionMessage[] = []; //角色动作消息队列
        protected m_nModelAni:Common.Animation = new Common.Animation(null,0,0,0,-1);   //角色模型动画
        protected m_nModleActionPartPack:Resources.SRPack[] =[]; //身体动作部件资源包
        protected m_PropSet: PropertySet = new PropertySet(); //属性集
        protected m_sEntityName = "";  //实体名称
        protected m_nAction:number = 0; //实体当前动作
        protected m_nNextActionTime:number = 0; //下一帧动作时间
        protected m_Appearance:Laya.Sprite; //用于身体、武器的外观显示的容器
        protected m_nDestX:number = 0;//移动的目的坐标X,如果角色不处于移动状态则此值等于m_nCurrentX
		protected m_nDestY:number = 0;//移动的目的坐标Y,如果角色不处于移动状态则此值等于m_nCurrentY
        protected m_UIContainer:Laya.Sprite;    //装载名字与血条的容器

        protected m_TextName:Laya.TextInput; //名字标签
        protected m_ProgressHP:Laya.ProgressBar;    //血量进度条

        public static readonly DefalutHeight:number = 120; //默认身体高度
        public static readonly DefalutWidth:number = 58;   //默认身体宽度

        protected m_EffectList:Array<Common.Animation> = null; //战士挥砍特效 同步帧数
        public GetHandle():number
        {
            return this.m_nHandle;
        }
         /**
         * 计算当前坐标与另一个坐标的方向 
         * @param handle	实体句柄
         * 
         */
        constructor(handle:number)
        {
            super();
            this.m_nHandle = handle;
            this.m_EffectList = new Array<Common.Animation>();
            this.m_Appearance = new Laya.Sprite();
            this.addChild(this.m_Appearance);
            this.m_Appearance.addChild(this.m_nModelAni);//身体动画
            this.m_nModelAni.zOrder = 1;//ｚ轴
            this.m_UIContainer = new Laya.Sprite();

            this.m_Appearance.addChild(this.m_UIContainer);
            this.m_UIContainer.x = -CustomEntity.DefalutWidth / 2;
            this.m_UIContainer.y = -CustomEntity.DefalutHeight;

            this.m_TextName = new Laya.TextInput();
            this.m_TextName.mouseEnabled = false;
          
            //血条进度条
            let pCfg:Config.GlobalConfig = Config.GlobalConfig._Instance;
            this.m_ProgressHP = new Laya.ProgressBar(pCfg._szHPProgressUrl[0]);
            this.m_ProgressHP.value = 100;
            this.m_UIContainer.addChild(this.m_ProgressHP);
            this.m_ProgressHP.pos(0,0);

            //名称标签
            this.m_TextName.font = pCfg._szFont;
            this.m_TextName.fontSize = pCfg._nFontSize;
            this.m_TextName.width =  CustomEntity.DefalutWidth * 2;
            this.m_TextName.align = "center";
            this.m_TextName.color = "#ffffff";
            this.m_TextName.pos(-CustomEntity.DefalutWidth / 2,this.m_ProgressHP.y + -pCfg._nFontSize - 10);
            this.m_UIContainer.addChild(this.m_TextName);
            this.m_UIContainer.zOrder = 1000;   //在最顶层
        }
        public GetAppearance():Laya.Sprite
        {
                return this.m_Appearance;
        }
        public Update(nCurrentTick:number):void
        {
          //  console.log("CustomEntity:Update_begin");
            super.Update(nCurrentTick);
           // console.log("CustomEntity:Update_end");
      
            //处理实体消息
            if(this.m_CharMsgList.length > 0)
            {
               let msg:ActorMessage = this.m_CharMsgList[0];
               this.DispatchActorMsg(msg);
               this.m_CharMsgList.splice(0,1);
            }
            //状态机处理，取下一个实体动作信息
            if(nCurrentTick >= this.m_nNextActionTime || this.m_ActionMsgList.length > 0)
            {
                //------------------------------------------------
                //神奇代码，勿动！！！！！
                //2017.10.8-01:11
                if(this.m_nAction == StandardActions.SA_WALK || this.m_nAction == StandardActions.SA_RUN)
                {
                    if(this.m_dwMoveStartTick > 0)
                    {
                       this.UpdateAimation(nCurrentTick);
                       return;
                    }
                }
                 //--------------------------------------------------
                let nAction:number = this.m_nAction;
                this.m_nAction = -1;
                if(this.m_ActionMsgList.length > 0)
                {
                    let msg:ActionMessage = this.m_ActionMsgList[0];
                    this.DispatchAcionMsg(msg);
                    this.m_ActionMsgList.splice(0,1);
                }
                if(this.m_nAction == -1)
                {
                    this.m_nAction = nAction;
                    this.SetToIdleAction();
                }
            }
            this.UpdateAimation(nCurrentTick);

            //更新挥砍特效
            for(let i:number = this.m_EffectList.length - 1;i > 0 ;i--)
            {
                let pAni:Common.Animation = this.m_EffectList[i];
                pAni.Update(nCurrentTick);
                if(pAni.parent == null)
                {
                    this.m_EffectList.splice(i,1);
                }
            }
           
        }
        
        public Destory():void
        {
            this.removeSelf();

            this.m_Appearance.removeSelf();

            this.m_UIContainer.removeSelf();
            this.m_UIContainer.destroy();
            this.m_UIContainer = null;

            this.m_ProgressHP.removeSelf();
            this.m_ProgressHP.destroy();
            this.m_ProgressHP = null;

            this.m_TextName.removeSelf();
            this.m_TextName.destroy();
            this.m_TextName = null;

           
            this.m_nModelAni.Destory();
            this.m_nModelAni = null;

            for(let i:number = 0;i < this.m_EffectList.length;i++)
            {
                let pAnimation:Common.Animation = this.m_EffectList[i];
                pAnimation.Destory();
            }
            this.m_EffectList = null;
        }

        protected UpdateAimation(nCurrentTick:number):void
        {
             this.m_nModelAni.Update(nCurrentTick);
        }
		/**
		 * 投递来自服务器的角色消息
		 * @param Ident
		 * @param Param
		 * @param Tag
		 * @param Series
		 * @param Data
		 * 
		 */
        public PostCharMessage(Ident:ActorMessages,Param:number,Tag:number,Series:number,Data:any = null):void
        {
            let msg:ActorMessage = new ActorMessage(Ident,Param,Tag,Series,Data);
            this.m_CharMsgList.push(msg);
        }

        //投递动作消息
        public PostActionMessage(nAction:number,Data:any):void
        {
            let msg:ActionMessage = new ActionMessage(nAction,Data);
            this.m_ActionMsgList.push(msg);
        }
        protected DispatchActorMsg(msg:ActorMessage):void
        {
            switch(msg._Ident)
            {
                case ActorMessages.AM_PROPERTY_CHANGE:  //实体属性被改变
                {
                    if(msg._Data == null)
                    {
                        break;
                    }
                    this.ChangePropertys(msg._Data as PropertySet);
                    break;
                }
                case ActorMessages.AM_DISAPPEAR: //实体消失
                {
                    this.m_boDisappeared = true;
                    break;
                }
            }
        }
        protected DispatchAcionMsg(msg:ActionMessage):void
        {
            switch(msg._nAction)
            {
                case StandardActions.SA_IDLE:
                {
                    this.SetAction(msg._nAction,this.GetDirection())
                    break;
                }
                case StandardActions.SA_WALK:
                {
                    
                    let data = msg._Data;
                    this.SetAction(StandardActions.SA_WALK,data.dir);
                    let Pos:Laya.Point = GameMap.CustomMap.CalcForwardPosition(data.x, data.y, data.dir, 1);
                    if(this.m_nCurrentX != data.x || this.m_nCurrentY != data.y)
                    {
                        this.SetCurrentXY(data.x,data.y);
                    }
                    this.MoveTo(Pos.x,Pos.y,this.GetMoveSpeed());
                    break;
                }
                case StandardActions.SA_RUN:
                {
                    let data = msg._Data;
                    this.SetAction(StandardActions.SA_RUN,data.dir);
                    let Pos:Laya.Point = GameMap.CustomMap.CalcForwardPosition(data.x, data.y, data.dir, 2);
                   if(this.m_nCurrentX != data.x || this.m_nCurrentY != data.y)
                    {
                        this.SetCurrentXY(data.x,data.y);
                    }
                    this.MoveTo(Pos.x,Pos.y,this.GetMoveSpeed());
                    break;
                }
                case StandardActions.SA_NORMHIT:
                {
                    let data = msg._Data;
                    this.SetAction(StandardActions.SA_NORMHIT,data.dir);
                    break;
                }
                case StandardActions.SA_DEATH:
                {
                    let data = msg._Data;
                    this.SetAction(StandardActions.SA_DEATH,data.dir);
                    break;
                }
                case StandardActions.SA_DIE:
                {
                    this.m_UIContainer.visible = false; //死亡后隐藏ui
                    let data = msg._Data;
                    this.SetAction(StandardActions.SA_DIE,data.dir);
                    break;
                }
                case StandardActions.SA_SPELL:
                {
                    let data = msg._Data;
                    this.SetAction(StandardActions.SA_SPELL,data.dir);
                    break;
                }
                
            }
        }
        public MoveTo(X: number, Y: number, speed:number = 0): void
        {
            super.MoveTo(X,Y,speed);
            this.SetDestXY(X,Y);
        }
        /**
		 * 依据当前角色的状态设置为空闲动作 
		 * 
		 */
		protected  SetToIdleAction(): void
        {
            if(this.IsDie())
            {
               this.SetAction(StandardActions.SA_DEATH,this.GetDirection());
            }
            else
            {
                 this.SetAction(StandardActions.SA_IDLE,this.GetDirection());
            }
           
        }
        protected ChangePropertys(propSet:PropertySet):void
        {
            let a = enPropEntity.PROP_ENTITY_DIR;
              let arr = propSet.GetPropertyToArray();
              for(let i:number = 0;i < arr.length;i++)
              {
                  let id:enPropEntity = parseInt(<string> arr[i].id) ;
                  let value = arr[i].value;
                 
                  this.UpdatePropertys(id,value);
                  this.m_PropSet.SetProperty(id,value);
              }
        }

        protected UpdatePropertys(id:enPropEntity,value):void
        {
            switch(id)
            {
                case enPropEntity.PROP_ENTITY_DIR:
                {
                    this.SetDirection(parseInt(value));
                    break;
                }
                case enPropEntity.PROP_ENTITY_MODELID:
                {
                    this.SetModelIndex(parseInt(value));
                    break;
                }
               case enPropEntity.PROP_CREATURE_MOVEONESLOTTIME:
               {
                   this.SetMoveSpeed(parseInt(value));
                   break;
               }
               case enPropEntity.PROP_CREATURE_HP:
               {
                    let nCurrentValue = this.m_PropSet.GetIntProperty(enPropEntity.PROP_CREATURE_HP);
                    let nNewValue = parseInt(value);
                    let nMaxValue = this.GetIntProperty(enPropEntity.PROP_CREATURE_MAXHP);
                     UI.DamageEff.GetInstance().MakeDamageEffect(this,nNewValue - nCurrentValue);
                    this.ChangeHpProgress(nNewValue,nMaxValue);
                    break;
               }
               case enPropEntity.PROP_CREATURE_MAXHP:
               {
                   let nNewValue = parseInt(value);
                   let nCurrentValue = this.GetIntProperty(enPropEntity.PROP_CREATURE_HP);
                    this.ChangeHpProgress(nCurrentValue,nNewValue);
                   break;
               }
            }

          
        }

        
        public GetModelIndex():number
        {
            return this.m_PropSet.GetIntProperty(enPropEntity.PROP_ENTITY_MODELID);
     
        }
        protected SetModelIndex(nModelIndex:number):void
        {

        }
        public GetEntityType():Entity.EntityType
        {
            return this.m_Type;
        }
        public GetEntityName():string
        {
            return this.m_sEntityName;
        }

        public SetEntityName(sName:string):void
        {
            this.m_sEntityName = sName;
            this.m_TextName.text = this.m_sEntityName;
        }

         public SetDirection(nDir:number):void
         {
             nDir = nDir % 8;
             if(this.GetDirection() != nDir)
             {
                 this.m_nDirection = nDir;
                 this.SetAction(this.m_nAction,this.m_nDirection);
             }
         }

         protected SetAction(nAction:number,nDir:number):void
         {
             this.m_nAction = nAction;
         }

         public GetModelAni():Common.Animation
         {
             return this.m_nModelAni;
         }

         public IsDie():boolean
         {
             return this.m_PropSet.GetIntProperty(enPropEntity.PROP_CREATURE_HP) == 0 ? true : false;
         }

         protected CheckNeedLoadBodyAction(nAction:number,isHuman:boolean = false):boolean
         {
             let part:number = StandardActions.GetSRPackageByAction(nAction,isHuman);
             let pack:Resources.SRPack = this.m_nModleActionPartPack[part];
             if(pack == null || pack.GetFrameCount() == 0)
             {
                 this.m_nModelAni.SetPack(null);
                
                 this.SetModelIndex(this.GetModelIndex());

                 pack = this.m_nModleActionPartPack[part];
                 if(pack != null && pack.GetFrameCount() > 0)
                 {
                     this.m_nModelAni.SetPack(pack);
                 }
                 return true;
             }
            
             this.m_nModelAni.SetPack(pack);
             return false;
         }
         public SetCurrentXY(X:number, Y:number):void
         {
             super.SetCurrentXY(X,Y);
             //遮挡透明
             this.AlphaAppearanceCurrentPoint(X,Y);
             this.SetDestXY(X,Y);

         }

         protected SetDestXY(nDestX:number,nDestY:number):void
         {
             this.m_nDestX = nDestX;
             this.m_nDestY = nDestY;
         }
         		/**
		 * 判断在当前点是否需要半透明身体 
		 * @param X
		 * @param Y
		 * 
		 */	
        protected AlphaAppearanceCurrentPoint(X:number,Y:number):void
        {
            switch(this.m_Type)
            {
                case Entity.EntityType.Human:
                case Entity.EntityType.Npc:
                case Entity.EntityType.Player:
                case Entity.EntityType.Monster:
                {
                    if(GameMap.CustomGameMap.GetInstance().Hidden(X,Y))
                    {
                        this.alpha = CustomEntity.Map_Hidden_Alpha;
                    }else
                    {
                        this.alpha = 1;
                    }
                    break;
                }

            }
        }	
        public GetIntProperty(propType:Entity.enPropEntity):number
        {
            return this.m_PropSet.GetIntProperty(propType);
        }
        private ChangeHpProgress(nHp:number,nMaxHp:number):void
        {
            // let hp:number = this.GetIntProperty(enPropEntity.PROP_CREATURE_HP);
            // let maxhp:number = this.GetIntProperty(enPropEntity.PROP_CREATURE_MAXHP);

            this.m_ProgressHP.value = nHp / nMaxHp;
           
        }

        public AddEffectById(nEffectId:number):void
        {
            let pStdEffect:Config.StdEffect = Config.ConfigManager.GetInstance().GetEffectConfig().GetEffectByID(nEffectId);
            if(pStdEffect != null)
            {
                this.AddEffect(pStdEffect._nID,pStdEffect._ShowPos,pStdEffect._Type,pStdEffect._nDuration);
            }
        }
        
        public AddEffect(nEffectId:number,showPos:Config.EffectShowPos,type:Config.EffectType,nDuration:number):void
        {
            let pEffect:Common.Animation =null;
            let pack = Resources.ResourcesManager._Instance.GetSkillEffectPackage(nEffectId);
            //特效并没有加载完成
            if(pack.GetFrameCount() <= 0)
            {
                return;
            }
           
            switch(type)
            {
                case Config.EffectType.meOnWeapon: //挥洒八方向特效
                {
                    let nFrameCount:number = pack.GetFrameCount() / 8;
                    let nStartFrame:number = nFrameCount * this.GetDirection();
                    let nEndFrame:number = nFrameCount * this.GetDirection() + nFrameCount;
                    pEffect = new Common.Animation(pack,nStartFrame,nEndFrame,0,1)
                   
                    break;
                }
                case Config.EffectType.meKeepOnBody:
                case Config.EffectType.meKeepOnFeet:   //脚下持续
                {
                    let nStartFrame:number = 0;
                    let nEndFrame:number = pack.GetFrameCount();
                    pEffect = new Common.Animation(pack,nStartFrame,nEndFrame,0,1)
                    break;
                }
            }
            if(pEffect != null)
            {
                this.addChild(pEffect);
                this.m_EffectList.push(pEffect);
            }

            let pStdEffect:Config.StdEffect = Config.ConfigManager.GetInstance().GetEffectConfig().GetEffectByID(nEffectId);
            if(pStdEffect != null && pStdEffect._nSoundId > 0)
            {
                SoundManager.GetInstance().PlayEffectSound(pStdEffect._nSoundId);
            }
        }

        public GetDistance(nPosX:number,nPosY:number):number
        {
            let nCurPosX:number = this.GetCurentX() - nPosX;
            let nCurPosY:number = this.GetCurrentY() - nPosY;
            let nDis:number = nCurPosX*nCurPosX + nCurPosY * nCurPosY;;
            return Math.sqrt(nDis);
        }
    }
}