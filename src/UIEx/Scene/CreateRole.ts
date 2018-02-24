module UI
{
    export class CreateRole extends ui.Scene.createroleUI
    {
        private m_Job:number = 0; 
        private m_Sex:number = 0;
        private m_GrayscaleFilter:Laya.ColorFilter ;
        private m_ArrImage=[];
        constructor()
        {
            super();
          
           //灰色滤镜
           	//由 20 个项目（排列成 4 x 5 矩阵）组成的数组，灰图
		    let grayscaleMat = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];

		    //创建一个颜色滤镜对象，灰图
		    this.m_GrayscaleFilter  = new Laya.ColorFilter(grayscaleMat);

            this.m_ArrImage.push({image:this.m_warrior_man,job:1,sex:0});
            this.m_ArrImage.push({image:this.m_warrior_woman,job:1,sex:1});
            this.m_ArrImage.push({image:this.m_mage_man,job:2,sex:0});
            this.m_ArrImage.push({image:this.m_mage_woman,job:2,sex:1});
            this.m_ArrImage.push({image:this.m_tao_man,job:3,sex:0});
            this.m_ArrImage.push({image:this.m_tao_woman,job:3,sex:1});
             //默认为男战士
            this.SetSelectIndex(1,0);
    
            for(let i:number = 0;i < this.m_ArrImage.length;i++)
            {
                this.m_ArrImage[i].image.on(Laya.Event.CLICK,this,this.OnImageClick);
            }

            //创建角色按钮
            this.m_ImageCreate.on(Laya.Event.CLICK,this,this.OnCreateRole);
         }
        private OnCreateRole():void
        {
            // let msg:ClientMsgPack.LoginPack.CreateActorMsgPack = new ClientMsgPack.LoginPack.CreateActorMsgPack();
            // msg._szName = this.m_TextName.text;
            // msg._bJob = this.m_Job;
            // msg._bSex = this.m_Sex;
            // Net.MsgSender.SendDataByPack(msg);
            
        }
        private OnImageClick(e):void
        {
             for(let i:number = 0;i < this.m_ArrImage.length;i++)
             {
                 if(e.target == this.m_ArrImage[i].image)
                 {
                     this.SetSelectIndex(this.m_ArrImage[i].job,this.m_ArrImage[i].sex);
                     break;
                 }
             }
        }
        private SetSelectIndex(job:number,sex:number)
        {
            for(let i:number = 0;i < this.m_ArrImage.length;i++)
            {
                if(this.m_ArrImage[i].job == job && this.m_ArrImage[i].sex == sex)
                {
                       this.m_ArrImage[i].image.filters = null;
                   
                }else
                {
                     this.m_ArrImage[i].image.filters = [this.m_GrayscaleFilter];
                }
            }
            this.m_Job = job;
            this.m_Sex = sex;
           
        }
    }
}