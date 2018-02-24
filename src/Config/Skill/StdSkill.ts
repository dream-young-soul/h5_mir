module Config
{
    export class StdSkill
    {
        public _nID:number = 0;        //技能id
        public  _szName:string = "";  //技能名称
        public  _szDesc:string ="";  //技能描述
        public  _nNeedJob:Vocation; //需要职业
        public _nAction:number = 0; //所需职业
        public _bLevel:number = 0;    //技能等级
        public SkillType:SkillType = SkillType.Normal;  //技能类型
        public _nRange:number = 0;   //攻击范围
        public _nDistance:number = 0;  //攻击距离
        public _nSpellEff:number = 0;  //施法特效
        public _nTargetEff:number = 0; //目标受击特效
        public AttackType:SkillAttackType = SkillAttackType.PHYSICAL_ATTACK; //攻击类型
        public CenterType:SkillCenterType = SkillCenterType.Pos;    //中心点类型
        public _nCD:number = 0; //冷却时间
        public _nNeedMp:number = 0; //需要蓝量
        public DeSerialize(pack:Net.Packet):void
        {
             this._nID = pack.ReadInt32();
            this._szName = pack.ReadCustomString();
            this._szDesc = pack.ReadCustomString();
            this._nNeedJob = <Vocation>pack.ReadUByte();
            this._nAction = pack.ReadUInt16();
            this._bLevel = pack.ReadUByte();
            this.SkillType = <SkillType>pack.ReadUByte();
            this._nRange = pack.ReadInt32();
            this._nDistance = pack.ReadInt32();
            this._nSpellEff = pack.ReadInt32();
            this._nTargetEff = pack.ReadInt32();
            this.AttackType = <SkillAttackType>pack.ReadUByte();
            this.CenterType = <SkillCenterType>pack.ReadUByte();
            this._nCD = pack.ReadUInt16();
  
        }
    }
}