module UI
{
    /*
    *飘血特效
    *@author 2017.10.11
    */
    export class DamageEff
    {
        private static _Instance:DamageEff = null;
        private  m_loadItem =[];
        private m_Number:Laya.Texture[] = [];
       
        private m_RootLayer:Laya.Sprite = null;
        constructor()
        {
           
        }
        public  Init(loadingItem:any)
        {
           this.m_RootLayer = new Laya.Sprite();
           Laya.stage.addChild(this.m_RootLayer);
           this.m_RootLayer.zOrder = 999;   //低于UI层
           let str:string = ""
           for(let i:number = 0;i < 12;i++)
           {
                str = "data/other/hit1/HitNum1_"+i+".png"
                let item = {url:str,type:Laya.Loader.IMAGE};
                this.m_loadItem.push(item);
                loadingItem.push(item);
           }
          
      
        }

        public static GetInstance():DamageEff
        {
            if(DamageEff._Instance == null)
            {
                DamageEff._Instance = new DamageEff();
            }
             
            return DamageEff._Instance;
        }

        public OnLoaded():void
        {
            this.m_Number =[];
            for(let i:number = 0;i < this.m_loadItem.length;i++)
            {
                let pTex = Laya.loader.getRes(this.m_loadItem[i].url);
                this.m_Number.push(pTex);
            }
        }

        public MakeDamageEffect(pEntity:Entity.CustomEntity,nValue:number):void
        {
            if(nValue == 0)return;
           //可以优化的，把用过的sprite加入到缓存中，因为飘血太过于频繁了
           let s:Laya.Sprite = new Laya.Sprite();
           let nValueStr:string = nValue.toString();
           const AddImageIndex:number =10;
           const DecImageIndex:number =11;

           let numbSprite:Laya.Sprite = new Laya.Sprite();
           if(nValue > 0)
           {
                numbSprite.texture =this.m_Number[AddImageIndex];
           }else if(nValue < 0)
           {
                 numbSprite.texture =this.m_Number[DecImageIndex];
           }
           if(numbSprite.texture  == null)
           {
               return;
           }
           s.addChild(numbSprite);
           let offsetX:number = numbSprite.texture.width;
           
           for(let i:number = 1;i < nValueStr.length;i++)
           {
               let n:number = parseInt(nValueStr[i]);
               let numbSprite:Laya.Sprite = new Laya.Sprite();
               numbSprite.texture = this.m_Number[n];
               if(numbSprite.texture == null)
               {
                   return;
               }
               s.addChild(numbSprite);
               numbSprite.x =  offsetX  + 2;
               offsetX += numbSprite.texture.width;
               
           }

           this.m_RootLayer.addChild(s);
           let nScenePoint:Laya.Point = new Laya.Point();
           pEntity.localToGlobal(nScenePoint);
           
           s.x = nScenePoint.x - Entity.CustomEntity.DefalutWidth / 2;
           s.y = nScenePoint.y - Entity.CustomEntity.DefalutHeight;
           
           Laya.Tween.to(s,{ y: s.y - 50 },1000,null,Laya.Handler.create(this,this.OnComplete,[s]));
        }

        private OnComplete(arg):void
        {
            let s:Laya.Sprite = arg as Laya.Sprite;
            if(s)
            {
                this.m_RootLayer.removeChild(s);
                s.texture = null;                
                s.destroy();
            }
           
        }
    }
}