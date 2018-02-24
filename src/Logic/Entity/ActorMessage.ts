	/**
	 * 角色消息类，用于保存角色自服务器处收来的消息 
	 * @author 后天
	 * 
	 */
    module Entity
    {
        export class ActorMessage
        {
            public _Ident:ActorMessages; //消息号
            public _Param:number = 0;
            public _Tag:number = 0;
            public _Series:number = 0;
            public _Data:any = null;

            constructor(ident:ActorMessages,param:number,tag:number,series:number,data:any = null)
            {
                this._Ident = ident;
                this._Param = param;
                this._Tag = tag;
                this._Series = series;
                this._Data = data;
            }
           
        }
    }
