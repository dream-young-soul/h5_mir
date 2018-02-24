module Resources
{
    export class ResSprite
    {
        public _szFile:string = "";
        public _Texture:Laya.Texture = null;
        public _ArrSprite:Array<Laya.Sprite> = new Array<Laya.Sprite>();
        constructor(texture:Laya.Texture = null)
        {
            this._Texture = texture;
            if(this._Texture != null)
            {
                this.GetSprite(); //初始化一张精灵
            }
            
        }
        public SetTexture(pTex:Laya.Texture):void
        {
            this._Texture = pTex;
            if(this._Texture != null)
            {
                for(let i:number = 0;i < this._ArrSprite.length;i++)
                {
                    if(this._ArrSprite[i].texture == null)
                    {
                        this._ArrSprite[i].texture = pTex;
                        //需要设置点击区域,以相应单击事件
                       // this._ArrSprite[i].scale(1,1);
                        this._ArrSprite[i].hitArea = new laya.maths.Rectangle(0,0,pTex.width,pTex.height);
                    }
                }
            }

        }
        public Destory():void
        {
             for(let i:number = 0;i < this._ArrSprite.length;i++)
             {
                 let s:Laya.Sprite = this._ArrSprite[i];
                 s.texture = null;
                 s.hitArea = null;
                 s.destroy();
             }
             this._ArrSprite = [];
             this._Texture = null;
        }
        public GetSprite():Laya.Sprite
        {
            
            for(let i:number = 0;i < this._ArrSprite.length;i++)
            {
                if(this._ArrSprite[i].parent == null)
                {
                    this._ArrSprite[i].scale(1,1);
                    this._ArrSprite[i].pos(0,0);
                    this._ArrSprite[i].hitArea = new laya.maths.Rectangle(0,0,this._Texture.width,this._Texture.height);
                    return this._ArrSprite[i];
                }
            }
            let sprite:Laya.Sprite = new Laya.Sprite();
            sprite.texture = this._Texture;
             //需要设置点击区域,以相应单击事件
             sprite.scale(1,1);
             sprite.pos(0,0);
             if(this._Texture != null)
             {
                 sprite.hitArea = new laya.maths.Rectangle(0,0,this._Texture.width,this._Texture.height);
             }
             
            this._ArrSprite.push(sprite);
            return sprite;
           
        }

        public CheckFreeMemory():boolean
        {
            if(this._ArrSprite == null)
            {
                return true;
            }
            for(let i:number = 0;i < this._ArrSprite.length;i++)
            {
                if(this._ArrSprite[i].parent != null)
                {
                    return false;
                }
            }
            this.Destory();
            return true;
        }
    }
}