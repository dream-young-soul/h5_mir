module Config
{
    export enum EffectType
    {
        meNone = 0, //无效果
        meFly = 3,      //飞行
        meExplode = 4,  //爆炸
        meKeepOnFeet = 5,   //脚下持续
        meKeepOnBody = 6,   //身上持续
        meOnWeapon = 7, //八方向挥洒特效
    } 

    export enum EffectShowPos
    {
        
        Entity = 1, //现在在实体身上
        Scene = 2,  //显示在屏幕
    }
    export class EffectConfig extends BaseConfig
    {
        private m_ArrEffect:Array<StdEffect> = null; 
        public Load(data):void
        {
            this.m_ArrEffect = new Array<StdEffect>();
            let pack:Net.Packet = new Net.Packet(data);
            let nCount:number = pack.ReadUByte();
            for(let i:number = 0;i < nCount;i++)
            {
                let pStdEff:StdEffect = new StdEffect();
                pStdEff.DeSerialize(pack);
                this.m_ArrEffect.push(pStdEff);
            }
        }

        public GetEffectByID(nEffectId:number):StdEffect
        {
            for(let i:number = 0;i < this.m_ArrEffect.length;i++)
            {
                if(this.m_ArrEffect[i]._nID == nEffectId)
                {
                    return this.m_ArrEffect[i];
                }
            }
            return null;
        }
    }
}