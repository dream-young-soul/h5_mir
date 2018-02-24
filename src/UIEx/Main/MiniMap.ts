module UI
{
    export class MiniMap extends ui.Main.minimapUI
    {
        constructor()
        {
            super();
            this.m_image_bg.on(Laya.Event.CLICK,this,this.onImageBGClick);
        }

        public SetMapName(szMapName:string):void
        {
            this.m_label_mapname.text = szMapName;
        }

        public SetMapPoint(nX:number,nY:number):void
        {
            this.m_label_point.text = nX.toString() +" "+nY.toString();
        }
        private onImageBGClick():void
        {
            UI.UIManager.GetInstance().ShowDialog(UI.UIDialogID.Map);
        }
    }
}