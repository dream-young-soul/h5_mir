module Config
{
    export class GlobalConfig
    {
        public static readonly  _Instance:GlobalConfig = new GlobalConfig();
        public static s_dwUpdateTick:number = 0;
        public static readonly HITPAUSETIME = 400;  //攻击停留速度
        public _szUrl:string = "data/";
        public _nWidth:number = 1136;   //设计屏幕宽度 1136
        public _nHeight:number = 640;   //设计屏幕高度640
        public _nSceneWidth:number; //实际屏幕宽度
        public _nSceneHeight:number;    //实际屏幕高度
        public _szUser:string = ""; //用户帐号
        public _szPasswd:string  = "";  //用户密码
        public _nAccountId:number = 0;  //帐号id
        public _nActorId:number = 0;    //角色id
        public _nHeartBeatTime:number = 15000;  //每十五秒发一次心跳包
        public _szFont:string = "SimSun";   //游戏字体
        public _nFontSize:number = 16;  //默认字体大小
        public _nClearFreeMemoryTime:number = 1000 * 60;    //一分钟清理一次无用资源
        public _nFrameTick:number = 35; //帧固定运行时间- 每一帧就限定这个时间- 超过会闪屏
        public _nCurrentFrameTick:number = 0;  //记录每一帧的最后运行时间
        public _szHPProgressUrl:string[] =[ "res/ui/progress/progressBar_hp.png","res/ui/progress/progressBar_hp$bar.png"];  //血量进度条地址


        //运行时
        public _CurrentShowItem:Config.UserItem = null;    //当前要显示的道具tips信息
        public _ShowItemTipsType:UI.ShowItemTipsType = 0; //当前要显示的道具tips类型

        public SetCurrentShowItem(pUserItem:Config.UserItem,showType:UI.ShowItemTipsType)
        {
            this._CurrentShowItem = pUserItem;
            this._ShowItemTipsType = showType;
        }
    }
}