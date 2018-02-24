module Config
{
    export class StdEffect
    {
       public  _nID:number = 0;    //特效id
        public _ShowPos:EffectShowPos = EffectShowPos.Entity ;  //特效显示位置
        public _Type:EffectType = EffectType.meNone;
        public _nDuration:number = 0;      //显示类型
        public _nSoundId:number = 0;    //特效id
         public DeSerialize(pack:Net.Packet):void
         {
             this._nID = pack.ReadInt32();
             this._ShowPos = <EffectShowPos> pack.ReadUByte();
             this._Type = <EffectType> pack.ReadUByte();
             this._nDuration = pack.ReadInt32();
             this._nSoundId = pack.ReadInt32();
         }
    }
}