module Entity
{
    export class Monster extends CustomEntity
    {
        constructor(handle:number)
        {
            super(handle);
            this.m_Type = EntityType.Monster;
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
            let pack:Resources.SRPack = Resources.ResourcesManager._Instance.GetMonsterPackage(bodyIndex + nPart);
            if(pack != null)
            {   
                this.m_nModleActionPartPack[nPart] = pack;
            }
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
             const is5dir:boolean = true;
              this.SetDirection(nDir);
             if(is5dir && nDir >= 5)
             {
                 nDir = 8 - nDir;
             }
				
            

             if(this.CheckNeedLoadBodyAction(nAction,true))
             {
                 return;
             }
             let actionAnimation:ActionAnimation = StdMonsterAction.GetDirActionByType(nAction);
             if(actionAnimation == null)
             {
                 return;
             }
             let nFrameCount:number = actionAnimation._nFrameCount;
             let nFrameStart:number = actionAnimation._nFrameStart + nDir * nFrameCount;
             let bodyFrameStart:number =  nDir * nFrameCount;
			 let dwActionTime = actionAnimation._nActionTime;
             //取消最后一帧停顿状态
              this.m_nModelAni.SetEndFramePasue(false);
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
                 case StandardActions.SA_HIT2:
                 case StandardActions.SA_HIT3:
                 {
                     dwActionTime = this.GetAttackSpeed();
                     break;
                 }
                case StandardActions.SA_DEATH:
				{
					nFrameStart =  actionAnimation._nFrameStart + nDir * nFrameCount + (actionAnimation._nFrameCount-1);
					nFrameCount = 1;
				}
                case StandardActions.SA_DIE:
                {
                    //死亡最后一帧停顿下来，然后触发sa_death状态，防止动画闪烁
                    this.m_nModelAni.SetEndFramePasue(true);
                    break;
                }
             }
             let dwInterval:number = dwActionTime / nFrameCount;
             if(bodyFrameStart != nFrameStart)
             {
                 bodyFrameStart = nFrameStart;
             }
             let nEndFrame:number = bodyFrameStart+nFrameCount;
             if(nOldAction != this.m_nAction || nOldDir != this.GetDirection() || 
                bodyFrameStart != this.m_nModelAni.GetStartFrame() || this.m_nModelAni.GetEndFrame() != nEndFrame)
              {
                this.m_nModelAni.SetStartFrame(bodyFrameStart);
                this.m_nModelAni.SetEndFrame(nEndFrame);
                this.m_nModelAni.SetFrameRate(dwInterval);
                this.m_nModelAni.SetCurrentFrame(bodyFrameStart);
                this.m_nModelAni.scaleX = (this.GetDirection() <= 4) && is5dir ? 1 : -1;
             }
             
             if(this.m_nAction != StandardActions.SA_IDLE && this.m_nAction != StandardActions.SA_DEATH)
             {
                 this.m_nNextActionTime = Config.GlobalConfig.s_dwUpdateTick+ dwActionTime;
             }
            
          
             super.SetAction(nAction,nDir);
         }
         public GetAttackSpeed():number
         {
             return this.m_PropSet.GetIntProperty(Entity.enPropEntity.PROP_CREATURE_ATTACK_SPEED);
         }
        
    }
}