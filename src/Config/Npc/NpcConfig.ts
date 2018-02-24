module Config
{
    export class NpcConfig extends BaseConfig
    {
        private m_ArrNpc:Array<StdNpc>;
        public Load(data):void
        {
            this.m_ArrNpc = new Array<StdNpc>();
            let pack:Net.Packet = new Net.Packet(data);
            let nCount:number = pack.ReadInt32();
            for(let i:number = 0;i < nCount;i++)
            {
                let pStdNpc:StdNpc = new StdNpc();
                pStdNpc.DeSerialize(pack);
                this.m_ArrNpc.push(pStdNpc);
            }
        }

        public GetMapAllNpc(nMapId:number):Array<StdNpc>
        {
            let ret:Array<StdNpc> = new Array<StdNpc>();

            for(let i:number =0;i < this.m_ArrNpc.length;i++)
            {
                if(this.m_ArrNpc[i]._nMapID == nMapId)
                {
                    ret.push(this.m_ArrNpc[i]);
                }
            }
            return ret;
        }

        public GetMapNpcByXY(nMapId:number,nX:number,nY:number):StdNpc
        {
            for(let i:number = 0;i < this.m_ArrNpc.length;i++)
            {
                let pStdNpc:StdNpc = this.m_ArrNpc[i];
                if(pStdNpc._nMapID == nMapId && nX == pStdNpc._nX && nY == pStdNpc._nY)
                {
                    return pStdNpc;
                }
            }
            return null;
        }
    }
}