	/**
	 * 标准怪物动作值以及动画帧定义 
	 * @author 后天 2017.10.4
	 * 
	 */
module Entity
{
    export class StdMonsterAction
    {
        private static SMIdle:ActionAnimation = null;   //休闲
        private static SMMove:ActionAnimation = null;   //移动
        private static SMAttack:ActionAnimation = null; //攻击
        private static SMDie:ActionAnimation = null;    //死亡
        private static SMStruct:ActionAnimation = null; //受击
        public static Init()
        {
            StdMonsterAction.SMIdle = new ActionAnimation(0,5,1200);
            StdMonsterAction.SMMove = new ActionAnimation(0,8,500);
            StdMonsterAction.SMAttack = new ActionAnimation(0,7,400);
            StdMonsterAction.SMDie = new ActionAnimation(0,4,400);
            StdMonsterAction.SMStruct = new ActionAnimation(0,4,300);
        }

         /**
		 * 根据类型和方向获取对应的动作 
		 * @param type
		 * @param dir
		 * @return 
		 * 
		 */	
        public static GetDirActionByType(type:number):ActionAnimation
        {
            switch(type)
            {
                case StandardActions.SA_IDLE:
                {
                    return StdMonsterAction.SMIdle;
                }
                case StandardActions.SA_WALK:
                case StandardActions.SA_RUN:
                {
                    return StdMonsterAction.SMMove;
                }
                case StandardActions.SA_NORMHIT:
                case StandardActions.SA_HIT1:
                case StandardActions.SA_HIT2:
                case StandardActions.SA_HIT3:
                {
                    return StdMonsterAction.SMAttack;
                }
                case StandardActions.SA_DIE:
                case StandardActions.SA_DEATH:
                {
                    return StdMonsterAction.SMDie;
                }
            }
        }
    }
}
