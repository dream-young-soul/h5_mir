module UI
{
    export class Skill extends ui.Window.skillUI
    {


        constructor()
        {
            super();
            this.on(Laya.Event.ADDED,this,this.OnLoaded);
            this.on(Laya.Event.REMOVED,this,this.OnRemove);
        }

        private OnLoaded():void
        {

            this.m_btn_close.on(Laya.Event.CLICK,this,this.OnBtnClose);
        }
       
       private OnRemove():void
       {
          
           this.m_btn_close.off(Laya.Event.CLICK,this,this.OnBtnClose);
       }

       private OnBtnClose():void
       {
            UI.UIManager.GetInstance().HideDialog(UI.UIDialogID.Skill);
       }
    }
}