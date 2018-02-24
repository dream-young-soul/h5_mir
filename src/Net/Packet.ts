module Net
{
    export class Packet  
    {
        private m_Byte:Laya.Byte;
        constructor(data = null)
        {
            this.m_Byte = new Laya.Byte();
            this.m_Byte.endian = "littleEndian";
            if(data != null)
            {
                this.m_Byte.writeArrayBuffer(data);
                this.m_Byte.pos = 0;
            }
        }

        public WriteCmd(nSysId:number,nCmdId:number):void
        {
            this.m_Byte.writeByte(nSysId);
            this.m_Byte.writeByte(nCmdId);
        }

        public WriteCustomString(str:string):void
        {
            this.m_Byte.writeUTFString(str);
            this.m_Byte.writeByte(0);
        }


        public ReadCustomString():string
        {
            let ret:string = this.m_Byte.readUTFString();
            this.m_Byte.readByte();
            return ret;
        }

        public ReadInt64():number
        {
            let ret:number= <number>(this.m_Byte.getFloat64());
            return ret;
        }

        public WriteDouble(value:number):void
        {
            this.m_Byte.writeFloat64(value);
        }
        public WriteInt32(value:number):void
        {
            this.m_Byte.writeInt32(value);
        }
        public ReadInt32():number
        {
            return this.m_Byte.getInt32();
        }
        public WriteUInt32(value:number):void
        {
            this.m_Byte.writeUint32(value);
        }

        public ReadUInt32():number
        {
            return this.m_Byte.getUint32();
        }

        public WriteInt16(value:number):void
        {
            this.m_Byte.writeInt16(value);
        }
        public ReadInt16():number
        {
            return this.m_Byte.getInt16();
        }
        public WriteUInt16(value:number):void
        {
            this.m_Byte.writeUint16(value);
        }
        public ReadUInt64():number
        {
            return this.m_Byte.getUint16();
        }
        public ReadUInt16():number
        {
            return this.m_Byte.getUint16();
        }
        public ReadDouble():number
        {
            return this.m_Byte.getFloat64();
        }
        public ReadBoolean():boolean
        {
            return this.m_Byte.getUint8() == 1 ? true : false;
        }
        public WriteBoolean(value:boolean):void
        {
            this.m_Byte.writeUint8(value == true ? 1 : 0);
        }
        public ReadFloat():number
        {
            return this.m_Byte.getFloat32();
        }
        public WriteFloat(value:number):void
        {
            this.m_Byte.writeFloat32(value);
        }
        public WriteByte(value:number):void
        {
            this.m_Byte.writeByte(value);
        }
        public ReadByte():number
        {
            return this.m_Byte.readByte();
        }

        public WriteUByte(value:number):void
        {
            this.m_Byte.writeUint8(value);
        }
        public ReadUByte():number
        {
            return this.m_Byte.getUint8();
        }

        public GetBuffer():ArrayBuffer
        {
            return this.m_Byte.__getBuffer();
        }

        public Clear(pos:number = 0):void
        {
            this.m_Byte.clear();
            this.m_Byte.pos = pos;
        }
        public GetPos():number
        {
            return this.m_Byte.pos;
        }
        public SetPos(value:number):void
        {
            this.m_Byte.pos = value;
        }
    }
}