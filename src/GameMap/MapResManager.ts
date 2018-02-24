/*
    地图地砖资源管理器
    @author 后天 2017.9.28
*/
module GameMap
{
   export class MapResManager
    {
        public static readonly _Instance = new MapResManager();
        //private static readonly RESURL:string = "http://cdn.zr2.51.com/v1/map/tiles/";
        private static readonly RESURL:string = "./data/map/map/tiles/";
        private m_ArrTile =[];
     
        constructor()
        {

        }

        //清理无用纹理
        public ClearFreeMemory():void
        {
            for(let key in this.m_ArrTile)
            {
                let sprite:Laya.Sprite = this.m_ArrTile[key];
                if(sprite != null && sprite.parent == null)
                {
                    if(sprite.texture != null)
                    {
                        sprite.texture.destroy(true);
                    }
                    sprite.destroy();
                    this.m_ArrTile[key] = null;
                   
                }
            }
        }
        public GetTileImg(bkImgIndex:number):Laya.Sprite
        {
            let s:string = bkImgIndex.toString();
            while ( s.length < 5 )
			{
				s = "0" + s;
			}
            
            s = MapResManager.RESURL+Math.floor(bkImgIndex / 10000) + "/" + Math.floor(((bkImgIndex % 10000) / 1000)) + "/" + s+".jpg";
            if(this.m_ArrTile[s] != null)
            {
                return this.m_ArrTile[s];
            }
            let pImg:Laya.Sprite = new Laya.Sprite();
            this.m_ArrTile[s] = pImg;
      
            Laya.loader.load(s,Laya.Handler.create(this,this.OnLoadImage));
            return pImg;
        }

        private OnLoadImage(data):void
        {
            if(data != null)
            {
                let pTex:Laya.Texture = data as Laya.Texture;
                if(this.m_ArrTile[pTex.url] != null)
                {
                   let pSprite:Laya.Sprite = this.m_ArrTile[pTex.url] as Laya.Sprite;
                   if(pSprite != null)
                   {
                       pSprite.texture = pTex;
                   }

                }
            }
        }
        
    }
}