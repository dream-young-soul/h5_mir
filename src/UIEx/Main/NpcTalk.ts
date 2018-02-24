module UI
{
    export class NpcTalk extends ui.Main.npctalkUI
    {
        private static readonly SPLIT:string = "&&";
        private static readonly SPLITSELECT:string = "/@";
        private m_Handle:number = 0;    //npc句柄
        private m_nType:number = 0; //npc类型
        private m_ArrSelect:Array<Laya.Label> = null;
        private m_ArrSelectCallBack:Array<string> = null;
        private m_Link:Array<string>;
        
         constructor()
        {
            super();
            this.m_ArrSelect = new Array<Laya.TextInput>();
            this.m_ArrSelectCallBack = new Array<string>();
            this.m_ArrSelect.push(this.m_text_select1);
            this.m_ArrSelect.push(this.m_text_select2);
            this.m_ArrSelect.push(this.m_text_select3);
            this.m_ArrSelect.push(this.m_text_select4);
            this.m_ArrSelect.push(this.m_text_select5);
            for(let i:number = 0;i < this.m_ArrSelect.length;i++)
            {
                this.m_ArrSelect[i].on(Laya.Event.MOUSE_UP,this,this.OnSelectClick,[i]);
            }
            this.m_btnClose.on(Laya.Event.CLICK,this,this.OnBtnClose);

        }

        private OnBtnClose():void
        {
            this.visible = false;
        }
        private OnSelectClick(nIndex:number):void
        {
            if(nIndex >= this.m_ArrSelectCallBack.length || 
            this.m_ArrSelectCallBack[nIndex] == null || 
            this.m_ArrSelectCallBack[nIndex].length <= 0)
            {return;}
            // let msg:ClientMsgPack.LogicPack.NpcTalkMsgPack = new ClientMsgPack.LogicPack.NpcTalkMsgPack();
            // msg._Handle = this.m_Handle;
            // msg._szFuncNmae = this.m_ArrSelectCallBack[nIndex];
            // Net.MsgSender.SendDataByPack(msg);
        }
        public Update(handle:number,type:number,str:string):boolean
        {
            this.m_text_npctalk.text = null;
            for(let i:number = 0;i < this.m_ArrSelect.length;i++)
            {
                this.m_ArrSelect[i].text = "";
            }
            this.m_Link = new Array<string>();

            this.m_Handle = handle;
            this.m_nType = type;

            let arr:string[] = str.split(UI.NpcTalk.SPLIT);
            if(arr.length <= 0)
            {
                return false;
            }
            this.m_text_npctalk.text = arr[0];


            this.m_ArrSelectCallBack.splice(0,this.m_ArrSelectCallBack.length-1);
            if(arr.length > 1)
            {
                arr = arr[1].split(" ");

                for(let i:number = 0;i < arr.length;i++)
                {
                    let line:string = arr[i].substr(1,arr[i].length - 2);
                    let arrselect:string[] = line.split(NpcTalk.SPLITSELECT);
                    if(i >= this.m_ArrSelect.length)
                    {
                        break;
                    }
                    this.m_ArrSelect[i].text = arrselect[0];
                    this.m_ArrSelectCallBack.push(arrselect[1]);
                }
            }


            return true;
        }
    } 
}