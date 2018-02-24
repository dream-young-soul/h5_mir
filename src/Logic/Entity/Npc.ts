/**
 * npc实体类
 * @author 后天 2017.9.30
 */

module Entity
{
    export class Npc extends CustomEntity
    {
        constructor(handle:number)
        {
            super(handle);
            this.m_Type = Entity.EntityType.Npc;
            this.m_ProgressHP.visible = false; //npc是没有血量的
        }

        public Update(nCurrentTick:number):void
        {
            if( this.m_nModleActionPartPack[StandardActions.AP_IDLE] != null &&
                this.m_nModelAni.GetEndFrame() == 0 && 
                this.m_nModleActionPartPack[StandardActions.AP_IDLE].GetFrameCount() > 0 )
            {
                this.m_nModelAni.SetEndFrame(this.m_nModleActionPartPack[StandardActions.AP_IDLE] .GetFrameCount());
            }
            super.Update(nCurrentTick);

        }
        protected SetModelIndex(nModelIndex:number):void
        {
            if(this.GetModelIndex() != nModelIndex && nModelIndex > 0)
            {
               
                this.m_nModleActionPartPack[StandardActions.AP_IDLE]  = Resources.ResourcesManager._Instance.GetNpcPack(nModelIndex);
                this.m_nModelAni.SetPack(this.m_nModleActionPartPack[StandardActions.AP_IDLE] );
                this.m_nModelAni.SetCurrentFrame(0);
                this.m_nModelAni.SetFrameRate(100);
                this.m_nModelAni.SetStartFrame(0);
                this.m_nModelAni.SetEndFrame(this.m_nModleActionPartPack[StandardActions.AP_IDLE] .GetFrameCount());
            }
        }
        //NPC是不死的
        public IsDie():boolean
        {
            return false;
        }
    }
}