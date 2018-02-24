	/**
	 * 动作帧定义
     * @author 后天
    */

    module Entity
    {
        export class HumanAction
        {
            public static HAIdle:ActionAnimation = null;
            public static HAMove:ActionAnimation = null;   //
            public static HARUN:ActionAnimation = null;    //跑步
            public static HAHit:ActionAnimation = null;    //普通攻击动作
            public static HAReadyAttack:ActionAnimation = null; //攻击停顿
            public static HASpell:ActionAnimation = null;   //施法
     
            public static Init()
            {
                HumanAction.HAIdle = new ActionAnimation(0,8,2400);
                HumanAction.HAMove= new ActionAnimation(64,8,560);
                HumanAction.HARUN = new ActionAnimation(128, 12,660);
                HumanAction.HAHit = new ActionAnimation(232,7,600);
                HumanAction.HAReadyAttack = new ActionAnimation(224,1,600);
                HumanAction.HASpell = new ActionAnimation(288, 6, 600);
            }
	        /**
		 * 根据类型和方向获取对应的动作 
		 * @param type
		 * @return 
		 * 
		 */	
            public static GetDirActionByType(type:number):  ActionAnimation
            {
                switch(type)
                {
                    case StandardActions.SA_IDLE:
                    {
                        return HumanAction.HAIdle;
                    }   
                    case StandardActions.SA_WALK:
                    {
                        return HumanAction.HAMove;
                    }
                    case StandardActions.SA_RUN:
                    {
                        return HumanAction.HARUN;
                    }
                    case StandardActions.SA_NORMHIT:
                    case StandardActions.SA_HIT1:
                    {
                        return HumanAction.HAHit;
                    }
                    case StandardActions.SA_READY_ATTACK:
                    {
                        return HumanAction.HAReadyAttack;
                    }
                    case StandardActions.SA_SPELL:
                    {
                        return HumanAction.HASpell;
                    }
                }
                return null;
            }
        }
    }