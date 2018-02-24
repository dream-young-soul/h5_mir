module UI
{
    //富文本类
    //如果该富文本有特效动画类，记得Update
    export class RichTextLine
    {
        public _ListComponent:Array<RichTextBaseComponent>;
        public _nUIHeight:number = 0;
        constructor()
        {
            this._ListComponent = new Array<RichTextBaseComponent>();
        }
        public Destory():void
        {
            for(let i:number = 0;i < this._ListComponent.length;i++)
            {
                this._ListComponent[i].Destory();
            }
            this._ListComponent.splice(0,this._ListComponent.length);
            this._ListComponent = null;
        }
        public GetWidth():number
        {
            let nWidth:number = 0;
            for(let i:number = 0;i < this._ListComponent.length;i++)
            {
                nWidth += this._ListComponent[i].GetUIWidth();
            }
            return nWidth;
        }
        public Update(nCurrentTick):void
        {
            for(let i:number = 0;i < this._ListComponent.length;i++)
            {
                this._ListComponent[i].Update(nCurrentTick);
            }
        }
    }
    //富文本,需要手动换行
    export class RichText extends Laya.Sprite
    {
        private m_ListText:Array<RichTextLine>; //每一行的富文本控件信息
        private m_nShowX:number =　0; //X坐标显示位置
        private m_nShowY:number = 0; //Y坐标显示位置
        constructor()
        {
            super();
            this.m_ListText = new Array<RichTextLine>();
        }

        public GetWidth():number
        {
            let nWidth:number = 0;
            for(let i:number = 0;i < this.m_ListText.length;i++)
            {
                if(this.m_ListText[i].GetWidth() > nWidth)
                {
                    nWidth = this.m_ListText[i].GetWidth();
                }
            }
            return nWidth;
        }

        public GetHeight():number
        {
            let nHeight:number = 0;
            for(let i:number = 0;i < this.m_ListText.length;i++)
            {
                nHeight += this.m_ListText[i]._nUIHeight;
            }
            return nHeight;
        }
        public Destory()
        {
            for(let i:number = 0;i < this.m_ListText.length;i++)
            {
                this.m_ListText[i].Destory();
            }
            this.m_ListText.splice(0,this.m_ListText.length);
            this.m_ListText = null;
            this.removeSelf();
        }
        public SetText(str:string):void
        {
            this.m_nShowX = this.m_nShowY = 0;
            for(let i:number = 0;i < this.m_ListText.length;i++)
            {
                this.m_ListText[i].Destory();
            }
            this.m_ListText.splice(0,this.m_ListText.length);


            let arrStr:string[] = str.split('\\');
            for(let i:number = 0;i < arrStr.length - 1;i++)
            {
                //换行
                if(arrStr[i].length <= 0)
                {
                    this.m_nShowY += Config.GlobalConfig._Instance._nFontSize;
                }
                this.AddText(arrStr[i]);
            }
        }

        public AddText(str:string,bWrap:boolean = true):void
        {
            let listText:RichTextLine = null;
            //是否换行
            if(bWrap)
            {
                listText = new RichTextLine();
            }else
            {
                if(this.m_ListText.length > 0)
                {
                    listText = this.m_ListText[this.m_ListText.length - 1];
                }else
                {
                    listText = new RichTextLine();
                }
            }
           
            while(true)
            {
                let pos = str.indexOf(">");
                if(pos < 0 || pos >= str.length)
                {break;}
                let szLine = str.substr(0,pos+1);

                let typeStartPos:number = szLine.indexOf("(");
                let typeEndPos:number = szLine.indexOf(")");
                if(typeStartPos < 0 || typeEndPos < 0)
                {
                    str= str.substr(pos+1);
                    continue;
                }

                let szType:string = szLine.substr(typeStartPos+1,typeEndPos-typeStartPos -1);
                let szArr:string[] = szType.split(",");
                let szLineEx = "";
                if(typeEndPos + 1 != szLine.length -1)
                {
                    szLineEx = szLine.substr(typeEndPos + 1)
                    szLineEx = szLineEx.substr(0,szLineEx.length - 1);
                }
                if(szArr.length <= 0)
                {
                    str　= str.substr(pos+1);
                    continue;
                }
                let ui:RichTextBaseComponent = null;
                let szAttr:string[] = szArr[0].split(":");
                if(szAttr.length <= 1){ str= str.substr(pos+1);continue;}
                switch(parseInt(szAttr[1]))
                {
                    case RichTextComponentType.Label:　//标签
                    {
                        ui = new RichTextLabel(this);
                        break;
                    }
                    case RichTextComponentType.Image:   //图片
                    {
                        ui = new RichTextImage(this);
                        break;
                    }
                    case RichTextComponentType.Emotion:　//表情
                    {
                        ui = new RichTextAnimation(this,RichTextAnimationType.Emotion);
                        break;
                    }
                    default:
                    {
                        str = str.substr(pos+1);
                        continue;
                    }
                }
                if(ui != null)
                {
                    szArr.splice(0,1);
                    ui.ProcessStr(szLineEx,szArr);
                    listText._ListComponent.push(ui);
                    if(ui.GetUIHeight() > listText._nUIHeight)
                    {
                        listText._nUIHeight = ui.GetUIHeight();
                    }
                }
                if(pos +1 >= str.length)
                {break;}
                str = str.substr(pos+1);

            }

            if(listText._ListComponent.length > 0)
            {
                //显示出来。
                for(let i:number = 0;i < listText._ListComponent.length;i++)
                {
                    let ui:RichTextBaseComponent = listText._ListComponent[i];
                    ui.Show(this.m_nShowX,this.m_nShowY);
                    this.m_nShowX += ui.GetUIWidth();
                }
                this.m_nShowY = this.m_nShowY + listText._nUIHeight;
                this.m_nShowX = 0;
                this.m_ListText.push(listText);
            }

           
        }

        public Update(nCurrentTick:number):void
        {
            for(let i:number = 0;i < this.m_ListText.length;i++)
            {
                this.m_ListText[i].Update(nCurrentTick);
            }
        }
    }
}