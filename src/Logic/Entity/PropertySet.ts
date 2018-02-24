/*
*   实体属性集合
*   @author 后天
*/

module Entity
{
    export class PropertySet
    {
        private m_ArrProp = [];
        constructor()
        {

        }
        public Clear():void
        {
            this.m_ArrProp = [];
        }
        public SetProperty(propType:Entity.enPropEntity,value):void
        {
            this.m_ArrProp[propType] = value;
        }

        public GetIntProperty(propType:Entity.enPropEntity):number
        {
            if(this.m_ArrProp[propType] == null)
            {
                return 0;
            }
            return parseInt(this.m_ArrProp[propType].toString() );
        }

        public GetProperty(propType:Entity.enPropEntity):any
        {
            if(this.m_ArrProp[propType] == null)
            {
                return 0;
            }
            return this.m_ArrProp[propType];
        }

        public GetPropertyToArray():any
        {
            let ret = [];
            for(let i in this.m_ArrProp)
            {
                ret.push({id:i,value:this.m_ArrProp[i]});
            }
            return ret;
        }
        public ReadMultiProperty(nCount:number, pack:Net.Packet):void 
        {
            for(let i:number = 0;i < nCount;i++)
            {
                let propId:number = pack.ReadUByte();
                this.ReadProperty(propId, pack);
            }
        }
        public ReadProperty(propId:number,pack:Net.Packet):void
        {
            let type:PropertyDataType = ActorProperties.GetDataType(propId);
            switch(type)
            {
                      case PropertyDataType.DOUBLE:
                    {
                        this.m_ArrProp[propId] = pack.ReadDouble();
                        break;
                    }
                case PropertyDataType.FLOAT:
                    {
                        this.m_ArrProp[propId] = pack.ReadFloat();
                        break;
                    }
                case PropertyDataType.INT:
                    {
                        this.m_ArrProp[propId] = pack.ReadInt32();
                        break;
                    }
                case PropertyDataType.STRING:
                    {
                        this.m_ArrProp[propId] = pack.ReadCustomString();
                        break;
                    }
                case PropertyDataType.UINT:
                    {
                        this.m_ArrProp[propId] = pack.ReadUInt32();
                        break;
                    }
                default:
                    {
                        throw new Error("ReadProperty error normal type" + type.toString());
                    }
            }
        }
    }
}