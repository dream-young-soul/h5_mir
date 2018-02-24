/*用于确认移动控制具体应当实施的行为的数据类型 
--@author 后天
--time 2017.10.3
*/
module Entity
{
    export class MoveAction
    {
        public _nAction:number = 0; //移动的行为
        public _nIdent:number = 0;  //移动的消息
        public _nDir:number = 0;    //方向
        public _nStep:number = 0;   //移动的步伐
        public _nMoveSpeed:number = 0;  //移动速度
        public _nTargetX:number = 0;    //目标位置X
        public _nTargetY:number = 0;    //目标位置Y
        constructor()
        {
            
        }
    }
}