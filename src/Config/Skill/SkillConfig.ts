module Config
{
    export enum SkillType
    {
        Normal = 0,
        SingleAttack = 1, //单体攻击
        GroupAttack = 2,    //群体攻击
        KaiTianZhan = 3,    //开天斩
        YeManChongZhuang = 4,   //野蛮冲撞
        Track = 6,          //连击技能
    }

    export enum SkillAttackType
    {
        
        PHYSICAL_ATTACK = 0,    //物理攻击
        MAGIC_ATTACK = 1,       //魔法攻击
        WIZARD_ATTACK = 2,       //道术攻击
    }

    export enum SkillCenterType
    {
        Self = 1,//以自身为中心
        Pos = 2,    //以鼠标点为中心
    }
    export class SkillConfig extends BaseConfig
    {
        private m_ArrSkill:Array<StdSkill>;
        public Load(data):void
        {
            this.m_ArrSkill = new Array<StdSkill>();
            let pack:Net.Packet = new Net.Packet(data);
            let nCount:number = pack.ReadUByte();

            for(let i:number = 0;i < nCount;i++)
            {
                let nSkillLevel:number =pack.ReadUByte();
                for(let j:number = 0;j < nSkillLevel;j++)
                {
                    let pStdSkill:StdSkill = new StdSkill();
                    pStdSkill.DeSerialize(pack);
                    this.m_ArrSkill.push(pStdSkill);
                }
            }
          
        }

        public GetStdSkillByID(nSkillId:number,nLevel:number):StdSkill
        {
            for(let i:number = 0;i < this.m_ArrSkill.length;i++)
            {
                let pStdSkill:StdSkill = this.m_ArrSkill[i];
                if(pStdSkill._nID == nSkillId && pStdSkill._bLevel == nLevel)
                {return pStdSkill;}
            }
            return null;
        }
    }
}