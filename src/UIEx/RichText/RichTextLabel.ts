module UI
{
    export class RichTextLabel extends RichTextBaseComponent
    {
        private m_Label:Laya.Label;
        private m_szLink:string = "";
        constructor(parent:Laya.Sprite)
        {
            super(parent);
            this.m_Label = new Laya.Label();
            this.m_Label.font = Config.GlobalConfig._Instance._szFont;
            this.m_Label.fontSize = Config.GlobalConfig._Instance._nFontSize;
            this.m_ComponentType = RichTextComponentType.Label;
            this.m_Label.color = "#FFFFFF"; //默认白色
            //this.m_Label.stroke = 1;
            //this.m_Label.strokeColor = "#060606";
        }
         public Destory():void
         {
             super.Destory();
             this.m_Label.removeSelf();
              if(this.m_szLink.length > 0)
              {
                  this.m_Label.off(Laya.Event.CLICK,this,this.OnClick);
              }
             this.m_Label = null;
         }
        public SetColor(szColor:string):void
        {
            this.m_Label.color = szColor;
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
                        case "color":
                        {
                            this.m_Label.color = "#"+arr[1];
                            break;
                        } 
                        case "link":
                        {
                            this.m_szLink = arr[1];
                            if(this.m_szLink.length > 0)
                            {
                                this.m_Label.underline = true; //显示下划线并且添加单击事件
                                this.m_Label.underlineColor = "#33FF00"; //默认绿色
                                this.m_Label.mouseEnabled = true;
                                this.m_Label.on(Laya.Event.CLICK,this,this.OnClick);
                            }
                            break;
                        }
                    }
                }
            }
            this.m_Label.text = szStr;
        }

        private OnClick():void
        {
            //执行脚本
            
        }
        public GetUIHeight():number
        {
            return this.m_Label.fontSize;
        }

        public GetUIWidth():number
        {
             return this.m_Label.text.length * Config.GlobalConfig._Instance._nFontSize;
        }
        public Show(nX:number,nY:number):void
        {
            this.m_Parent.addChild(this.m_Label);
            this.m_Label.pos(nX,nY);
        }
    }
}