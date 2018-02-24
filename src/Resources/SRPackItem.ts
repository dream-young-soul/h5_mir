/*
*动画包资源项
@author 后天 2017.9.28 22:06
*/

module Resources
{
    export class SRPackItem
    {
        public _nOffset:number = 0; //文件偏移点
        public _nDataSize:number = 0;   //二进制数据长度
        public _Data = null;    //Base64编码数据
        public _nOffsetPoint:Laya.Point = new Laya.Point(); //坐标偏移点
        public _ArrSprite:Laya.Sprite[] = [];
        public _nWidth:number = 0;  //纹理宽度- 这个成员是无效的。
        public _nHeight:number = 0; //纹理高度 这个成员是无效的。

        constructor()
        {

        }
        public Destory():void
        {
             for(let i = 0;i < this._ArrSprite.length;i++)
             {
                 let sprite:Laya.Sprite = this._ArrSprite[i];
                 sprite.destroy();
             }
             this._ArrSprite = [];
             this._Data = null;
             this._nDataSize = 0;
             this._nOffset = 0;
        }
        public GetSprite():Laya.Sprite
        {
            for(let i = 0;i < this._ArrSprite.length;i++)
            {
                if(this._ArrSprite[i].parent == null)
                {
                    return this._ArrSprite[i];
                }
            }
            let sprite = Laya.Sprite.fromImage(this._Data);
            this._ArrSprite.push(sprite);
            sprite.pos(this._nOffsetPoint.x,this._nOffsetPoint.y);
            return sprite;
        }
        public CheckFree():boolean
        {
            for(let i:number = 0;i < this._ArrSprite.length;i++)
            {
                let sprite:Laya.Sprite = this._ArrSprite[i];
                if(sprite.parent != null)
                {
                    return false;
                }
            }
            return true;
        }
    }
}