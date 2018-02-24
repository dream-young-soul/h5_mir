module UI
{
    export class Log extends ui.Main.logUI
    {
        private m_sLog:string = "";
        constructor()
        {
            super();
            this.m_btn_clear.on(Laya.Event.CLICK,this,this.OnBtnClear);
            this.m_btn_clear.visible = false;
      
            this.m_text_log.style.font = Config.GlobalConfig._Instance._szFont;
            this.m_text_log.style.fontSize = Config.GlobalConfig._Instance._nFontSize;
          
            this.m_text_log.innerHTML ="";



        }
        public  AddLog(type:Common.MirLogType,szStr:string):void
        {
            this.m_sLog +=  "<br/><span color='#FFFFFF'>"+szStr+"</span>";
            this.m_text_log.innerHTML = this.m_sLog;
        }
         public  AddLogByte(type:Common.MirLogType,buff:ArrayBuffer):void
        {
            // let str:string = "";
            // let pack:Net.Packet = new Net.Packet(buff);

            // for(let i:number = 0;i < buff.byteLength;i++)
            // {
            //     str = str+pack.ReadUByte().toString()+",";
            // }
            // console.log(str);
            // this.m_text_log.text += str;
        }
        private OnBtnClear():void
        {
           
            this.m_text_log.innerHTML  ="";
            // let pack:Net.Packet = new Net.Packet();
            // pack.WriteCustomString(this.m_text_log.text);
            // this.AddLogByte(Common.MirLogType.Tips,pack.GetBuffer());
            
            //this.m_text_log.text = "";
        }
    }
}