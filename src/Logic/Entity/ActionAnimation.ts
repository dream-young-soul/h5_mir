	/**
	 * 动作动画帧范围类 
	 * @author 后天 2017.10.2
	 * 
	 */
    module Entity
    {
        export class ActionAnimation
        {
            public _nFrameStart:number = 0;//帧起始
            public _nFrameCount:number = 0; //帧数量
            public _nActionTime:number = 0; //动作的周期时间，完成此动作所需要的时间
            constructor(nFrameStart: number, nFrameCount: number, nActionTime: number)
            {
                this._nFrameStart = nFrameStart;
                this._nFrameCount = nFrameCount;
                this._nActionTime = nActionTime;
            }

        }
    }