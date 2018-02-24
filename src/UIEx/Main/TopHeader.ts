module UI
{
    export class TopHeader extends ui.Main.topheaderUI
    {
        
        public SetGold(nGold:number):void
        {
            this.m_label_gold.text = nGold.toString();
        }

        public SetYuanBao(nYuanBao:number):void
        {
            this.m_label_yuanbao.text = nYuanBao.toString();
        }

        public SetBindGold(nBindGold:number):void
        {
            this.m_label_bindgold.text = nBindGold.toString();
        }

        public SetBindYuanBao(nBindYuanBao:number):void
        {
            this.m_label_bindyuanbao.text = nBindYuanBao.toString();
        }
    }
}