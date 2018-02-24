module Config
{
    export class UserSkillInfo
    {
        public  _nSkillID:number = 0;    //技能id
        public _bLevel:number = 0;            //技能等级
        public _nMiJIID:number = 0;     //秘籍id
        public _nTick:number = 0;  //冷却时间
        public _nExp:number = 0;       //经验
        public _nMiJITime:number = 0; //秘籍过期时间
        public _bClose:number = 0;    //是否停用
       
       //客户端用
        public _nUseCD:number = 0;
        public DeSerialize(pack:Net.Packet):void
        {
            this._nSkillID = pack.ReadUInt16();
            this._bLevel = pack.ReadUByte();
            this._nMiJIID = pack.ReadUInt16();
            this._nTick = pack.ReadInt32();
            this._nExp = pack.ReadInt32();
            this._nMiJITime = pack.ReadUInt32();
            this._bClose = pack.ReadUByte();

        } 
    }
}