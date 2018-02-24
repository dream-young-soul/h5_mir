
module Entity
{
    export class Human extends CustomEntity
    {
                /**
		 * 角色在攻击之后需要停留一段时间，此事件称为反映时间，即为角色两次攻击之间的间隔时间
		 * 若停留期间内有来自服务器的消息则会处理服务器的消息否则在停留超过AttackPuase时间后则会调整为空闲动作
		 * 在LocalPlayer类中进行本地控制处理的时候会判断AttackPuase的值，若处于攻击后的等待时间中则暂时不处理本地操作的控制
		 * 此值为-1表示等待设定攻击停留时间，为0表示不处于攻击停留状态，否则表示攻击停留的具体时间
		**/
        protected m_nEndAttackPause:number = tagAttackPause.Idle;
        		/**
		 * 自动完成攻击停留的时间。当m_nEndAttackPause到期，则AttackPause结束，但为了更好呈现其他玩家连续攻击的动作连贯性，
		 * 避免进入IDLE动作再发起攻击而引起的动作不协调问题，同时在进行最后一下攻击后能够以准备动作多保持一段时间，在设置为攻击
		 * 停留动作的时候会设置此值为2秒或更长，在此时间到期后才将角色设置为IDLE动作。
		 **/
		protected  m_nCompleteAttackPause: number = 0;

        protected m_WeaponModleActionPartPack:Resources.SRPack[] =[]; //武器动作部件资源包
        protected m_WeaponModelAni:Common.Animation = new Common.Animation(null,0,0,0,-1);   //角色武器动画
        protected m_ShadowModelAni:Common.Animation = new Common.Animation(null,0,0,0,-1);  //角色影子动画
        protected m_ShadowModlePack:Resources.SRPack ; //影子动作部件资源包
        constructor(handle:number)
        {
            super(handle);
            this.m_Type = EntityType.Human;
            this.m_Appearance.addChild(this.m_WeaponModelAni);
            this.m_Appearance.addChild(this.m_ShadowModelAni);
        }

        protected SetWeaponModelIndex(nWeaponModelIndex:number):void
        {
            if(nWeaponModelIndex <= 0)
            {
                return;
            }
            if(this.GetWeaponModelIndex() != nWeaponModelIndex)
            {
                this.m_WeaponModleActionPartPack = [];
            }
            nWeaponModelIndex = nWeaponModelIndex * 100;
            let nPart:number  = StandardActions.GetSRPackageByAction(this.m_nAction,true);
            let pack:Resources.SRPack = Resources.ResourcesManager._Instance.GetWeaponPackage(nWeaponModelIndex + nPart,this.GetSex());
             if(pack != null)
            {
                this.m_WeaponModleActionPartPack[nPart] = pack;
            }
        }

        public GetSex():number
        {
            return this.m_PropSet.GetIntProperty(enPropEntity.PROP_ACTOR_SEX);
        }
        public GetWeaponModelIndex():number
        {
            return this.m_PropSet.GetIntProperty(enPropEntity.PROP_ACTOR_WEAPONAPPEARANCE);
        }
        protected SetModelIndex(nModelIndex:number):void
        {
            if(nModelIndex < 0 )
            {
                return;
            }
            if(this.GetModelIndex() != nModelIndex)
            {
                this.m_nModleActionPartPack = [];
            }
            
            let bodyIndex:number = nModelIndex * 100;
            let nPart:number  = StandardActions.GetSRPackageByAction(this.m_nAction,true);
            let pack:Resources.SRPack = Resources.ResourcesManager._Instance.GetHumanPackage(bodyIndex + nPart);
            if(pack != null)
            {
                this.m_nModleActionPartPack[nPart] = pack;
            }
        }
        protected CheckNeedLoadBodyAction(nAction:number,isHuman:boolean = false):boolean
        {
            let ret:boolean = super.CheckNeedLoadBodyAction(nAction,true);
            //加载武器
            if(this.GetWeaponModelIndex() > 0)
            {
                 this.CheckNeedWeaponAction(nAction,true);
            }
            this.CheckNeedShadowAction(nAction,true);
            return ret;
        }
        protected CheckNeedShadowAction(nAction:number,isHuman:boolean = false):boolean
        {

             if(this.m_ShadowModlePack == null )
             {
                 this.m_ShadowModelAni.SetPack(null);
                 let pack:Resources.SRPack = Resources.ResourcesManager._Instance.GetHumanShadowPackage( this.GetSex());
                 if(pack != null)
                 {
                     this.m_ShadowModlePack = pack
                 }
                 
                 if(pack != null && pack.GetFrameCount() > 0)
                 {
                     this.m_ShadowModelAni.SetPack(pack);
                 }
                 return true;
             }
             if(this.m_ShadowModelAni.GetPack() != this.m_ShadowModlePack)
             {
                this.m_ShadowModelAni.SetPack(this.m_ShadowModlePack);
             }
             
             return false;
        }
         protected CheckNeedWeaponAction(nAction:number,isHuman:boolean = false):boolean
         {
             let part:number = StandardActions.GetSRPackageByAction(nAction,isHuman);
             let pack:Resources.SRPack = this.m_WeaponModleActionPartPack[part];
             if(pack == null || pack.GetFrameCount() == 0)
             {
                 this.m_WeaponModelAni.SetPack(null);
                 this.SetWeaponModelIndex(this.GetWeaponModelIndex());

                 pack = this.m_WeaponModleActionPartPack[part];
                 if(pack != null && pack.GetFrameCount() > 0)
                 {
                     this.m_WeaponModelAni.SetPack(pack);
                 }
                 return true;
             }
             this.m_WeaponModelAni.SetPack(pack);
             return false;
         }
         protected UpdateAimation(nCurrentTick:number):void
         {
             super.UpdateAimation(nCurrentTick);
             if(this.GetWeaponModelIndex() > 0)
             {
                 this.m_WeaponModelAni.Update(nCurrentTick);
             }
             this.m_ShadowModelAni.Update(nCurrentTick);
         }
   
         protected SetAction(nAction:number,nDir:number):void
         {
             if(nAction < 0)
             {
                 nAction = 0;
             }
             
             let nOldAction:number = nAction;
             let nOldDir:number = this.GetDirection();
             this.m_nAction = nAction;
             this.SetDirection(nDir);

             if(this.CheckNeedLoadBodyAction(nAction,true))
             {
                 return;
             }
             let actionAnimation:ActionAnimation = HumanAction.GetDirActionByType(nAction);
             if(actionAnimation == null)
             {
                 throw new Error("Human Get Action Error!"+nAction);
                
             }
             let nFrameCount:number = actionAnimation._nFrameCount;
             let nFrameStart:number = actionAnimation._nFrameStart + nDir * nFrameCount;
             let bodyFrameStart:number =  nDir * nFrameCount;
			 let dwActionTime = actionAnimation._nActionTime;
             
             switch(nAction)
             {
                 case StandardActions.SA_WALK:
                 case StandardActions.SA_RUN:
                 {
                     dwActionTime = this.GetMoveSpeed();
                     break;
                 }
                 case StandardActions.SA_IDLE: //空闲状态
                 {
                     break;
                 }
                 case StandardActions.SA_NORMHIT:
                 case StandardActions.SA_HIT1:
                 {
                     this.m_nEndAttackPause = -1;   //攻击动作停顿
                     
                     break;
                 }
                 case StandardActions.SA_READY_ATTACK: //攻击停顿
                 {
                     nFrameCount = 1;
                     dwActionTime = Config.GlobalConfig.HITPAUSETIME;
                     break;
                 }
                 case StandardActions.SA_SPELL: //技能攻击
                 {
                     this.m_nEndAttackPause = -1;   //施法动作停顿
                     break;
                 }
             }
             let dwInterval:number = dwActionTime / nFrameCount;
             let nEndFrame:number = bodyFrameStart+nFrameCount;
             if(nOldAction != this.m_nAction || nOldDir != this.GetDirection() || 
                bodyFrameStart != this.m_nModelAni.GetStartFrame() || this.m_nModelAni.GetEndFrame() != nEndFrame)
              {
                this.m_nModelAni.SetStartFrame(bodyFrameStart);
                this.m_nModelAni.SetEndFrame(nEndFrame);
                this.m_nModelAni.SetFrameRate(dwInterval);
                this.m_nModelAni.SetCurrentFrame(bodyFrameStart);
             }
             //更新武器动画
             
             if(nOldAction != this.m_nAction || nOldDir != this.GetDirection() || 
                bodyFrameStart != this.m_WeaponModelAni.GetStartFrame() || this.m_WeaponModelAni.GetEndFrame() != nEndFrame)
              {
                this.m_WeaponModelAni.SetStartFrame(bodyFrameStart);
                this.m_WeaponModelAni.SetEndFrame(nEndFrame);
                this.m_WeaponModelAni.SetFrameRate(dwInterval);
                this.m_WeaponModelAni.SetCurrentFrame(bodyFrameStart);
             }
             //更新影子动画
             
              if(nOldAction != this.m_nAction || nOldDir != this.GetDirection() || 
                bodyFrameStart != this.m_ShadowModelAni.GetStartFrame() || this.m_ShadowModelAni.GetEndFrame() != nEndFrame)
              {
                this.m_ShadowModelAni.SetStartFrame(nFrameStart);
                this.m_ShadowModelAni.SetEndFrame(nFrameStart + nEndFrame);
                this.m_ShadowModelAni.SetFrameRate(dwInterval);
                this.m_ShadowModelAni.SetCurrentFrame(nFrameStart);
             }
             if(this.m_nAction != StandardActions.SA_IDLE && this.m_nAction != StandardActions.SA_DEATH)
             {
                 this.m_nNextActionTime = Config.GlobalConfig.s_dwUpdateTick+ dwActionTime;
             }
             this.SwitchDirIndex();
            // console.log("下一次时间:"+dwActionTime)
             super.SetAction(nAction,nDir);
         }
          protected UpdatePropertys(id:enPropEntity,value):void
          {
              super.UpdatePropertys(id,value);
              switch(id)
              {
                  case enPropEntity.PROP_ACTOR_WEAPONAPPEARANCE:
                  {
                      this.SetWeaponModelIndex(parseInt(value));
                      break;
                  }
              }
          }
          //更换武器和衣服的Z轴顺序
          protected SwitchDirIndex():void
          {
              let DirLayerList:Common.Animation[] =[];
              switch(this.GetDirection())
              {
                    case 0:
                    case 6:
                    case 7:
                    case 5:
                    {
                        DirLayerList.push(this.m_ShadowModelAni);
                        DirLayerList.push(this.m_WeaponModelAni);
                        DirLayerList.push(this.m_nModelAni);
                        break;
                    }
                    case 1:
                    {                    
                        DirLayerList.push(this.m_ShadowModelAni); 
                        DirLayerList.push(this.m_nModelAni);
                        DirLayerList.push(this.m_WeaponModelAni);
                        break;
                    }
                    case 2:
                    {
                        let type:number = StandardActions.GetSRPackageByAction(this.m_nAction,true);
                        
                        if(type == StandardActions.AP_CARRIER_IDLE || type == StandardActions.AP_WALK ||
                            type == StandardActions.AP_ATTACK || type == StandardActions.AP_RUN)
                        {
                            DirLayerList.push(this.m_ShadowModelAni);
                            DirLayerList.push(this.m_nModelAni);
                            DirLayerList.push(this.m_WeaponModelAni);
                        }
                        break;
                    }
                    case 3:
                    case 4:
                    {
                        DirLayerList.push(this.m_ShadowModelAni);
                        DirLayerList.push(this.m_nModelAni);
                        DirLayerList.push(this.m_WeaponModelAni);
                        break;
                    }

            
              }
              for(let i:number= 0;i < DirLayerList.length;i++)
              {
                  DirLayerList[i].zOrder = i + 1;
              }
          }

          public GetJob():Config.Vocation
          {
              return <Config.Vocation>this.GetIntProperty(enPropEntity.PROP_ACTOR_VOCATION);
          }
          protected  SetToIdleAction(): void
          {
              if(this.m_nEndAttackPause == 0)
              {
                    if(!this.IsDie())
                    {
                        // if(this.m_nAction != StandardActions.SA_IDLE)
                        {
                            this.SetAction(StandardActions.SA_IDLE,this.GetDirection());
                        }
                    }
                   
              }
              //检查攻击停留的超时，主要用于允许主角的下一次本地逻辑控制
              else if(this.m_nEndAttackPause > 0 && Config.GlobalConfig.s_dwUpdateTick >= this.m_nEndAttackPause)
              {
                  this.m_nEndAttackPause = 0;
              }
              //等待设置为攻击停留
              else if(this.m_nEndAttackPause == -1)
              {
                  this.SetToReadyAction(StandardActions.SA_READY_ATTACK);
              }
              //施法停留
                else if (this.m_nEndAttackPause == -3 )
                {
                    this.SetToReadyAction(StandardActions.SA_PREPARESKILL);
                }
          }
         /**
		 * 设置为攻击、采集后的停留动作 
		 * 
		 */
		protected  SetToReadyAction(nAction: number): void
        {
            switch(nAction)
            {
                case StandardActions.SA_PREPARESKILL:
                {
                    nAction = StandardActions.SA_READY_ATTACK;
                  
                    break;
                }
                case StandardActions.SA_READY_ATTACK:
                {
                    nAction = StandardActions.SA_READY_ATTACK;
                    break;
                }
            }
              this.m_nEndAttackPause = Config.GlobalConfig.s_dwUpdateTick + Config.GlobalConfig.HITPAUSETIME;
              this.SetAction(nAction,this.GetDirection());
        }
    }
}