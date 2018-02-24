module UI
{
    export class Header extends ui.Main.HeaderUI
    {
        constructor()
        {
            super();
            this.m_label_level.text = "111";
            this.on(Laya.Event.CLICK,this,this.OnDialogClick);
        }

        private OnDialogClick():void
        {
           
        }

        public UpdateHPProgress(nHP:number,nMaxHP:number):void
        {
            this.m_progress_hp.value = nHP / nMaxHP;
            this.m_label_hp.text = nHP.toString() + "/" + nMaxHP.toString();
        }

        public UpdateMPProgress(nMP:number,nMaxMP:number):void
        {
            this.m_progress_mp.value = nMP / nMaxMP;
            this.m_label_mp.text = nMP.toString() + "/" + nMaxMP.toString();
        }
        public UpdateLevel(nLevel:number):void
        {
            this.m_label_level.text = nLevel.toString();
        }

        public UpdateJob(nJob:Config.Vocation):void
        {
            let str:string = "无"
            switch(nJob)
            {
                case Config.Vocation.Warrion:
                {
                    str = "战";
                    break;
                }
                case Config.Vocation.Mage:
                {
                    str = "法";
                    break;
                }
                case Config.Vocation.Tao:
                {
                    str = "道";
                    break;
                }
            }
            this.m_label_job.text = str;
        }
    }
}