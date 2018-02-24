	/**
	 * 角色相关消息（非动作消息） 
	 * @author 后天 2017.9.30 21：47
	 * 
	 */
    module Entity
    {
        export enum ActorMessages
        {
            AM_HEAR = 40,//说话
            AM_VIP_FACE= 41,//发VIP表情
            AM_FEATURECHANGED = 42, //角色外观变更
            AM_USERNAME = 43,	//角色名称或名称颜色变更
            AM_USER_FIGTHTYPE = 44,	//角色名称或名称颜色变更
            AM_LEVELUP = 45,//角色升级，注意SM_LEVELUP_OTHER消息在处理的时候，向角色发送的实际消息号也是此消息
            AM_ACHIEVETITLE = 46,//角色称号变更
            AM_MISSED = 60,//未命中（MISS）
            AM_DAMAGE = 61,//伤害（被击中），除主角外的其他角色
            AM_ABSORB_DAMAGE = 62,//吸收伤害
            AM_UNDER_ATTACK= 63,//主角被攻击
            AM_LEVELUP_OTHER = 1110,	//其他角色升级
            AM_EXP_CHANGE_OTHER= 1111, //其他角色经验变化
            AM_HEALTHSPELLCHANGED = 53,	//角色体力或气力发生变化
            AM_HEALTHSPELLCHANGED_BANG = 56,//角色因遭到暴击而体力或气力发生变化
            AM_SPACEMOVE_HIDE = 800,	//角色被传送走
            AM_SPACEMOVE_SHOW = 801,	//角色被传送出现
            AM_SPACEMOVE_SHOW2 = 807,	//角色被传送出现
            AM_GHOST = 803,//角色消失
            AM_SETPOSITION = 1145,//设定角色位置
            AM_ACTORSPEED = 1120,//角色速度变更
            AM_NPCROLESTATE = 1151,//NPC任务状态变更
            AM_SENDDYNAMICEFFECTS = 1208,//发送角色附加特效
            AM_DELDYNAMICEFFECT = 1244,//删除角色附加特效
            AM_UPDATEAPPENDSTATUS = 1229,//更新角色状态
            AM_DELTYPEDAPPENDSTATUS = 1230,//按状态类型删除角色状态
            AM_UPDATEAPPENDSTATUSVALUE = 1231,//更新角色状态值
            AM_DELSKILLSTATUS = 1268,//删除角色技能组的状态
            AM_TEAMMSG = 101,//说话
            AM_MONSTERSAY = 106,//怪物说话
            AM_CHANGENAMECOLOR = 656,//角色名字颜色变更
            AM_PROPERTY_CHANGE= 10000,//临时的属性变更消息定义
            AM_BANGSTRUCK= 10001,//被暴击
            AM_HEMOPHAGIA= 10002, //吸血
            AM_BANGBOSSSTRUCK= 10003, //被致命一击
            AM_DEFEATBANG= 10004,  //反暴击

            AM_DISAPPEAR = 10005,   //实体消失
        }
    }