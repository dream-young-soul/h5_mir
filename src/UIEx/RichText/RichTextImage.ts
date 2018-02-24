module UI
{
    export class RichTextImage extends RichTextBaseComponent
    {
        private m_nWidth:number = 0;
        private m_nHeight:number = 0;
        private m_Sprite:Laya.Sprite = null;
        constructor(parent:Laya.Sprite)
        {
            super(parent);
            this.m_ComponentType = RichTextComponentType.Image;
        }
        public Destory():void
        {
            super.Destory();
            if(this.m_Sprite != null)
            {
                this.m_Sprite.removeSelf();
            }
            this.m_Sprite = null;
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
                        case "file":
                        {
                            this.m_Sprite = Resources.ResourcesManager._Instance.GetSpriteForURL(arr[1]);
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
            if(this.m_Sprite == null )
            {
                return;
            }
          
            this.m_Parent.addChild(this.m_Sprite);
            this.m_Sprite.pos(nX,nY);
        }
    }
}