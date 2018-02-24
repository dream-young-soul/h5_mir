/*
*动画资源包解析
* @author 2017.9.28 21:59
*/

module Resources
{
    export class SRPack
    {
        
        private static readonly VERSION:number = 0x11111111;
        private static readonly DATASIZEKEY:number = 0x20070F0F;
        private m_sFile:string = "";
        private m_bLoadFlag:boolean = false;    //是否正在加载标记
        private m_ArrItem:SRPackItem[] = [];
        constructor()
        {
            
        }
        public Destory():void
        {
            for(let i:number = 0;i < this.m_ArrItem.length;i++)
            {
                let pItem:SRPackItem = this.m_ArrItem[i];
                pItem.Destory();
            }
            this.m_sFile = "";
            this.m_ArrItem = [];
        }

        public SetLoadFlag(flag:boolean):void
        {
            this.m_bLoadFlag = flag;
        }

        public GetLoadFlag():boolean
        {
            return this.m_bLoadFlag;
        }
        public Load(sFile:string,bytes:Laya.Byte):boolean
        {
            this.m_ArrItem = [];
            this.m_sFile = sFile;
            bytes.endian = "littleEndian";
            let nVersion:number = bytes.getUint32();
            if(nVersion != SRPack.VERSION)
            {
                Common.MirLog.Log(Common.MirLogType.Error,"版本号不匹配"+nVersion+"file:"+this.m_sFile);
                return false;
            }
            let nLen:number = bytes.getByte();
            bytes.pos += nLen;
            const base:Base64 = new Base64();
            let nCount:number = bytes.getUint32();
            let pItem:SRPackItem  = null;
            for(let i:number = 0;i < nCount;i++)
            {
                pItem = new SRPackItem();
                pItem._nOffset = bytes.getUint32();
                pItem._nDataSize = bytes.getUint32() ^ SRPack.DATASIZEKEY;
                this.m_ArrItem.push(pItem) ;
            }
            let data:Laya.Byte = new Laya.Byte();
            data.endian = bytes.endian;
            
            for(let i:number = 0;i < nCount;i++)
            {
                pItem = this.m_ArrItem[i];
                bytes.pos = pItem._nOffset;
                data.clear();
                data.pos = 0;
                let arrBuffer:ArrayBuffer =null;
                data.writeArrayBuffer(bytes.__getBuffer(),bytes.pos,pItem._nDataSize);
                arrBuffer = data.__getBuffer();
                //最后一个文件不创建纹理最后一个为所有图片的偏移文件
                if(i != nCount - 1)
                {
                    let str:string = base.encode(arrBuffer);
                    str = "data:image/png;base64,"+str;
                    pItem._Data = str;
                    //取图片宽度和高度
                    let uint8Buff:Uint8Array = data.getUint8Array(0,arrBuffer.byteLength)
                    let nWidth=uint8Buff[18]*256+uint8Buff[19];
	                let nHeight=uint8Buff[22]*256+uint8Buff[23];
                    pItem._nWidth = nWidth;
                    pItem._nHeight = nHeight;
                }else
                {
                    pItem._Data = arrBuffer;
                }
            }
            //最后一个为所有图片的偏移文件
            pItem = this.m_ArrItem.pop();
            data.clear();
            data.pos = 0;
            data.writeArrayBuffer(pItem._Data,0,pItem._nDataSize);
            data.pos = 0;
            for(let i:number = 0;i < this.m_ArrItem.length;i++)
            {
                 pItem = this.m_ArrItem[i];
                 let x:number = data.getInt16();
                 let y:number = data.getInt16();
                 pItem._nOffsetPoint.x = x;
                 pItem._nOffsetPoint.y = y;
                 //预先初始化一个精灵--防止动画闪烁2017.10.5
                 pItem.GetSprite(); //预初始化精灵
            }
            
            return true;
        }

        public GetSpriteByIndexWidth(nIndex:number):number
        {
            if(nIndex < 0 || nIndex >= this.m_ArrItem.length)
            {
                return 0;
            }
             return this.m_ArrItem[nIndex]._nWidth;
        }

        public GetSpriteByIndexHeight(nIndex:number):number
        {
            if(nIndex < 0 || nIndex >= this.m_ArrItem.length)
            {
                return 0;
            }
             return this.m_ArrItem[nIndex]._nHeight;
        }
        public GetSpriteByIndex(nIndex:number):Laya.Sprite
        {
            if(nIndex < 0 || nIndex >= this.m_ArrItem.length)
            {
                return null;
            }
            return this.m_ArrItem[nIndex].GetSprite();
        }

        public GetFrameCount():number
        {
            return this.m_ArrItem.length;
        }

        public CheckFreeMemory():boolean
        {
            //还没有加载完成
            if(!this.m_bLoadFlag)
            {return false;}
            for(let i:number = 0;i < this.m_ArrItem.length;i++)
            {
                let pItem:SRPackItem = this.m_ArrItem[i];
                if(!pItem.CheckFree())
                {
                    return false;
                }
            }
            this.Destory(); //释放
            return true;
        }
    }
}