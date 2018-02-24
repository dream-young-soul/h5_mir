module UI
{
    export class RichTextBaseComponent
    {
        protected m_ComponentType:RichTextComponentType;
        protected m_Parent:Laya.Sprite;
        constructor(parent:Laya.Sprite)
        {
            this.m_Parent = parent;
            this.m_ComponentType = RichTextComponentType.Normal;
        }
        public Destory():void
        {
            this.m_Parent = null;
        }
        public ProcessStr(szStr:string,arrAttr:string[]):void
        {

        }

        public GetUIHeight():number
        {
            return 0;
        }
        public GetUIWidth():number
        {
            return 0;
        }
        public Show(nX:number,nY:number):void
        {

        }

        public Update(nCurrentTick:number):void
        {
            
        }

    }
}