module Config
{
    export class UserItem
    {
        public static readonly  MaxItemHole:number = 5;  //物品的最大镶嵌槽
        public static readonly MaxSmithAttrCount:number = 3;    //最大精锻属性个数
        public static readonly ACTOR_NAME_BUFF_LENGTH:number = 33;  //最大名称数量
        public  _Series:number = 0;  //道具唯一序列号
        public  _wItemId:number = 0; //对应的标准物品ID
        public _btQuality:number = 0; //物品的品质等级
        public _btStrong:number = 0;      //物品的强化等级
        public  _btStrongLimit:number = 0; //物品的当前强化等级上限
        public _wDura:number = 0;       //物品耐久度
        public _wDuraMax:number = 0;    //物品的耐久度上限
        public _btHoles:Array<number> = new Array<number>(); //物品的镶嵌槽列表
        public  _btReserve1:number = 0;    //保留1
        public _wInsureTimes:number = 0;    //装备投保次数
        public _Time:number = 0;          //物品的使用时间
        public _smithAttrs:Array<number> = new Array<number>();    //精锻属性表
        public _initAttrs:number = 0;      //初始化属性
        public _btCount:number = 0;       //此物品的数量，默认为1，当多个物品堆叠在一起的时候此值表示此沓物品的数量
	    public _btFlag:number = 0;        //物品标志，使用比特位标志物品的标志，例如绑定否
	    public _btLuck:number = 0;        //动态的幸运值或者诅咒值,祝福油加幸运，杀人减幸运
		public  _btSmithCount:number = 0;    //精锻度
        public _btDeportId:number = 0;         //装备穿戴的位置
        public _btHandPos:number = 0;          //是左右还是右手
        public _btSharp:number = 0;           //锋利值
        public _btCircleForge:number = 0;     
	    public _wTypeValue:number = 0;      //物品使用的冻结时间或者使用次数
	    public _nAppraisal:number = 0;       //物品的血炼等级
        public _btTheBestLevel:number = 0;    //极品等级
	    public _nSceneTag:number = 0;          ////低十六位为场景id 高十六位为怪物id
	    public _sActorName:string = "";      //道具第一次拥有者
	    public _btTaoStrong:number = 0;       //道士宝宝强化点
        public _nRealInjury:number = 0;       //	对实体造成的真实伤害
        public _btReserve:number = 0;         //用于追踪内存的使用，防止内存2次释放

        public DeSerialize(pack:Net.Packet):void
        {
            this._Series = pack.ReadDouble();
            this._wItemId = pack.ReadInt32();
            this._btQuality = pack.ReadUByte();
            this._btStrong = pack.ReadUByte();
            this._btStrongLimit = pack.ReadUByte();
            this._wDura = pack.ReadUInt16();
            this._wDuraMax = pack.ReadUInt16();
            for(let i:number = 0;i < UserItem.MaxItemHole;i++)
            {
                this._btHoles.push(pack.ReadUByte());
            }
            this._btReserve1 = pack.ReadUByte();
            this._wInsureTimes = pack.ReadUInt16();
            this._Time = pack.ReadUInt32();
            for(let i:number = 0;i < UserItem.MaxSmithAttrCount;i++)
            {
                this._smithAttrs.push(pack.ReadInt32());
            }
            this._initAttrs = pack.ReadInt32();
            this._btCount = pack.ReadUByte();
            this._btFlag =  pack.ReadUByte();
            this._btLuck = pack.ReadUByte();
            this._btSmithCount = pack.ReadUInt16();
            this._btDeportId = pack.ReadUByte();
            this._btHandPos = pack.ReadByte();
            this._btSharp = pack.ReadByte();
            this._btCircleForge = pack.ReadByte();
            this._wTypeValue = pack.ReadUInt16();
            this._nAppraisal = pack.ReadUInt32();
            this._btTheBestLevel = pack.ReadByte();
            this._nSceneTag = pack.ReadUInt32();
            this._sActorName = pack.ReadCustomString();
            this._btTaoStrong = pack.ReadByte();
            this._nRealInjury = pack.ReadUInt32();
            this._btReserve = pack.ReadByte();
        }
    }
}