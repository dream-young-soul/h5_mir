module Config
{
    export class StdNpc
    {
        public _nID:number = 0;  //NPCID
        public _szName:string = "";  //NPC名称
        public  _nMapID:number = 0;     //所在地图ID
        public  _nX:number = 0;     //所在地图X
        public  _nY:number = 0;     //所在地图Y
        public  _nDir:number = 0;   //方向
        public DeSerialize(pack:Net.Packet):void
        {
            this._nID = pack.ReadInt32();
            this._szName = pack.ReadCustomString();
            this._nMapID = pack.ReadInt32();
            this._nX = pack.ReadInt32();
            this._nY = pack.ReadInt32();
            this._nDir = pack.ReadUByte();
        }
    }
}