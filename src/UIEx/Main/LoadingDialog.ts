module UI
{
    export class LoadingDialog extends ui.Main.loadingUI
    {
        constructor()
        {
            super();
        }
        public UpdateProgress(v:number)
        {
            
            let nValue:number = parseInt((v * 100).toString());
            this.m_label_progress.text ="正在加载中"+nValue.toString()+"%";
        }
    }
}