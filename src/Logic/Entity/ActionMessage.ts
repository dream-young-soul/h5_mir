module Entity
{
    export class ActionMessage
    {
        public _nAction:number = 0; //动作
        public _Data = null;    //数据
        constructor(nAction:number,data:any)
        {
            this._nAction = nAction;
            this._Data = data;
        }
    }
}