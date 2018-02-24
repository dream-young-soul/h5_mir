module UI
{
    export class Main extends ui.Main.mainUI
    {
        constructor()
        {
            super();
            this.m_image_header.on(Laya.Event.CLICK,this,this.onImageHeaderClick);
        }

        private onImageHeaderClick()
        {
            return;
        }
    }
}