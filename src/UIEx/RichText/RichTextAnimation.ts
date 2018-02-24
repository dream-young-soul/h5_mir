module UI
{
    export enum RichTextAnimationType
    {
        Emotion = 0,    //表情组
    }
    export class RichTextAnimation extends RichTextBaseComponent
    {
        private m_AniType:RichTextAnimationType;
        private m_nWidth:number = 0;
        private m_nHeight:number = 0;
        private m_nIndex:number = 0;    //动画包索引
        private m_Animation:Common.Animation = null;
        private m_nPosX:number = 0;
        private m_nPosY:number = 0;
        constructor(parent:Laya.Sprite,aniType:RichTextAnimationType)
        {
            super(parent);
            this.m_AniType = aniType;
        }
         public Destory():void
         {
             super.Destory();
             if(this.m_Animation != null)
             {
                this.m_Animation.removeSelf();
                this.m_Animation.Destory();
             }

             this.m_Animation = null;
         }
        public ProcessStr(szStr:string,arrAttr:string[]):void
        {
            for(let i:number = 0;i < arrAttr.length;i++ )
            {
                let arr:string[] = arrAttr[i].split(":");
                if(arr.length > 1)
                {
                    switch(arr[0])
                    {
                        case "index":
                        {
                            this.m_nIndex = parseInt(arr[1]);
                            
                            break;
                        } 
                        case "width":
                        {
                            this.m_nWidth = parseInt(arr[1]);
                            break;
                        }
                        case "height":
                        {
                            this.m_nHeight = parseInt(arr[1]);
                            break;
                        }
                    }
                }
            }
        }

        public GetUIHeight():number
        {
            return this.m_nHeight;
        }
        public GetUIWidth():number
        {
            return this.m_nWidth;
        }
        public Show(nX:number,nY:number):void
        {
           this.m_nPosX = nX;
           this.m_nPosY = nY;
        }

        public Update(nCurrentTick:number):void
        {
            if(this.m_nIndex <= 0)return;
            let pack:Resources.SRPack = null;
            switch(this.m_AniType)
            {
                case RichTextAnimationType.Emotion:
                {
                    pack = Resources.ResourcesManager._Instance.GetEmotionPackage(this.m_nIndex);
                    break;
                }
            }
            if(pack != null && pack.GetFrameCount() > 0 )
            {
                if(this.m_Animation == null)
                {
                    this.m_Animation = new Common.Animation(pack,0,pack.GetFrameCount(),80,-1);
                    this.m_Parent.addChild(this.m_Animation);
                    this.m_Animation.pos(this.m_nPosX,this.m_nPosY);
                }

            }
            if(this.m_Animation != null)
            {
                this.m_Animation.Update(nCurrentTick);
            }
        }
    }
}