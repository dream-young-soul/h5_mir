/**
 *  日志类-用于控制台输出日志与抛出异常
 * @author 后天 2017.9.28
 * */
module Common
{

    export enum MirLogType
    {
        Tips = 0,   //提示
        Waring = 1, //警告
        Error = 2,  //错误
    }
    export class MirLog
    {
        public static Log(type:MirLogType,text:string):void
        {
            console.log(text);
            if(type == MirLogType.Error)
            {
                throw new Error(text);
            }
            
            let pLogDialog:UI.Log = UI.UIManager.GetInstance().GetLogDialog();
            if(pLogDialog != null)
            {
                pLogDialog.AddLog(type,text);
            }
        }
    }
    
}