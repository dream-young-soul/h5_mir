    /**
	 * 通用行为定义 
	 * @author 后天
	 * 
	 */
module Entity
{
    export class StandardActions
    {
        /**
		 * 动作值定义
		 */
		public static readonly SA_IDLE:number = 0;//站立
		public static readonly SA_WALK:number = 1;//走
		public static readonly SA_RUN:number = 2;//跑
		public static readonly SA_READYJUMP:number = 3;//准备跳跃
		public static readonly SA_JUMP:number = 4;//跳跃
		public static readonly SA_READY_ATTACK:number = 5;//准备攻击
		public static readonly SA_STRUCK:number = 6;//被攻击
		public static readonly SA_NORMHIT:number = 7;//普通攻击
		public static readonly SA_SPELL:number = 8;//技能攻击（本地逻辑动作，会转转换为具体的技能动作）
		public static readonly SA_PREPARESKILL:number = 9;//准备技能（吟唱）
		public static readonly SA_HIT1:number = 10;//攻击
		public static readonly SA_HIT2:number = 11;//攻击
		public static readonly SA_HIT3:number = 12;//攻击
		public static readonly SA_COLLECT:number = 13;//采集
		public static readonly SA_DIE:number = 14;//死亡倒下
		public static readonly SA_DEATH:number = 15;//死亡（躺着的尸体状体）
		public static readonly SA_BACKSTEP:number = 16;//后退
		public static readonly SA_READY_COLLECT:number = 17;//采集之后的攻击停留
		public static readonly SA_STRUCK_FLY:number = 18;//被击飞
		public static readonly SA_SPRINT:number = 19;//冲刺
		public static readonly SA_SPRINT_START:number = 20;//冲刺起步
		public static readonly SA_READY_SPELL:number = 21;//准备施法
		public static readonly SA_HORSE_IDLE:number = 22;//马上站立
		public static readonly SA_HORSE_RUN:number = 23;//马上跑
		public static readonly SA_HORSE_STAND_IDLE:number = 24;  //马上站立 空闲
		public static readonly SA_HORSE_STAND_RUN:number = 25;   //马上站立 跑
		public static readonly SA_SWIMMING_IDLE:number = 26;     //游泳中的站立
		public static readonly SA_SWIMMING_RUN:number = 27;     //游泳中的跑
		public static readonly SA_SWIMMING_KISS:number = 28;   //游泳中的kiss
		public static readonly SA_LAND_KISS:number = 29;   //陆地上的kiss
		public static readonly SA_CARRIER_IDLE:number = 30;     //载具的站立
		public static readonly SA_CARRIER_RUN:number = 31;     //载具中的跑
		public static readonly SA_DONGFANG:number = 32;     //洞房
		public static readonly SA_SPRINT_NEW:number = 33;     //冲锋
		public static readonly SA_ROTATE:number = 34;     //旋转
		public static readonly SA_READYDIVINESWORD:number = 35;  //准备万剑归宗
		public static readonly SA_DIVINESWORD:number = 36;  //万剑归宗
		public static readonly SA_MINING:number = 37;	//挖矿


        //动作包的定义
		public static readonly AP_IDLE:number = 0;            //站立的动作包
		public static readonly AP_WALK:number = 1;            //走的动作包类型
		public static readonly AP_RUN:number = 2;          	//跑的动作包类型   
		public static readonly AP_READERATTACK:number = 3;    //准备攻击的动作包类型   
		public static readonly AP_ATTACK:number = 4;          //攻击的动作包类型  
		public static readonly AP_SPELL:number = 5;          //施法的动作包类型
		public static readonly AP_DEATH:number = 7;          //死亡的动作包类型
		public static readonly AP_JUMP:number = 18;           //跳跃
		public static readonly AP_DIVIESWORD:number = 8; 			//万剑归宗
		public static readonly AP_ROTATE:number = 9;           //旋转
		public static readonly AP_HORSE_IDLE:number = 10;      //马上站立
		public static readonly AP_HORSE_RUN:number = 10;       //马上跑  
		public static readonly AP_SWIMMING_IDLE:number = 11;      //游泳站立
		public static readonly AP_SWIMMING_RUN:number = 12;       //游泳跑 
		public static readonly AP_SWIMMING_KISS:number = 13;       //游泳kiss
		public static readonly AP_LAND_KISS:number = 14;       //陆地kiss
		public static readonly AP_CARRIER_IDLE:number = 15;       //载具的站立
		public static readonly AP_CARRIER_RUN:number = 16;       //载具中的跑
		public static readonly AP_DONGFANG:number = 17;       //洞房
		public static readonly AP_ACTION_PART_COUNT:number = 18;	//动作部件资源包

        public static GetSRPackageByAction(action:StandardActions,isHuman:boolean = false):number
        {
            switch(action)
			{
				case StandardActions.SA_IDLE:
					return StandardActions.AP_IDLE;
				case StandardActions.SA_WALK:
					return StandardActions.AP_WALK;
				case StandardActions.SA_RUN:
				case StandardActions.SA_BACKSTEP:
					return StandardActions.AP_RUN;
				case StandardActions.SA_SPRINT:
				case StandardActions.SA_SPRINT_START:
					return isHuman ? StandardActions.AP_RUN : StandardActions.AP_WALK;
				case StandardActions.SA_SPRINT_NEW:
					return StandardActions.AP_ATTACK;
				case StandardActions.SA_READY_ATTACK:
					return StandardActions.AP_READERATTACK;
				case StandardActions.SA_NORMHIT:
				case StandardActions.SA_HIT1:
				{
					return StandardActions.AP_ATTACK;
				}
			
					
				case StandardActions.SA_PREPARESKILL:
				case StandardActions.SA_SPELL:
				case StandardActions.SA_HIT2:
				case StandardActions.SA_HIT3:
				case StandardActions.SA_READY_SPELL:
					return isHuman ? StandardActions.AP_SPELL : StandardActions.AP_ATTACK;
				case StandardActions.SA_STRUCK:
					return 5;
				case StandardActions.SA_DIE:
				case StandardActions.SA_DEATH:
					return StandardActions.AP_DEATH;
				case StandardActions.SA_HORSE_IDLE:
					return StandardActions.AP_HORSE_IDLE;
				case StandardActions.SA_HORSE_RUN:
					return StandardActions.AP_HORSE_RUN;
				case StandardActions.SA_HORSE_STAND_IDLE:
				case StandardActions.SA_HORSE_STAND_RUN:
					return StandardActions.AP_IDLE;
				case StandardActions.SA_SWIMMING_IDLE:
					return StandardActions.AP_SWIMMING_IDLE;
				case StandardActions.SA_SWIMMING_RUN:
					return StandardActions.AP_SWIMMING_RUN;
				case StandardActions.SA_SWIMMING_KISS:
					return StandardActions.AP_SWIMMING_KISS;
				case StandardActions.SA_LAND_KISS:
					return StandardActions.AP_LAND_KISS;
				case StandardActions.SA_CARRIER_IDLE:
					return StandardActions.AP_CARRIER_IDLE;
				case StandardActions.SA_CARRIER_RUN:
					return StandardActions.AP_CARRIER_RUN;
				case StandardActions.SA_DONGFANG:
					return StandardActions.AP_DONGFANG;
				case StandardActions.SA_READYJUMP:
				case StandardActions.SA_JUMP:
					return StandardActions.AP_ATTACK;
				case StandardActions.SA_ROTATE:
					return StandardActions.AP_ROTATE;
				case StandardActions.SA_DIVINESWORD:
					return StandardActions.AP_DIVIESWORD;
				default :
                    return StandardActions.AP_IDLE;
                
					
			}
        }
    }
}
	